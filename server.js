var static = require('node-static');

//
// Create a node-static server instance to serve the '.' folder
//
var file = new(static.Server)('.');

console.log('Running server at http://localhost:8000');
var server = require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    //
    // Serve files!
    //
    file.serve(request, response);
  });
}).listen(8000);
