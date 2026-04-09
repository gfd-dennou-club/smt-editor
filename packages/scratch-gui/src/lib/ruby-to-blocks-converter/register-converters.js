import MotionConverter from './motion';
import LooksConverter from './looks';
import SoundConverter from './sound';
import EventConverter from './event';
import ControlConverter from './control';
import SensingConverter from './sensing';
import OperatorsConverter from './operators';
import VariablesConverter from './variables';
import MyBlocksConverter from './my-blocks';
import MusicConverter from './music';
import PenConverter from './pen';
import MicroBitConverter from './microbit';
import MicrobitMoreConverter from './microbit_more';
import EV3Converter from './ev3';
import Wedo2Converter from './wedo2';
import GdxForConverter from './gdx_for';
import MeshConverter from './mesh';
import MeshV2Converter from './mesh_v2';
import SmalrubotS1Converter from './smalrubot_s1';
import BoostConverter from './boost';
import TranslateConverter from './translate';
import MakeyMakeyConverter from './makeymakey';
import VideoConverter from './video';
import Text2SpeechConverter from './text2speech';
import KoshienConverter from './koshien';
import FaceSensingConverter from './face_sensing';
// === Smalruby: Start of TM2Scratch extension ===
import TM2ScratchConverter from './tm2scratch';
// === Smalruby: End of TM2Scratch extension ===
// === Smalruby: Start of G2S (AkaDako) extension ===
import G2SConverter from './g2s';
// === Smalruby: End of G2S (AkaDako) extension ===
// === Smalruby: Start of Ruby String extension ===
import SmalrubyRubyConverter from './smalruby-ruby';
// === Smalruby: End of Ruby String extension ===
import SmT_Utils_Converter from './smt_utils';
import SmT_GPIO_Converter from './smt_gpio';
import SmT_PWM_Converter from './smt_pwm';
import SmT_ADC_Converter from './smt_adc';
import SmT_I2C_Converter from './smt_i2c';
import SmT_SPI_Converter from './smt_spi';
import SmT_UART_Converter from './smt_uart';
import SmT_I2C_Sensors_Converter from './smt_i2c_sensors';
import SmT_I2C_LCD_Converter from './smt_i2c_lcd';
import SmT_Time_Converter from './smt_time';
import SmT_Network_Converter from './smt_network';
import SmT_SPI_SDcard_Converter from './smt_spi_sdcard';

const registerConverters = function (converter) {
    [
	SmT_Utils_Converter,
	SmT_GPIO_Converter,
	SmT_PWM_Converter,
	SmT_ADC_Converter,
	SmT_I2C_Converter,
	SmT_SPI_Converter,
	SmT_UART_Converter,
	SmT_I2C_Sensors_Converter,
	SmT_I2C_LCD_Converter,
	SmT_Time_Converter,
	SmT_Network_Converter,
	SmT_SPI_SDcard_Converter,
        VariablesConverter,
        EventConverter,
        ControlConverter,
        MicroBitConverter,
        VideoConverter,
        Text2SpeechConverter,
        Wedo2Converter,
        MicrobitMoreConverter,
        MeshV2Converter,
        MeshConverter,
        KoshienConverter,
        FaceSensingConverter,
        TM2ScratchConverter,
        G2SConverter,
        SmalrubyRubyConverter,
        BoostConverter,
        TranslateConverter,
        SoundConverter,
        MusicConverter,
        PenConverter,
        MakeyMakeyConverter,
        OperatorsConverter,
        LooksConverter,
        EV3Converter,
        GdxForConverter,
        SmalrubotS1Converter,
        MotionConverter,
        SensingConverter,
        MyBlocksConverter
    ].forEach(x => x.register(converter));
};

export {
    registerConverters as default,
    MusicConverter,
    PenConverter,
    EV3Converter,
    GdxForConverter,
    SmalrubotS1Converter,
    BoostConverter,
    TranslateConverter,
    MakeyMakeyConverter,
    LooksConverter,
    SoundConverter,
    SensingConverter
};
