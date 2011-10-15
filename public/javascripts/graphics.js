define(function() {
  var TWO_PI = 2 * Math.PI;
  
  function Graphics(context) {
    this.context = context;
    this._fill = '#000000';
  };
  
  Graphics.prototype.setFill = function(hex) {
    this._fill = hex || this._fill;
    if (this._fill.indexOf('#') !== 0) {
      this._fill = '#' + this._fill;
    }
  };

  Graphics.prototype.circle = function(x, y, radius) {
    var context = this.context;
    context.fillStyle = this._fill;
    context.beginPath();
    context.arc(x, y, radius, 0, TWO_PI, false);
    context.fill();
    context.closePath();
  };
  
  return Graphics;
});
