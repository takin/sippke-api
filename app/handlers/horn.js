var gpio = require('rpi-gpio');

function Horn(pin, HornModel) {
    gpio.setup(pin, gpio.DIR_OUT, err => {
        if(!err) {
            HornModel.listen(state => {
                var pinState = state == 'on' ? false : true;
                gpio.write(pin,pinState,err => {});
            });
        }
    });
}

module.exports = Horn;