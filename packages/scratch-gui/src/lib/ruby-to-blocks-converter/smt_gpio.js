/**
 * converter for GPIO
 */

import Utils from './smt_common.js';

const SmT_GPIO_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入側 (gpio = GPIO.new(12, GPIO::IN)) ---
	// この関数に入ったことで左辺が変数であることが保証されている
        converter.registerOnVasgn((scope, variable, rh) => {

	    // 右辺が GPIO.new ブロックでなければ無視
            if (rh?.opcode !== "unifiedapi_gpio_init") return null;

	    //ブロック作成
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
                // ピン番号のチェック
                if (args[0].type === "int" && Number(args[0].value) >= 0) {
                    converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 12);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
                }

                // DIRECTION が指定の4つの文字列のどれかに一致することの保証
                const modeArg = args[1];
                const source = modeArg.node ? converter._getSource(modeArg.node) : "";
                
                // ユーザーがスペースを入れてしまった場合を考慮して空白を削除して判定
                const normalizedSource = source.replace(/\s+/g, '');
                const validDirections = ["GPIO::IN", "GPIO::OUT", "GPIO::IN|GPIO::PULL_UP", "GPIO::PULL_DOWN"];
                
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

                // VALUE が 0 か 1 であることの保証
                if (args[0].type === "int" && (Number(args[0].value) === 0 || Number(args[0].value) === 1)) {
                    converter.addNumberInput(block, "VALUE", "math_integer", Number(args[0].value), 0);
                } else {
                    throw new Error(Utils.getErrorMessage('ONLY_ZERO_OR_ONE', 1));
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

        // --- 2. 初期化 (GPIO.new) ---
        converter.registerOnSend("::GPIO", "new", 2, (params) => {
	    const { args, node } = params;

            const block = converter.createBlock("unifiedapi_gpio_init", "statement", node);
            Utils.fixLocationToLineStart(block);

	    const modeArg = args[1];
	    const source = modeArg.node ? converter._getSource(modeArg.node) : "";
	    //console.log('Final Mode Analysis:', source);

            if (block) {
		if (args[0].type === "int" && Number(args[0].value) >= 0) {
		    converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 12);
		}else{
		    throw new Error(Utils.getErrorMessage('ONLY_POSITIVE_INTEGER', 1));
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
	    
            if (converter._instanceTypeMap[varName] !== "GPIO") return null;
	    
            const opcode = "unifiedapi_gpio_write";
            const block = converter.createBlock(opcode, "statement", node);

            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		converter.addNumberInput(block, "VALUE", "math_integer", Number(args[0].value), 0);
                return block;
            }
            return null;
        });
    }
};

export default SmT_GPIO_Converter;
*/
