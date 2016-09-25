var datamodel = {
    engine:'on|off',
    power:'on|off',
    parking : {
        enabled:'boolean',
        radius:{
            unit:'M|Km',
            value: 'int'
        }
    },
    position : {    
        altitude: {
            unit: 'M',
            value:'float'
        },
        speed:{
            unit: 'Km/h',
            value: 'float'
        },
        latitude:'double',
        longitude: 'double'
    },
    perimeter : {
        enabled:'boolean',
        center:{
            latitude:'double',
            longitude: 'double'
        },
        radius: {
            unit: 'M',
            value:'int'
        }
    }
};

module.exports = datamodel;