/**
 * Module dependencies.
 */
var uuid = require('uuid-lib'),
    express = require('express'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);

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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'SketchWith.Us'
  });
});

(function() {
	var artists = {};

	app.get('/sketchpad', function(req, res) {
		res.redirect('/sketchpad/' + uuid.create(), 301);
	});

	function with_sketchpad(req, res, next) {
		var sketchpad_id = req.params.uuid;

		if (!artists[sketchpad_id]) {
			artists[sketchpad_id] = [];
		}

		req.sketchpad = {
			id: sketchpad_id,
			artists: function() {
				return artists[sketchpad_id];
			},
			add_artist: function(artist) {
				artists[sketchpad_id].push(artist);
			},
			remove_artist: function(artist) {
				var a = artists[sketchpad_id].indexOf(artist);
				if (a >= 0) {
					artists[sketchpad_id].splice(a, 1);
				}
			}
		};

		next();
	}

	app.get('/sketchpad/:uuid', with_sketchpad, function(req, res) {
		io.of('/' + req.sketchpad.id).on('connection', function(socket) {
			var artist = socket.id;

			socket.on('join', function (data) {
				socket.broadcast.emit('join', [artist]);
				socket.emit('join', req.sketchpad.artists());
				req.sketchpad.add_artist(artist);
			});

			socket.on('draw', function(data) {
				socket.broadcast.emit('draw', { id: artist, invocation: data });
			});

			socket.on('disconnect', function () {
				socket.broadcast.emit('leave', artist);
				req.sketchpad.remove_artist(artist);
			});
		});

		res.render('sketchpad', {
			title: 'SketchWith.Us',
			sketchpad_id: req.sketchpad.id
		});
	});
})();

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
