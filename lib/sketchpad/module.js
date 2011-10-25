var uuid = require('uuid-lib'),
  sockets = require('socket.io');

function Service(sketchpads, emitters) {
  this._sketchpads = sketchpads;
  this._emitters = emitters;
}

Service.prototype.run = function(app) {
  var io = sockets.listen(app),
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
  
  app.post('/sketchpad', function(req, res) {
    var id = uuid.raw(),
      url = '/sketchpad/' + id,
      sketchpad = sketchpads.get_or_create(id);
      emitter = emitters.get_or_create(id);
    
    var namespace = io.of('/' + id).on('connection', function(socket) {
      var artist_id = socket.id;

      socket.on('join', function () {
        sketchpad.once('join', function(ids) {
          namespace.emit('join', ids);
          emitter.emit('join', ids);
        });
        sketchpad.join(artist_id);
      });

      socket.on('login', function(profile) {
        sketchpad.login(artist_id, profile);
        socket.emit('login', sketchpad.logged_in());
        socket.broadcast.emit('login', [profile]);
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
    res.render('sketchpad', {
      title: 'SketchWith.Us',
      sketchpad_id: req.params.uuid
    });
  });
};

module.exports.Service = Service;
