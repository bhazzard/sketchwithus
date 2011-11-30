define(['artist', 'graphics'], function (Artist, Graphics) {
  function RemoteGraphics(sketchpad_id, emitter) {
    this._emitter = emitter;
    this._sketchpad_id = sketchpad_id;
    this.artists = {};
  };

  RemoteGraphics.prototype.listen = function(context) {
    var emitter= this._emitter,
      artists = this.artists;
   
    //a is 'Artists' - blame hazzard 
    emitter.on('login', function(a) {
      for (var i = 0; i < a.length; i++) {
        artists[a[i].id] = new Artist(new Graphics(context));
      }
    });

    emitter.on('leave', function(id) {
      delete artists[id];
    });

    emitter.on('draw', function(id, packet) {
      artists[id].execute(packet);
    });
    
    this._emitter = emitter;
    return emitter;
  }

  return RemoteGraphics;
});
