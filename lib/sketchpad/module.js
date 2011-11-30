function Service(sketchpads, emitters, io) {
  this._sketchpads = sketchpads;
  this._emitters = emitters;
  this._io = io;
}

Service.prototype.run = function(app) {
  var io = this._io,
    sketchpads = this._sketchpads,
    emitters = this._emitters;
  
  io.configure('production', function() {
    io.set('log level', 1);
  });
  
  io.of('/sketchpad').on('connection', function(socket) {
    sketchpads.on('create', function(sketchpad) {
      socket.emit('create', sketchpad.id);
    });
  });

  function uuid(req, res, next) {
    var uuid = require('uuid-lib');
    req.params.uuid = uuid.raw();

    next();
  }; 

  function chat(req, res, next) {
    io.of('/chatrooms/' + req.params.uuid).on('connection', function(socket) {
      socket.on('chat', function(text) {
        socket.broadcast.emit('chat', { id: socket.id, text: text });
      });
    });

    next();
  }; 

  app.post('/sketchpad', uuid, chat, function(req, res) {
    var id = req.params.uuid,
      url = '/sketchpad/' + id,
      sketchpad = sketchpads.get_or_create(id);
      emitter = emitters.get_or_create(id);
    
    var namespace = io.of('/' + id).on('connection', function(socket) {
      var artist_id = socket.id;

      socket.on('login', function(profile) {
        var artist = sketchpad.login(artist_id, profile);
        socket.emit('login', sketchpad.logged_in());
        socket.broadcast.emit('login', [artist]);
      });

      socket.on('logout', function() {
        sketchpad.logout(artist_id);
        socket.broadcast.emit('logout', artist_id);
      });

      socket.on('draw', function(command) {
        sketchpad.once('draw', function(id, data) {
          socket.broadcast.emit('draw', id, data);
          emitter.emit('draw', id, data);
        });
        sketchpad.draw(artist_id, command);
      });

      socket.on('disconnect', function () {
        sketchpad.leave(artist_id);
        socket.broadcast.emit('leave', artist_id);
        emitter.emit('leave', artist_id);
      });
    });
    
    res.redirect(url, 303);
  });

  app.get('/sketchpad/:uuid', function(req, res) {
    var id = req.params.uuid;
    res.json({
      id: id,
      self: '/sketchpad/' + id,
      socket: '/' + id,
      image: '/sketchpad/' + id + '/sketch.png'
    });
  });
};

module.exports.Service = Service;
