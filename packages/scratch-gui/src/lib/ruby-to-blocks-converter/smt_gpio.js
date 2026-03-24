/**
 * converter for GPIO
 *
*/

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
                converter.addNumberInput(block, "PIN", "math_integer", Number(args[0].value), 12);
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
            const block = converter.createBlock(opcode, "value", node);

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
