var EventEmitter = require('events').EventEmitter,
  _ = require('underscore');

function Sketchpad(id) {
  this.id = id;
  this.artists = {};
}

Sketchpad.prototype = new EventEmitter();

Sketchpad.prototype.draw = function(artist_id, command) {
  this.emit('draw', artist_id, command);
};

Sketchpad.prototype.join = function(artist_id) {
  this.artists[artist_id] = {id: artist_id};
  this.emit('join', _.keys(this.artists));
};

Sketchpad.prototype.leave = function(artist_id) {
  delete this.artists[artist_id];
  this.emit('leave', artist_id);
};

Sketchpad.prototype.login = function(artist_id, profile) {
  profile.artist_id = artist_id;
  this.artists[artist_id].profile = profile;
  this.emit('login', profile);
};

Sketchpad.prototype.logout = function(artist_id) {
  delete this.artists[artist_id].profile;
  this.emit('logout');
};

Sketchpad.prototype.logged_in = function() {
  var artists = _.values(this.artists);
  artists = _.select(artists, function (artist) {
    return artist.profile !== undefined;
  });
  return _.map(artists, function(artist) {
    return artist.profile;
  });
};

module.exports.Sketchpad = Sketchpad;
