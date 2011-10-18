var uuid = require('uuid-lib'),
  underscore = require('underscore'),
  sockets = require('socket.io');

function Service(sketchpads, emitters) {
  this._sketchpads = sketchpads;
  this._emitters = emitters;
}

Service.prototype.run = function(app) {
  var io = sockets.listen(app),
    sketchpads = this._sketchpads,
    emitters = this._emitters;
  
  io.of('/sketchpad').on('connection', function(socket) {
    emitters.get_or_create('sketchpad').on('create', function(id) {
      socket.emit('create', id);
    });
  });
  
  app.post('/sketchpad', function(req, res) {
    var id = uuid.raw(),
      url = '/sketchpad/' + id,
      sketchpad = sketchpads.get_or_create(id);
      emitter = emitters.get_or_create(id);
    
    var namespace = io.of('/' + id).on('connection', function(socket) {
      var artist_id = socket.id;

      socket.on('join', function (data) {
        sketchpad.add_artist(artist_id);
        var artistKeys = underscore.keys(sketchpad.artists);
        namespace.emit('join', artistKeys);
        emitter.emit('join', artistKeys);
      });

      socket.on('draw', function(command) {
        socket.broadcast.emit('draw', { id: artist_id, command: command });
        emitter.emit('draw', { id: artist_id, command: command });
      });

      socket.on('disconnect', function () {
        socket.broadcast.emit('leave', artist_id);
        emitter.emit('leave', artist_id);
        sketchpad.remove_artist(artist_id);
      });
    });
    
    res.redirect(url, 303);
  });

  app.get('/sketchpad/:uuid', function(req, res) {
    res.render('sketchpad', {
      title: 'SketchWith.Us',
      sketchpad_id: req.params.uuid
    });
  });
};

module.exports.Service = Service;
