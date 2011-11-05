function Messages(rooms, io) {
  this.rooms = rooms;
  this.io = io;
}

Messages.prototype.listen = function() {
  var io = this.io;

  this.rooms.on('create', function(id) {
    var notifications = io.of('/room/' + id + '/notifications/messages');

    notifications.on('chat', function(data) {
      notifications.emit('chat', data);
    });
  });
};

module.exports = Messages;
