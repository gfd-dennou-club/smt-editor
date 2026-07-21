/*
 * I2C sensor 
 */

import Utils from './smt_common.js';

//sensors including RTC
const I2C_SENSORS = ['BME688', 'BMP280', 'DPS310', 'SCD30', 'SCD41', 'SHT30', 'SHT35', 'SHT40', 'VL53L0X'];
const I2C_SENSORS_METHOD = ['pressure', 'temperature', 'humidity', 'co2', 'distance'];

const SmT_I2C_Sensors_Converter = {
    register: function (converter) {
	converter._instanceTypeMap = converter._instanceTypeMap || {};

	I2C_SENSORS.forEach((sensorName) => {	
	    const className = `::${sensorName}`;       // 例: ::SHT35
	    
	    // --- 代入 ( $sensor = SENSOR.new($i2c) ) ---
            converter.registerOnVasgn((scope, variable, rh) => {
		if (rh?.opcode !== "peripherals_i2c_sensor_init") return null;
		
		// 共通関数で変数ブロックを接続
		const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE2", variable);

		//インスタンス名は決め打ち
		const instance = "_" + sensorName.toLowerCase() + "_1_";
		if (varName !== instance) return null;
		
		converter._instanceTypeMap[varName] = "I2C_SENSOR";
		return rh;
            });
	    
            // --- 初期化 ( SENSOR.new($i2c) ) ---
            converter.registerOnSend(className, "new", 1, (params) => {
		const { args, node } = params;
		const block = converter.createBlock("peripherals_i2c_sensor_init", "statement", node);
            
		Utils.fixLocationToLineStart(block);
		
		if (block) {
		    converter.addField(block, "SENSOR", sensorName);
		    return block;
		}
		return null;
            });

	    // --- メソッド (.read) ---
            converter.registerOnSend('variable', 'read', 0, (params) => {
		const { receiver, node, args } = params;
		const varName = receiver.fields?.VARIABLE?.value || "";
		
		if (converter._instanceTypeMap[varName] !== "I2C_SENSOR") return null;
		if (! varName.includes( sensorName.toLowerCase() )) return null;				
		const opcode = "peripherals_i2c_sensor_read"; 
		const block = converter.createBlock(opcode, "statement", node);
		
		if (block) {
		    converter.addField(block, "SENSOR", sensorName);
                    return block;
		}
		return null;
            });
	    
	    I2C_SENSORS_METHOD.forEach((method) => {	
		converter.registerOnSend('variable', method, 0, (params) => {
                    const { receiver, node, args } = params;
                    const varName = receiver.fields?.VARIABLE?.value || "";
		    
                    if (converter._instanceTypeMap[varName] !== "I2C_SENSOR") return null;
		    if (! varName.includes( sensorName.toLowerCase() )) return null;		    
		    
                    const opcode = "peripherals_i2c_sensor_value"; 
                    const block = converter.createBlock(opcode, "value", node);
		    
                    if (block) {
			converter.addField(block, "SENSOR", sensorName);
			converter.addField(block, "TARGET", method);
			return block;
                    }
                    return null;
		});
	    });
	});
    }
}

export default SmT_I2C_Sensors_Converter;
