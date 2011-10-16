function Sketchpad(id) {
  this.id = id;
  this.artists = {};
}

Sketchpad.prototype.add_artist = function(artist_id) {
  this.artists[artist_id] = {id: artist_id};
};

Sketchpad.prototype.remove_artist = function(artist_id) {
  delete this.artists[artist_id];
}

module.exports.Sketchpad = Sketchpad;
