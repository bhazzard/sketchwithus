require(['rect', 'pen'], function(Rect, Pen) {
	var canvas = document.getElementById('sketch'),
		transport = document.getElementById('transport'),
		socket = io.connect('http://localhost'),
		image = new Image(),
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		pen = new Pen(5),
		rect = new Rect(),
		canvasRect = new Rect({
			left: 0,
			top: 0,
			right: $(canvas).width(),
			bottom: $(canvas).height()
		}),
		context,
		transportContext;
	
	if (canvas.getContext && transport.getContext) {
		context = canvas.getContext('2d');
		transportContext = transport.getContext('2d');
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
		
		if (pen.down) {
			pen.stroke(x, y, context);
			rect.expand(x, y, pen.width / 2);
		}
	};
	
	function mouseEnter(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (pen.down) {
			pen.stroke(x, y, context);
			rect.expand(x, y, pen.width / 2);
		}
	};
	
	function mouseDown(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (!pen.down) {
			pen.down = true;
			rect = new Rect({ left: x, top: y });
			mouseEnter(event);
		}
	};
	
	function mouseUp(event) {
		if (pen.down) {
			pen.down = false;
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
