var requirejs = require('requirejs'),
    Canvas = require('canvas'),
    sketchpad_canvases = {};


requirejs.config({
  baseUrl: 'public/javascripts'
});

requirejs(['remote_graphics'], function(RemoteGraphics) {
  function Service(sketchpads) {
    this._sketchpads = sketchpads;
  }

  Service.prototype.run = function(app) {
    var sketchpads = this._sketchpads;

    function no_cache(req, res, next) {
      res.header('Cache-Control','no-cache, must-revalidate');
      res.header('Expires','Mon 1 Jan 2000 01:00:00 GMT');
      res.header('Pragma','no-cache');
      next();
    };
   
    app.get('/sketchpad/:uuid/sketch.png', no_cache, function(req, res) {
      var canvas = sketchpad_canvases[req.params.uuid];
      canvas.toBuffer(function(err, buffer) {
        res.contentType('image/png');
        res.send(buffer);
      });
    });
    
    sketchpads.on('create', function(sketchpad) {
      if (!sketchpad_canvases[sketchpad.id]) {
        sketchpad_canvases[sketchpad.id] = new Canvas(800, 600);
      }

      var canvas = sketchpad_canvases[sketchpad.id];

      var remote = new RemoteGraphics(sketchpad.id, sketchpad);
      remote.listen(canvas.getContext('2d'));
    });
  }
 
  module.exports.Service = Service;
});
