/**
 * Define Ruby code generator for I2C_UART Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    //
    // GPIO (output)
    //
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
    


    
    Generator.m5unified_led = function (block) {
        const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
	if (pin == 13) {
	    Generator.prepares_.led13 = Generator.m5unified_led_init13(null);
	} else if (pin == 12){
	    Generator.prepares_.led12 = Generator.m5unified_led_init12(null);
	} else if (pin == 14){
	    Generator.prepares_.led14 = Generator.m5unified_led_init14(null);
	} else if (pin == 27){
	    Generator.prepares_.led27 = Generator.m5unified_led_init27(null);
	} else if (pin == 26){
	    Generator.prepares_.led26 = Generator.m5unified_led_init26(null);
	} else if (pin == 25){
	    Generator.prepares_.led25 = Generator.m5unified_led_init25(null);
	} else if (pin == 33){
	    Generator.prepares_.led33 = Generator.m5unified_led_init33(null);
	} else if (pin == 32){
	    Generator.prepares_.led32 = Generator.m5unified_led_init32(null);
	}
        return (
	    `gpio${pin}.write(${onoff})\n`
	);
    };

    //
    // GPIO (SW)
    //
    Generator.m5unified_sw_init34 = function (){
        return (
	    `gpio34 = GPIO.new( 34, GPIO::IN )`
	);
    };
    Generator.m5unified_sw_init35 = function (){
        return (
	    `gpio35 = GPIO.new( 35, GPIO::IN )`
	);
    };
    Generator.m5unified_sw_init18 = function (){
        return (
	    `gpio18 = GPIO.new( 18, GPIO::IN|GPIO::PULL_UP )`
	);
    };
    Generator.m5unified_sw_init19 = function (){
        return (
	    `gpio19 = GPIO.new( 19, GPIO::IN|GPIO::PULL_UP )`
	);
    };

    Generator.m5unified_sw_all = function (block) {
        const onoff1  = Generator.getFieldValue(block, 'ONOFF1', Generator.ORDER_NONE);
        const onoff2  = Generator.getFieldValue(block, 'ONOFF2', Generator.ORDER_NONE);
        const onoff3  = Generator.getFieldValue(block, 'ONOFF3', Generator.ORDER_NONE);
        const onoff4  = Generator.getFieldValue(block, 'ONOFF4', Generator.ORDER_NONE);
	Generator.prepares_.sw34 = Generator.m5unified_sw_init34( null );
	Generator.prepares_.sw35 = Generator.m5unified_sw_init35( null );
	Generator.prepares_.sw18 = Generator.m5unified_sw_init18( null );
	Generator.prepares_.sw19 = Generator.m5unified_sw_init19( null );
        return [ `(gpio34.read == ${onoff1}) && (gpio35.read == ${onoff2}) && (gpio18.read == ${onoff3}) && (gpio19.read == ${onoff4})`, Generator.ORDER_ATOMIC ];
    };

    Generator.m5unified_sw = function (block) {
	const pin   = Generator.getFieldValue(block, 'PIN',   Generator.ORDER_NONE);
        const onoff = Generator.getFieldValue(block, 'ONOFF', Generator.ORDER_NONE);
	if (pin == 34) {
	    Generator.prepares_.sw34 = Generator.m5unified_sw_init34( null );
	} else if (pin == 35){
	    Generator.prepares_.sw35 = Generator.m5unified_sw_init35( null );
	} else if (pin == 18){
	    Generator.prepares_.sw18 = Generator.m5unified_sw_init18( null );
	} else if (pin == 19){
	    Generator.prepares_.sw19 = Generator.m5unified_sw_init19( null );
	} 
        return [`gpio${pin}.read == ${onoff}`, Generator.ORDER_ATOMIC];
    };


    //
    // PWM LEDs
    //
    Generator.m5unified_pwm_led_init13 = function (){
        return (
	    `pwm13 = PWM.new( 13, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init12 = function (){
        return (
	    `pwm12 = PWM.new( 12, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init14 = function (){
        return (
	    `pwm14 = PWM.new( 14, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init27 = function (){
        return (
	    `pwm27 = PWM.new( 27, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init26 = function (){
        return (
	    `pwm26 = PWM.new( 26, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init25 = function (){
        return (
	    `pwm25 = PWM.new( 25, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init33 = function (){
        return (
	    `pwm33 = PWM.new( 33, timer: 0, frequency:440, duty:0 )`
	);
    };
    Generator.m5unified_pwm_led_init32 = function (){
        return (
	    `pwm32 = PWM.new( 32, timer: 0, frequency:440, duty:0 )` 
	);
    };
    
    Generator.m5unified_pwm_duty = function (block) {
        const pin  = Generator.getFieldValue(block, 'PIN',  Generator.ORDER_NONE);
	const duty = Generator.valueToCode(block, 'DUTY', Generator.ORDER_NONE) || 0;
	if (pin == 13) {
	    Generator.prepares_.pwm_led13 = Generator.m5unified_pwm_led_init13(null);
	} else if (pin == 12){
	    Generator.prepares_.pwm_led12 = Generator.m5unified_pwm_led_init12(null);
	} else if (pin == 14){
	    Generator.prepares_.pwm_led14 = Generator.m5unified_pwm_led_init14(null);
	} else if (pin == 27){
	    Generator.prepares_.pwm_led27 = Generator.m5unified_pwm_led_init27(null);
	} else if (pin == 26){
	    Generator.prepares_.pwm_led26 = Generator.m5unified_pwm_led_init26(null);
	} else if (pin == 25){
	    Generator.prepares_.pwm_led25 = Generator.m5unified_pwm_led_init25(null);
	} else if (pin == 33){
	    Generator.prepares_.pwm_led33 = Generator.m5unified_pwm_led_init33(null);
	} else if (pin == 32){
	    Generator.prepares_.pwm_led32 = Generator.m5unified_pwm_led_init32(null);
	}
        return (
	    `pwm${pin}.duty( ${duty} )\n`
	);
    };

    //
    // PWM buzzer
    //
    Generator.m5unified_pwm_buzzer_init = function (){
        return (
   	    `pwm15 = PWM.new( 15, timer: 1, frequency:440, duty:0 )\n` 
	);
    };
    
    Generator.m5unified_buzzer = function (block) {
	Generator.prepares_.pwm_buzzer = Generator.m5unified_pwm_buzzer_init(null);
	const note = Generator.getFieldValue(block, 'NOTE', Generator.ORDER_NONE) || 0;
        return (
	    `pwm15.duty( 50 )\n` +
	    `pwm15.frequency( ${note} )\n`
	);
    };

    Generator.m5unified_buzzer_stop = function (block) {
	Generator.prepares_.pwm_buzzer = Generator.m5unified_pwm_buzzer_init(null);
        return (
	    `pwm15.duty( 0 )\n` 
	);
    };

    //
    // ADC
    //
    Generator.m5unified_temp_init = function () {
        return (	
	    `adc39 = ADC.new( 39 )\n` 
	);
    };

    Generator.m5unified_temp = function () {
        Generator.prepares_.adc_temp = Generator.m5unified_temp_init(null);
        return [`1.0 / ( 1.0 / 3435.0 * Math.log( (3300.0 - $adc39.read() * 1000.0) / ($adc39.read() * 1000.0) ) + 1.0 / 298.0 ) - 273.0\n`, Generator.ORDER_ATOMIC];
    };

    //
    // I2C
    //
    Generator.m5unified_i2c_init = function () {
        return (
	    `i2c = I2C.new\n`
	);
    };

    //
    // LCD
    //
    Generator.m5unified_i2c_lcd_init = function () {
        Generator.prepares_.i2c = Generator.m5unified_i2c_init(null);
        return (
	    `aqm0802a = AQM0802A.new(i2c)\n`
	);
    };

    Generator.m5unified_monitor = function (block) {
        Generator.prepares_.i2c_lcd = Generator.m5unified_i2c_lcd_init(null);
        const line = Generator.getFieldValue(block, 'LINE', Generator.ORDER_NONE) || 0;
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `aqm0802a.cursor(line: ${line})\n` +
	    `aqm0802a.print("        ")\n` +
	    `aqm0802a.cursor(line: ${line})\n` +
 	    `aqm0802a.print(${text})\n`
	);
    };

    //
    // Wi-Fi
    //
    Generator.m5unified_wifi_init = function () {
        const ssid = Generator.valueToCode(block, 'SSID', Generator.ORDER_NONE);
        const pass = Generator.valueToCode(block, 'PASS', Generator.ORDER_NONE);
        return (
	    `wlan = WLAN.new()\n` +
	    `wlan.connect(${ssid}, ${pass}) \n`
	);
    };

    Generator.m5unified_wifi_isconnected = function () {
        return [`wlan.connected?`, Generator.ORDER_ATOMIC];
    };

    Generator.m5unified_http_get = function (block) {
        const url = Generator.valueToCode(block, 'URL', Generator.ORDER_NONE) || null;
        return [`HTTP.get( ${url} )`, Generator.ORDER_ATOMIC]
    };

    Generator.m5unified_http_post = function (block) {
        const url  = Generator.valueToCode(block, 'URL',  Generator.ORDER_NONE) || null;
        const data = Generator.valueToCode(block, 'DATA', Generator.ORDER_NONE) || null;
        return [`HTTP.post( ${url}, ${data} )`, Generator.ORDER_ATOMIC]
    };

    //
    // Time
    //
    Generator.m5unified_time_mktime = function (block) {
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

    Generator.m5unified_time_sync = function (block) {
        const ntp = Generator.valueToCode(block, 'NTP') || null;
        return (
	    `Time.sync_ntp( ${ntp} )\n`
	);
    };    

    Generator.m5unified_time_now = function (block) {
        return (
	    `time = Time.now\n`
	);
    };

    Generator.m5unified_time_value = function (block) {
        const time = Generator.getFieldValue(block, 'TIME') || null;
        return [`time.${time}`, Generator.ORDER_ATOMIC]
    };

    
    //
    // GPS
    //
    Generator.m5unified_gps_init = function (block) {
        return (
	    `gpio5 = GPIO.new(5, GPIO::OUT)\n`    +
            `gpio5.write(0)\n`                    +
	    `uart2 = UART.new(2, baudrate:9600)\n`+
    	    `sleep(1) \n`
	);
    };

    Generator.m5unified_gps_puts = function (block) {
	Generator.prepares_.gps = Generator.m5unified_gps_init(null);
        const comm = Generator.valueToCode(block, 'COMM', Generator.ORDER_NONE) || null;
        return (
	    `uart2.puts(${comm}) \n`
	);
    };

    Generator.m5unified_gps_gets = function (block) {
	Generator.prepares_.gps = Generator.m5unified_gps_init(null);
        return [`uart2.gets`, Generator.ORDER_ATOMIC];
    };

    Generator.m5unified_gps_clear = function (block) {
	Generator.prepares_.gps = Generator.m5unified_gps_init(null);
        return (
	    `uart2.clear_tx_buffer\n` +
	    `uart2.clear_rx_buffer\n` 
	);
    };

    //
    // SD
    //
    Generator.m5unified_sd_init = function (block) {
        return (
	    `spi = SPI.new(miso_pin:19, mosi_pin:23, clk_pin:18)\n` +
  	    `sdspi = SDSPI.new($spi, cs_pin:2, mount_point:'/sdcard')\n` 
	);
    };

    Generator.m5unified_sd_open = function (block) {
	Generator.prepares_.sd = Generator.m5unified_sd_init(null);
        const file = Generator.valueToCode(block, 'FILE', Generator.ORDER_NONE) || null;
        const mode = Generator.getFieldValue(block, 'MODE') || null;
	const cleanFile = file.replace(/^['"]|['"]$/g, '');
        return (
	    `file = File.open( "/sdcard/${cleanFile}", "${mode}")\n`
	);
    };

    Generator.m5unified_sd_close = function (block) {
	Generator.prepares_.sd = Generator.m5unified_sd_init(null);
        return (
	    `file.close\n`
	);
    };

    Generator.m5unified_sd_puts = function (block) {
	Generator.prepares_.sd = Generator.m5unified_sd_init(null);
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return (
	    `file.puts(${text})\n`
	);
    };

    Generator.m5unified_sd_gets = function (block) {
	Generator.prepares_.sd = Generator.m5unified_sd_init(null);
        const mode = Generator.getFieldValue(block, 'MODE') || null;
        return [`file.${mode}`, Generator.ORDER_ATOMIC];
    };

    Generator.m5unified_puts = function (block) {
        const text = Generator.valueToCode(block, 'TEXT', Generator.ORDER_NONE) || null;
        return `puts( ${text}.to_s )\n`;
    };
    
}
