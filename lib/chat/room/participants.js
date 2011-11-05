function Participants(rooms, io) {
  this.rooms = rooms;
  this.io = io;
}

Participants.prototype.listen = function() {
  var io = this.io;

  this.rooms.on('join', function(data) {
    var notifications = io.of('/room/' + data.room.id + '/notifications/participants');
  });
};

module.exports = Participants;
