/**
 * converter for GPIO
 */

import Utils from './smt_common.js';

const SmT_GPIO_Converter = {
    register: function (converter) {

	//関数をまたいで利用する変数
	converter._instanceTypeMap = converter._instanceTypeMap || {};
	converter._instanceName    = converter._instanceName || {};
	converter._instanceID      = converter._instanceID || {};

        // --- 代入側 (gpio = GPIO.new(12, GPIO::IN)) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_gpio_init") return null;

            // 共通関数で変数ブロックを接続
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

	    // インスタンスの名前と .new の名前が一致するか確認
	    if (converter._instanceName[varName] !== varName ) {
                throw new Error(
                    Utils.getErrorMessage('INVALID_INSTANCE_NAME')
                );
            }

            // メソッド呼び出し側でチェックされるため、内部名 (varName) を登録
            converter._instanceTypeMap[varName] = "GPIO";
            return rh;
        });

        // --- 初期化 (GPIO.new) ---
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_gpio_init", "statement", node);

            Utils.fixLocationToLineStart(block);
            
            if (block) {
                if (!args[0]) return null;

                // 第一引数は整数のみ受け取る
                if (args[0].type !== "int") {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                }

                const pin = Number(args[0].value);

		// smalruby の内部的に作られる変数名を用意して保管．
		const varName = "_gpio" + pin + "_1_";
		converter._instanceName[varName] = varName;
 		converter._instanceID[varName]   = pin;
		
                // 整数の場合は正であることを保証
                if (pin >= 0) {
                    converter.addNumberInput(block, "PIN", "math_integer", pin, 12);
                    
                    // 代入側に安全にピン番号を渡すため、converter本体に退避させる
                    converter._lastGpioPin = pin;
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                }

                // DIRECTION が指定の4つの文字列のどれかに一致することの保証
                const modeArg = args[1];
                const source = modeArg.node ? converter._getSource(modeArg.node) : "";
                
                // ユーザーがスペースを入れてしまった場合を考慮して空白を削除して判定
                const normalizedSource = source.replace(/\s+/g, '');
                const validDirections = ["GPIO::IN", "GPIO::OUT", "GPIO::IN|GPIO::PULL_UP", "GPIO::IN|GPIO::PULL_DOWN"];
                
                if (!validDirections.includes(normalizedSource)) {
                    throw new Error(Utils.getErrorMessage('INVALID_GPIO_DIRECTION', 2));
                }
        
                converter.addField(block, "DIRECTION", source);
                return block;
            }
            return null;
        });

        // --- メソッド (.read) ---
        converter.registerOnSend('variable', 'read', 0, (params) => {
            const { receiver, node } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            if (!varName) {
                throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
            }

            if (converter._instanceTypeMap[varName] !== "GPIO") return null;

            const opcode = "unifiedapi_gpio_read";
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
                converter.addNumberInput(block, "PIN", "math_integer", converter._instanceID[varName], 12);
                return block;
            }
            return null;
        });

        // --- メソッド (.write) ---
        converter.registerOnSend('variable', 'write', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            if (!varName) {
                throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
            }

            if (converter._instanceTypeMap[varName] !== "GPIO") return null;

            const opcode = "unifiedapi_gpio_write";
            const block = converter.createBlock(opcode, "statement", node);

            if (block) {
                converter.addNumberInput(block, "PIN", "math_integer", converter._instanceID[varName], 12);
		
                if (!args[0]) return null;
		
		if (args[0].type === "int"){
                    if ((Number(args[0].value) === 0 || Number(args[0].value) === 1)) {
                        converter.addNumberInput(block, "VALUE", "math_integer", Number(args[0].value), 0);
                    } else {
                        throw new Error(Utils.getErrorMessage('ONLY_ZERO_OR_ONE', 1));
                    }
                } else if (args[0].type === "str"){
                    throw new Error(Utils.getErrorMessage('NOT_STRING', 1));
                } else {
                    converter.addInput(block, "VALUE", args[0]);         
                }        
                return block;
            }
            return null;
        });
    }
};

export default SmT_GPIO_Converter;

/*
import Utils from './smt_common.js';

const SmT_GPIO_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入側 (gpio = GPIO.new(12, GPIO::IN)) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_gpio_init") return null;

            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

            converter._instanceTypeMap[varName] = "GPIO";
            return rh;
        });

        // --- 初期化 (GPIO.new) ---
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_gpio_init", "statement", node);

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

                // DIRECTION が指定の4つの文字列のどれかに一致することの保証
                const modeArg = args[1];
                const source = modeArg.node ? converter._getSource(modeArg.node) : "";
                
                // ユーザーがスペースを入れてしまった場合を考慮して空白を削除して判定
                const normalizedSource = source.replace(/\s+/g, '');
                const validDirections = ["GPIO::IN", "GPIO::OUT", "GPIO::IN|GPIO::PULL_UP", "GPIO::IN|GPIO::PULL_DOWN"];
                
                if (!validDirections.includes(normalizedSource)) {
                    throw new Error(Utils.getErrorMessage('INVALID_GPIO_DIRECTION', 2));
                }
		
                converter.addField(block, "DIRECTION", source);
                return block;
            }
            return null;
        });

        // --- メソッド (.read) ---
        converter.registerOnSend('variable', 'read', 0, (params) => {
            const { receiver, node } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            // varName が空（変数ブロックとして認識されていない）場合はエラー
            if (!varName) {
                throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
            }

            if (converter._instanceTypeMap[varName] !== "GPIO") return null;

            const opcode = "unifiedapi_gpio_read";
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
                return block;
            }
            return null;
        });

        // --- メソッド (.write) ---
        converter.registerOnSend('variable', 'write', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            // 念のため varName が空の場合はエラー
            if (!varName) {
                throw new Error(Utils.getErrorMessage('ONLY_VARIABLE'));
            }

            if (converter._instanceTypeMap[varName] !== "GPIO") return null;

            const opcode = "unifiedapi_gpio_write";
            const block = converter.createBlock(opcode, "statement", node);

            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		if (!args[0]) return null;

		if (args[0].type === "int"){
		    // 整数の場合は値が 0 か 1 であることを保証
		    if ((Number(args[0].value) === 0 || Number(args[0].value) === 1)) {
			converter.addNumberInput(block, "VALUE", "math_integer", Number(args[0].value), 0);
                    } else {
			throw new Error(Utils.getErrorMessage('ONLY_ZERO_OR_ONE', 1));
		    }
		} else if (args[0].type === "str"){
		    // 文字列は排除
		    throw new Error(Utils.getErrorMessage('NOT_STRING', 1));
		} else {
		    //文字列・整数以外の場合
                    converter.addInput(block, "VALUE", args[0]); 		    
                }		
                return block;		

            }
            return null;
        });
    }
};

export default SmT_GPIO_Converter;
*/
