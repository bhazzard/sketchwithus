(function($) {
  $(document).ready(function() {
    var chat = $('#chat')
          .append($('<ul>'))
          .append($('<input>').attr('type', 'text')),
        messages = chat.find('ul'),
        input = chat.find('input');

    $('#sketch').bind('sketch.initialized', function(event, sketchpad) {
      chat.bind('chat.incoming', function appendAndScroll(event, chat) {
        messages
          .append($('<li class="from ' + chat.id + '"><strong>' + chat.id + ':</strong> ' + chat.text + '</li>'))
          .scrollTop(messages.attr('scrollHeight'));
      });

      input.bind('keyup', 'return', function triggerChatEvents() {
        chat.trigger('chat.incoming', { id: 'me', text: this.value });
        chat.trigger('chat.outgoing', { id: 'me', text: this.value });
        this.value = '';
      });

      chatForSketchpad(sketchpad);
    });

    function chatForSketchpad(sketchpad) {
      joinRoom('/rooms/' + sketchpad.id, function notFound(roomUrl) {
        $.ajax({
          url: roomUrl,
          type: 'PUT',
          data: {
            name: 'Chatroom for Sketchpad (' + sketchpad.id + ')'
          },
          success: function(data, status, xhr) {
            joinRoom(xhr.getResponseHeader('location'), function notFound(roomUrl) {
              throw "Room Not Found";
            });
          }
        });
      });
    }

    function joinRoom(roomUrl, notFound) {
      $.ajax({
        url: roomUrl, 
        type: 'GET',
        success: function(room) {
          var socket = io.connect(room.links.messages.href);
    
          socket.on('chat', function(chat) {
            chat.trigger('chat.incoming', chat);
          });

          chat.bind('chat.outgoing', function(event, data) {
console.log(data);
            socket.emit('chat', data.text);
          });
        },
        error: function(res) {
          if (res.status == 404) {
            notFound(roomUrl);
          }
        }
      });
    }
  });
})(jQuery);
