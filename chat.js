var express = require('express'),
    app = module.exports = express.createServer(),
    io = require('socket.io').listen(app);
    
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

io.sockets.on('connection', function(socket) {
  socket.on('join', function(req, res) {
    req.profile = req.profile || {};

    var context = {
      room: req.room,
      profile: {
        id: req.profile.id || socket.id,
        nickname: req.profile.nicname || 'Guest' + socket.id.slice(12),
        image: req.profile.image || 'http://sketchwith.us:8000/images/anonymousUser.jpg'
      }
    };

    socket.join(context.room);
    socket.set('context', context);

    socket.broadcast.to(context.room).emit('system message', context.profile.nickname + ' just arrived.');
    io.sockets.in(context.room).emit('profile update', context.profile);
    res(context);
  });

  socket.on('chat', function(message) {
    socket.get('context', function(err, context) {
      io.sockets.in(context.room).emit('chat', { profile: context.profile, text: message });
    });
  });
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
