/* globals process */
var FirebaseHandler = require('./app/handlers/firebase'),
	ParkingHandler = require('./app/handlers/parking'),
	PerimeterHandler = require('./app/handlers/perimeter'),
	PowerHandler = require('./app/handlers/power'),
	EngineHandler = require('./app/handlers/engine'),
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
	enginePIN = 13,
	alarmPIN = 12;

var Vehicle = new FirebaseHandler(APP_ROOT,vehicleID);
/*
//setInterval(() => {
	gps.on('gps-data', data => {
		Datamodel.position.altitude.value = data.altitude;
		Datamodel.position.latitude = data.position.latitude;
		Datamodel.position.longitude = data.position.longitude;
		Datamodel.position.speed = data.speed;
		if( data.speed.value > 10) {
			Vehicle.position.set(Datamodel.position);
			return;
		}
		// jika speed dibawah 10 maka set data speed menjadi 0;
		Datamodel.position.speed.value = 0;
		Vehicle.position.set(Datamodel.position);
	});
//}, 1000);
*/

PowerHandler(powerPIN,Vehicle.power);
EngineHandler(enginePIN,Vehicle.engine);
ParkingHandler(alarmPIN,gps,Vehicle.parking);
PerimeterHandler(powerPIN,gps,Vehicle.perimeter,Vehicle.power);
