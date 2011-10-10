define(['pen'], function(Pen) {
	function Artist(graphics) {
		this.pen = new Pen(graphics);
	};
	
	return Artist;
});
