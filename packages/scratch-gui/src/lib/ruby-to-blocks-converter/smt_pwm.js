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

            // 共通関数で変数ブロックを接続
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
		
                const block = converter.createBlock(opcode, "value", node);
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
