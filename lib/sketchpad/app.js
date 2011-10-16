var uuid = require('uuid-lib'),
  exporter = require('./export'),
  sockets = require('./sockets'),
  sketchpads = require('./repository').create();

function run(app) {
  var listener = sockets.listen(app);
   
  app.post('/sketchpad', function(req, res) {
    res.redirect('/sketchpad/' + uuid.create(), 303);
  });

  function with_sketchpad(req, res, next) {
    req.sketchpad = sketchpads.get_or_create(req.params.uuid);
    next();
  }

  app.get('/sketchpad/:uuid', with_sketchpad, function(req, res) {
    listener.create(req.sketchpad);
    exporter.listen(req.sketchpad.id);

    res.render('sketchpad', {
      title: 'SketchWith.Us',
      sketchpad_id: req.sketchpad.id
    });
  });
}

module.exports.run = run;
