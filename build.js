var requirejs = require('requirejs')

var config = {
  appDir: "public/",
  baseUrl: "javascripts",
  dir: "public_build",
  modules: [
    {
      name: "main"
    }
  ]
};

requirejs.optimize(config, function() {});
