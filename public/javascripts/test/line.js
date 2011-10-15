require(['line'], function(Line) {
  module('Line');

  test('default', function() {
    var line = new Line();
    deepEqual(line.start, { x: 0, y: 0 }, 'start');
    deepEqual(line.end, { x: 0, y: 0 }, 'end');
  });
  
  test('interpolate', function() {
    var line = new Line({ x: 1, y: 1 });
    deepEqual(line.interpolate(), [{ x: 1, y: 1 }], 'point');
    
    line = new Line({ x: 1, y: 1 }, { x: 3, y: 1 });
    deepEqual(line.interpolate(), [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 }
    ], 'horizontal');
    
    line = new Line({ x: 1, y: 1 }, { x: 1, y: 3 });
    deepEqual(line.interpolate(), [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 }
    ], 'horizontal');
    
    line = new Line({ x: 1, y: 1 }, { x: 5, y: 3 });
    deepEqual(line.interpolate(), [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 3 },
      { x: 5, y: 3 }
    ], 'mostly horizontal');
    
    line = new Line({ x: 1, y: 1 }, { x: 3, y: 5 });
    deepEqual(line.interpolate(), [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 4 },
      { x: 3, y: 5 }
    ], 'mostly vertical');
    
    line = new Line({ x: 1, y: 1 }, { x: 2, y: 2 });
    deepEqual(line.interpolate(), [
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ], 'consecutive');
    
    line = new Line({ x: 5, y: 3 }, { x: 1, y: 1 });
    deepEqual(line.interpolate(), [
      { x: 5, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 1, y: 1 }
    ], 'reverse mostly horizontal');
    
    line = new Line({ x: 3, y: 5 }, { x: 1, y: 1 });
    deepEqual(line.interpolate(), [
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 1, y: 1 }
    ], 'reverse mostly vertical');
  });
});
