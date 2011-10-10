require(['rect', 'artist', 'graphics'], function(Rect, Artist, Graphics) {
	var canvas = document.getElementById('sketch'),
		transport = document.getElementById('transport'),
		socket = io.connect('http://localhost'),
		image = new Image(),
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		rect = new Rect(),
		canvasRect = new Rect({
			left: 0,
			top: 0,
			right: $(canvas).width(),
			bottom: $(canvas).height()
		}),
		context,
		transportContext,
		graphics,
		artist;
	
	if (canvas.getContext && transport.getContext) {
		context = canvas.getContext('2d');
		transportContext = transport.getContext('2d');
		graphics = new Graphics(context);
		artist = new Artist(graphics);
	}
	
  socket.on('data', function (data) {
  	image.onload = function() {
			context.drawImage(this, data.x, data.y);
		};
		image.src = data.image;
  });
  
  function broadcastData() {
  	var intersection = rect.intersect(canvasRect);
  	if (intersection.isDirty()) {
			transport.width = intersection.width();
			transport.height = intersection.height();
			
			var imageData = context.getImageData(intersection.left, intersection.top, transport.width, transport.height);
			transportContext.putImageData(imageData, 0, 0);
			
			socket.emit('data', {
				x: intersection.left,
				y: intersection.top,
				image: transport.toDataURL()
			});
			
			rect = new Rect();
  	}
  };
	
	function mouseMove(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (artist.pen.down()) {
			artist.pen.stroke(x, y);
			rect.expand(x, y, artist.pen.width() / 2);
		}
	};
	
	function mouseEnter(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (artist.pen.down()) {
			artist.pen.stroke(x, y);
			rect.expand(x, y, artist.pen.width() / 2);
		}
	};
	
	function mouseDown(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (!artist.pen.down()) {
			artist.pen.down(true);
			rect = new Rect({ left: x, top: y });
			mouseEnter(event);
		}
	};
	
	function mouseUp(event) {
		if (artist.pen.down()) {
			artist.pen.down(false);
		}
	};
	
	$(canvas).bind({
		mousedown: mouseDown,
		mouseenter: mouseEnter,
		mousemove: mouseMove,
		mouseup: mouseUp
	});
	
	$(document).bind({
		mousedown: mouseDown,
		mouseup: mouseUp
	});
	
	setInterval(broadcastData, 100);
});
