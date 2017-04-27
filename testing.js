//var VH = require('./app/handlers/vehicle'),
 //   ParkingHandler = require('./app/handlers/parking'),
//    bl = require('./app/handlers/bluetooth');
                                                                                                              
   GPSParser = require('./app/helpers/gps-parser'),
   GPS = new GPSParser('/dev/ttyUSB0',9600),
   path = require('path'),
   APP_ROOT = `${path.dirname(__dirname)}/${path.basename(__dirname)}`,
   vehicleID = 'DR3559KE';

GPS.on('gps-data', (data) => {
	console.log(data);
});

//var Vehicle = new VH(APP_ROOT,vehicleID);

// ParkingHandler(11,GPS,Vehicle.parking);

//bl();
