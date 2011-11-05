function Messages(rooms, io) {
  this.rooms = rooms;
  this.io = io;
}

Messages.prototype.listen = function() {
  var io = this.io;

  this.rooms.on('create', function(id) {
    var messages = io.of('/room/' + id + '/messages');

    messages.on('chat', function(data) {
      messages.emit('chat', data);
    });
  });
};

module.exports = Messages;
