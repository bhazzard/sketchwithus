var requirejs = require('requirejs'),
    Canvas = require('canvas'),
    io = require('socket.io-client'),
    sketchpad_canvases = {};

requirejs.config({
  baseUrl: 'public/javascripts'
});

requirejs(['remote_graphics'], function(RemoteGraphics) {
  function run(app) {
    function no_cache(req, res, next) {
      res.header('Cache-Control','no-cache, must-revalidate');
      res.header('Expires','Mon 1 Jan 2000 01:00:00 GMT');
      res.header('Pragma','no-cache');
      next();
    };
   
    app.get('/sketchpad/:uuid/sketch.png', no_cache, function(req, res) {
      sketchpad_canvases[req.params.uuid].toBuffer(function(err, buffer) {
        res.contentType('image/png');
        res.send(buffer);
      });
    });
    
    io.connect('http://localhost:8000/').on('create', function(id) {
      if (!sketchpad_canvases[id]) {
        sketchpad_canvases[id] = new Canvas(800, 600);
      }

      var canvas = sketchpad_canvases[id];

      var remote = new RemoteGraphics(id, io);
      remote.listen(canvas.getContext('2d'));
    });
  };

  module.exports.run = run;
});
