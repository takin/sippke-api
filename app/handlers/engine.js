/**
 * handler engine starter
 */

var gpio = require('rpi-gpio');

var engineIsOFF = true;

function Engine(pin,EngineModel) {
    EngineModel.listen(state => {
        if ( state == 'on' && engineIsOFF) {
            gpio.setup(pin, gpio.DIR_OUT, err => {
                if (!err) {
                    // untuk sementara, starter engine menggunakan timer
                    // berikutnya, starter engine akan menggunakan sensor
                    // dari indikator mesin hidup
                    gpio.write(pin, 0, err => {
                        if ( !err) {
                            EngineModel.set('ignition');
                            // setelah pin di ON kan, maka tunggu selama 1 detik 
                            // kemudian pin di OFF kan
                            setTimeout(() => {
                                gpio.write(pin, 1, err => {
                                    if(!err) {
                                        EngineModel.set('on');
                                        engineIsOFF = false;
                                    }
                                });
                            }, 1000);
                        }
                    });
                }
            });
        }
    });
}

module.exports = Engine;