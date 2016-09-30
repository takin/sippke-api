/* globals process */
var FirebaseHandler = require('./app/handlers/firebase'),
	ParkingHandler = require('./app/handlers/parking'),
	PerimeterHandler = require('./app/handlers/perimeter'),
	PowerHandler = require('./app/handlers/power'),
	Datamodel = require('./app/helpers/datamodel'),
    GPSParser = require('./app/helpers/gps-parser'),
	gps = new GPSParser('/dev/ttyUSB0', 9600),
	path = require('path'),
	_ = require('lodash'),
	geolib = require('geolib'),
	argv = process.argv,
	GPIOPins = [7,11,12,13,15,16,18,22,29,31,32,33,35,36,37,38,40],
	APP_ROOT = `${path.dirname(__dirname)}/${path.basename(__dirname)}`,
	vehicleID = 'DR3559KE',
	powerPIN = 11,
	enginePIN = 12,
	alarmPIN = 13;

var Vehicle = new FirebaseHandler(APP_ROOT,vehicleID);

/**
 * whatever happen as long as there is position update
 * just emit it to the server
 */
var last;
gps.on('gps-data', data => {
	Datamodel.position.altitude.value = data.altitude;
	Datamodel.position.latitude = data.position.latitude;
	Datamodel.position.longitude = data.position.longitude;
	Datamodel.position.speed = data.speed;
	if (last) {
		var delta = geolib.getDistance(Datamodel.position,last,1,1);
		if( delta > 0 ) {
			console.log(delta);
			Vehicle.position.set(Datamodel.position);
			last = Datamodel.position;
			return;
		}
	}
	
	last = Datamodel.position;
});

PowerHandler(powerPIN,Vehicle.power);
ParkingHandler(alarmPIN,gps,Vehicle.parking);
PerimeterHandler(powerPIN,gps,Vehicle.perimeter,Vehicle.power);