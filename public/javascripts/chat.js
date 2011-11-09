define(function() {
  function Chat() {
    this._create();
    this._init();
  };

  Chat.prototype._create = function() {
    this._chat = $('<div />').addClass('chat').appendTo('body');
    this._messages = $('<ul />').appendTo(this._chat);
    this._input = $('<input />').attr('type', 'text').appendTo(this._chat);
  };

  Chat.prototype._init = function() {
    var chat = this._chat,
      messages = this._messages,
      input = this._input;

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
  };

  Chat.prototype.chatForSketchpad = function(sketchpad) {
    var self = this;
    self.joinRoom('/rooms/' + sketchpad.id, function notFound(roomUrl) {
      $.ajax({
        url: roomUrl,
        type: 'PUT',
        data: {
          name: 'Chatroom for Sketchpad (' + sketchpad.id + ')'
        },
        success: function(data, status, xhr) {
          self.joinRoom(xhr.getResponseHeader('location'), function notFound(roomUrl) {
            throw "Room Not Found";
          });
        }
      });
    });
  };

  Chat.prototype.joinRoom = function(roomUrl, notFound) {
    var chat = this._chat;
    $.ajax({
      url: roomUrl, 
      type: 'GET',
      success: function(room) {
        var socket = io.connect(room.links.messages.href);
  
        socket.on('chat', function(chat) {
          chat.trigger('chat.incoming', chat);
        });

        chat.bind('chat.outgoing', function(event, data) {
          socket.emit('chat', data.text);
        });
      },
      error: function(res) {
        if (res.status == 404) {
          notFound(roomUrl);
        }
      }
    });
  };

  return Chat;
});
