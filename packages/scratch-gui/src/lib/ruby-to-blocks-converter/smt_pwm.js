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
	    console.log( varName );
	    
            converter._instanceTypeMap[varName] = "PWM";
            return rh;

        });

        // --- 初期化 (PWM.new) ---
        converter.registerOnSend("::PWM", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_pwm_init", "statement", node);

            Utils.fixLocationToLineStart(block);

            if (block) {
		if (!args[0]) return null;
                if (args[0].type === "int") {
		    // 整数の場合は正であることを保証
		    if (Number(args[0].value) >= 0) {
			converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 12);
		    } else {
			throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
		    }
		} else if (args[0].type === "str") {
                    // 文字列の場合
                    converter.addTextInput(block, "PIN", args[0].value, "a1"); 
                } else {
                    // 整数・文字列以外の場合
                    converter.addInput(block, "PIN", args[0]); 
                }
		
                // 第 2 引数のハッシュ (キーワード引数 timer:, frequency:) から値を取得
                const timerNode = args[1]?.get("sym:timer");
                const freqNode  = args[1]?.get("sym:frequency");
                const dutyNode  = args[1]?.get("sym:duty");

                // TIMER は正の整数
                if (timerNode && timerNode.type === "int" && Number(timerNode.value) >= 0) {
                    converter.addNumberInput(block, "TIMER", "math_integer", Number(timerNode.value), 0);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 2));
                }

                // FREQ は正の整数（0以上）
                if (freqNode && freqNode.type === "int" && Number(freqNode.value) >= 0) {
                    converter.addNumberInput(block, "FREQ", "math_integer", Number(freqNode.value), 50);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 3));
                }
		
                // DUTY は正の整数（0以上）
                if (dutyNode && dutyNode.type === "int" && Number(dutyNode.value) >= 0) {
                    converter.addNumberInput(block, "DUTY", "math_integer", Number(dutyNode.value), 0);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 3));
                }
		
                return block;
            }

            return null;
        });

        // メソッドをまとめて定義 (.duty, .frequency, .pulse_width_us) ---
        ["duty", "frequency", "pulse_width_us"].forEach(method => {
            converter.registerOnSend('variable', method, 1, (params) => {
                const { receiver, node, args } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";
		
                if (!args[0]) return null;
		
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
                    if (!args[0]) return null;
		    
                    if (args[0].type === "int") {
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
		    } else if (args[0].type === "str"){
			// 文字列は排除
			throw new Error(Utils.getErrorMessage('NOT_STRING', 1));
                    } else {
                        // そもそも整数ではない場合
			converter.addInput(block, inputName, args[0]);
                    }
                    
                    return block;
                }
                return null;
            });
        });
    }
};

export default SmT_PWM_Converter;

