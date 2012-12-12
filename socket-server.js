var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8001);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    /*
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
    */
    ;
});

var tools = {};

tools.connection = function(socket) {

}

var clients = {};

var publish = function(e, data, sender_socket) {
    if (!sender_socket) {
        sender_socket = {id: 0};
    }

    for (id in clients) {
        if (id != sender_socket.id) {
           clients[id].emit(e, data);
        } else {
            console.log('>>>>>>>>> Found it');
        }
    }
}

var tools = io
    .of('/tools')
    .on('connection', function(socket) {
        clients[socket.id] = socket;

        socket.on('join', function(data) {
            console.info('A new user joined');
        });

        socket.on('create', function(data) {
            console.log('created a tool');
            publish('create', data, this);
            /*
            for (id in clients) {
                clients[id].emit('create', data);
            }
            */
        });

        socket.on('update', function(data) {
            console.log('updated a tool');
            publish('update', data, this);
        });

        socket.on('remove', function(data) {
            console.log('removed a tool');
            for (id in clients) {
                clients[id].emit('remove', data);
            }
        });
    });
