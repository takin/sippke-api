/**
 * handler engine starter
 */

// var gpio = require('../mockup/rpi-gpio');
var gpio = require('rpi-gpio');

function Engine(pin,EngineModel) {

    function set(state) {
        if ( state === 'ignite') {
            gpio.setup(pin, gpio.DIR_OUT, err => {
                if (!err) {
                    // untuk sementara, starter engine menggunakan timer
                    // berikutnya, starter engine akan menggunakan sensor
                    // dari indikator mesin hidup
                    gpio.write(pin, false, err => {
                        if ( !err) {
                            //EngineModel.set('ignition');
                            // setelah pin di ON kan, maka tunggu selama 1 detik 
                            // kemudian pin di OFF kan
                            setTimeout(() => {
                                gpio.write(pin, true, err => {
                                    if(!err) {
                                        EngineModel.set('on');
                                    }
                                });
                            }, 600);
                        }
                    });
                }
            });
        }
    }

    EngineModel.listen(set);

    return set;
}

module.exports = Engine;
