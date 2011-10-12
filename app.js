/**
 * Module dependencies.
 */
var uuid = require('uuid-lib'),
    express = require('express'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app),
    requirejs = require('requirejs'),
    Canvas = require('canvas');

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
	var sketches = {};

	app.get('/sketchpad', function(req, res) {
		res.redirect('/sketchpad/' + uuid.create(), 301);
	});

	function with_sketchpad(req, res, next) {
		var sketchpad_id = req.params.uuid;

		if (!sketches[sketchpad_id]) {
		  var canvas = new Canvas(800, 600),
		    graphics = new Graphics(canvas.getContext('2d'));
		  
			sketches[sketchpad_id] = {
			  artists: {},
			  canvas: canvas,
			  graphics: graphics
			};
		}

		req.sketchpad = {
			id: sketchpad_id,
			artists: sketches[sketchpad_id].artists,
			artist_ids: function() {
				var artists = sketches[sketchpad_id].artists,
				  artist_id_list = [];
				for (var artist_id in artists) {
				  if (artists.hasOwnProperty(artist_id)) {
				    artist_id_list.push(artist_id);
				  }
				}
				return artist_id_list;
			},
			add_artist: function(artist_id) {
				sketches[sketchpad_id].artists[artist_id] = new Artist(sketches[sketchpad_id].graphics);
			},
			remove_artist: function(artist_id) {
				delete sketches[sketchpad_id].artists[artist_id];
			},
			canvas: sketches[sketchpad_id].canvas
		};

		next();
	}

	app.get('/sketchpad/:uuid', with_sketchpad, function(req, res) {
		io.of('/' + req.sketchpad.id).on('connection', function(socket) {
			var artist_id = socket.id;

			socket.on('join', function (data) {
				socket.broadcast.emit('join', [artist_id]);
				socket.emit('join', req.sketchpad.artist_ids());
				req.sketchpad.add_artist(artist_id);
			});

			socket.on('draw', function(data) {
			  var a = req.sketchpad.artists[artist_id],
			    method = a[data.method];
		    method.apply(a, data.arguments);
				socket.broadcast.emit('draw', { id: artist_id, invocation: data });
			});

			socket.on('disconnect', function () {
				socket.broadcast.emit('leave', artist_id);
				req.sketchpad.remove_artist(artist_id);
			});
		});

    req.sketchpad.canvas.toDataURL(function(err, dataUrl) {
		  res.render('sketchpad', {
			  title: 'SketchWith.Us',
			  sketchpad_id: req.sketchpad.id,
			  image: dataUrl
		  });
		});
	});
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
