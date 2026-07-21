/**
 * Define Ruby code generator for MicroController
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {
    Generator.unifiedapi_gpio_init = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const direction =
	      Generator.getFieldValue(block, "DIRECTION",  Generator.ORDER_NONE) || null;
        return `gpio${pin} = GPIO.new( ${pin}, ${direction} )\n`;
    };

    Generator.unifiedapi_gpio_write = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const value = Generator.valueToCode(block, "VALUE", Generator.ORDER_NONE);
        return `gpio${pin}.write( ${value} )\n`;
    };

    Generator.unifiedapi_gpio_read = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`gpio${pin}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_pwm_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const timer =
            Generator.valueToCode(block, "TIMER", Generator.ORDER_NONE) || null;
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        const duty =
            Generator.valueToCode(block, "DUTY", Generator.ORDER_NONE) || null;
        return `pwm${pin} = PWM.new( ${pin}, timer:${timer}, frequency:${freq}, duty:${duty} )\n`;
    };

    Generator.unifiedapi_pwm_duty = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const duty =
            Generator.valueToCode(block, "DUTY", Generator.ORDER_NONE) || null;
        return `pwm${pin}.duty( ${duty} )\n`;
    };

    Generator.unifiedapi_pwm_frequency = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        return `pwm${pin}.frequency( ${freq} )\n`;
    };

    Generator.unifiedapi_pwm_pulse = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const pulse =
            Generator.valueToCode(block, "PULSE", Generator.ORDER_NONE) || null;
        return `pwm${pin}.pulse_width_us( ${pulse} )\n`;
    };

    Generator.unifiedapi_adc_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return `adc${pin} = ADC.new( ${pin} )\n`;
    };

    Generator.unifiedapi_adc_raw = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`adc${pin}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_adc_volt = function (block) {
        const pin =
              Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        return [`adc${pin}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_i2c_init = function (block) {
        return `i2c = I2C.new\n`;
    };

    Generator.unifiedapi_i2c_write = function (block) {
	let addr =
              Generator.valueToCode(block, "ADDR", Generator.ORDER_NONE) || null;
	let hex1 =
	      Generator.valueToCode(block, "HEX1", Generator.ORDER_NONE) || null;
        let hex2 =
	      Generator.valueToCode(block, "HEX2", Generator.ORDER_NONE) || null;
	addr = addr.replace(/^"(.*)"$/, '$1');
	hex1 = hex1.replace(/^"(.*)"$/, '$1');
	hex2 = hex2.replace(/^"(.*)"$/, '$1');

	if (hex2 === '-') {
	    return `i2c.write( ${addr}, ${hex1} )\n`;
	}else{
	    return `i2c.write( ${addr}, ${hex1}, ${hex2} )\n`;
	}
    };

    Generator.unifiedapi_i2c_read = function (block) {
	let addr =
            Generator.valueToCode(block, "ADDR", Generator.ORDER_NONE) || null;
        const bytes =
              Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
        let hex =
	    Generator.valueToCode(block, "HEX", Generator.ORDER_NONE) || null;
	addr = addr.replace(/^"(.*)"$/, '$1');
	hex  = hex.replace(/^"(.*)"$/, '$1');

	if (hex === '-') {
	    return [`i2c.read( ${addr}, ${bytes} )`, Generator.ORDER_ATOMIC];
	}else{
	    return [`i2c.read( ${addr}, ${bytes}, ${hex} )`, Generator.ORDER_ATOMIC];
	}
    };

    Generator.unifiedapi_spi_init = function (block) {
        const miso =
            Generator.valueToCode(block, "MISO", Generator.ORDER_NONE) || 19;
        const mosi =
            Generator.valueToCode(block, "MOSI", Generator.ORDER_NONE) || 23;
        const clk =
            Generator.valueToCode(block, "CLK", Generator.ORDER_NONE) || 18;
        return `spi = SPI.new( miso_pin:${miso}, mosi_pin:${mosi}, clk_pin:${clk} )\n`;
    };

    Generator.unifiedapi_spi_write = function (block) {
	let hex1 =
	    Generator.valueToCode(block, "HEX1", Generator.ORDER_NONE) || null;
        let hex2 =
	    Generator.valueToCode(block, "HEX2", Generator.ORDER_NONE) || null;
	hex1 = hex1.replace(/^"(0x.*)"$/, '$1');
	hex2 = hex2.replace(/^"(0x.*)"$/, '$1');
	return `spi.write( ${hex1}, ${hex2} )\n`;
    };

    Generator.unifiedapi_spi_read = function (block) {
        const bytes =
            Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
	return [`spi.read( ${bytes} )`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_uart_init = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const rate =
            Generator.valueToCode(block, "RATE", Generator.ORDER_NONE) || null;
        return `uart${uart} = UART.new( ${uart}, baudrate:${rate} )\n`;
    };

    Generator.unifiedapi_uart_puts = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const comm =
            Generator.valueToCode(block, "COMM", Generator.ORDER_NONE) || null;
        return `uart${uart}.puts( ${comm} )\n`;
    };

    Generator.unifiedapi_uart_gets = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        return [`uart${uart}.gets()`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_uart_clear = function (block) {
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const txrx =
	      Generator.getFieldValue(block, "TXRX",  Generator.ORDER_NONE) || null;	
        return `uart${uart}.${txrx}()\n`;
    };

    Generator.unifiedapi_num16 = function (block) {
        const num = Generator.valueToCode(block, 'NUM', Generator.ORDER_NONE) || null;
        return [`${num}.to_i(16)`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_tools = function (block) {
        const str = Generator.valueToCode(block, 'STR', Generator.ORDER_NONE) || null;
        const tool =
	      Generator.getFieldValue(block, "TOOL",  Generator.ORDER_NONE) || null;
        return [`${str}.${tool}`, Generator.ORDER_ATOMIC];
    };
    
}
