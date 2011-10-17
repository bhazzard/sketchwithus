define(function() {
  var TWO_PI = 2 * Math.PI;
  
  function Graphics(context) {
    this.context = context;
  };

  Graphics.prototype.circle = function(center, radius, color) {
    var context = this.context;
    context.fillStyle = color || '#000000';
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, TWO_PI, false);
    context.fill();
    context.closePath();
  };
  
  return Graphics;
});
