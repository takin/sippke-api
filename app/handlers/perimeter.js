var gpio = require('../test/rpi-gpio'),
    // gpio = require('rpi-gpio'),
    geolib = require('geolib');
    

function Perimeter(powerPin, GPS, PerimeterModel, PositionModel) {
    PerimeterModel.enabled.listen(isEnabled => {
        if ( isEnabled ) {
            PerimeterModel.root(perimeterData => {
                var radiusInMeters = perimeterData.radius.unit == 'Km' ? (perimeterData.radius.value * 1000) : perimeterData.radius.value;
                GPS.on('gps-data', gpsData => {
                    var isInsidePerimeter = geolib.isPointInCircle(gpsData.position,perimeterData.center,radiusInMeters);
                    if ( !isInsidePerimeter && perimeterData.engine == 'on') {
                        // jika kendaraan keluar dari area perimeter
                        // maka lakukan prosedur untuk mematikan kendaraan
                        TurnoffVehicle();
                    }
                });
            });
        }
    });

    var TurnoffVehicle = function() {
        gpio.setup(powerPin, gpio.DIR_OUT, err => {
            if ( !err ) {
                gpio.write(powerPin,1);
                // proses update lokasi ke dalam database 
                // setelah proses mematikan kendaraan tidak perlu dilakukan
                // karena proses ini sudah dilakukan secara otomatis pada bagian main.js
            }
        });
    };
}

module.exports = Perimeter;