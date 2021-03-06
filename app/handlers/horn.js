// var gpio = require('../mockup/rpi-gpio');
var gpio = require('rpi-gpio');

function Horn(pin, HornModel) {
    gpio.setup(pin, gpio.DIR_OUT, err => {
        if(!err) {
            HornModel.listen(state => {
                var pinState = state !== 'on';
                gpio.write(pin,pinState);
            });
        }
    });
}

module.exports = Horn;