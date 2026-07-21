/**
 * converter for I2C
 */

import Utils from './smt_common.js';


/**
 * 引数を安全に判定し、テキスト入力穴（または変数入力穴）をセットするヘルパー関数
 */
const setHexOrInput = (converter, block, inputName, arg, defaultValue = '0x00') => {
    if (!arg) {
        converter.addTextInput(block, inputName, defaultValue, defaultValue);
        return;
    }

    // 数値リテラルの場合（0x3E や 62 など）
    if (converter.isNumber(arg) || typeof arg.value === 'number') {
        const val = Number(arg.value);
        const hexStr = `0x${val.toString(16).toUpperCase().padStart(2, '0')}`;
        converter.addTextInput(block, inputName, hexStr, defaultValue);
    } 
    // 文字列リテラルの場合 ("0x3E" など)
    else if (arg.type === "str" || typeof arg.value === 'string') {
        converter.addTextInput(block, inputName, arg.value, defaultValue);
    } 
    // 変数などの式が直接入ってきた場合
    else {
        converter.addInput(block, inputName, arg);
    }
};

const SmT_I2C_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入 ($i2c = I2C.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_i2c_init") return null;

            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
	    
	    //インスタンス名は i2c で決め打ち
	    if (varName !== '_i2c_1_'){
		throw new Error(
                    Utils.getErrorMessage('INVALID_INSTANCE_NAME2')
                );
	    }
	    
	    converter._instanceTypeMap[varName] = "I2C";
            return rh;
        });

        // --- 初期化 (I2C.new) ---
        converter.registerOnSend("::I2C", "new", 0, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_i2c_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);
	    
            if (block){
                return block;
            }
            return null;
        });

	// --- メソッド (.write, 2引数および3引数) ---
	[2, 3].forEach(argCount => {
	    converter.registerOnSend('variable', 'write', argCount, (params) => {
		const { receiver, node, args } = params;
		const varName = receiver.fields?.VARIABLE?.value || "";
		if (converter._instanceTypeMap[varName] !== "I2C") return null;
		
		const block = converter.createBlock("unifiedapi_i2c_write", "statement", node);
		
		if (block) {
		    setHexOrInput(converter, block, "ADDR", args[0], '0x00');
		    setHexOrInput(converter, block, "HEX1", args[1], '0x00');
		    setHexOrInput(converter, block, "HEX2", args[2], '-');
		    return block;
		}
		return null;
	    });
	});

	// --- メソッド (.read, アドレス + バイト数 [+ アドレス]) ---
	[2, 3].forEach(argCount => {
	    converter.registerOnSend('variable', 'read', argCount, (params) => {
		const { receiver, node, args } = params;
		const varName = receiver.fields?.VARIABLE?.value || "";
		
		if (converter._instanceTypeMap[varName] !== "I2C") return null;
		
		const opcode = "unifiedapi_i2c_read";
		const block = converter.createBlock(opcode, "value", node);

		if (block) {
		    // ADDR (第1引数: 16進数)
		    setHexOrInput(converter, block, "ADDR", args[0], '0x00');
		    
		    // BYTES (第2引数: バイト数 / 数値入力)
		    if (args[1] && (converter.isNumber(args[1]) || typeof args[1].value === 'number')) {
			converter.addNumberInput(block, 'BYTES', "math_integer", Number(args[1].value), 0);
		    } else if (args[1]) {
			converter.addInput(block, 'BYTES', args[1]);
		    } else {
			converter.addNumberInput(block, 'BYTES', "math_integer", 1, 0);
		    }
		    
		    // HEX (第3引数: 3引数時は16進数、2引数時はデフォルトで '-' をセット)
		    setHexOrInput(converter, block, "HEX", args[2], '-');
		    
		    return block;
		}
		return null;
	    });
	});
	
	/*	
	// --- メソッド (.write, アドレス + コマンド) ---
        converter.registerOnSend('variable', 'write', 2, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
            if (converter._instanceTypeMap[varName] !== "I2C") return null;
	    
            const opcode = "unifiedapi_i2c_write";
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {
		converter.addTextInput(block, "ADDR", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		if (converter.isNumber(args[1])){
		    converter.addTextInput(block, "HEX1", `0x${args[1].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');		    
		}else{
		    converter.addTextInput(block, "HEX1", args[1], '0x00');
		}
		converter.addTextInput(block, "HEX2", '-', '-');
                return block;
            }
            return null;
        });

	// --- メソッド (.write, アドレス + コマンド + コマンド) ---
        converter.registerOnSend('variable', 'write', 3, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C") return null;
	    
            const opcode = "unifiedapi_i2c_write";
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {
		converter.addTextInput(block, "ADDR", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		if (converter.isNumber(args[1])){
		    converter.addTextInput(block, "HEX1", `0x${args[1].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');		    
		}else{
		    converter.addTextInput(block, "HEX1", args[1], '0x00');
		}
		if (converter.isNumber(args[2])){
		    converter.addTextInput(block, "HEX2", `0x${args[2].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');		    
		}else{
		    converter.addTextInput(block, "HEX2", args[2], '0x00');
		}
                return block;
            }
            return null;
        });

	// --- メソッド (.read, アドレス + バイト数) ---
        converter.registerOnSend('variable', 'read', 2, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C") return null;
	    
            const opcode = "unifiedapi_i2c_read";
            const block = converter.createBlock(opcode, "value", node);
	    
            if (block) {
		converter.addTextInput(block, "ADDR", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		converter.addNumberInput(block, 'BYTES', "math_integer", Number(args[1].value), 0);
		converter.addTextInput(block, "HEX", '-', '-');
                return block;
            }
            return null;
        });

	// --- メソッド (.read, アドレス + バイト数 + アドレス) ---
        converter.registerOnSend('variable', 'read', 3, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C") return null;
	    
            const opcode = "unifiedapi_i2c_read";
            const block = converter.createBlock(opcode, "value", node);
	    
            if (block) {
		converter.addTextInput(block, "ADDR", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		converter.addNumberInput(block, 'BYTES', "math_integer", Number(args[1].value), 0);
		converter.addTextInput(block, "HEX", `0x${args[2].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
                return block;
            }
            return null;
            });
	*/
    }
};

export default SmT_I2C_Converter;
