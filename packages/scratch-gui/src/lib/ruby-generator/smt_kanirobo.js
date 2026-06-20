/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.kanirobo_motor_init = function (block) {
        return (
	    `$gpio13 = GPIO.new(13, GPIO::OUT)\n` +
	    `$gpio12 = GPIO.new(12, GPIO::OUT)\n` +
	    `$gpio25 = GPIO.new(25, GPIO::OUT)\n` +
	    `$gpio32 = GPIO.new(32, GPIO::OUT)\n` +
  	    `$pwm26  = PWM.new(26, timer:0, frequency:1000, duty:0)\n` +
 	    `$pwm33  = PWM.new(33, timer:0, frequency:1000, duty:0)\n`
	);
    };

    Generator.kanirobo_sensor_init = function (block) {
	return (
	    `$adc36 = ADC.new(36)\n` +
	    `$adc34 = ADC.new(34)\n` + 
	    `$adc35 = ADC.new(35)\n` + 
  	    `$adc2  = ADC.new(2)\n`
	);
    };

    Generator.kanirobo_servo_init = function (block) {
	return (
	    `$pwm27 = PWM.new(27, timer:1, frequency:50, duty:0)\n` +
  	    `$pwm14 = PWM.new(14, timer:1, frequency:50, duty:0)\n`
	);
    };
    
    Generator.kanirobo_motor = function (block) {
	Generator.prepares_[`motor`] = Generator.kanirobo_motor_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const dir = Generator.getFieldValue(block, 'DIR', Generator.ORDER_NONE) || null;
        const pwr = Generator.getFieldValue(block, 'PWR', Generator.ORDER_NONE) || null;
	const duty = ( 100 - 2 * Number(pwr) ) * Number(dir) + Number(pwr);
	var idP, idL, onoff;
	if (Number(id) == 25) {
	    console.log("25");
	    idP = 26;
	    idL = 13;
	} else if (Number(id) == 32) {
	    idP = 33;
	    idL = 12;
	};
	if (Math.abs(Number(dir) * 100 - duty) < 20 ) {
	    onoff = 0;
	} else {
	    onoff = 1;
	};
//	const id2 = Number(id) + 1;
        return (
	    `$gpio${idL}.write(${onoff})\n` +
	    `$gpio${id}.write(${dir})\n` +
	    `$pwm${idP}.duty( ${duty} ) \n`
	);
    };
    Generator.kanirobo_sensor = function (block) {
	Generator.prepares_[`sensor`] = Generator.kanirobo_sensor_init(null);
        const id = Generator.getFieldValue(block, 'ID', Generator.ORDER_NONE) || null;
	return [`$adc${id}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kanirobo_servo = function (block) {
	Generator.prepares_[`servo`] = Generator.kanirobo_servo_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const agl = Generator.getFieldValue(block, 'AGL', Generator.ORDER_NONE)  || 0;
	return (
	    `$pwm${id}.pulse_width_us( ${agl} )\n`
	);
    };

}
