/**
 * Handler Bluetooth Low Energy
 * 
 * Handler ini berfungsi untuk menangai perintah dan query 
 * dari aplikasi Android
 */
var bleno = require('bleno');


function vehicleBLE(){

    var myService = 'SiPPKe';

    bleno.on('stateChange', (state) => {
        if (state === 'poweredOn') {
            bleno.startAdvertising(myService,['3559']);
        } else {
            bleno.stopAdvertising();
        }
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