require(['canvas'], function(Canvas) {
  $('#authentication-panel').bind('userLoggedIn', function(event, profile) {
    $.post('/sketchpad', function(data, status, xhr) {
      var l = xhr.getResponseHeader('Location'),
        path = l.split('/'),
        id = path[path.length - 1];
      var socket = io.connect('/' + id);
      socket.emit('join');
      socket.emit('login', {
        id : profile.id,
        name : profile.name
      });
      //set hash from location
      //create canvas and socket
      socket.on('login', function(artists) {
        _.each(artists, function(artist) {
          $('#authentication-panel').trigger('recievedLogin', artist);
        });
      });

      $('#authentication-panel').bind('userLoggedOut', function(event, profile) {
        socket.emit('logout');
      });

      socket.on('logout', function(artist_id) {
        $('#authentication-panel').trigger('userLeft', artist_id);
      });

      socket.on('leave', function(artist_id) {
        $('#authentication-panel').trigger('userLeft', artist_id);
      });

      var canvas = new Canvas(socket, id);
    });
  });

});
