define(['artist', 'toolbox', 'graphics', 'proxy', 'remote_graphics'], function(Artist, Toolbox, Graphics, Proxy, RemoteGraphics) {
  function Canvas(socket, sketchpad) {
    this._id = sketchpad.id;
    this._socket = socket;

    var sketch = $('#sketch');
    this._sketch = sketch;
    this.calculateOffsets();
  
    var image = new Image();
    this._image = image;
    image.onload = $.proxy(this, '_init');
    image.src = sketchpad.image;
  };
 
  Canvas.prototype._init = function() {
    var sketch = this._sketch;
    var socket = this._socket;
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', sketch.width());
    canvas.setAttribute('height', sketch.height());
    
    var context = canvas.getContext('2d');
    var graphics = new Graphics(context);
    graphics = new Proxy(graphics, function(invocation) {
      var packet = invocation.arguments.concat();
      packet.unshift(invocation.method);
      socket.emit('draw', packet);
      invocation.proceed();
    });
    var artist = new Artist(graphics);
    remote = new RemoteGraphics(this._id, socket);
    socket = remote.listen(context);
    
    context.drawImage(this._image, 0, 0);
    
    sketch.html(canvas);
    
    socket.emit('join');
    
    this._canvas = canvas;
    this._context = context;
    this._graphics = graphics;
    this._artist = artist;

    $(canvas).bind({
      mousedown: $.proxy(this, 'mousedown'),
      mouseenter: $.proxy(this, 'mouseenter'),
      mousemove: $.proxy(this, 'mousemove'),
      mouseup: $.proxy(this, 'mouseup'),
      mouseout: $.proxy(this, 'mouseout')
    });

    if (canvas.addEventListener) {
      canvas.addEventListener('touchstart', $.proxy(this, 'touchevent'), false);
      canvas.addEventListener('touchmove', $.proxy(this, 'touchevent'), false);
      canvas.addEventListener('touchend', $.proxy(this, 'touchevent'), false);
      canvas.addEventListener('touchcancel', $.proxy(this, 'touchevent'), false);
    }
    
    $(document).bind({
      mouseup: $.proxy(this, 'mouseup')
    });

    canvas.onselectstart = function() { return false; };
    
    this._toolbox = new Toolbox(artist);
  };

  Canvas.prototype.calculateOffsets = function() {
    var sketch = this._sketch;
    this._offsetX = sketch.offset().left;
    this._offsetY = sketch.offset().top;
  };
 
  Canvas.prototype.mousemove = function(event) {
    var x = event.pageX - this._offsetX,
      y = event.pageY - this._offsetY;
    
    this._artist.mousemove(x, y);
  };
  
  Canvas.prototype.mousedown = function(event) {
    var x = event.pageX - this._offsetX,
      y = event.pageY - this._offsetY;
    
    this._artist.mousedown(x, y);
  };
  
  Canvas.prototype.mouseup = function(event) {
    var x = event.pageX - this._offsetX,
      y = event.pageY - this._offsetY;
    
    this._artist.mouseup(x, y);
  };
  
  Canvas.prototype.mouseout = function(event) {
    var x = event.pageX - this._offsetX,
      y = event.pageY - this._offsetY;
    
    this._artist.mouseout(x, y);
  };
  
  Canvas.prototype.mouseenter = function(event) {
    var x = event.pageX - this._offsetX,
      y = event.pageY - this._offsetY;
    
    this._artist.mouseenter(x, y);
  };

  Canvas.prototype.touchevent = function(event) {
    var touches = event.changedTouches,
      first = touches[0],
      eventMap = {
        touchstart: 'mousedown',
        touchmove: 'mousemove',
        touchend: 'mouseup'
      },
      type = eventMap[event.type];

    if (!type) {
      return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
      first.screenX, first.screenY,
      first.clientX, first.clientY, false,
      false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);

    event.preventDefault();
  };

  return Canvas;
});
