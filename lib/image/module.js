var requirejs = require('requirejs'),
    Canvas = require('canvas'),
    sketchpad_canvases = {};


requirejs.config({
  baseUrl: 'public/javascripts'
});

requirejs(['remote_graphics'], function(RemoteGraphics) {
  function DefaultRoomEmitter() {
    var SKETCHPAD_SERVER = 'http://localhost:8000',
      io = require('socket.io-client');

    return io.connect(SKETCHPAD_SERVER + '/sketchpad');
  }

  function DefaultSketchEmitter(sketchpad_id) {
    var SKETCHPAD_SERVER = 'http://localhost:8000',
      io = require('socket.io-client');

    return io.connect(SKETCHPAD_SERVER + '/' + sketchpad_id);
  }

  function Service(emitters) {
    this._emitters= emitters;
  }

  Service.prototype.run = function(app) {
    var emitters = this._emitters;

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
    
    var roomEmitter = emitters.get_or_create('sketchpad');
    roomEmitter.on('create', function(id) {
      var sketchEmitter = emitters.get_or_create(id);

      if (!sketchpad_canvases[id]) {
        sketchpad_canvases[id] = new Canvas(800, 600);
      }

      var canvas = sketchpad_canvases[id];

      var remote = new RemoteGraphics(id, sketchEmitter);
      remote.listen(canvas.getContext('2d'));
    });
  }
 
  module.exports.Service = Service;
});
