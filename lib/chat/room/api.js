function Api(repository, hypertext, socket) {
  this.rooms = repository;
  this.hypertext = hypertext;
  this.socket = socket;
}

function uuid(req, res, next) {
  var Uuid = require('uuid-lib'), uuid;

  req.uuid = req.params.uuid || req.body.uuid || Uuid.raw();

  if (!Uuid.isUuid(req.uuid)) {
    res.send("Not a valid identifier", 400);
    return false;
  }

  next();
}

function getFrom(repository) {
  return function get(req, res, next) {
    var uuid = req.params.uuid;

    if (!repository.exists(uuid)) {
      res.send(404);
      return false;
    }

    req.room = repository.get(uuid);
    next();
  };
}

function create(req, res, next) {
  if ((req.body.uuid && req.params.uuid) && (req.body.uuid != req.params.uuid)) {
    res.send("Room identifier cannot be changed", 400);
    return false;
  }

  if (!req.body.name) {
    res.send("Rooms must have a name", 400);
    return false;
  }

  req.room = {
    uuid: req.uuid,
    name: req.body.name
  };

  next();
}

function saveTo(repository) {
  return function(req, res, next) {
    repository.save(req.room);
    next();
  };
}

function createdResponse(hypertext) {
  return function respondWithLocation(req, res) {
    hypertext.inject(req.room);
    res.header('location', req.room.links['self'].href);
    res.send(200);
  };
}

Api.prototype.listen = function(app) {
  var rooms = this.rooms,
    hypertext = this.hypertext,
    room_events = this.socket.of('rooms');

  app.post('/rooms', uuid, create, saveTo(rooms), createdResponse(hypertext));

  app.put('/rooms/:uuid', uuid, create, saveTo(rooms), createdResponse(hypertext));

  app.post('/rooms/:uuid/participants', getFrom(rooms), function joinRoom(req, res) {
    rooms.join(req.room.uuid, req.body);
    res.send(req.room, 200);
  });

  app.get('/rooms/:uuid', getFrom(rooms), function getRoom(req, res) {
    res.send(req.room, 200);
  });

  app.delete('/rooms/:uuid', getFrom(rooms), function deleteRoom(req, res) {
    rooms.delete(req.room.uuid);
    res.send(200);
  });

  rooms.on('create', function onCreate(room) {
    hypertext.inject(room);
    room_events.emit('create', room.links['self'].href);
  });

  rooms.on('update', function onUpdate(room) {
    hypertext.inject(room);
    room_events.emit('update', room.links['self'].href);
  });

  rooms.on('delete', function onDelete(uuid) {
    room_events.emit('delete', uuid);
  });
};

module.exports = Api;
