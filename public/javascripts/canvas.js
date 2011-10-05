(function() {
	var canvas = document.getElementById('sketch'),
		penDown = false,
		penWidth = 5,
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		context;
	
	if (canvas.getContext) {
		context = canvas.getContext('2d');
	}
	
	function mouseMove(event) {
		var x = event.pageX,
			y = event.pageY;
		
		if (penDown) {
			context.lineTo(x - offsetX, y - offsetY);
			context.lineWidth = penWidth;
			context.lineCap = 'round';
			context.stroke();
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
	
	function mouseDown(event) {
		if (!penDown) {
			penDown = true;
			mouseEnter(event);
		}
	};
	
	function mouseOut() {
		context.closePath();
	};
	
	function mouseUp() {
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
})();
