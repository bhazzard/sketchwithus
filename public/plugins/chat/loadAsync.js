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

        if (typeof callback === "function") {
          callback(); // execute callback function
        }

        // Prevent memory leaks in IE
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };
    head.appendChild(script);
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
    loadScript("http://sketchwith.us:8000/plugins/chat/chat.js", function() {
      loadScript("http://sketchwith.us:8000/plugins/chat/embedded.js");
    });
  });
})();
