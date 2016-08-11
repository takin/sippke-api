 /* globals process */
var Firebase = require('firebase'),
	FirebaseHandler = require('./app/firebase-handler'),
	GPSParser = require('./app/gps-parser'),
	gps = new GPSParser('/dev/ttyUSB0', 9600),
	path = require('path'),
	// gpio = require('rpi-gpio'),
	gpio = require('./app/rpi-gpio-dummy'),
	_ = require('lodash'),
	argv = process.argv,
	GPIOPins = [7,11,12,13,15,16,18,22,29,31,32,33,35,36,37,38,40];

var VEHICLE_ID = 'DR3559KE';

var appRootPath = `${path.dirname(__dirname)}/${path.basename(__dirname)}`;

Firebase.initializeApp({
    serviceAccount:`${appRootPath}/app/service_account.json`,
    databaseURL:'https://vehicle-iot.firebaseio.com'
});

var dbRef = Firebase.database().ref(VEHICLE_ID);
var powerPin = (argv[2] === '--pin' || argv[2] === '-p')  && !isNaN(parseInt(argv[3])) && _.includes(GPIOPins, parseInt(argv[3])) ? argv[3] : 11;
var Handler = new FirebaseHandler(dbRef, gpio, powerPin, VEHICLE_ID);

Handler.watchCommand();
Handler.ready(() => {
	gps.on('gps-data', data => {
		Handler.handleGPS(data);
	});
});