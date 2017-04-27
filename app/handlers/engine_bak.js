/**
 * handler engine starter
 */

// var gpio = require('../mockup/rpi-gpio');
var gpio = require('rpi-gpio');

function Engine(pin,EngineModel) {
    EngineModel.listen(state => {
        if ( state == 'ignite') {
            gpio.setup(pin, gpio.DIR_OUT, err => {
                if (!err) {
                    // untuk sementara, starter engine menggunakan timer
                    // berikutnya, starter engine akan menggunakan sensor
                    // dari indikator mesin hidup
                    gpio.write(pin, 0, err => {
                        if ( !err) {
                            //EngineModel.set('ignition');
                            // setelah pin di ON kan, maka tunggu selama 1 detik 
                            // kemudian pin di OFF kan
                            setTimeout(() => {
                                gpio.write(pin, 1, err => {
                                    if(!err) {
                                        EngineModel.set('on');
                                    }
                                });
                            }, 800);
                        }
                    });
                }
            });
        }
    });
}

module.exports = Engine;
