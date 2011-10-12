require(['artist', 'graphics', 'proxy'], function(Artist, Graphics, Proxy) {
	var sketchpad_id= $('#sketchpad_id').attr('val');

	var canvas = document.getElementById('sketch'),
		socket = io.connect('http://localhost/' + sketchpad_id),
		offsetX = $(canvas).offset().left,
		offsetY = $(canvas).offset().top,
		context,
		graphics,
		artist,
		artists = {};
	
	if (canvas.getContext) {
		context = canvas.getContext('2d');
		graphics = new Graphics(context);
		artist = new Artist(graphics);
		artist = new Proxy(artist, function(invocation) {
			socket.emit('draw', {
				method: invocation.method,
				arguments: invocation.arguments
			});
			invocation.proceed();
		});
	}
	
	context.drawImage(document.getElementById('sketchState'), 0, 0);
	
	socket.emit('join');
	
	socket.on('join', function(ids) {
		for (var i = 0; i < ids.length; i++) {
			artists[ids[i]] = new Artist(new Graphics(context));
		}
	});
	
	socket.on('leave', function(id) {
		delete artists[id];
	});
	
	socket.on('draw', function(data) {
		var a = artists[data.id],
			method = a[data.invocation.method];
		method.apply(a, data.invocation.arguments);
	});
	
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

	$(function() {
		$('#ink').ColorPicker({
			color: '#000000',
			flat: true,
			onChange: function (hsb, hex, rgb) {
				artist.setColor(hex);
			}
		});
	});
});
