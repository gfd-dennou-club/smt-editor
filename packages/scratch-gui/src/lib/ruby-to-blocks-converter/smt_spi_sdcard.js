/**
 * converter for SDcard
 */

import Utils from './smt_common.js';

const SmT_SPI_SDcard_Converter = {
    register: function (converter) {
        converter._instanceTypeMap = converter._instanceTypeMap || {};

	// --- 代入 ( $sd = SDSPI.new($spi) ) ---
        converter.registerOnVasgn((scope, variable, rh) => {
	    if (rh?.opcode !== "peripherals_sd_init") return null;
	    
	    // 共通関数で変数ブロックを接続
	    const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE2", variable);

	    //インスタンス名は決め打ち
	    const instance = "_sdspi_1_";
	    if (varName !== instance) return null;
	    
	    converter._instanceTypeMap[varName] = "SDSPI";
	    return rh;
        });
	
        // --- 初期化 ( SDSPI.new($spi) ) ---
        converter.registerOnSend("::SDSPI", "new", 2, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_sd_init", "statement", node);
            
	    Utils.fixLocationToLineStart(block);
	    
	    if (block) {
		const pin = Number(args[1]?.get("sym:cs_pin").value);
                converter.addNumberInput(block, "PIN", "math_integer", pin, 0);
                
                const dir = args[1]?.get("sym:mount_point").value;
                converter.addTextInput(block, "DIR", dir, "");
		
		return block;
	    }
	    return null;
        });

        converter.registerOnSend('variable', "umount", 0, (params) => {
            const { receiver, node } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            if (converter._instanceTypeMap[varName] !== "SDSPI") return null;
	    
            const opcode = "peripherals_sd_umount";             		
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {	
                return block;
            }
            return null;            
        });

	
	// --- 代入 ( $file = File.open(file, mode) ) ---
        converter.registerOnVasgn((scope, variable, rh) => {
	    if (rh?.opcode !== "peripherals_sd_open") return null;
	    
	    // 共通関数で変数ブロックを接続
	    const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

	    //インスタンス名は決め打ち
	    const instance = "_file_1_";
	    if (varName !== instance) return null;
	    
	    converter._instanceTypeMap[varName] = "SDSPI_FILE";
	    return rh;
        });
	
        // --- 初期化 ( File.open(file, mode) ) ---
        converter.registerOnSend("::File", "open", 2, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_sd_open", "statement", node);
            
	    Utils.fixLocationToLineStart(block);

	    if (block) {
		converter.addTextInput(block, "FILE", args[0], "");
		converter.addField(block, "MODE", args[1]);
		return block;
	    }
	    return null;
        });

        converter.registerOnSend('variable', "close", 0, (params) => {
            const { receiver, node } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            if (converter._instanceTypeMap[varName] !== "SDSPI_FILE") return null;
	    
            const opcode = "peripherals_sd_close";             		
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {	
                return block;
            }
            return null;            
        });

	['read', 'gets'].forEach(method => {
            converter.registerOnSend('variable', method, 0, (params) => {
                const { receiver, node, args } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

                if (converter._instanceTypeMap[varName] !== "SDSPI_FILE") return null;

                const opcode = "peripherals_sd_gets"; 
                const block = converter.createBlock(opcode, "value", node);

                if (block) {
		    converter.addField(block, "MODE", method);
                    return block;
                }
                return null;
            });
	});	

	converter.registerOnSend('variable', "puts", 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";

            if (converter._instanceTypeMap[varName] !== "SDSPI_FILE") return null;
	    
            const opcode = "peripherals_sd_puts";
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {	
		converter.addTextInput(block, "TEXT", args[0], "");
                return block;
            }
            return null;            
        });
	
    }
};

export default SmT_SPI_SDcard_Converter;
