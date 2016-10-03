// var gpio = require('../mockup/rpi-gpio');

var gpio = require('rpi-gpio');
var geolib = require('geolib');

var parkingCoordinate;
var intervalObj;

function Parking(AlarmPIN,GPS,ParkingModel) {
    
    ParkingModel.enabled.listen(isEnabled => {
        if ( isEnabled ) {
            ParkingModel.radius.listen(radius => {
                /**
                 * monitor pergerakan kendaraan
                 * 
                 * jika bergeser sejauh ParkingModel.radius.value
                 * maka aktifkan alarm
                 */
                GPS.on('gps-data', data => {
                    /**
                     * Rekam posisi kendaraan ketika mode parking
                     * baru saja diaktifkan, hal ini menandakan letak
                     * awal parkir kendaraan. Koordinat ini kemudian nantinya
                     * yang akan digunakan untuk mengukur pergerakan kendaraan
                     * sejauh radius yang sudah ditentukan di dalam database 
                     */
                    if (!parkingCoordinate) {
                        parkingCoordinate = data.position;
                        return;
                    }

                    var distance = geolib.getDistance(parkingCoordinate, data.position,1,1);
                    // jika kendaraan bergeser dari posisi awal sejauh lebih dari 
                    // radius parkir yang sudah ditentukan, maka trigger alarm
                    if ( distance >= radius.value) {
                        
                        // sebelum mengaktifkan alarm, cek terlebih dahulu
                        // apakah alarm sudah dalam kondisi aktif atau belum
                        if ( !intervalObj ) {
                            ActivateAlarm(AlarmPIN);
                        }

                        return;
                    } 
                    /**
                     * Jika setelah dalam kondisi motor bergeser diluar radius yang 
                     * diizinkan maka alarm dalam kondisi aktif. Apabila dalam kondisi ini
                     * kemudian kendaaran kembali bergeser ke dalam radius yang sudah ditentukan
                     * maka matikan alarm
                     */
                    if(intervalObj) {
                        DeactivateAlarm(AlarmPIN);
                    }
                });
            });
            
            return;
        }
        /**
         * jika mode parkir di disable, maka kosongkan parkingCoordinate
         * untuk di set ulang nantinya ketika mode ini di aktifkan kembali
         */
        parkingCoordinate = null;
        /**
         * Selain itu, pastikan pula alarm di deactivate, in case alarm 
         * sudah aktif ketika akan di disable agar alarm tidak looping
         */
        if(intervalObj) {
            DeactivateAlarm(AlarmPIN);
        }
    });

}

function ActivateAlarm(pin) {
    // GPIO menggunakan mode aktif rendah, dimana 
    // default statenya (pin dalam kondisi mati) adalah tinggi (true)
    var pinState = false;

    gpio.setup(pin, gpio.DIR_OUT, err => {
        intervalObj = setInterval(() => {
            gpio.write(pin, pinState, err => {
                pinState = !pinState;
            });
        },800);
    });
}

function DeactivateAlarm(pin) {
    clearInterval(intervalObj);
    gpio.write(pin, 0, err => {
        gpio.destroy(() => {
            intervalObj = null;
        });
    });
}

module.exports = Parking;