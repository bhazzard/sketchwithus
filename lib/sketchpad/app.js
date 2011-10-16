var uuid = require('uuid-lib'),
  underscore = require('underscore'),
  sockets = require('socket.io'),
  Repository = require('./repository').Repository;

function run(app) {
  var io = sockets.listen(app),
    sketchpads = new Repository();
  
  io.on('connection', function(socket) {
    sketchpads.on('create', function(id) {
      socket.emit('create', id);
    });
  });
  
  app.post('/sketchpad', function(req, res) {
    var id = uuid.raw(),
      url = '/sketchpad/' + id;
    
    io.of('/' + id).on('connection', function(socket) {
      var artist_id = socket.id;

      socket.on('join', function (data) {
        var sketchpad = sketchpads.get_or_create(id);
        
        socket.broadcast.emit('join', [artist_id]);
        socket.emit('join', underscore.keys(sketchpad.get_artists()));
        sketchpad.add_artist(artist_id);
      });

      socket.on('draw', function(command) {
        socket.broadcast.emit('draw', { id: artist_id, command: command });
      });

      socket.on('disconnect', function () {
        var sketchpad = sketchpads.get_or_create(id);
        
        socket.broadcast.emit('leave', artist_id);
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
}

module.exports.run = run;
