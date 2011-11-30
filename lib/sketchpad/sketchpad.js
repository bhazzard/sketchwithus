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

Sketchpad.prototype.leave = function(artist_id) {
  delete this.artists[artist_id];
  this.emit('leave', artist_id);
};

Sketchpad.prototype.login = function(artist_id, profile) {
  var artist = {
    id: artist_id,
    profile: profile
  };

  this.artists[artist_id] = artist; 
  this.emit('login', [artist]);

  return artist;
};

Sketchpad.prototype.logout = function(artist_id) {
  delete this.artists[artist_id].profile;
  this.emit('logout');
};

Sketchpad.prototype.logged_in = function() {
  return _.values(this.artists);
};

module.exports.Sketchpad = Sketchpad;
