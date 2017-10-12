// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var path = require('path');
var helper = require(path.resolve(__dirname, './helper'));
var con = require(path.resolve(__dirname, './connection'));
var constants = require(path.resolve(__dirname, './constants'));
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
var connection = null;
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    con.init(constants.SECRET, request.accept(null, request.origin));
    var textToSend = {
        type: 'text',
        data: ''
    }
    connection = con.get();
    connection.send(JSON.stringify(textToSend));

    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    connection.on('message', function(message) {
        console.log(message);
        if (message.type === 'utf8') { // accept only text
            connection.send(JSON.stringify(helper.samples[1]));
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    });

});
