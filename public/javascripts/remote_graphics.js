define(['artist', 'graphics'], function (Artist, Graphics) {
	function RemoteGraphics(sketchpad_id, socket) {
	  this._socket = socket;
		this._sketchpad_id = sketchpad_id;
	};

	RemoteGraphics.prototype.listen = function(context) {
		var socket = this._socket,
		    artists = {};
		    
		socket.on('join', function(ids) {
			for (var i = 0; i < ids.length; i++) {
				artists[ids[i]] = new Artist(new Graphics(context));
			}
		});

		socket.on('leave', function(id) {
			delete artists[id];
		});

		socket.on('draw', function(data) {
			artists[data.id].execute(data.command);
		});
    
    this._socket = socket;
		return socket;
	}

	return RemoteGraphics;
});
