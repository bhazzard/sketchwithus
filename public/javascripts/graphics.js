define(function() {
  var TWO_PI = 2 * Math.PI;
  
  function Graphics(context) {
    this.context = context;
    this.color = '#000000';
  };
  
  Graphics.prototype.setColor = function(hex) {
    this.color = hex || this.color;
    if (this.color.indexOf('#') !== 0) {
      this.color = '#' + this.color;
    }
  };

  Graphics.prototype.circle = function(x, y, radius) {
    var context = this.context;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(x, y, radius, 0, TWO_PI, false);
    context.fill();
    context.closePath();
  };
  
  return Graphics;
});
