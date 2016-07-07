var ThePromise = require('promise'),
    geolib = require('geolib');

function FirebaseHandler(dbref, gpio, pin){
    this._db = dbref;
    this._gpio = gpio;
    this._pin = pin;

    // read the initial vehicle status
    this._gpio.setup(this._pin, this._gpio.DIR_IN, err => {

        if ( err ) {
            return FirebaseHandler.prototype.message.call(this, 'Unable to setup GPIO Pin');
        }

        this._gpio.read(this._pin, (err, value) => {

            // rpi-gpio using low active, so when the port value is high,
            // then the relay is OFF
            // so we need to reverse the state, to make the app interface 
            // show the button state correctly
            var commandToWrite = value ? "off" : "on";

            if ( err ) {
                return FirebaseHandler.prototype.message.call(this, 'Unable to read GPIO Pin');
            }

            this._db.child('status').set(commandToWrite);

            var message = value ? ' Locked Down' : ' Ready';
            FirebaseHandler.prototype.message.call(this, 'Vehicle is' + message);
        });

    });
}

FirebaseHandler.prototype.ready = function(callback) {
    this._db.child('position').once('value', posObj => {
        this._latestPosition = posObj.val();
        callback.call(this);
    });
}

FirebaseHandler.prototype.handleGPS = function(newPosition) {

    if ( newPosition.hasOwnProperty('latitude') && newPosition.hasOwnProperty('longitude') && ) {
        if ( !isNaN(newPosition.latitude) && !isNaN(newPosition.longitude) && !isNaN(newPosition.speed) ) {
            var deltaPosition = geolib.getDistance({latitude:newPosition.latitude, longitude:newPosition.longitude},{latitude:this._latestPosition.latitude,longitude:this._latestPosition.longitude});

            if ( deltaPosition >= 10 ) {
                this._db.child('position').set(newPosition);
                this._latestPosition = newPosition;
            }
        }

    }
    
};

FirebaseHandler.prototype.message = function(message) {
    this._db.child('message').set(message);
}

FirebaseHandler.prototype.watchCommand = function() {
    this._db.child('status').on('value', command => {

        var transformedCommand = command.val() === "on" ? false : true;

        this._gpio.setup(this._pin, this._gpio.DIR_OUT, err => {
            if ( err ) {
                return FirebaseHandler.prototype.message.call(this, 'Unable to setup GPIO Pin to write');
            }

            this._gpio.write(this._pin, transformedCommand, err => {
                if ( err ) {
                    return FirebaseHandler.prototype.message.call(this, 'Unable to write the command to GPIO Pin');
                }

                var message = transformedCommand ? ' Locked Down' : ' Ready';

                FirebaseHandler.prototype.message.call(this, 'Vehicle is' + message);
            })
        });
    });
}

module.exports = FirebaseHandler;