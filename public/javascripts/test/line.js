require(['line'], function(Line) {
  module('Line');

  test('default', function() {
    var line = new Line();
    deepEqual(line.start, [0, 0], 'start');
    deepEqual(line.end, [0, 0], 'end');
  });
  
  test('interpolate', function() {
    var line = new Line([1, 1]);
    deepEqual(line.interpolate(), [[1, 1]], 'point');
    
    line = new Line([1, 1], [3, 1]);
    deepEqual(line.interpolate(), [
      [1, 1],
      [2, 1],
      [3, 1]
    ], 'horizontal');
    
    line = new Line([1, 1], [1, 3]);
    deepEqual(line.interpolate(), [
      [1, 1],
      [1, 2],
      [1, 3]
    ], 'horizontal');
    
    line = new Line([1, 1], [5, 3]);
    deepEqual(line.interpolate(), [
      [1, 1],
      [2, 2],
      [3, 2],
      [4, 3],
      [5, 3]
    ], 'mostly horizontal');
    
    line = new Line([1, 1], [3, 5]);
    deepEqual(line.interpolate(), [
      [1, 1],
      [2, 2],
      [2, 3],
      [3, 4],
      [3, 5]
    ], 'mostly vertical');
    
    line = new Line([1, 1], [2, 2]);
    deepEqual(line.interpolate(), [
      [1, 1],
      [2, 2]
    ], 'consecutive');
    
    line = new Line([5, 3], [1, 1]);
    deepEqual(line.interpolate(), [
      [5, 3],
      [4, 3],
      [3, 2],
      [2, 2],
      [1, 1]
    ], 'reverse mostly horizontal');
    
    line = new Line([3, 5], [1, 1]);
    deepEqual(line.interpolate(), [
      [3, 5],
      [3, 4],
      [2, 3],
      [2, 2],
      [1, 1]
    ], 'reverse mostly vertical');
  });
});
