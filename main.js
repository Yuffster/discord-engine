sys = require('sys');
fs  = require('fs');
require.paths.push('./');
require('lib/mootools').apply(GLOBAL);
require('engine/engine');
var net = require('net');

var port = (process.argv[2]) || '8000';
var PORT = port.trim().toInt();

log_error = function(message) {
	sys.puts("ERROR: ".color('red')+message);
}
onerror = log_error;

var world = new World('discoworld');

var server = net.createServer(function (stream) {

	stream.setEncoding('utf8');

	stream.on('error', function(e) {
		log_error(e);
	});

	var player = new Player();

	player.addEvent('output', function(message, style) {
		if (!stream.writable) return;
		stream.write(message.style(style)+"\r\n");
	});

	player.addEvent('quit', function() { stream.end(); });

	player.ip    = stream.remoteAddress;
	player.world = world;

	sys.puts(player.ip+" has connected.");

	player.prompt(Prompts.login, "Please enter your name.");

	stream.on('data', player.onInput.bind(player));

	stream.on('end', function () {
		player.send("Goodbye.");
		stream.end();
	});

});  

server.listen(PORT);
sys.puts("Now listening on "+PORT);
