var datamodel = {
    engine:'OFF',
    horn:'OFF',
    message:'the message was here',
    power:'OFF',
    ping:'ask',
    parking : {
        enabled:false,
        radius:{
            unit:'meter',
            value: 10
        }
    },
    perimeter : {
        enabled:false,
        center:{
            latitude:0.00000,
            longitude:0.00000
        },
        radius: {
            unit: 'meter',
            value:0
        }
    },
    position : {    
        altitude: {
            unit: 'M',
            value:0
        },
        speed:{
            unit: 'Km/h',
            value: 0
        },
        latitude:0.00000,
        longitude:0.00000
    }
};

module.exports = datamodel;