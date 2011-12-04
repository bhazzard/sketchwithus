(function(exports) {
  var head = document.getElementsByTagName("head")[0];

  function loadScript(url, callback) {
    var script = document.createElement("script");

    script.src = url;

    tellMeWhenItsDone(script, callback);

    head.appendChild(script);
  }

  function loadStyle(url, callback) {
    var link = document.createElement("link");

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    tellMeWhenItsDone(link, callback);

    head.appendChild(link);
  }


  function tellMeWhenItsDone(resource, callback) {
    var done = false;

    resource.onload = resource.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;

        if (typeof callback === "function") {
          callback();
        }

        resource.onload = resource.onreadystatechange = null;
        head.removeChild(resource);
      }
    };
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

  var chatShowing= false;
  function toggle() {

    if (!chatShowing) {
      $('.chat').animate({ 'left': '+=341px' });
      $('.chat input').focus();
      chatShowing = true;
    } else {
      $('.chat').animate({ 'left': '-=341px' });
      $('.chat input').blur();
      chatShowing = false;
    }
  }

  loadDependencies(function() {
    loadStyle('http://sketchwith.us:8000/plugins/chat/embedded-layout.css');
    loadStyle('http://sketchwith.us:8000/plugins/chat/embedded-color.css');
    loadScript("http://sketchwith.us:8000/plugins/chat/chat.js", function() {
      loadScript("http://sketchwith.us:8000/plugins/chat/embedded.js", function() {
        chatLoaded = true;
      });
    });
  });

  exports.chat = exports.chat || {};
  exports.chat.toggle = toggle;
})(window);
