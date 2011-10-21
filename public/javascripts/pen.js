define(function() {
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
        point = [x, y];
      
      graphics.line(point, this._last, this._width, this._color);
      
      this._last = point;
    }
  };
  
  return Pen;
});
