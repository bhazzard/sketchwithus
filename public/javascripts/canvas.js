require(['artist', 'graphics'], function(Artist, Graphics) {
	var canvas = document.getElementById('sketch'),
		socket = io.connect('http://localhost'),
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		context,
		graphics,
		artist;
	
	if (canvas.getContext) {
		context = canvas.getContext('2d');
		graphics = new Graphics(context);
		artist = new Artist(graphics);
	}
	
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
});
