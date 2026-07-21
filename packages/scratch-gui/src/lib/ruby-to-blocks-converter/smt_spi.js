/**
 * converter for SPI
 */

import Utils from './smt_common.js';

const SmT_SPI_Converter = {
    register: function (converter) {

        converter._instanceTypeMap = converter._instanceTypeMap || {};

        // --- 代入 ($spi = SPI.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_spi_init") return null;

            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
	    
	    //インスタンス名は spi で決め打ち
	    if (varName !== '_spi_1_'){
		throw new Error(
                    Utils.getErrorMessage('INVALID_INSTANCE_NAME2')
                );
	    }

            converter._instanceTypeMap[varName] = "SPI";
            return rh;
        });

        // --- 初期化 (SPI.new) ---
        converter.registerOnSend("::SPI", "new", 1, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_spi_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);
	    
            if (block) {
		const miso = Number(args[0]?.get("sym:miso_pin").value);
                converter.addNumberInput(block, "MISO", "math_integer", miso, 19);

		const mosi = Number(args[0]?.get("sym:mosi_pin").value);
                converter.addNumberInput(block, "MOSI", "math_integer", mosi, 23);	
                
                const clk  = Number(args[0]?.get("sym:clk_pin").value);
                converter.addNumberInput(block, "CLK", "math_integer", clk, 18);

		return block;
            }
            return null;
        });

	// --- メソッド (.write, コマンド + コマンド) ---
        converter.registerOnSend('variable', 'write', 2, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "SPI") return null;
	    
            const opcode = "unifiedapi_spi_write";
            const block = converter.createBlock(opcode, "statement", node);
	    
            if (block) {
		converter.addTextInput(block, "HEX1", `0x${args[0].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
		converter.addTextInput(block, "HEX2", `0x${args[1].value.toString(16).toUpperCase().padStart(2, '0')}`, '0x00');
                return block;
            }
            return null;
        });

	// --- メソッド (.read, バイト数) ---
        converter.registerOnSend('variable', 'read', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "SPI") return null;
	    
            const opcode = "unifiedapi_spi_read";
            const block = converter.createBlock(opcode, "value", node);
	    
            if (block) {
		converter.addNumberInput(block, 'BYTES', "math_integer", Number(args[0].value), 0);
                return block;
            }
            return null;
        });

    }
};

export default SmT_SPI_Converter;
