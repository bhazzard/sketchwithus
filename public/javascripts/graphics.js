define(['line'], function(Line) {
  var TWO_PI = 2 * Math.PI;
  
  function Graphics(context) {
    this.context = context;
  };
  
  Graphics.prototype.line = function(start, end, width, color) {
    var line = new Line(start, end),
      points = line.interpolate(),
      radius = width / 2,
      len = points.length,
      i;
    
    for (i = 0; i < len; i++) {
      this.circle(points[i], radius, color);
    }
  };

  Graphics.prototype.circle = function(center, radius, color) {
    var context = this.context;
    context.fillStyle = color || '#000000';
    context.beginPath();
    context.arc(center[0], center[1], radius, 0, TWO_PI, false);
    context.fill();
    context.closePath();
  };
  
  return Graphics;
});
