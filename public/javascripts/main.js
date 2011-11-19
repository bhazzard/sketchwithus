require(['canvas'], function(Canvas, Chat) {
  function onLogin(profile) {
    return function(sketchpad) {
      location.hash = '#' + sketchpad.self;

      var socket = io.connect(sketchpad.socket);
      socket.emit('join');
      socket.emit('login', {
        id : profile.id,
        name : profile.name
      });

      socket.on('login', function(artists) {
        _.each(artists, function(artist) {
          $('#artists').trigger('recievedLogin', artist);
        });
      });

      $('#artists').bind('userLoggedOut', function(event, profile) {
        socket.emit('logout');
      });

      socket.on('logout', function(artist_id) {
        $('#artists').trigger('userLeft', artist_id);
      });

      socket.on('leave', function(artist_id) {
        $('#artists').trigger('userLeft', artist_id);
      });

      var canvas = new Canvas(socket, sketchpad);
    };
  };

  $('#artists').bind('userLoggedIn', function(event, profile) {
    if (location.hash) {
      var url = location.hash.indexOf('#') == 0 ?
        location.hash.substring(1) :
        location.hash;
      $.getJSON(url, onLogin(profile));
    } else {
      $.post('/sketchpad', onLogin(profile));
    }
  });
});
