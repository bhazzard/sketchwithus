var requirejs = require('requirejs'),
    Canvas = require('canvas'),
    sketchpad_canvases = {};

requirejs.config({
	baseurl: '../../public/javascripts'
});

function listen(sketchpad_id) {
	if (!sketchpad_canvases[sketchpad_id]) {
		sketchpad_canvases[sketchpad_id] = new Canvas(800, 600);
	}

	var canvas = sketchpad_canvases[sketchpad_id];

	requirejs(['remote_graphics'], function(RemoteGraphics) {
		var remote = new RemoteGraphics(sketchpad_id);
		remote.listen(canvas.getContext('2d'));
	});
}

function run(app) {	
	app.get('/sketchpad/export/:uuid/sketch.png', function(req, res) {
		sketchpad_canvases[req.params.uuid].toBuffer(function(err, buffer) {
			res.contentType('img/png');
			res.send(buffer);
		});
	});
}

module.exports.run = run;
module.exports.listen = listen;
