/**
 * converter for ADC
 */

import Utils from './smt_common.js';

const SmT_ADC_Converter = {
    register: function (converter) {

	//関数をまたいで利用する変数
	converter._instanceTypeMap = converter._instanceTypeMap || {};
	converter._instanceName    = converter._instanceName || {};
	converter._instanceID      = converter._instanceID || {};

        // --- 代入 ($adc1 = ADC.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_adc_init") return null;

            // 共通関数で変数ブロックを接続
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

	    // インスタンスの名前と .new の名前が一致するか確認
	    if (converter._instanceName[varName] !== varName ) {
                throw new Error(
                    Utils.getErrorMessage('INVALID_INSTANCE_NAME')
                );
            }
	    
            // メソッド呼び出し側でチェックされるため、内部名 (varName) を登録
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

                // 第一引数は整数のみ受け取る
                if (args[0].type !== "int") {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                }

                const pin = Number(args[0].value);

		// smalruby の内部的に作られる変数名を用意して保管．
		const varName = "_adc" + pin + "_1_";
		converter._instanceName[varName] = varName;
 		converter._instanceID[varName]   = pin;
		
                // 整数の場合は正であることを保証
                if (pin >= 0) {
                    converter.addNumberInput(block, "PIN", "math_integer", pin, 12);
                    
                    // 代入側に安全にピン番号を渡すため、converter本体に退避させる
                    converter._lastAdcPin = pin;
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

                // varName が空の場合はエラー
                if (!varName) {
                    throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
                }
                
                if (converter._instanceTypeMap[varName] !== "ADC") return null;
        
                const opcode = method === "read" ? "unifiedapi_adc_volt" : "unifiedapi_adc_raw";
                const block = converter.createBlock(opcode, "value", node);
		
                if (block) {
                    // 変数ブロックをアタッチする代わりに、引っこ抜いたピン番号を PIN に直接セット		    
                    converter.addNumberInput(block, "PIN", "math_integer", converter._instanceID[varName], 12);
                    return block;
                }
                return null;
            });
        });
    }
};

export default SmT_ADC_Converter;

/*
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
*/
