define(['line'], function(Line) {
  function Pen(graphics) {
    this._graphics = graphics;
    this._width = 5;
    this._down = false;
  };
  
  Pen.prototype.setColor = function(hex) {
    this._color = hex || this._color;
    if (this._color.indexOf('#') !== 0) {
      this._color = '#' + this._color;
    }
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
        color = this._color,
        point = [x, y],
        line = new Line(point, this._last),
        points = line.interpolate(),
        radius = this._width / 2,
        len = points.length,
        i;
      
      for (i = 0; i < len; i++) {
        graphics.circle(points[i], radius, color);
      }
      
      this._last = point;
    }
  };
  
  return Pen;
});
