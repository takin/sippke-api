var socket = require('socket.io-client')('ws://localhost:3000/vehicle'),
	handler = require('./handler'),
	power = new handler.Power(),
	starter = new handler.Starter(),
	gpio = require('./rpi-gpio-dummy'),
	GPSParser = require('./gps-parser'),
	gps = new GPSParser('/dev/ttyUSB3', 9600),
	// gpio = require('rpi-gpio'),
    powerPin = 11,
    starterPin = 13,
    gpsData = {};

gps.on('gps-data', (data) => {
	gpsData = data;
});

setInterval(() => {
	socket.emit('gps info', gpsData);
}, 1000);

socket.on('vehicle command', (command) => {
	console.log(command);
});