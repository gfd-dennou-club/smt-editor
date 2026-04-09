/**
 * converter for I2C
 */

import Utils from './smt_common.js';

const SmT_I2C_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入 ($i2c = I2C.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_i2c_init") return null;

            // 共通関数で変数ブロックを接続
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
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

	// --- メソッド (.write, アドレス + コマンド) ---
        converter.registerOnSend('variable', 'write', 2, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C") return null;
	    
            const opcode = "unifiedapi_i2c_write";
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
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
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
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
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
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
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		converter.addTextInput(block, "ADDR", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		converter.addNumberInput(block, 'BYTES', "math_integer", Number(args[1].value), 0);
		converter.addTextInput(block, "HEX", `0x${args[2].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
                return block;
            }
            return null;
        });	
    }
};

export default SmT_I2C_Converter;
