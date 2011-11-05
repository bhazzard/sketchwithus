function Participants(rooms, io) {
  this.rooms = rooms;
  this.io = io;
}

Particpants.prototype.listen = function() {
  var io = this.io;

  this.rooms.on('create', function(id) {
  });
};

module.exports = Participants;
