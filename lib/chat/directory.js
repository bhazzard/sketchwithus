function DirectoryService() {
}


DirectoryService.prototype.run = function(app) {
  var rooms = [];

  app.get('/rooms', function(req, res) {
    res.send({
      links: {
        'self': {
          title: "List Chat Rooms",
          href: "/rooms"
        },
        'next': {
          title: "Next Page of Rooms",
          href: "/rooms?offset=" + req.offset + "&limit=" + req.limit
        }
      },
      rooms: rooms 
    }, 200);
  });
};

module.exports.DirectoryService = DirectoryService;
