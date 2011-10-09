define(function() {
	var two_pi = 2 * Math.PI;

	function Pen(width) {
		this.width = width;
		this.down = false;
	};

	Pen.prototype.stroke = function(x, y, context) {
		if (this.down) {
			context.beginPath();
			context.arc(x, y, this.width/2, 0, two_pi, false);
			context.fill();
			context.closePath();
  	}
	};
	
	return Pen;
});
