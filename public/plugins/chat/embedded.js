(function(chat, $) {
  $(function() {
    var dom = dom || {};
    dom.chat = dom.chat || $('<div />').addClass('chat').appendTo('body');
    dom.toggle = dom.toggle || $('<div />').addClass('toggle').appendTo(dom.chat);
    dom.messages = $('<ul />').appendTo(dom.chat);
    dom.input = $('<input />').attr('type', 'text').appendTo(dom.chat);

    var send = chat.init({
      receive: function(incoming) {
        dom.messages
          .append($('<li class="from ' + incoming.id+ '"><strong>' + incoming.profile.nickname + ':</strong> ' + incoming.text + '</li>'))
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

    dom.toggle.click(function() {
      chat.toggle();
    });
  });
})(chat, jQuery);
