/**
 * Handler Bluetooth Low Energy
 * 
 * Handler ini berfungsi untuk menangai perintah dan query 
 * dari aplikasi Android
 */
var bleno = require('bleno');
var gpio = require('rpi-gpio');
var PowerHandler = require('./power');
var EngineHandler = require('./engine');

function vehicleBLE(Vehicle, powerPin, starterPin){

    var myService = 'SiPPKe';

    bleno.on('stateChange', (state) => {
        if (state === 'poweredOn') {
            bleno.startAdvertising(myService,['3559']);
        } else {
            bleno.stopAdvertising();
        }
    });

    bleno.on('connect', client => {
        console.log(client + ' connected!');
    });

    bleno.on('disconnect', (client) => {
        console.log('disconnected');
        var state = 'off';
        // PowerHandler(powerPin, Vehicle.power).set('off');
        gpio.setup(powerPin, gpio.DIR_OUT, err => {
            if ( !err ) {
                var boolState = state == 'off';
                gpio.write(powerPin, boolState, err => {
                    if (err) {
                        state = (state == 'off') ? 'on' : 'off';
                    }
                    Vehicle.power.set(state);
                });
            }
        });
    });

    bleno.on('accept', client => {
        console.log(client);
    });

    bleno.on('advertisingStart', err =>{
        if( err ) {
            console.log('error occure -> ' + err);
            return;
        }

        bleno.setServices([
            new bleno.PrimaryService({
                value:null,
                uuid:'vhcl',
                properties:['read', 'write', 'notify'],
                onSubscribe: function(maxValue, updateValueCallback) {
                    console.log('device subscribed');
                },
                onUnsubscribe: function() {

                },
                onReadRequest: function() {

                },
                onWriteRequest: function() {
                    
                }
            })
        ]);
    });
}

module.exports = vehicleBLE;