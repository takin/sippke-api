var FirebaseHandler = require('./app/firebase-handler'),
	GPSParser = require('./app/gps-parser'),
	gps = new GPSParser('/dev/ttyUSB0', 9600),
	geolib = require('geolib'),
	gpio = require('./app/rpi-gpio-dummy'),
	// gpio = require('rpi-gpio'),
    powerPin = 11,
    gpsData = {};

gps.on('gps-data', data => {
	gpsData = data;
});

var positionQuery = setInterval(handlePositionQuery, 3000);

function handlePositionQuery() {

	FirebaseHandler.Position.once('value', positionValue => {
		var currentPosition = positionValue.val();

		// calculate the change of the distance between new GPS Data and the database position data
		// if the distance is >= 10m then emit the new distance
		var deltaOfDistance = geolib.getDistance(currentPosition, {latitude:gpsData.latitude,longitude:gpsData.longitude});

		if ( deltaOfDistance >= 10 ) {
			console.log(deltaOfDistance);
			FirebaseHandler.Position.set(gpsData);
		}
	});

}


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