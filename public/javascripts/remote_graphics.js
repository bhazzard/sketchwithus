define(['artist', 'graphics'], function (Artist, Graphics) {
  function RemoteGraphics(sketchpad_id, emitter) {
    this._emitter = emitter;
    this._sketchpad_id = sketchpad_id;
  };

  RemoteGraphics.prototype.listen = function(context) {
    var emitter= this._emitter,
      artists = {};
    
    emitter.on('join', function(ids) {
      for (var i = 0; i < ids.length; i++) {
        artists[ids[i]] = new Artist(new Graphics(context));
      }
    });

    emitter.on('leave', function(id) {
      delete artists[id];
    });

    emitter.on('draw', function(data) {
      artists[data.id].execute(data.command);
    });
    
    this._emitter = emitter;
    return emitter;
  }

  return RemoteGraphics;
});
