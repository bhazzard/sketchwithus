/**
 * Module dependencies.
 */
var express = require('express'),
    app = module.exports = express.createServer(),
    sketchpad = require('./lib/sketchpad/app'),
    image = require('./lib/image/app'),
    argv = require('optimist').argv;
    
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'SketchWith.Us'
  });
});

if (argv.image) {
  image.run(app);
} else {
  sketchpad.run(app);
}

app.listen(argv.port || 8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
