function Api(repository, hypertext, socket) {
  this.rooms = repository;
  this.hypertext = hypertext;
  this.socket = socket;
}

Api.prototype.listen = function(app) {
  var rooms = this.rooms,
    hypertext = this.hypertext,
    room_events = this.socket.of('rooms');

  app.put('/room/:id', function(req, res) {
    var room = {
      id: req.params.id,
      name: req.body.name
    };

    rooms.save(room);
    hypertext.inject(room);

    res.header('location', room.links.self.href);
    res.send(200);
  });

  app.post('/room/:id', function(req, res) {
    var id = req.params.id, room;

    if (rooms.exists(id)) {
      room = rooms.get(id);
      rooms.join(room.id, req.body);
      res.send(room, 200);
    } else {
      res.send(404);
    }
  });

  app.get('/room/:id', function(req, res) {
    var id = req.params.id, room;

    if (rooms.exists(id)) {
      room = rooms.get(id);
      res.send(room, 200);
    } else {
      res.send(404);
    }
  });

  app.delete('/room/:id', function(req, res) {
    rooms.delete(req.params.id);
    res.send(200);
  });

  rooms.on('create', function(id) {
    var room = rooms.get(id);
    hypertext.inject(room);
    room_events.emit('create', room.links.self.href);
  });

  rooms.on('update', function(id) {
    var room = rooms.get(id);
    hypertext.inject(room);
    room_events.emit('update', room.links.self.href);
  });

  rooms.on('delete', function(id) {
    room_events.emit('delete', id);
  });
};

module.exports = Api;
