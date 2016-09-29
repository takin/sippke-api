// var gpio = require('rpi-gpio');
var gpio = require('../test/rpi-gpio');


function Power(powerPin, powerModel) {
    powerModel.listen(state => {
        gpio.setup(powerPin, gpio.DIR_OUT, err => {
            if ( !err ) {
                gpio.write(powerPin, state, err => {
                    if (err) {
                        powerModel.set(!state);
                    }
                });
            }
        });
    });
}

module.exports = Power;