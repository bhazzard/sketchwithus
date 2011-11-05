function Hypertext() {
}

Hypertext.prototype.inject = function(room) {
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

module.exports = Hypertext;