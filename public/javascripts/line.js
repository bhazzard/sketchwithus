define(function() {
	function interpolateX(x, start, end) {
		return Math.round(start.y + (x - start.x) * ((end.y - start.y)/(end.x - start.x)));
	};
	
	function interpolateY(y, start, end) {
		return Math.round(((end.x - start.x) * (y - start.y))/(end.y - start.y) + start.x);
	};

	function Line(start, end) {
		this.start = start || { x: 0, y: 0 };
		this.end = end || this.start;
	};

	Line.prototype.interpolate = function() {
		var start = this.start,
			end = this.end,
			xDelta = Math.abs(end.x - start.x),
			yDelta = Math.abs(end.y - start.y),
			xSign = Math.round(xDelta/(end.x - start.x)),
			ySign = Math.round(yDelta/(end.y - start.y)),
			points = [start],
			x, y;
		
		if (xDelta > 0 || yDelta > 0) {
			if (xDelta > yDelta) {
				for (x = start.x + xSign; x !== end.x; x += xSign) {
					points.push({ x: x, y: interpolateX(x, start, end) });
				}
			} else if (yDelta >= xDelta) {
				for (y = start.y + ySign; y !== end.y; y += ySign) {
					points.push({ x: interpolateY(y, start, end), y: y });
				}
			}
			points.push(end);
		}
		
		return points;
	};
	
	return Line;
});
