var gpio = require('rpi-gpio');
// var gpio = require('../test/rpi-gpio');


function Power(powerPin, powerModel) {
    powerModel.listen(state => {
        gpio.setup(powerPin, gpio.DIR_OUT, err => {
            if ( !err ) {
                var boolState = state == 'off';
                gpio.write(powerPin, boolState, err => {
                    if (err) {
                        state = (state == 'off') ? 'on' : 'off';
                        powerModel.set(state);
                    }
                });
            }
        });
    });
}

module.exports = Power;