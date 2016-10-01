var Firebase = require('firebase');

function FirebaseConnector(APP_ROOT,ID){
    Firebase.initializeApp({
        serviceAccount:`${APP_ROOT}/app/service_account.json`,
        databaseURL:'https://vehicle-iot.firebaseio.com'
    });

    this._root = Firebase.database().ref(ID);
    this._engine = this._root.child('engine');
    this._power = this._root.child('power');
    this._horn = this._root.child('horn');
    this._parking = this._root.child('parking');
    this._perimeter = this._root.child('perimeter');
    this._position = this._root.child('position');
}

function FirebaseHandler(APP_ROOT,ID){
    var fc = new FirebaseConnector(APP_ROOT,ID);

    /**
     * Engine handler
     */
    this.engine = {
        set: function(newValue) {
            fc._engine.set(newValue);
        },
        listen: function(callback) {
            fc._engine.on('value', engine => {
                callback.call(this, engine.val());
            });
        }
    };

    /**
     * Power Handler
     */
    this.power = {
        set: function(newValue) {
            fc._power.set(newValue);
            /**
             * jika newValue = 'off', artinya kontak dimatikan,
             * maka engine juga harus di set ke dalam kondisi OFF
             * 
             * Proses ini dilakukan di sini untuk membuatnya otomatis
             * sehingga pada proses perimeter tidak perlu dilakukan
             * proses untuk men-set engine menjadi 'off'
             */

            if( newValue == 'off' ) {
                fc._engine.set(newValue);
            }
        },
        listen: function(callback) {
            fc._power.on('value', power => {
                callback.call(this, power.val());
            });
        }
    };

    this.horn = {
        listen: function(callback) {
            fc._horn.on('value', horn => {
                callback.call(this, horn.val());
            });
        }
    };

    /**
     * Position handler
     */
    this.position = {
        set: function(posDataModel) {
            fc._position.set(posDataModel);
        },
        listen: function(callback) {
            fc._position.on('value', position => {
                callback.call(this, position.val());
            });
        }
    };

    this.perimeter = {
        root: function(callback) {
            fc._perimeter.on('value', perimeter => {
                callback.call(this, perimeter.val());
            });
        },
        enabled: (function(){
            return {
                listen: function(callback){
                    fc._perimeter.child('enabled').on('value', enabled => {
                        callback.call(this, enabled.val());
                    });
                }
            };
        })(),
        center: (function(){
            return {
                listen: function(callback){
                    fc._perimeter.child('center').on('value', center => {
                        callback.call(this, center.val());
                    });
                }
            };
        })(),
        radius: (function(){
            return {
                listen: function(callback) {
                    fc._perimeter.child('radius').on('value', radius => {
                        callback.call(this, radius.val());
                    });
                }
            };
        })()
    };

    /**
     * Parking handler
     */
    this.parking = {
        enabled: (function(){
            return {
                listen: function(callback) {
                    fc._parking.child('enabled').on('value', enabled => {
                        callback.call(this,Boolean(enabled.val()));
                    });
                }
            };
        })(),
        radius:(function(){
            return {
                listen: function(callback) {
                    fc._parking.child('radius').on('value', radius => {
                        callback.call(this,radius.val());
                    });
                }
            };
        })()
    };
}

module.exports = FirebaseHandler;
