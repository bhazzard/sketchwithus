define(function() {
	var TWO_PI = 2 * Math.PI;
	
	function Graphics(context) {
		this.context = context;
	};
	
	Graphics.prototype.circle = function(x, y, radius) {
		var context = this.context;
		context.beginPath();
		context.arc(x, y, radius, 0, TWO_PI, false);
		context.fill();
		context.closePath();
	};
	
	return Graphics;
});
