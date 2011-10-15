function run(app) {	
	var sockets = require('./sockets').listen(app),
	    sketchpads = require('./repository').create();

	app.post('/sketchpad', function(req, res) {
		res.redirect('/sketchpad/' + uuid.create(), 303);
	});

	function with_sketchpad(req, res, next) {
		req.sketchpad = sketchpads.get_or_create(req.params.uuid);
		next();
	}

	app.get('/sketchpad/:uuid', with_sketchpad, function(req, res) {
		sockets.create(req.sketchpad);

		res.render('sketchpad', {
			title: 'SketchWith.Us',
			sketchpad_id: req.sketchpad.id,
			image: ''
		});
	});
}

module.exports.run = run;
