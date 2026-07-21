/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

/*    
    Generator.peripherals_m5lcd_init = function () {
        return `m5lcd = ILI934X.new(23, 18, 14, 27, 33, 32) \n`;
    };
    
    Generator.peripherals_ili934x_write_line = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const x2   = Generator.valueToCode(block, 'X2', Generator.ORDER_NONE);
        const y2   = Generator.valueToCode(block, 'X2', Generator.ORDER_NONE);
        const type = Generator.getFieldValue(block, 'TYPE') || null;
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${x1}, ${y1}, ${x2}, ${y2}, ${color}) \n`;
    };

    Generator.peripherals_ili934x_write_circle = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
        const type = Generator.getFieldValue(block, 'TYPE') || null;
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.draw_${type}(${x1}, ${y1}, ${size}, ${color}) \n`;
    };

    Generator.peripherals_ili934x_write_string = function (block) {
        Generator.prepares_.i2c_m5lcd = Generator.peripherals_m5lcd_init(null);
        const x1   = Generator.valueToCode(block, 'X1', Generator.ORDER_NONE);
        const y1   = Generator.valueToCode(block, 'Y1', Generator.ORDER_NONE);
        const size = Generator.valueToCode(block, 'SIZE', Generator.ORDER_NONE);
        const mess = Generator.valueToCode(block, 'MESS', Generator.ORDER_NONE);
        const color = Generator.getFieldValue(block, 'COLOR') || null;
        return `m5lcd.drawString(${x1}, ${y1}, ${mess}, ${size}, ${color}) \n`;
    };
*/
    //
    // I2C Sensors
    //
    Generator.peripherals_i2c_sensor_init = function (block) {
        const instance1 = Generator.valueToCode(block, 'INSTANCE1', Generator.ORDER_NONE) || null;
        const instance2 = Generator.valueToCode(block, 'INSTANCE2', Generator.ORDER_NONE) || null;
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
        return `${instance2} = ${sensor}.new( ${instance1} )\n`;
    };

    Generator.peripherals_i2c_sensor_read = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return `${instance}.read\n`;
    };
    
    Generator.peripherals_i2c_sensor_value = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`${instance}.${target}`, Generator.ORDER_ATOMIC];
   };

    //
    // LCD
    //
    Generator.peripherals_lcd_init = function (block) {
        const instance1 = Generator.valueToCode(block, 'INSTANCE1', Generator.ORDER_NONE) || null;
        const instance2 = Generator.valueToCode(block, 'INSTANCE2', Generator.ORDER_NONE) || null;
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
        return `${instance2} = ${sensor}.new( ${instance1} )\n`;
    };

    Generator.peripherals_lcd_cursor = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const line = Generator.valueToCode(block, 'LINE', Generator.ORDER_NONE) || 1;
        return (
	    `${instance}.cursor(line: ${line})\n`
	);
    };

    Generator.peripherals_lcd_print = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `${instance}.print(${text})\n`
	);
    };

    Generator.peripherals_lcd_clear = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return (
	    `${instance}.clear\n`
	);
    };

    //
    // Time
    //
    Generator.peripherals_time_sync_ntp = function (block) {
        const ntp = Generator.valueToCode(block, 'NTP', Generator.ORDER_NONE) || null;
        return `Time.sync_ntp(${ntp})\n`;
    };

    Generator.peripherals_time_mktime = function (block) {
	const year = Generator.valueToCode(block, 'YEAR', Generator.ORDER_NONE) || 'nil';
	const mon  = Generator.valueToCode(block, 'MON',  Generator.ORDER_NONE) || 'nil';
	const day  = Generator.valueToCode(block, 'DAY',  Generator.ORDER_NONE) || 'nil';
	const hour = Generator.valueToCode(block, 'HOUR', Generator.ORDER_NONE) || 'nil';
	const min  = Generator.valueToCode(block, 'MIN',  Generator.ORDER_NONE) || 'nil';
	const sec  = Generator.valueToCode(block, 'SEC',  Generator.ORDER_NONE) || 'nil';
        return (
	    `Time.mktime( ${year}, ${mon}, ${day}, ${hour}, ${min}, ${sec} )\n`
	);
    };
    
    Generator.peripherals_time_now = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return (
	    `${instance} = Time.now\n`
	);
    };

    Generator.peripherals_time_value = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`${instance}.${target}`, Generator.ORDER_ATOMIC];
    };

    //
    // Wi-Fi
    //
    Generator.peripherals_wifi_init = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return (
	    `${instance} = WLAN.new()\n`
	);
    };

    Generator.peripherals_wifi_connect = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `${instance}.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.peripherals_wifi_connected = function (block) {
	const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return [`${instance}.connected?`, Generator.ORDER_ATOMIC];
    };
    
    Generator.peripherals_http_get = function (block) {
        const url = Generator.valueToCode(block, 'URL', Generator.ORDER_NONE) || null;
        return [`HTTP.get( ${url} )`, Generator.ORDER_ATOMIC]
    };

    Generator.peripherals_http_post = function (block) {
        const url  = Generator.valueToCode(block, 'URL',  Generator.ORDER_NONE) || null;
        const data = Generator.valueToCode(block, 'DATA', Generator.ORDER_NONE) || null;
        return [`HTTP.post( ${url}, ${data} )`, Generator.ORDER_ATOMIC];
    };

    //
    // SD
    //
    Generator.peripherals_sd_init = function (block) {
        const instance1 = Generator.valueToCode(block, 'INSTANCE1', Generator.ORDER_NONE) || null;
        const instance2 = Generator.valueToCode(block, 'INSTANCE2', Generator.ORDER_NONE) || null;
        const pin = Generator.valueToCode(block, 'PIN', Generator.ORDER_NONE) || null;
	const dir = Generator.valueToCode(block, 'DIR', Generator.ORDER_NONE) || null;
        return (
  	    `${instance2} = SDSPI.new(${instance1}, cs_pin:${pin}, mount_point:${dir})\n` 
	);
    };

    Generator.peripherals_sd_open = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const file = Generator.valueToCode(block, 'FILE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return (
	    `${instance} = File.open(${file}, "${mode}")\n`
	);
    };

    Generator.peripherals_sd_puts = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `${instance}.puts(${text})\n`
	);
    };

    Generator.peripherals_sd_gets = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return [`${instance}.${mode}`, Generator.ORDER_ATOMIC];
    };
    
    Generator.peripherals_sd_close = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return (
	    `${instance}.close\n`
	);
    };

    Generator.peripherals_sd_umount = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        return (
	    `${instance}.umount\n`
	);
    };

}

