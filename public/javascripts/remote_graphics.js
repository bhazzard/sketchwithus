define(['artist', 'graphics'], function (Artist, Graphics) {
	function RemoteGraphics(sketchpad_id, io) {
	  this._io = io;
		this._sketchpad_id = sketchpad_id;
	};

	RemoteGraphics.prototype.listen = function(context) {
		var socket = this._io.connect('/' + this._sketchpad_id),
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
			var a = artists[data.id],
			method = a[data.invocation.method];
			method.apply(a, data.invocation.arguments);
		});
    
    this._socket = socket;
		return socket;
	}

	return RemoteGraphics;
});
