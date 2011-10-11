
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

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

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

//TODO: store somewhere better
var artists = [];

io.sockets.on('connection', function (socket) {
	var id = socket.id;
	
	socket.on('join', function (data) {
    socket.broadcast.emit('join', [id]);
    socket.emit('join', artists);
    artists.push(id);
  });
  socket.on('draw', function (data) {
    socket.broadcast.emit('draw', { id: id, invocation: data });
  });
  socket.on('disconnect', function () {
    socket.broadcast.emit('leave', id);
    
    var a = artists.indexOf(id);
    if (a >= 0) {
    	artists.splice(a, 1);
    }
  });
});
