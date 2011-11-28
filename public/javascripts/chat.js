(function() {
  function loadScript(url, callback) {
    var head = document.getElementsByTagName("head")[0],
        script = document.createElement("script"),
        done = false;

    script.src = url;

    // Attach event handlers for all browsers
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        callback(); // execute callback function

        // Prevent memory leaks in IE
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };
    head.appendChild(script);
  }

  function run() {
    var socket = io.connect('sketchwith.us:8000'),
        dom = {};

      dom.chat = $('<div />').addClass('chat').appendTo('body');
      dom.messages = $('<ul />').appendTo(dom.chat);
      dom.input = $('<input />').attr('type', 'text').appendTo(dom.chat);

    (function incoming() {
      socket.on('system message', function(message) {
         dom.messages
          .append($('<li class="system">' + message + '</li>'))
          .scrollTop(dom.messages.attr('scrollHeight'));
      });

      var profile = (function(socket) {
        var profiles = {};

        socket.on('profile update', function(profile) {
          profiles[profile.id] = profile;
        });

        return function(id) {
          return profiles[id];
        };
      })(socket);

      socket.on('chat', function(chat) {
        dom.messages
          .append($('<li class="from ' + chat.id+ '"><strong>' + profile(chat.id).nickname + ':</strong> ' + chat.text + '</li>'))
          .scrollTop(dom.messages.attr('scrollHeight'));
      });
    })();

    (function outgoing() {
      socket.emit('join', { room: location.href }, function(context) {
        alert('You are joining ' + context.room + ' as ' + context.profile.nickname);
      });

      dom.input.keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == '13') {
          socket.emit('chat', this.value);
          this.value = '';
        }
      });
    })();
  }

  function loadDependencies(callback) {
    var jq = false,
        si = false;

    function init() {
      if (jq && si) {
        callback();
      }
    }

    loadScript("http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js", function() {
      jq = true;
      init();
    });
    loadScript("http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.8.4/socket.io.min.js", function() {
      si = true;
      init();
    });
  }

  loadDependencies(function() {
    $(run);
  });
})();
