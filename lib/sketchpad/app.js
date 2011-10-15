function run(app) {	
	var io = require('socket.io').listen(app),
	    requirejs = require('requirejs'),
	    underscore = require('underscore'),
	    sketchpads = require('./repository').create();

	requirejs.config({
	  baseUrl: 'public/javascripts'
	});

	requirejs(['artist', 'graphics'], function(Artist, Graphics) {
		app.post('/sketchpad', function(req, res) {
			res.redirect('/sketchpad/' + uuid.create(), 303);
		});

		function with_sketchpad(req, res, next) {
			req.sketchpad = sketchpads.get_or_create(req.params.uuid);
			next();
		}

		app.get('/sketchpad/:uuid', with_sketchpad, function(req, res) {
			io.of('/' + req.sketchpad.id).on('connection', function(socket) {
				var artist_id = socket.id;

				socket.on('join', function (data) {
					socket.broadcast.emit('join', [artist_id]);
					socket.emit('join', underscore.map(req.sketchpad.get_artists(), function(artist) {
						return artist.id;
					}));
					req.sketchpad.add_artist(artist_id);
				});

				socket.on('draw', function(data) {
					//var a = req.sketchpad.get_artist(artist_id),
					//method = a[data.method];
					//method.apply(a, data.arguments);
					socket.broadcast.emit('draw', { id: artist_id, invocation: data });
				});

				socket.on('disconnect', function () {
					socket.broadcast.emit('leave', artist_id);
					req.sketchpad.remove_artist(artist_id);
				});
			});

			res.render('sketchpad', {
				title: 'SketchWith.Us',
				sketchpad_id: req.sketchpad.id,
				image: ''
			});
		});
	});
}

module.exports.run = run;
