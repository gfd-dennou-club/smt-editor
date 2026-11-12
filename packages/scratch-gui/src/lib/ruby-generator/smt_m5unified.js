/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.m5unified_init = function (){
        return (
	    `m5unified = M5Unified.new(rotation: 0)` 
	);
    };

    Generator.m5unified_clear = function (block) {
	Generator.prepares_.init = Generator.m5unified_init(null);
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
        return (
	    `m5unified.clear(color: ${color})\n` 
	);
    };

    Generator.m5unified_rect = function (block) {
	Generator.prepares_.init = Generator.m5unified_init(null);
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const size1 = Generator.valueToCode(block, "SIZE1", Generator.ORDER_NONE) || null;
	const size2 = Generator.valueToCode(block, "SIZE2", Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const fill  = Generator.getFieldValue(block, 'FILL', Generator.ORDER_NONE);
        return (
	    `m5unified.rect(pos: [${pos1}, ${pos2}], size: [${size1}, ${size2}], color: ${color}, fill: ${fill})\n` 
	);
    };

    Generator.m5unified_circle = function (block) {
	Generator.prepares_.init = Generator.m5unified_init(null);
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const radius= Generator.valueToCode(block, "RADIUS", Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const fill  = Generator.getFieldValue(block, 'FILL', Generator.ORDER_NONE);
        return (
	    `m5unified.circle(pos: [${pos1}, ${pos2}], radius: ${radius}, color: ${color}, fill: ${fill})\n` 
	);
    };
    
    Generator.m5unified_line = function (block) {
	Generator.prepares_.init = Generator.m5unified_init(null);
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const pos3  = Generator.valueToCode(block, "POS3", Generator.ORDER_NONE) || null;
	const pos4  = Generator.valueToCode(block, "POS4", Generator.ORDER_NONE) || null;
	const width = Generator.valueToCode(block, "WIDTH",Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
        return (
	    `m5unified.line(pos_start: [${pos1}, ${pos2}], pos_end: [${pos3},${pos4}], width: ${width}, color: ${color})\n` 
	);
    };

    Generator.m5unified_text = function (block) {
	Generator.prepares_.init = Generator.m5unified_init(null);
	const text  = Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const size  = Generator.valueToCode(block, "SIZE",Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const color2= Generator.getFieldValue(block, 'COLOR2', Generator.ORDER_NONE);
        return (
	    `m5unified.text(${text}, pos: [${pos1}, ${pos2}], pointsize: ${size}, color: ${color}, background: ${color2})\n` 
	);
    };
        
}
