var VH = require('./app/handlers/vehicle'),
    path = require('path'),                                                                                                                                                                                                                                                                                                                                                                 
    APP_ROOT = `${path.dirname(__dirname)}/${path.basename(__dirname)}`,
    vehicleID = 'DR3559KE';


var Vehicle = new VH(APP_ROOT,vehicleID);

var lastState = null;

function engine() {
    Vehicle.engine.listen(state => {
        setTimeout(() => {
            lastState = ( state == 'on' ) ? 'off' : 'on'; 
            Vehicle.engine.set(lastState);
        },3000);
    });
}

function parking() {
    Vehicle.parking.enabled.listen(isEnabled => {
        console.log(isEnabled);
    });
}

function perimeter() {
    Vehicle.perimeter.center.listen();
}

perimeter();