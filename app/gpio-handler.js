/**
 * GPIO Handler
 * 
 * Created By Syamsul Muttaqin
 */
function Handler(socket, pin, gpio, commandChannel, responseChannel) {
	this._socket = socket;
	this._gpio = gpio;
	this._pin = pin;
	this._commandChannel = commandChannel;
	this._reponseChannel = responseChannel;
}

function Power(socket, pin, gpio) {
	Handler.call(this, socket, pin, gpio, 'power', 'power response');
}

function Starter(socket, pin, gpio) {
	Handler.call(this, socket, pin, gpio, 'starter', 'starter response');
}

Power.prototype = Object.create(Handler.prototype);
Power.prototype.constructor = Power;

Starter.prototype = Object.create(Handler.prototype);
Starter.prototype.constructor = Starter;

Handler.prototype.setup = function(direction, callback) {
	this._gpio.setup(this._pin, direction, (err) => {
		if ( err ) {
			Handler.prototype.emit.call(this, err, false);
			return;
		}
		callback.call(this);
	});
};

Handler.prototype.emit = function(value, message) {
	this._socket.emit(this._reponseChannel, {status:value, message:message});
	this._socket.broadcast.emit(this._reponseChannel, {status:value, message:message});
	return this;
};

Handler.prototype.listen = function(callback) {
	this._socket.on(this._commandChannel, (data) => {
		callback.call(this,data);
	});
	return this;
};

module.exports = {
	Power: Power,
	Starter: Starter
};
