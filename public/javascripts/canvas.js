require(['rect'], function(Rect) {
	var canvas = document.getElementById('sketch'),
		transport = document.getElementById('transport'),
		socket = io.connect('http://localhost'),
		image = new Image(),
		penDown = false,
		penWidth = 5,
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
  
  function stroke(x, y) {
  	context.beginPath();
  	context.arc(x, y, penWidth/2, 0, 2 * Math.PI, false);
  	context.fill();
  	context.closePath();
  };
	
	function mouseMove(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (penDown) {
			stroke(x, y);
			rect.expand(x, y, penWidth / 2);
		}
	};
	
	function mouseEnter(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (penDown) {
			stroke(x, y);
			rect.expand(x, y, penWidth / 2);
		}
	};
	
	function mouseDown(event) {
		var x = event.pageX - offsetX,
			y = event.pageY - offsetY;
		
		if (!penDown) {
			penDown = true;
			rect = new Rect({ left: x, top: y });
			mouseEnter(event);
		}
	};
	
	function mouseOut() {
		context.closePath();
	};
	
	function mouseUp(event) {
		if (penDown) {
			penDown = false;
			mouseOut();
		}
	};
	
	$(canvas).bind({
		mousedown: mouseDown,
		mouseenter: mouseEnter,
		mousemove: mouseMove,
		mouseup: mouseUp,
		mouseout: mouseOut
	});
	
	$(document).bind({
		mousedown: mouseDown,
		mouseup: mouseUp
	});
	
	setInterval(broadcastData, 100);
});
