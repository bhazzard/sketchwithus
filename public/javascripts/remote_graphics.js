define(['artist', 'graphics'], function (Artist, Graphics) {

  //TODO: will the hard-coded port bite us in the ass?
  var socketServer = typeof(location) === 'undefined' ? 'http://localhost:8000/' : '/';

	function RemoteGraphics(sketchpad_id, io) {
	  this._io = io;
		this._sketchpad_id = sketchpad_id;
	};

	RemoteGraphics.prototype.listen = function(context) {
		var socket = this._io.connect(socketServer + this._sketchpad_id),
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
