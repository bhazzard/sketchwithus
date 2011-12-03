(function(chat, $) {
  $(function() {
    var dom = {};

    dom.chat = $('<div />').addClass('chat').appendTo('body');
    dom.messages = $('<ul />').appendTo(dom.chat);
    dom.input = $('<input />').attr('type', 'text').appendTo(dom.chat);

    var send = chat({
      join: function(context) {
        alert('You are joining ' + context.room + ' as ' + context.profile.nickname);
      },
      recieve: function(chat) {
        dom.messages
          .append($('<li class="from ' + chat.id+ '"><strong>' + chat.profile.nickname + ':</strong> ' + chat.text + '</li>'))
          .scrollTop(dom.messages.attr('scrollHeight'));
      },
      system: function(message) {
        dom.messages
         .append($('<li class="system">' + message + '</li>'))
         .scrollTop(dom.messages.attr('scrollHeight'));
      }
    });

    dom.input.keydown(function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code == '13') {
        send(this.value);
        this.value = '';
      }
    });
  });
})(chat, jQuery);
