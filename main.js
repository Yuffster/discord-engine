// This is now out of date, put changes in the main server engine at the front. 
sys = require('sys');
require.paths.push('./');
require('lib/mootools').apply(GLOBAL);
require('engine/engine');
var net = require('net');

var server = net.createServer(function (stream) {

    stream.on('connect', function () {
		stream.write("What is your name?\r\n");
		sys.puts("User connected ("+stream.remoteAddress+")");
	});

	var closure = null;
	stream.on('data', function (data) {
		if (!closure) closure = handlePlayer(new String(data).trim().split(' ')[0], stream);
		if (!closure) stream.write("Please try a different name: ");
	}); 

	stream.on('end', function () {
		stream.write('goodbye\r\n');
		stream.end();
	});

});

log_error = function(message) {
	sys.puts("ERROR: "+message);
}

GLOBAL.onerror = log_error;

world = new World('discoworld');

handlePlayer = function(playerName, stream) {
	
	if (playerName.match(/\W|\d/)) {
		stream.write("Letters only, please.");
	}

	if (world.getPlayer(playerName)) {
		stream.write("Sorry, that name is already taken.");
		return false;
	}

	var player = new Player(playerName);

	player.addEvent('output', function(message, style) {
		if (Styles[style]) {
			var classes = (Styles[style]);
			if (!classes.each) classes = [classes];
			var codes = '';
			classes.each(function(color) {
				codes += ANSI.get(color);
			});
			message = codes+message+ANSI.get('reset');
		}
		stream.write(message+"\r\n");
	});

	stream.on('data', function(data) {
		try {
			player.onInput(new String(data).trim());
		} catch(e) {
			log_error(e);
		}
	});

	try {
		if (!player.enterWorld(world)) return false;
		player.send("Hi there, "+player.get('name')+"!");
		return true;
	} catch (e) {
		log_error(e);
	}

};

server.listen(8000);
