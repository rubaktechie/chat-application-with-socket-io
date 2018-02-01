var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8000;

var nsp = io.of('/private');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/');
});

nsp.on('connection', function(socket){
	socket.on('send-message', function(msg){
		nsp.emit('receive-message', msg);
	});
});

http.listen(port, function(){
	console.log('listening on *:' + port);
});