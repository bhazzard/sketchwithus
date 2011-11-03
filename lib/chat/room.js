var EventEmitter = require('events').EventEmitter;

function RoomService(socket) {
  this.rooms = new RoomRepository();
  this.hypertext = new RoomHypertext();
  this.socket = socket;
}

RoomService.prototype.run = function(app) {
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

  app.get('/room/:id', function(req, res) {
    var room = rooms.get(req.params.id);

    if (room) {
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

module.exports.RoomService = RoomService;

function RoomRepository() {
  this.rooms = {};
}

RoomRepository.prototype = new EventEmitter();

RoomRepository.prototype.save = function(room) {
  if (!room.id) throw "Rooms must have an id";
  if (!room.name) throw "Rooms must have a name";
  var exists = this.exists(room.id);

  this.rooms[room.id] = room;

  if (exists) {
    this.emit('update', room.id);
  } else {
    this.emit('create', room.id);
  }
};

RoomRepository.prototype.get = function(id) {
  return this.rooms[id];
};

RoomRepository.prototype.exists = function(id) {
  return this.rooms[id] ? true : false;
};

RoomRepository.prototype.delete = function(id) {
  delete this.rooms[id];
  this.emit('delete', id);
};

function RoomHypertext() {
}

RoomHypertext.prototype.inject = function(room) {
  room.links = {
    'self': {
      title: 'Chat Room: ' + room.name,
      href: '/room/' + room.id
    },
    'socket': {
      title: 'Join ' + room.name + 'via WebSockets',
      href: 'not/sure/how/to/get/this/url'
    }
  };
}
