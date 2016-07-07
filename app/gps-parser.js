var serialport = require('serialport');
var nmea = require('nmea');
var EventEmitter = require("events").EventEmitter;



var gpsparser = function(device, baud) {
	var port = new serialport(device, {
			baudrate: baud, parser: serialport.parsers.readline("\n") });
	var self = this;

	var gpsData = {};

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

		if (typeof(data.lat) !== 'undefined') {
			gpsData.latitude = convert(data.lat, data.latPole);
		}

		if (typeof(data.lon) !== 'undefined') {
			gpsData.longitude = convert(data.lon, data.lonPole);
		}

		if (typeof(data.alt) !== 'undefined') {
			gpsData.altitude = {value:data.alt, unit: data.altUnit};
		}

		if (typeof(data.speedKmph) !== 'undefined') {
			gpsData.speed = data.speedKmph;
		}
	    self.emit('gps-data', gpsData);

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