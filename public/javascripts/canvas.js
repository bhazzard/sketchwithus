function BroadcastingProxy(message, socket, target) {
	function wrap(methodName, method) {
		return function() {
			var args = $.makeArray(arguments);
			socket.emit(message, {
				method: methodName,
				arguments: args
			});
			return method.apply(target, args);
		};
	};
	var key, value;
	for (key in target) {
		value = target[key]; 
		if ($.isFunction(value)) {
			this[key] = wrap(key, value);
		}
	}
};

require(['artist', 'graphics'], function(Artist, Graphics) {
	var canvas = document.getElementById('sketch'),
		socket = io.connect('http://localhost'),
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
		artist = new BroadcastingProxy('draw', socket, artist);
	}
	
	socket.emit('join');
	
	socket.on('join', function(ids) {
		for (var i = 0; i < ids.length; i++) {
			artists[ids[i]] = new Artist(graphics);
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
});
