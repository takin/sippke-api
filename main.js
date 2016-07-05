var FirebaseHandler = require('./app/firebase'),
	GPSParser = require('./app/gps-parser'),
	gps = new GPSParser('/dev/ttyUSB3', 9600),
	gpio = require('rpi-gpio'),
    powerPin = 11,
    gpsData = {};

gps.on('gps-data', (data) => {
	gpsData = data;
});

FirebaseHandler.watchTheCommand().then((status) => {
	gpio.setup(powerPin, gpio.DIR_IN, (err) => {
		if ( err ) {
			console.log('error reading pin');
			return;
		}

		gpio.read(powerPin, (err, value) => {
			if( err ) {
				console.log('unable to read GPIO Pin');
				return;
			}

			if ( status === 'off' && value == 1 ) {
				gpio.setup(powerPin, gpio.DIR_OUT, LockVehicle);
			}
		});
	});
});

function LockVehicle(err) {
	if ( err ) {
		console.log('unable to loack down vehilce');
		return;
	}

	gpio.write(powerPin, true, (err) => {
		if ( err ) {
			console.log('unable to execute the command');
			return;
		}

		console.log('vehicle locked down');
	});
}


/*
var positions = [
	{latitude:-8.6050847,longitude:116.4518528},
	{latitude:-8.6059467,longitude:116.4521188},
	{latitude:-8.6071287,longitude:116.4520988},
	{latitude:-8.6085807,longitude:116.4525628},
	{latitude:-8.6092427,longitude:116.4542038}
];

var i = 0;
var tm = setInterval(()=>{
	if ( i < positions.length ){
		console.log('new position', positions[i]);
		FirebaseHandler.Position.set(positions[i]);
		i++;
	} else {
		console.log('done!');
		clearInterval(tm);
	}
}, 5000);
*/