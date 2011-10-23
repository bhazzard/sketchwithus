require(['artist', 'graphics', 'proxy', 'remote_graphics'], function(Artist, Graphics, Proxy, RemoteGraphics) {
  var sketchpad_id= $('#sketchpad_id').attr('val');

  var socket = io.connect('/' + sketchpad_id),
    sketch = $('#sketch'),
    offsetX = sketch.offset().left,
    offsetY = sketch.offset().top,
    canvas,
    context,
    graphics,
    artist;
  
  function mousemove(event) {
    var x = event.pageX - offsetX,
      y = event.pageY - offsetY;
    
    artist.mousemove(x, y);
  };
  
  function mousedown(event) {
    var x = event.pageX - offsetX,
      y = event.pageY - offsetY;
    
    artist.mousedown(x, y);
  };
  
  function mouseup(event) {
    var x = event.pageX - offsetX,
      y = event.pageY - offsetY;
    
    artist.mouseup(x, y);
  };
  
  function mouseout(event) {
    var x = event.pageX - offsetX,
      y = event.pageY - offsetY;
    
    artist.mouseout(x, y);
  };
  
  function mouseenter(event) {
    var x = event.pageX - offsetX,
      y = event.pageY - offsetY;
    
    artist.mouseenter(x, y);
  };
  
  var image = new Image();
  image.onload = function() {
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', sketch.width());
    canvas.setAttribute('height', sketch.height());
    
    context = canvas.getContext('2d');
    graphics = new Graphics(context);
    graphics = new Proxy(graphics, function(invocation) {
      var packet = invocation.arguments.concat();
      packet.unshift(invocation.method);
      socket.emit('draw', packet);
      invocation.proceed();
    });
    artist = new Artist(graphics);
    remote = new RemoteGraphics(sketchpad_id, socket);
    socket = remote.listen(context);
    
    context.drawImage(this, 0, 0);
    
    sketch.append(canvas);
    
    socket.emit('join');
    
    $(canvas).bind({
      mousedown: mousedown,
      mouseenter: mouseenter,
      mousemove: mousemove,
      mouseup: mouseup,
      mouseout: mouseout
    });
    
    $(document).bind({
      mouseup: mouseup
    });

    $('#authentication-panel').bind('userLoggedIn', function(event, profile) {
      socket.emit('login', {
        id : profile.id,
        name : profile.name
      });
    });

    socket.on('login', function(artists) {
      _.each(artists, function(artist) {
        $('#authentication-panel').trigger('recievedLogin', artist);
      });
    });

    $('#authentication-panel').bind('userLoggedOut', function(event, profile) {
      socket.emit('logout');
    });

    socket.on('logout', function(arist_id) {
      $('#authentication-panel').trigger('recievedLogout');
    });

    $('#ink').ColorPicker({
      color: '#000000',
      flat: true,
      onChange: function (hsb, hex, rgb) {
        artist.setColor(hex);
      }
    });
  };
  image.src = "/sketchpad/" + sketchpad_id + "/sketch.png";
});
