require(['rect'], function(Rect) {
	module('Rect');

	test('default', function() {
		var r = new Rect();
		
		equal(r.width(), 0, 'should have width 0');
		equal(r.height(), 0, 'should have height 0');
		ok(!r.isDirty(), 'should not be dirty');
	});
	
	test('new', function() {
		var r = new Rect({
			left: 10,
			top: 5,
			right: 15,
			bottom: 20
		});
		
		equal(r.width(), 5, 'should have width 5');
		equal(r.height(), 15, 'should have height 15');
		ok(r.isDirty(), 'should be dirty');
	});
	
	test('expand', function() {
		var r = new Rect({
			left: 100,
			top: 50,
			right: 150,
			bottom: 200
		});
		
		r.expand(20, 50);
		
		equal(r.left, 20, 'left');
		equal(r.top, 50, 'top');
		equal(r.right, 150, 'right');
		equal(r.bottom, 200, 'bottom');
		
		r.expand(200, 250);
		
		equal(r.left, 20, 'left');
		equal(r.top, 50, 'top');
		equal(r.right, 200, 'right');
		equal(r.bottom, 250, 'bottom');
	});
	
	test('intersect', function() {
		var r1 = new Rect({
			left: 100,
			top: 50,
			right: 150,
			bottom: 200
		});
		
		var r2 = new Rect({
			left: 125,
			top: 100,
			right: 200,
			bottom: 250
		});
		
		var i = r1.intersect(r2);
		
		equal(i.left, 125, 'left');
		equal(i.top, 100, 'top');
		equal(i.right, 150, 'right');
		equal(i.bottom, 200, 'bottom');
	});
});
