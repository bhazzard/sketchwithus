/**
 * Module dependencies.
 */
var uuid = require('uuid-lib'),
    express = require('express'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app),
    requirejs = require('requirejs'),
    Canvas = require('canvas'),
    _ = require('underscore');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

requirejs.config({
  baseUrl: 'public/javascripts'
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'SketchWith.Us'
  });
});

requirejs(['artist', 'graphics'], function(Artist, Graphics) {
	var sketchpads = require('./sketchpads').repository();

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
				socket.emit('join', _.map(req.sketchpad.get_artists(), function(artist) {
					return artist.id;
				}));
				req.sketchpad.add_artist(artist_id);
			});

			socket.on('draw', function(data) {
				var a = req.sketchpad.get_artist(artist_id),
				method = a[data.method];
				method.apply(a, data.arguments);
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

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
