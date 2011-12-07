define(function() {
  var width = {
    small: 5,
    medium: 15,
    large: 25
  };

  function Toolbox(artist) {
    this.artist = artist;
    this._create();
    this._init();
  };
 
  Toolbox.prototype._create = function() {
    this._colorstrip = $('<div />').addClass('colorstrip').appendTo('#content');
    this._toolbox = $('<div />').addClass('toolbox').appendTo('#content');
  };

  Toolbox.prototype._init = function() {
    var self = this;

    this._toolbox.html(_.template($('#toolbox-template').html()));

    this._toolbox.delegate('.pen', 'click', function(){
      self.artist.setColor(self._color || "#000000");
    });

    this._toolbox.delegate('.eraser', 'click', function(){
      self.artist.setColor("#FFFFFF");
    });

    this._toolbox.delegate('.width', 'click', function() {
      self.artist.setWidth(width[$(this).text().toLowerCase()]);
    });

    this._colorstrip.colorstrip(function(hex) {
      self.artist.setColor(hex);
      self._color = hex;
      $('.color', self._toolbox).css('background-color', hex);
    });
  };
 
  return Toolbox;
});
