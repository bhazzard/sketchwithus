define(['pen'], function(Pen) {
	function Artist(graphics) {
		this._pen = new Pen(graphics);
	};
	
	Artist.prototype.mousedown = function(x, y) {
		var pen = this._pen;
		if (!pen.down()) {
			pen.down(true);
			pen.stroke(x, y);
		}
	};
	
	Artist.prototype.mouseup = function(x, y) {
		var pen = this._pen;
		this._out = false;
		if (pen.down()) {
			pen.down(false);
		}
	};
	
	Artist.prototype.mousemove = function(x, y) {
		var pen = this._pen;
		if (pen.down()) {
			pen.stroke(x, y);
		}
	};
	
	Artist.prototype.mouseout = function(x, y) {
		var pen = this._pen;
		this._out = pen.down();
		pen.down(false);
	};
	
	Artist.prototype.mouseenter = function(x, y) {
		if (this._out) {
			this.mousedown(x, y);
		}
	};
	
	return Artist;
});
