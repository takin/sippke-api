/* globals process */
var FirebaseHandler = require('./app/handlers/firebase'),
	ParkingHandler = require('./app/handlers/parking'),
	PerimeterHandler = require('./app/handlers/perimeter'),
    GPSParser = require('./app/helpers/gps-parser'),
	// gps = new GPSParser('/dev/ttyUSB0', 9600),
	path = require('path'),
	_ = require('lodash'),
	argv = process.argv,
	GPIOPins = [7,11,12,13,15,16,18,22,29,31,32,33,35,36,37,38,40],
	APP_ROOT = `${path.dirname(__dirname)}/${path.basename(__dirname)}`,
	vehicleID = 'DR3559KE',
	powerPIN = 11,
	enginePIN = 12,
	alarmPIN = 13;

var Vehicle = new FirebaseHandler(APP_ROOT,vehicleID);

Vehicle.perimeter.root((data) => {
	console.log(data);
});

gps.on('gps-data', data => {

});

// ParkingHandler(alarmPIN,gps,Vehicle.parking);
PerimeterHandler(powerPIN,gps,Vehicle.perimeter, Vehicle.position);