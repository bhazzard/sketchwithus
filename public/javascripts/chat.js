(function(exports) {
  var sketchpad_id= $('#sketchpad_id').attr('val'),
    socket = io.connect('/chatrooms/' + sketchpad_id);
    
  socket.on('chat', function(chat) {
    if (console) {
      console.log(chat);
    }
  });

  exports.chat = function(text) {
    socket.emit('chat', text);
  };
})(window);
