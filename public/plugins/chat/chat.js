(function(exports) {
  var socket = io.connect('sketchwith.us:8000'),
    receive = system = join = function() {},
    external = function(params) {
      receive = params.receive || receive;
      system = params.system || system;
      join = params.join || join;

      init(socket);

      return function(text) {
        socket.emit('chat', text);
      };
    };

  function init(socket) {
    socket.on('system message', systemMessage);
    socket.on('chat', receive); 
    socket.emit('join', { room: location.href }, join);
  }

  exports.chat = external;
})(window);
