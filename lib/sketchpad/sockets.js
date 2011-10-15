var underscore = require('underscore'),
    sockets = require('socket.io'),
    io;

function listener(io) {
	return {
		"create": function(sketchpad) {
			io.of('/' + sketchpad.id).on('connection', function(socket) {
				var artist_id = socket.id;

			      socket.on('join', function (data) {
				socket.broadcast.emit('join', [artist_id]);
				socket.emit('join', req.sketchpad.artist_ids());
				req.sketchpad.add_artist(artist_id);
			      });

			      socket.on('draw', function(command) {
				req.sketchpad.artists[artist_id].execute(command);
				socket.broadcast.emit('draw', { id: artist_id, command: command });
			      });

			      socket.on('disconnect', function () {
				socket.broadcast.emit('leave', artist_id);
				req.sketchpad.remove_artist(artist_id);
			      });
		    });
		}
	};
}

function listen(app) {
	return listener(sockets.listen(app)); 
}

module.exports.listen = listen;
