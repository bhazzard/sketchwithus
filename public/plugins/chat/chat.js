(function(exports) {
  var socket = io.connect('sketchwith.us:8000'),
    receive = system = join = profile = function() {},
    external = function(params) {
      receive = params.receive || receive;
      system = params.system || system;
      join = params.join || join;
      profile = params.profile || profile;

      init(socket);

      return function(text) {
        socket.emit('chat', text);
      };
    };

  function init(socket) {
    socket.on('system message', system);
    socket.on('chat', receive); 
    socket.on('profile', profile); 
    socket.emit('join', { room: location.href }, join);
  }

  exports.chat = external;
})(window);
