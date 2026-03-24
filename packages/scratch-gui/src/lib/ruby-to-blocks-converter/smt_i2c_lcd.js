/*
 * I2C LCD
 */

import Utils from './smt_common.js';

const I2C_SENSORS = ['AQM0802A'];

const SmT_I2C_LCD_Converter = {
    register: function (converter) {
	converter._instanceTypeMap = converter._instanceTypeMap || {};

	I2C_SENSORS.forEach((sensorName) => {	
	    const className = `::${sensorName}`;       // 例: ::SHT35
	    
	    // --- 代入 ( $sensor = SENSOR.new($i2c) ) ---
            converter.registerOnVasgn((scope, variable, rh) => {
		if (rh?.opcode !== "peripherals_lcd_init") return null;

		// 共通関数で変数ブロックを接続
		const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE2", variable);
		converter._instanceTypeMap[varName] = "I2C_LCD";
		return rh;
            });
	    
            // --- 初期化 ( SENSOR.new($i2c) ) ---
            converter.registerOnSend(className, "new", 1, (params) => {
		const { args, node } = params;
		const block = converter.createBlock("peripherals_lcd_init", "statement", node);
            
		Utils.fixLocationToLineStart(block);
		
		if (block) {
		    converter.addField(block, "SENSOR", sensorName);
		    converter.addInput(block, "INSTANCE1", args[0]);
		    return block;
		}
		return null;
            });
	});

	// --- メソッド (.cursor) ---
        converter.registerOnSend('variable', 'cursor', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C_LCD") return null;

	    const opcode = "peripherals_lcd_cursor"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
		Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);

                const line = Number(args[0]?.get("sym:line").value);
                converter.addNumberInput(block, "LINE", "math_integer", line, 1);
                return block;
            }
            return null;
        });

	// --- メソッド (.print) ---
        converter.registerOnSend('variable', 'print', 1, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C_LCD") return null;

	    const opcode = "peripherals_lcd_print"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
		Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);

                converter.addTextInput(block, "TEXT", args[0].value, "");
                return block;
            }
            return null;
        });

	// --- メソッド (.clear) ---
        converter.registerOnSend('variable', 'clear', 0, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "I2C_LCD") return null;

	    const opcode = "peripherals_lcd_clear"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
		Utils.attachVariableBlock(converter, block, "INSTANCE", receiver);
                return block;
            }
            return null;
        });	
    }
}

export default SmT_I2C_LCD_Converter;
