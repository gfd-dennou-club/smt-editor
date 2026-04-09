/**
 * converter for UART
 */

import Utils from './smt_common.js';

const SmT_UART_Converter = {
    register: function (converter) {
	converter._instanceTypeMap = converter._instanceTypeMap || {};
	
        // --- 代入 ($uart1 = UART.new) ---
        converter.registerOnVasgn((scope, variable, rh) => {
            if (rh?.opcode !== "unifiedapi_uart_init") return null;

            // 共通関数で変数ブロックを接続
            const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
            converter._instanceTypeMap[varName] = "UART";
            return rh;
        });

        // --- 初期化 (UART.new) ---
        converter.registerOnSend("::UART", "new", 2, (params) => {
            const { args, node } = params;
            const block = converter.createBlock("unifiedapi_uart_init", "statement", node);
            
            Utils.fixLocationToLineStart(block);
	    console.log( args );
	    
            if (block && converter.isNumber(args[0])) {
                converter.addNumberInput(block, "UART", "math_integer", Number(args[0].value), 39);
		
		const baudrate = Number(args[1]?.get("sym:baudrate").value);
                converter.addNumberInput(block, "RATE", "math_integer", baudrate, 0);

		return block;
            }
            return null;
        });

        // --- メソッド (.puts) ---
        converter.registerOnSend('variable', 'puts', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "UART") return null;
	    
	    // メソッド名に対応する Opcode の決定
            const opcode = "unifiedapi_uart_puts"
	    
            const block = converter.createBlock(opcode, "statement", node);
            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		converter.addTextInput(block, "COMM", args[0], '');
                return block;
            }
            return null;
        });

        // --- メソッド (.gets) ---
        converter.registerOnSend('variable', 'gets', 0, (params) => {
            const { receiver, node } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "UART") return null;
	    
	    // メソッド名に対応する Opcode の決定
            const opcode = "unifiedapi_uart_gets"
	    
            const block = converter.createBlock(opcode, "value", node);
            if (block) {
                Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
                return block;
            }
            return null;
        });
	
        // --- メソッド (バッファクリア) ---
        ["clear_tx_buffer", "clear_rx_buffer"].forEach(method => {
            converter.registerOnSend('variable', method, 0, (params) => {
                const { receiver, node } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

                if (converter._instanceTypeMap[varName] !== "UART") return null;

		// メソッド名に対応する Opcode の決定
                const opcode = "unifiedapi_uart_clear"
		
                const block = converter.createBlock(opcode, "statement", node);
                if (block) {
                    Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		    converter.addField(block, "TXRX", method);
                    return block;
                }
                return null;
            });
        });

	
    },
/*
    onSend: function (receiver, name, args, rubyBlockArgs, rubyBlock, node) {

        const receiverName = receiver.fields.VALUE.value;
	if (!receiverName) return null;

	const match = receiverName.match(/^uart(\d+)$/);
	if (!match) return null;

        const pin = Number(match[1]);	
	
	switch (name) {

            // uart.puts
            case "puts": {
                if (args.length != 1) return null;
                if (!this._isString(args[0])) return null;

                const block = this._changeBlock(
                    receiver, "unifiedapi_uart_puts", "statement"
                );
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
                this._addTextInput(block, "COMM", args[0], "Output String");
                return block;
                break;
            }

            // uart.gets
            case "gets": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);

                const block = this._changeBlock(
                    receiver, "unifiedapi_uart_gets", "value"
                );
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
		return block;
                break;
            }

            // uart.clear_tx_buffer
            case "clear_tx_buffer": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);

                const block = this._changeBlock(
                    receiver, "unifiedapi_uart_txclear", "statement"
                );
		this._addNumberInput(block, "UART", "math_integer", pin, 10);
                return block;
                break;
            }

            // uart.clear_rx_buffer
            case "clear_rx_buffer": {
                if (args.length != 0) return null;
                const pin = Number(match[1]);
		
                const block = this._changeBlock(
                    receiver, "unifiedapi_uart_rxclear", "statement"
                );
                this._addNumberInput(block, "UART", "math_integer", pin, 10);
                return block;
                break;
            }
        }
        return null;
    },
*/
};

export default SmT_UART_Converter;
