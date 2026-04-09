/**
 * converter for PWM
 */

import Utils from './smt_common.js';

const SmT_PWM_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};
	
        // --- 代入 ($pwm1 = PWM.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_pwm_init") return null;

            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

            converter._instanceTypeMap[varName] = "PWM";
            return rh;
        });

        // --- 初期化 (PWM.new) ---
        converter.registerOnSend("::PWM", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_pwm_init", "statement", node);

            Utils.fixLocationToLineStart(block);

            if (block) {
                // PIN は正の整数
                if (args[0] && args[0].type === "int" && Number(args[0].value) >= 0) {
                    converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 39);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                }

                // 第 2 引数のハッシュ (キーワード引数 timer:, frequency:) から値を取得
                const timerNode = args[1]?.get("sym:timer");
                const freqNode = args[1]?.get("sym:frequency");

                // TIMER は正の整数 (範囲は 0～4)
                if (timerNode && timerNode.type === "int" && Number(timerNode.value) >= 0 && Number(timerNode.value) <= 4) {
                    converter.addNumberInput(block, "TIMER", "math_integer", Number(timerNode.value), 0);
                } else {
                    throw new Error(Utils.getErrorMessage('INVALID_PWM_TIMER'));
                }

                // FREQ は正の整数（0以上）
                if (freqNode && freqNode.type === "int" && Number(freqNode.value) >= 0) {
                    converter.addNumberInput(block, "FREQ", "math_integer", Number(freqNode.value), 50);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER'));
                }

                return block;
            }
            return null;
        });

        // メソッド (.duty, .frequency, .pulse_width_us) ---
        ["duty", "frequency", "pulse_width_us"].forEach(method => {
            converter.registerOnSend('variable', method, 1, (params) => {
                const { receiver, node, args } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

		// varName が空（変数ブロックとして認識されていない）場合はエラー
                if (!varName) {
                    throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
                }

                if (converter._instanceTypeMap[varName] !== "PWM") return null;

                let opcode;
                let inputName;
                
                switch (method) {
                case "duty":
                    opcode = "unifiedapi_pwm_duty";
                    inputName = "DUTY";
                    break;
                case "frequency":
                    opcode = "unifiedapi_pwm_frequency";
                    inputName = "FREQ";
                    break;
                case "pulse_width_us":
                    opcode = "unifiedapi_pwm_pulse";
                    inputName = "PULSE";
                    break;
                }
		
                const block = converter.createBlock(opcode, "statement", node);
                
                if (block) {
                    Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
                    
                    // 引数が整数（int）であるかどうかの大前提チェック
                    if (args[0] && args[0].type === "int") {
                        const val = Number(args[0].value);
                        
                        // メソッドごとの制約チェック
                        if (method === "duty") {
                            // DUTY は正の整数 (範囲は 0～100)
                            if (val >= 0 && val <= 100) {
                                converter.addNumberInput(block, inputName, "math_integer", val, 0);
                            } else {
                                throw new Error(Utils.getErrorMessage('INVALID_PWM_DUTY', 1));
                            }
                        } else {
                            // FREQ と PULSE は正の整数
                            if (val >= 0) {
                                converter.addNumberInput(block, inputName, "math_integer", val, 0);
                            } else {
                                throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                            }
                        }
                    } else {
                        // そもそも整数ではない場合
                        throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                    }
                    
                    return block;
                }
                return null;
            });
        });
    }
};

export default SmT_PWM_Converter;

/*
const SmT_PWM_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入 ($pwm1 = PWM.new) ---
	// この関数に入ったことで左辺が変数であることが保証されている
        converter.registerOnVasgn((scope, variable, rh) => {

	    // 右辺が PWM.new ブロックでなければ無視
	    if (rh?.opcode !== "unifiedapi_pwm_init") return null;

	    //ブロック作成
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
            converter._instanceTypeMap[varName] = "PWM";
            return rh;
        });

        // --- 初期化 (PWM.new) ---
        converter.registerOnSend("::PWM", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_pwm_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);
	    //console.log( args );
	    
            if (block && converter.isNumber(args[0])) {
                converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 39);
		
		const timer = Number(args[1]?.get("sym:timer").value);
                converter.addNumberInput(block, "TIMER", "math_integer", timer, 0);
                
                const freq = Number(args[1]?.get("sym:frequency").value);
                converter.addNumberInput(block, "FREQ", "math_integer", freq, 50);

		return block;
            }
            return null;
        });

        // --- メソッド (.read, .read_raw) ---
        ["duty", "frequency", "pulse_width_us"].forEach(method => {
            converter.registerOnSend('variable', method, 1, (params) => {
                const { receiver, node, args } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

                if (converter._instanceTypeMap[varName] !== "PWM") return null;

		// メソッド名に対応する Opcode の決定
                let opcode;
                let inputName;
                switch (method) {
                    case "duty": 
                        opcode = "unifiedapi_pwm_duty"; 
                        inputName = "DUTY";
                        break;
                    case "frequency": 
                        opcode = "unifiedapi_pwm_frequency"; 
                        inputName = "FREQ";
                        break;
                    case "pulse_width_us": 
                        opcode = "unifiedapi_pwm_pulse"; 
                        inputName = "PULSE";
                        break;
                }
		
                const block = converter.createBlock(opcode, "statement", node);
                if (block) {
                    Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		    converter.addNumberInput(block, inputName, "math_integer", Number(args[0].value), 0);
                    return block;
                }
                return null;
            });
        });
    }
};

export default SmT_PWM_Converter;
*/
