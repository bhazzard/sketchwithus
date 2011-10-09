define(function() {
	function Rect(rect) {
		rect = rect || {};
		this.left = rect.left || 0;
		this.top = rect.top || 0;
		this.right = rect.right || rect.left || 0;
		this.bottom = rect.bottom || rect.top || 0;
	};

	Rect.prototype.isDirty = function() {
		return this.right > this.left && this.bottom > this.top;
	};

	Rect.prototype.width = function() {
		return Math.max(0, this.right - this.left);
	};

	Rect.prototype.height = function() {
		return Math.max(0, this.bottom - this.top);
	};

	Rect.prototype.expand = function(x, y, radius) {
		radius = Math.ceil(radius || 0);
		this.left = Math.min(x - radius, this.left);
		this.right = Math.max(x + radius, this.right);
		this.top = Math.min(y - radius, this.top);
		this.bottom = Math.max(y + radius, this.bottom);
	};

	Rect.prototype.intersect = function(rect) {
		return new Rect({
			left: Math.max(this.left, rect.left),
			top: Math.max(this.top, rect.top),
			right: Math.min(this.right, rect.right),
			bottom: Math.min(this.bottom, rect.bottom)
		});
	};
	
	return Rect;
});
