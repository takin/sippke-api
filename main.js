/* globals process */
var FirebaseHandler = require('./app/handlers/firebase'),
	ParkingHandler = require('./app/handlers/parking'),
	PerimeterHandler = require('./app/handlers/perimeter'),
	PowerHandler = require('./app/handlers/power'),
        Bluetooth = require('./app/handlers/bluetooth'),
	HornHandler = require('./app/handlers/horn'),
	EngineHandler = require('./app/handlers/engine'),
	Datamodel = require('./app/helpers/datamodel'),
	GPSParser = require('./app/helpers/gps-parser'),
	gps = new GPSParser('/dev/ttyUSB0', 9600),
	path = require('path'),
	APP_ROOT = `${path.dirname(__dirname)}/${path.basename(__dirname)}`,
	vehicleID = 'DR3559KE',
	powerPIN = 11,
	enginePIN = 13,
	alarmPIN = 12;

var Vehicle = new FirebaseHandler(APP_ROOT,vehicleID);

Vehicle.ready((initialData) => {
	if( initialData == null ) {
		Vehicle.init(Datamodel);
	}
});

gps.on('gps-data', data => {
	Datamodel.position.altitude.value = data.altitude.value;
	Datamodel.position.latitude = data.position.latitude;
	Datamodel.position.longitude = data.position.longitude;
	Datamodel.position.speed = data.speed;
	if( data.speed.value >= 10) {
		console.log('emitted');
		Vehicle.position.set(Datamodel.position);
	}
});

Vehicle.ping.listen((ping) => {
	if(ping == 'ask') {
		Vehicle.ping.answer('online');
		if(Datamodel.position.latitude && Datamodel.position.longitude){
			console.log(Datamodel.position);
			Vehicle.position.set(Datamodel.position);
		}
	}
});

HornHandler(alarmPIN,Vehicle.horn);
PowerHandler(powerPIN,Vehicle.power);
EngineHandler(enginePIN,Vehicle.engine);
ParkingHandler(alarmPIN,gps,Vehicle.parking);
//PerimeterHandler(powerPIN,gps,Vehicle.perimeter,Vehicle.power);

Bluetooth(Vehicle, powerPIN, enginePIN);
