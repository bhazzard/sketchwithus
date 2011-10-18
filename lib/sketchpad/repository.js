var Sketchpad = require('./sketchpad').Sketchpad,
  EventEmitter = require('events').EventEmitter;

function Repository() {
  this._sketchpads = {};
}

Repository.prototype = new EventEmitter();

Repository.prototype.get_or_create = function(id) {
  var sketchpads = this._sketchpads;
  
  if (!sketchpads[id]) {
    sketchpads[id] = new Sketchpad(id);
    this.emit('create', sketchpads[id]);
  }

  return sketchpads[id];
};

module.exports.Repository = Repository;
