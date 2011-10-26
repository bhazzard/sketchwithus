(function(exports) {
  var sketchpad_id= $('#sketchpad_id').attr('val'),
    socket = io.connect('/chatrooms/' + sketchpad_id);
    
  socket.on('chat', function(chat) {
    $('#chat ul').trigger('chat', chat);
  });

  exports.chat = function(text) {
    socket.emit('chat', text);
  };
})(window);

(function($) {
  function appendChat(chat) {
      $('#chat ul').append($('<li class="from ' + chat.id + '">' + chat.text + '</li>')); 
  }

  $(document).ready(function() {
    $('#chat')
      .append($('<ul>'))
      .append($('<input>').attr('type', 'text'));

    $('#chat input').bind('keyup', 'return', function() {
      chat(this.value);
      appendChat({ id: 'me', text: this.value });
      this.value = '';
    });

    $('#chat ul').bind('chat', function(event, chat) {
      appendChat(chat);
    });
  });
})(jQuery);
