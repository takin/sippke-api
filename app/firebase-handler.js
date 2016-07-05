var firebase = require('firebase'),
    ThePromise = require('promise');

firebase.initializeApp({
    serviceAccount:'app/service_account.json',
    databaseURL:'https://vehicle-iot.firebaseio.com'
});

var dbRef = firebase.database().ref();

var FirebaseHandler = (function(){
    return {
        watchTheCommand: function(){
            var promise = new ThePromise((resolve, reject) => {
                dbRef.child('status').on('value', (status) => {
                    resolve(status.val());
                });
            });

            return promise;
        },
        Position: (function() {
            return dbRef.child('position');
        }())
    };

}());


module.exports = FirebaseHandler;