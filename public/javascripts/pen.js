define(['line'], function(Line) {
  function Pen(graphics) {
    this._graphics = graphics;
    this._width = 5;
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

  Pen.prototype.stroke = function(x, y) {
    if (this._down) {
      var graphics = this._graphics,
        point = { x: x, y: y },
        line = new Line(point, this._last),
        points = line.interpolate(),
        radius = this._width / 2,
        len = points.length,
        i;
      
      for (i = 0; i < len; i++) {
        graphics.circle(points[i].x, points[i].y, radius);
      }
      
      this._last = point;
    }
  };
  
  return Pen;
});
