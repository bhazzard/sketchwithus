function Hypertext() {
}
module.exports = Hypertext;

Hypertext.prototype.inject = function(room) {
  room.links = {
    'self': {
      title: 'Chat Room: ' + room.name,
      type: 'application/json',
      href: '/rooms/' + room.uuid
    },
    'messages': {
      title: 'Join ' + room.name + ' via socket.io',
      href: '/notifications/rooms/' + room.uuid + '/messages'
    }
  };
}
