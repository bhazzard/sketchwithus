require(['artist', 'graphics', 'proxy', 'remote_graphics'], function(Artist, Graphics, Proxy, RemoteGraphics) {
  var sketchpad_id= $('#sketchpad_id').attr('val');

  var sketch = $('#sketch'),
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
      socket.emit('draw', {
        method: invocation.method,
        arguments: invocation.arguments
      });
      invocation.proceed();
    });
    artist = new Artist(graphics);
    remote = new RemoteGraphics(sketchpad_id);
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
      mousedown: mousedown,
      mouseup: mouseup
    });

    $('#ink').ColorPicker({
      color: '#000000',
      flat: true,
      onChange: function (hsb, hex, rgb) {
        artist.setColor(hex);
      }
    });
  };
  image.src = location.pathname + "/sketch.png";
});
