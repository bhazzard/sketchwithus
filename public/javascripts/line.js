define(function() {
  function interpolateX(x, start, end) {
    return Math.round(start[1] + (x - start[0]) * ((end[1] - start[1])/(end[0] - start[0])));
  };
  
  function interpolateY(y, start, end) {
    return Math.round(((end[0] - start[0]) * (y - start[1]))/(end[1] - start[1]) + start[0]);
  };

  function Line(start, end) {
    this.start = start || [0, 0];
    this.end = end || this.start;
  };

  Line.prototype.interpolate = function() {
    var start = this.start,
      end = this.end,
      xDelta = Math.abs(end[0] - start[0]),
      yDelta = Math.abs(end[1] - start[1]),
      xSign = Math.round(xDelta/(end[0] - start[0])),
      ySign = Math.round(yDelta/(end[1] - start[1])),
      points = [start],
      x, y;
    
    if (xDelta > 0 || yDelta > 0) {
      if (xDelta > yDelta) {
        for (x = start[0] + xSign; x !== end[0]; x += xSign) {
          points.push([x, interpolateX(x, start, end)]);
        }
      } else if (yDelta >= xDelta) {
        for (y = start[1] + ySign; y !== end[1]; y += ySign) {
          points.push([interpolateY(y, start, end), y]);
        }
      }
      points.push(end);
    }
    
    return points;
  };
  
  return Line;
});
