function RoomService() {
  this.rooms = new RoomRepository();
  this.hypertext = new RoomHypertext();
}


RoomService.prototype.run = function(app) {
  var rooms = this.rooms,
    hypertext = this.hypertext;

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
    res.send(rooms.getById(req.params.id), 200);
  });

  app.delete('/room/:id', function(req, res) {
    delete rooms.getById(req.params.id);
    res.send(200);
  });
};

module.exports.RoomService = RoomService;

function RoomRepository() {
  this.rooms = {};
}

RoomRepository.prototype.save = function(room) {
  if (!room.id) throw "Rooms must have an id";
  if (!room.name) throw "Rooms must have a name";

  this.rooms[room.id] = room;
}

RoomRepository.prototype.getById = function(id) {
  return this.rooms[id];
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
