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

    bleno.on('disconnect', (client) => {
	console.log('client disconnected');
    });

    bleno.on('accept', client => {
        console.log(client + " accepted!");
    });

    bleno.on('advertisingStart', err =>{
	console.log('advertising started');
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
		    this.updateInterval = setInterval(() => {
			updateValueCallback(new Buffer('hi'));
                    },1000);
                },
                onUnsubscribe: function() {
		    console.log('unsubscribed');
		    clearInterval(this.updateInterval);
                },
                onReadRequest: function() {
		    console.log("read requested!");
                },
                onWriteRequest: function() {
                    console.log("write requested!");
                },
                onNotify: function() {
			console.log('notify');
                },
		onIndicate: function() {}
            })
        ]);
    });
    bleno.on('rssiUpdate', rssi =>{
	console.log(rssi);
    });
}

module.exports = vehicleBLE;
