// var gpio = require('../mockup/rpi-gpio');
var gpio = require('rpi-gpio');


function Power(powerPin, powerModel) {

    function set(state) {
        console.log('set to off');
        gpio.setup(powerPin, gpio.DIR_OUT, err => {
            if ( !err ) {
                var boolState = state === 'off';
                gpio.write(powerPin, boolState, err => {
                    if (err) {
                        state = (state === 'off') ? 'on' : 'off';
                    }
                    powerModel.set(state);
                });
            }
        });
    }

    powerModel.listen(set);

    return {
        set:set
    };
}

module.exports = Power;