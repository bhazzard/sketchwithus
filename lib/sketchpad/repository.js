var Sketchpad = require('./sketchpad').Sketchpad;

function Repository(emitters) {
  this._sketchpads = {};
  this._emitters = emitters; 
}

Repository.prototype.get_or_create = function(id) {
  var sketchpads = this._sketchpads,
    emitters = this._emitters;
  
  if (!sketchpads[id]) {
    sketchpads[id] = new Sketchpad(id);
    emitters.get_or_create('sketchpad').emit('create', id);
  }

  return sketchpads[id];
};

module.exports.Repository = Repository;
