var EventEmitter = require('events').EventEmitter,
  Sketchpad = require('./sketchpad').Sketchpad;

function Repository() {
  this.sketchpads = {};
}

Repository.prototype = new EventEmitter();

Repository.prototype.get_or_create = function(id) {
  var sketchpads = this.sketchpads;
  
  if (!sketchpads[id]) {
    sketchpads[id] = new Sketchpad(id);
    this.emit('create', id);
  }

  return sketchpads[id];
};

module.exports.Repository = Repository;
