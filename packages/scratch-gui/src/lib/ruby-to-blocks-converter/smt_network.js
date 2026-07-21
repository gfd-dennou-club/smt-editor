/**
 * converter for network
 */

import Utils from './smt_common.js';

const SmT_Network_Converter = {
    register: function (converter) {
	converter._instanceTypeMap = converter._instanceTypeMap || {};

	// --- 代入 ( $wlan = WLAN.new ) ---
        converter.registerOnVasgn((scope, variable, rh) => {
	    if (rh?.opcode !== "peripherals_wifi_init") return null;
	    
	    // 共通関数で変数ブロックを接続
	    const varName = Utils.attachVariableBlock(converter, rh, "INSTANCE", variable);

	    //インスタンス名は決め打ち
	    const instance = "_wlan_1_";
	    if (varName !== instance) return null;
	    
	    converter._instanceTypeMap[varName] = "WLAN";
	    return rh;
        });
	
        // --- 初期化 ( WLAN.new ) ---
        converter.registerOnSend("::WLAN", "new", 0, (params) => {
	    const { args, node } = params;
	    const block = converter.createBlock("peripherals_wifi_init", "statement", node);
            
	    Utils.fixLocationToLineStart(block);
	    
	    if (block) {
		return block;
	    }
	    return null;
        });
	
	// --- メソッド (.connect) ---
        converter.registerOnSend('variable', 'connect', 2, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "WLAN") return null;

	    const opcode = "peripherals_wifi_connect"; 
            const block = converter.createBlock(opcode, "statement", node);

            if (block) {
		converter.addTextInput(block, "SSID", args[0], '');
		converter.addTextInput(block, "PASS", args[1], '');
                return block;
            }
            return null;
        });

	// --- メソッド (.connected?) ---
        converter.registerOnSend('variable', 'connected?', 0, (params) => {
            const { receiver, node, args } = params;
            const varName = receiver.fields?.VARIABLE?.value || "";
	    
            if (converter._instanceTypeMap[varName] !== "WLAN") return null;

	    const opcode = "peripherals_wifi_connected"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
                return block;
            }
            return null;
        });

	// --- HTTP クラスメソッド (HTTP.get) ---
        converter.registerOnSend('::HTTP', 'get', 1, (params) => {
            const { receiver, node, args } = params;
	    const opcode = "peripherals_http_get"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
		converter.addTextInput(block, "URL", args[0], '');
                return block;
            }
            return null;
        });

	// --- HTTP クラスメソッド (HTTP.post) ---
        converter.registerOnSend('::HTTP', 'post', 2, (params) => {
            const { receiver, node, args } = params;
	    const opcode = "peripherals_http_post"; 
            const block = converter.createBlock(opcode, "value", node);

            if (block) {
		converter.addTextInput(block, "URL",  args[0], '');
		converter.addTextInput(block, "DATA", args[1], '');
                return block;
            }
            return null;
        });
    }
}

export default SmT_Network_Converter;
