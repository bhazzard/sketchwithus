var EventEmitter = require('events').EventEmitter;

function Repository(emitterFactory) {
  this._emitters = {};
  this._emitterFactory = emitterFactory || function(id) {
    return new EventEmitter();
  };
}

Repository.prototype.get_or_create = function(id) {
  var emitters = this._emitters,
    emitterFactory = this._emitterFactory;

  if (!emitters[id]) {
    emitters[id] = emitterFactory(id);
  }

  return emitters[id];
};

module.exports.Repository = Repository;
