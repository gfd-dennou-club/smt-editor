/*
 * converter for Time
 */

import Utils from './smt_common.js';

const SmT_Time_Converter = {
    register: function (converter) {
	converter._instanceTypeMap = converter._instanceTypeMap || {};
	
	// --- 代入 ( $time = Time.now ) ---
        converter.registerOnVasgn((scope, variable, rh) => {
	    if (rh?.opcode !== "peripherals_time_now") return null;
	    
	    // 共通関数で変数ブロックを接続
	    const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);
	    converter._instanceTypeMap[varName] = "TIME";
	    return rh;
        });
	
        // --- 初期化 ( Time.now ) ---
        converter.registerOnSend("::Time", "now", 0, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_time_now", "statement", node);
            
	    Utils.fixLocationToLineStart(block);
	    
	    if (block) {
		return block;
	    }
	    return null;
        });
	
	// --- メソッド (.sync_ntp) ---
        converter.registerOnSend('::Time', 'sync_ntp', 1, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_time_sync_ntp", "statement", node);
            
	    Utils.fixLocationToLineStart(block);
	    
	    if (block) {
                converter.addTextInput(block, "NTP", args[0], "");
		return block;
	    }
	    return null;
        });

	// --- メソッド (.mktime) ---
        converter.registerOnSend('::Time', 'mktime', 6, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_time_mktime", "statement", node);
            
	    Utils.fixLocationToLineStart(block);
	    
	    if (block) {
                converter.addNumberInput(block, "YEAR", "math_integer", Number(args[0].value), 0);
                converter.addNumberInput(block, "MON",  "math_integer", Number(args[1].value), 0);
                converter.addNumberInput(block, "DAY",  "math_integer", Number(args[2].value), 0);
                converter.addNumberInput(block, "HOUR", "math_integer", Number(args[3].value), 0);
                converter.addNumberInput(block, "MIN",  "math_integer", Number(args[4].value), 0);
                converter.addNumberInput(block, "SEC",  "math_integer", Number(args[5].value), 0);
		return block;
	    }
	    return null;
        });

	['datetime', 'date', 'time', 'year', 'mon', 'mday', 'wday', 'hour', 'min', 'sec', 'msec'].forEach(method => {
            converter.registerOnSend('variable', method, 0, (params) => {
                const { receiver, node, args } = params;
                const varName = receiver.fields?.VARIABLE?.value || "";

                if (converter._instanceTypeMap[varName] !== "TIME") return null;

                const opcode = "peripherals_time_value"; 
                const block = converter.createBlock(opcode, "value", node);

                if (block) {
                    Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
		    converter.addField(block, "TARGET", method);
                    return block;
                }
                return null;
            });
	});	
	
    }
}

export default SmT_Time_Converter;
