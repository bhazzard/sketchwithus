var EventEmitter = require('events').EventEmitter;
   
function Repository() {
  this.rooms = {};
}

Repository.prototype = new EventEmitter();

Repository.prototype.save = function(room) {
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

Repository.prototype.get = function(id) {
  return this.rooms[id];
};

Repository.prototype.exists = function(id) {
  return this.rooms[id] ? true : false;
};

Repository.prototype.delete = function(id) {
  delete this.rooms[id];
  this.emit('delete', id);
};

module.exports = Repository;
