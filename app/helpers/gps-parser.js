var serialport = require('serialport');
var nmea = require('nmea');
var EventEmitter = require("events").EventEmitter;

var gpsparser = function(device, baud) {
	var port = new serialport(device, {
			baudrate: baud, parser: serialport.parsers.readline("\n") });
	var self = this;

	var gpsData = gpsData || {position:{}};

	port.on('data', function(line) {

		if (line === "undefined") {
			return;
		}

		var data;
		
		try{
			data = nmea.parse(line);
		} catch(e) {
			return;
		}
		
		if (data === "undefined") {
			return;
		}

		if (data.hasOwnProperty('lat')) {
			var latitude = convert(data.lat, data.latPole);
			if ( !isNaN(latitude) ) {
				gpsData.position.latitude = latitude;
			}
		}

		if (data.hasOwnProperty('lon')) {
			var longitude = convert(data.lon, data.lonPole);
			if ( !isNaN(longitude) ) {
				gpsData.position.longitude = longitude;
			}
		}

		if (data.hasOwnProperty('alt')) {
			var altitude = {value:data.alt, unit: data.altUnit};
			if ( altitude.hasOwnProperty('value') && !isNaN(altitude.value) ) {
				gpsData.altitude = altitude;
			}
		}

		if (data.hasOwnProperty('speedKmph')) {
			var speed = data.speedKmph;
			if ( !isNaN(speed) ) {
				gpsData.speed = {
					value:speed,
					unit:"Km/h"
				};
			}
		}

		if ( gpsData.position.hasOwnProperty('latitude') && gpsData.position.hasOwnProperty('longitude') && gpsData.hasOwnProperty('altitude') && gpsData.hasOwnProperty('speed')){
	    	self.emit('gps-data', gpsData);
		}

		self.emit('data',data);
		self.emit(data.type,data);
	});
};

function convert(coordinate, pole) {
	var convertedCoordinate,dd,mm,limiter;

	limiter = ( coordinate.split('.')[0].length === 5 ) ? 3 : 2;
	dd 		= parseInt(coordinate.slice(0,limiter));
	mm 		= parseFloat(coordinate.slice((coordinate.indexOf('.') - 2),coordinate.length)) / 60;

	convertedCoordinate = parseFloat(dd + mm).toFixed(6);

	if ( pole.match(/[SW]/) ) {
		convertedCoordinate = convertedCoordinate - (convertedCoordinate * 2);
	}

	return parseFloat(convertedCoordinate);
}

gpsparser.prototype = new EventEmitter();

module.exports = gpsparser;