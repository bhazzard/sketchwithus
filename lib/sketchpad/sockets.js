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
					socket.emit('join', underscore.map(sketchpad.get_artists(), function(artist) {
						return artist.id;
					}));
					sketchpad.add_artist(artist_id);
				});

				socket.on('draw', function(data) {
					//var a = sketchpad.get_artist(artist_id),
					//method = a[data.method];
					//method.apply(a, data.arguments);
					socket.broadcast.emit('draw', { id: artist_id, invocation: data });
				});

				socket.on('disconnect', function () {
					socket.broadcast.emit('leave', artist_id);
					sketchpad.remove_artist(artist_id);
				});
			});
		}
	};
}

function listen(app) {
	return listener(sockets.listen(app)); 
}

module.exports.listen = listen;
