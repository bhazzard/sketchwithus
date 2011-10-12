define(function() {
	var TWO_PI = 2 * Math.PI;
	
	function Graphics(context) {
		this.context = context;
		this._fill = '#000000';
		this._stroke = '#000000';
	};
	
	Graphics.prototype.setFill = function(hex) {
		this._fill = hex || this._fill;
	};
	
	Graphics.prototype.setStroke = function(hex) {
		this._stroke = hex || this._stroke;
	};


	Graphics.prototype.circle = function(x, y, radius) {
		var context = this.context;
		context.fillStyle = this._fill;
		context.strokeStyle = this._stroke;
		context.beginPath();
		context.arc(x, y, radius, 0, TWO_PI, false);
		context.fill();
		context.closePath();
	};
	
	return Graphics;
});
