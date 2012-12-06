var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8001);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
    /*
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
    */
});

var tools = {};

tools.connection = function(socket) {

}

var clients = {};

var tools = io
    .of('/tools')
    .on('connection', function(socket) {
        clients[socket.id] = socket;

        socket.on('join', function(data) {
            console.info('A new user joined');
        });

        socket.on('create', function(data) {
            console.log('created a tool');
            for (id in clients) {
                clients[id].emit('create', data);
            }
        });

        socket.on('remove', function(data) {
            console.log('removed a tool');
            for (id in clients) {
                clients[id].emit('remove', data);
            }
        });
    });
