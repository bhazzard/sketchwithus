define(['line'], function(Line) {
	var TWO_PI = 2 * Math.PI;

	function Pen(width) {
		this._width = width;
		this._down = false;
	};
	
	Pen.prototype.width = function(width) {
		if (width === undefined) {
			return this._width;
		} else {
			this._width = width;
		}
	};
	
	Pen.prototype.down = function(down) {
		if (down === undefined) {
			return this._down;
		} else {
			this._down = down;
			
			if (down === false) {
				delete this._last;
			}
		}
	};

	Pen.prototype.stroke = function(x, y, context) {
		if (this._down) {
			var point = { x: x, y: y },
				line = new Line(point, this._last),
				points = line.interpolate(),
				len = points.length,
				i;
			
			for (i = 0; i < len; i++) {
				context.beginPath();
				context.arc(points[i].x, points[i].y, this._width/2, 0, TWO_PI, false);
				context.fill();
				context.closePath();
			}
			
			this._last = point;
  	}
	};
	
	return Pen;
});
