'use strict';

module.exports = {
	setup: function (pinNumber, direction, callback) {
		callback.call(this);
	},
	read: function (pinNumber, callback) {
		callback.call(this, false, true);
	}, 
	write: function(pinNumber, data, callback) {
		console.log('gpio state -> ' + data);
		callback.call(this);
	},
	DIR_IN: 1,
	DIR_OUT: 1
};