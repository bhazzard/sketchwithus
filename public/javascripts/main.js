require(['canvas'], function(Canvas, Chat) {
  function onStart() {
    return function(sketchpad) {
      location.hash = '#' + sketchpad.self;

      var socket = io.connect(sketchpad.socket);
      socket.emit('join');
      socket.emit('login');

      socket.on('login', function(artists) {
        _.each(artists, function(artist) {
          console.log(artist);
        });
      });

      var canvas = new Canvas(socket, sketchpad);

      $(window).resize(function() {
        canvas.calculateOffsets();
      });
    };
  };

  $('#start').click(function(event, profile) {
      $.post('/sketchpad', onStart());
  });

  $(document).ready(function(){
    if(location.hash){
      var url = location.hash.indexOf('#') == 0 ?
        location.hash.substring(1) :
        location.hash;
      $.getJSON(url, onStart());
    }
  });
});
