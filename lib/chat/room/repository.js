var EventEmitter = require('events').EventEmitter;
   
function Repository() {
  this.rooms = {};
  this.members = {};
}

Repository.prototype = new EventEmitter();

Repository.prototype.save = function(room) {
  if (!room.uuid) throw "Rooms must have a uuid";
  if (!room.name) throw "Rooms must have a name";
  var exists = this.exists(room.id);

  this.rooms[room.uuid] = room;
  this.members[room.uuid] = {};

  if (exists) {
    this.emit('update', room);
  } else {
    this.emit('create', room);
  }
};

Repository.prototype.get = function(id) {
  return this.rooms[id];
};

Repository.prototype.exists = function(id) {
  return this.get(id) ? true : false;
};

Repository.prototype.delete = function(id) {
  delete this.rooms[id];
  this.emit('delete', id);
};

Repository.prototype.join = function(id, member) {
  var room = this.get(id);

  if (!room) {
    throw "You can't join a room that doesn't exist!";
  }

  this.members[id][member.id] = member;

  this.emit('join', { room: room, member: member });
};

module.exports = Repository;
