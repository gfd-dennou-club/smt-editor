/**
 * converter for ADC
 */

import Utils from './smt_common.js';

const SmT_ADC_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入 ($adc1 = ADC.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_adc_init") return null;

            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

            converter._instanceTypeMap[varName] = "ADC";
            return rh;
        });

        // --- 初期化 (ADC.new) ---
        converter.registerOnSend("::ADC", "new", 1, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_adc_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);

	    if (block){
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
                return block;
            }
            return null;
        });

        // --- メソッド (.read, .read_raw) ---
        ["read", "read_raw"].forEach(method => {
            converter.registerOnSend('variable', method, 0, (params) => {
                const { receiver, node } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

		// 念のため varName が空の場合はエラー
                if (!varName) {
                    throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
                }
		
                if (converter._instanceTypeMap[varName] !== "ADC") return null;
		
                const opcode = method === "read" ? "unifiedapi_adc_volt" : "unifiedapi_adc_raw";
                const block = converter.createBlock(opcode, "value", node);
		
                if (block) {
                    Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
                    return block;
                }
                return null;
            });
        });
    }
};

export default SmT_ADC_Converter;
