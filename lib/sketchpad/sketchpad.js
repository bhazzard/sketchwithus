var EventEmitter = require('events').EventEmitter,
  _ = require('underscore');

function Sketchpad(id) {
  this.id = id;
  this.artists = {};
  this.loggedIn = {};
}

Sketchpad.prototype = new EventEmitter();

Sketchpad.prototype.draw = function(artist_id, command) {
  this.emit('draw', { id: artist_id, command: command });
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
  this.loggedIn[artist_id] = profile;
  this.emit('login', profile);
};

module.exports.Sketchpad = Sketchpad;
