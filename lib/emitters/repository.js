var EventEmitter = require('events').EventEmitter;

function Repository() {
  this._emitters = {};
}

Repository.prototype.get_or_create = function(id) {
  var emitters = this._emitters;

  if (!emitters[id]) {
    emitters[id] = new EventEmitter();
  }

  return emitters[id];
};

module.exports.Repository = Repository;
