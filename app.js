/**
 * Module dependencies.
 */
var express = require('express'),
    app = module.exports = express.createServer(),
    argv = require('optimist').argv,
    SketchpadRepository = require('./lib/sketchpad/repository').Repository,
    EmitterRepository = require('./lib/emitters/repository').Repository,
    SketchpadService = require('./lib/sketchpad/module').Service,
    ChatDirectoryService = require('./lib/chat/directory').DirectoryService,
    ChatRoomService = require('./lib/chat/room').RoomService,
    ImageService = require('./lib/image/module').Service;
    
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

(function() {
  var emitters = new EmitterRepository();
  var sketchpads = new SketchpadRepository(emitters);

  if (argv.sketchpad) {
    new SketchpadService(sketchpads, emitters).run(app);
  }

  if (argv.image) {
    new ImageService(sketchpads).run(app);
  }

  if (argv.chat) {
    new ChatRoomService().run(app);
  }
})();

app.listen(argv.port || 8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
