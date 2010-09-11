sys = require('sys');
require.paths.push('./');
require('lib/mootools').apply(GLOBAL);
require('engine/engine');
var net = require('net');

var port = (process.argv[2]) || '8000';
var PORT = port.trim().toInt();

log_error = function(message) {
	sys.puts("ERROR: "+message);
}

GLOBAL.onerror = log_error;

var world = new World('discoworld');

var server = net.createServer(function (stream) {

	stream.setEncoding('utf8');

	var player = new Player();

	player.addEvent('output', function(message, style) {
		if (!stream.writable) return;
		stream.write(message.style(style)+"\r\n");
	});

	player.addEvent('quit', function() {
		stream.end();
	});

	player.ip    = stream.remoteAddress;
	player.world = world;

	player.prompt(Prompts.login, "Please enter your name.");

    stream.on('data', function (data) {
		player.onInput(data);
	});

	stream.on('end', function () {
		player.send("Goodbye.");
		stream.end();
	});

});  

server.listen(PORT);
sys.puts("Now listening on "+PORT);
