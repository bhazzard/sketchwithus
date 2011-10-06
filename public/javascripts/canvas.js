(function() {
	var canvas = document.getElementById('sketch'),
		socket = io.connect('http://localhost'),
		penDown = false,
		penWidth = 5,
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		context;
	
	if (canvas.getContext) {
		context = canvas.getContext('2d');
	}
	
  socket.on('mousedown', function (data) {
    mouseDown(data, true);
  });
  
  socket.on('mousemove', function (data) {
    mouseMove(data, true);
  });
  
  socket.on('mouseup', function (data) {
    mouseUp(data, true);
  });
	
	function mouseMove(event, silent) {
		var x = event.pageX,
			y = event.pageY;
		
		if (penDown) {
			context.lineTo(x - offsetX, y - offsetY);
			context.lineWidth = penWidth;
			context.lineCap = 'round';
			context.stroke();
		}
		
		if (!silent) {
			socket.emit('mousemove', { pageX: event.pageX, pageY: event.pageY });
		}
	};
	
	function mouseEnter(event) {
		var x = event.pageX,
			y = event.pageY;
		
		if (penDown) {
			context.beginPath();
			context.moveTo(x - offsetX, y - offsetY);
		}
	};
	
	function mouseDown(event, silent) {
		if (!penDown) {
			penDown = true;
			mouseEnter(event);
		}
		
		if (!silent) {
			socket.emit('mousedown', { pageX: event.pageX, pageY: event.pageY });
		}
	};
	
	function mouseOut() {
		context.closePath();
	};
	
	function mouseUp(event, silent) {
		if (penDown) {
			penDown = false;
			mouseOut();
		}
		
		if (!silent) {
			socket.emit('mouseup');
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
})();
