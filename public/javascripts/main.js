require(['canvas'], function(Canvas, Chat) {
  function onStart() {
    return function(sketchpad) {
      location.hash = '#' + sketchpad.self;

      var socket = io.connect(sketchpad.socket);
      socket.emit('join');
      socket.emit('login');

      socket.on('login', function(artists) {
        _.each(artists, function(artist) {
          $('body').trigger('artist', artist);
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

  $('#content').delegate('.invite', 'click', function() {
    var template = _.template($("#invite-template").html()),
      content = template(location);
    $.modal(content, {
      close: false
    });
  });

  $('body').bind('artist', function(event, artist){
    var template = _.template($("#artist-template").html()),
      artists = $('.artists');
    if (!artists.length) {
      artists = $('<div />').addClass('artists').appendTo('#content');
      artists.append('<a class="invite" title="Invite a friend to sketch with">Invite</a>');
    }
    artists.append(template(artist));
  });

  $('#login').bind('userLeft', function(event, artist_id){
    $('#' + artist_id).remove();
  });
});
