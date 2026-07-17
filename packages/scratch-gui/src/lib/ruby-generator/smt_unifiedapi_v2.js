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
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;	
        return `${instance} = GPIO.new( ${pin}, ${direction} )\n`;
    };

    Generator.unifiedapi_gpio_write = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;	
        const value = Generator.valueToCode(
            block,
            "VALUE",
            Generator.ORDER_NONE
        );
        return `${instance}.write( ${value} )\n`;
    };

    Generator.unifiedapi_gpio_read = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;	
        return [`${instance}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_pwm_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const timer =
            Generator.valueToCode(block, "TIMER", Generator.ORDER_NONE) || null;
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const duty =
            Generator.valueToCode(block, "DUTY", Generator.ORDER_NONE) || null;
        return `${instance} = PWM.new( ${pin}, timer:${timer}, frequency:${freq}, duty:${duty} )\n`;
    };

    Generator.unifiedapi_pwm_duty = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const duty =
            Generator.valueToCode(block, "DUTY", Generator.ORDER_NONE) || null;
        return `${instance}.duty( ${duty} )\n`;
    };

    Generator.unifiedapi_pwm_frequency = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;	
        const freq =
            Generator.valueToCode(block, "FREQ", Generator.ORDER_NONE) || null;
        return `${instance}.frequency( ${freq} )\n`;
    };

    Generator.unifiedapi_pwm_pulse = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;	
        const pulse =
            Generator.valueToCode(block, "PULSE", Generator.ORDER_NONE) || null;
        return `${instance}.pulse_width_us( ${pulse} )\n`;
    };

    Generator.unifiedapi_adc_init = function (block) {
        const pin =
            Generator.valueToCode(block, "PIN", Generator.ORDER_NONE) || null;
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        return `${instance} = ADC.new( ${pin} )\n`;
    };

    Generator.unifiedapi_adc_raw = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        return [`${instance}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_adc_volt = function (block) {
        const instance =
            Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        return [`${instance}.read`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_i2c_init = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        return `${instance} = I2C.new\n`;
    };

    Generator.unifiedapi_i2c_write = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
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
	    return `${instance}.write( ${addr}, ${hex1} )\n`;
	}else{
	    return `${instance}.write( ${addr}, ${hex1}, ${hex2} )\n`;
	}
    };

    Generator.unifiedapi_i2c_read = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
	let addr =
            Generator.valueToCode(block, "ADDR", Generator.ORDER_NONE) || null;
        const bytes =
              Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
        let hex =
	    Generator.valueToCode(block, "HEX", Generator.ORDER_NONE) || null;
	addr = addr.replace(/^"(.*)"$/, '$1');
	hex  = hex.replace(/^"(.*)"$/, '$1');

	if (hex === '-') {
	    return [`${instance}.read( ${addr}, ${bytes} )`, Generator.ORDER_ATOMIC];
	}else{
	    return [`${instance}.read( ${addr}, ${bytes}, ${hex} )`, Generator.ORDER_ATOMIC];
	}
    };

    Generator.unifiedapi_spi_init = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const miso =
            Generator.valueToCode(block, "MISO", Generator.ORDER_NONE) || 19;
        const mosi =
            Generator.valueToCode(block, "MOSI", Generator.ORDER_NONE) || 23;
        const clk =
            Generator.valueToCode(block, "CLK", Generator.ORDER_NONE) || 18;
        return `${instance} = SPI.new( miso_pin:${miso}, mosi_pin:${mosi}, clk_pin:${clk} )\n`;
    };

    Generator.unifiedapi_spi_write = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
	let hex1 =
	    Generator.valueToCode(block, "HEX1", Generator.ORDER_NONE) || null;
        let hex2 =
	    Generator.valueToCode(block, "HEX2", Generator.ORDER_NONE) || null;
	hex1 = hex1.replace(/^"(0x.*)"$/, '$1');
	hex2 = hex2.replace(/^"(0x.*)"$/, '$1');
	return `${instance}.write( ${hex1}, ${hex2} )\n`;
    };

    Generator.unifiedapi_spi_read = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const bytes =
            Generator.valueToCode(block, "BYTES", Generator.ORDER_NONE) || 1;
	return [`${instance}.read( ${bytes} )`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_uart_init = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const uart =
            Generator.valueToCode(block, "UART", Generator.ORDER_NONE) || null;
        const rate =
            Generator.valueToCode(block, "RATE", Generator.ORDER_NONE) || null;
        return `${instance} = UART.new( ${uart}, baudrate:${rate} )\n`;
    };

    Generator.unifiedapi_uart_puts = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const comm =
            Generator.valueToCode(block, "COMM", Generator.ORDER_NONE) || null;
        return `${instance}.puts( ${comm} )\n`;
    };

    Generator.unifiedapi_uart_gets = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        return [`${instance}.gets()`, Generator.ORDER_ATOMIC];
    };

    Generator.unifiedapi_uart_clear = function (block) {
        const instance =
              Generator.valueToCode(block, "INSTANCE", Generator.ORDER_NONE) || null;
        const txrx =
	      Generator.getFieldValue(block, "TXRX",  Generator.ORDER_NONE) || null;	
        return `${instance}.${txrx}()\n`;
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
