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

            // 共通関数で変数ブロックを接続
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
            converter._instanceTypeMap[varName] = "ADC";
            return rh;
        });

        // --- 初期化 (ADC.new) ---
        converter.registerOnSend("::ADC", "new", 1, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_adc_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);

	    // PIN は正の整数（0以上）であることの保証
            if (block && converter.isNumber(args[0])) {
		if (args[0] && args[0].type === "int" && Number(args[0].value) >= 0) {
                    converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 39);
		} else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
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

		// 念のため varName が空（変数ブロックとして認識されていない）場合はエラー
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
