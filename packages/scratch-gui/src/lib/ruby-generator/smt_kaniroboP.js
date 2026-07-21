/**
 * Define Ruby code generator for Sample Blocks
 * @param {RubyGenerator} Generator The RubyGenerator
 * @return {RubyGenerator} same as param.
 */
export default function (Generator) {

    Generator.kaniroboP_motor_init = function (block) {
        return (
	    `gpio2 = GPIO.new(2, GPIO::OUT)\n` +
	    `gpio6 = GPIO.new(6, GPIO::OUT)\n` +
  	    `pwm3 = PWM.new(3, timer:0, frequency:1000, duty:0)\n` +
	    `pwm7 = PWM.new(7, timer:0, frequency:1000, duty:0)\n`
	);
    };

    Generator.kaniroboP_sensor_init = function (block) {
	return (
	    `adc26 = ADC.new(26)\n` +
	    `adc27 = ADC.new(27)\n` 
	);
    };

    Generator.kaniroboP_servo_init = function (block) {
	return (
	    `pwm0 = PWM.new(0, timer:1, frequency:50, duty:0)\n` +
 	    `pwm1 = PWM.new(1, timer:1, frequency:50, duty:0)\n`
	);
    };
    
    Generator.kaniroboP_motor = function (block) {
	Generator.prepares_[`motor`] = Generator.kaniroboP_motor_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const dir = Generator.getFieldValue(block, 'DIR', Generator.ORDER_NONE) || null;
        const pwr = Generator.getFieldValue(block, 'PWR', Generator.ORDER_NONE) || null;
	const id2 = Number(id) + 1;
	let duty;
	if (Number(dir) === 1){
	    duty = 100 - 0.6 * Number(pwr);
	}else{
	    duty = Number(pwr) * 0.6;
	}
        return (
	    `gpio${id}.write(${dir})\n` +
	    `pwm${id2}.duty( ${duty} ) \n`
	);
    };
    Generator.kaniroboP_sensor = function (block) {
	Generator.prepares_[`sensor`] = Generator.kaniroboP_sensor_init(null);
        const id = Generator.getFieldValue(block, 'ID', Generator.ORDER_NONE) || null;
	return [`adc${id}.read_raw`, Generator.ORDER_ATOMIC];
    };

    Generator.kaniroboP_servo = function (block) {
	Generator.prepares_[`servo`] = Generator.kaniroboP_servo_init(null);
        const id  = Generator.getFieldValue(block, 'ID',  Generator.ORDER_NONE) || null;
        const agl = Generator.getFieldValue(block, 'AGL', Generator.ORDER_NONE)  || 0;
	return (
	    `pwm${id}.pulse_width_us( ${agl} )\n`
	);
    };

}
