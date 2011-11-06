function Participants(rooms, io) {
  this.rooms = rooms;
  this.io = io;
}

Participants.prototype.listen = function() {
  var io = this.io;

  this.rooms.on('join', function(data) {
    var notifications = io.of('/notifications/rooms/' + data.room.uuid + '/participants');
  });
};

module.exports = Participants;
