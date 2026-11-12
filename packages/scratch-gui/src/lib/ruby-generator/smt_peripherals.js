/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {


    Generator.peripherals_lcdspi_init = function (){
        return (
	    `ili934x = LCDSPI.new( spi, cs_pin: 14, dc_pin: 27, rst_pin: 33, bl_pin: 32, rotation: 1)\n`
	);
    };

    Generator.peripherals_lcdspi_clear = function (block) {
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
        return (
	    `ili934x.clear(color: ${color})\n` 
	);
    };

    Generator.peripherals_lcdspi_rect = function (block) {
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const size1 = Generator.valueToCode(block, "SIZE1", Generator.ORDER_NONE) || null;
	const size2 = Generator.valueToCode(block, "SIZE2", Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const fill  = Generator.getFieldValue(block, 'FILL', Generator.ORDER_NONE);
        return (
	    `ili934x.rect(pos: [${pos1}, ${pos2}], size: [${size1}, ${size2}], color: ${color}, fill: ${fill})\n` 
	);
    };

    Generator.peripherals_lcdspi_circle = function (block) {
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const radius= Generator.valueToCode(block, "RADIUS", Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const fill  = Generator.getFieldValue(block, 'FILL', Generator.ORDER_NONE);
        return (
	    `ili934x.circle(pos: [${pos1}, ${pos2}], radius: ${radius}, color: ${color}, fill: ${fill})\n` 
	);
    };
    
    Generator.peripherals_lcdspi_line = function (block) {
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const pos3  = Generator.valueToCode(block, "POS3", Generator.ORDER_NONE) || null;
	const pos4  = Generator.valueToCode(block, "POS4", Generator.ORDER_NONE) || null;
	const width = Generator.valueToCode(block, "WIDTH",Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
        return (
	    `ili934x.line(pos_start: [${pos1}, ${pos2}], pos_end: [${pos3},${pos4}], width: ${width}, color: ${color})\n` 
	);
    };

    Generator.peripherals_lcdspi_text = function (block) {
	const text  = Generator.valueToCode(block, "TEXT", Generator.ORDER_NONE) || null;
	const pos1  = Generator.valueToCode(block, "POS1", Generator.ORDER_NONE) || null;
	const pos2  = Generator.valueToCode(block, "POS2", Generator.ORDER_NONE) || null;
	const size  = Generator.valueToCode(block, "SIZE",Generator.ORDER_NONE) || null;
	const color = Generator.getFieldValue(block, 'COLOR', Generator.ORDER_NONE);
	const color2= Generator.getFieldValue(block, 'COLOR2', Generator.ORDER_NONE);
        return (
	    `ili934x.text(${text}, pos: [${pos1}, ${pos2}], pointsize: ${size}, color: ${color}, background: ${color2})\n` 
	);
    };
    
    //
    // I2C Sensors
    //
    Generator.peripherals_i2c_sensor_init = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const instance = sensor.toLowerCase()
        return `${instance} = ${sensor}.new( i2c )\n`;
    };

    Generator.peripherals_i2c_sensor_read = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
	const instance = sensor.toLowerCase()
        return `${instance}.read\n`;
    };
    
    Generator.peripherals_i2c_sensor_value = function (block) {
        const sensor = Generator.getFieldValue(block, 'SENSOR') || null;
        const target = Generator.getFieldValue(block, 'TARGET') || null;
	const instance = sensor.toLowerCase()
        return [`${instance}.${target}`, Generator.ORDER_ATOMIC];
   };

    //
    // LCD
    //
    Generator.peripherals_lcd_init = function (block) {
        const lcd = Generator.getFieldValue(block, 'LCD') || null;
	const instance = lcd.toLowerCase()
        return `${instance} = ${lcd}.new( i2c )\n`;
    };

    Generator.peripherals_lcd_cursor = function (block) {
        const lcd = Generator.getFieldValue(block, 'LCD') || null;
        const line = Generator.valueToCode(block, 'LINE', Generator.ORDER_NONE) || 1;
	const instance = lcd.toLowerCase()
        return (
	    `${instance}.cursor(line: ${line})\n`
	);
    };

    Generator.peripherals_lcd_print = function (block) {
        const lcd = Generator.getFieldValue(block, 'LCD') || null;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
	const instance = lcd.toLowerCase()
        return (
	    `${instance}.print(${text})\n`
	);
    };

    Generator.peripherals_lcd_clear = function (block) {
        const lcd = Generator.getFieldValue(block, 'LCD') || null;
	const instance = lcd.toLowerCase()
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
	    `time = Time.now\n`
	);
    };

    Generator.peripherals_time_value = function (block) {
        const instance = Generator.valueToCode(block, 'INSTANCE', Generator.ORDER_NONE) || null;
        const target = Generator.getFieldValue(block, 'TARGET') || null;
        return [`time.${target}`, Generator.ORDER_ATOMIC];
    };

    //
    // Wi-Fi
    //
    Generator.peripherals_wifi_init = function (block) {
        return (
	    `wlan = WLAN.new()\n`
	);
    };

    Generator.peripherals_wifi_connect = function (block) {
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `wlan.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.peripherals_wifi_connected = function (block) {
        return [`wlan.connected?`, Generator.ORDER_ATOMIC];
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
        const pin = Generator.valueToCode(block, 'PIN', Generator.ORDER_NONE) || null;
	const dir = Generator.valueToCode(block, 'DIR', Generator.ORDER_NONE) || null;
        return (
  	    `sdspi = SDSPI.new(spi, cs_pin:${pin}, mount_point:${dir})\n` 
	);
    };

    Generator.peripherals_sd_open = function (block) {
        const file = Generator.valueToCode(block, 'FILE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return (
	    `file = File.open(${file}, "${mode}")\n`
	);
    };

    Generator.peripherals_sd_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `file.puts(${text})\n`
	);
    };

    Generator.peripherals_sd_gets = function (block) {
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return [`file.${mode}`, Generator.ORDER_ATOMIC];
    };
    
    Generator.peripherals_sd_close = function (block) {
        return (
	    `file.close\n`
	);
    };

    Generator.peripherals_sd_umount = function (block) {
        return (
	    `sdspi.umount\n`
	);
    };
}

