/**
 * Main server script for Disco mudlib.  Most of the code is still messy from
 * Node Knockout.
 *
 * This file is in charge of all the nitty gritty bits of loading all the 
 * JavaScript files required to get a World instance running, then opening a
 * socket and redirecting input to a Player object within the world.
 *
 * Most of the file loading logistics lives in the World class, which handles
 * determining where to pull files from based on configuration options and 
 * set rules.
 *
 * To quickly run a test server, you can use config.example.json, which will
 * load the example world.
 *
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt
 */

require('./engine');

/**
 * Parse the config file to figure out the port and world directory 
 * location.
 */
var config_file = process.argv[2];
if (!config_file) {
	sys.puts("Config file is required. See config.example.json for more info.");
	sys.puts("Usage: node ./server.js <config file>");
	process.exit();
}

try {
	config = fs.readFileSync(config_file);
} catch (err) {
	sys.puts(err);
	process.exit();
} 

CONFIG = {};
eval("CONFIG ="+config);

if (!CONFIG) {
	sys.puts("Could not decode config file.  Please ensure that the file is in "+
	         "valid JSON format.");
	process.exit();
}

log_error = function(err) {
	sys.puts('ERROR: '.color('red')+err);
	if (err.stack) { sys.puts("====>"+err.stack); }
}

var world = new World(CONFIG);

on_error = log_error;
process.on('uncaughtException', log_error);

var net = require('net');
var server = net.createServer(function (stream) {

	var enhanced = false;

	stream.setEncoding('utf8');

	var player = new Player();

	/* Error handling, notifies admins of errors. */
	stream.on('uncaughtException', function (message) {
		player.send("ERROR: ".color('red')+message);
	});

	player.addEvent('output', function(message, style) {
		if (!stream.writable) return;
		stream.write(message.style(style).wordwrap(80)+"\r\n");
	});

	player.addEvent('guiOutput', function(obj, handler) {
		if (!enhanced) { return false; }
		var data = {'data':obj, 'handler':handler};
		var json = JSON.encode(data);
		stream.write("<!-- \n"+json+"\n-->\n");
	});

	player.addEvent('quit', function() { stream.end(); });

	player.ip    = stream.remoteAddress;
	player.world = world;

	sys.puts(player.ip+" has connected.");

	player.prompt(Prompts.login, "Please enter your name.");

	stream.on('data', function(data) {
		if (data.trim()==">>> GUI_ON <<<") { enhanced = true; return;  }
		else if (data.trim().match(/^>>>(.*?)<<<$/)) { return; }
		player.onInput(data);
	});

	stream.on('end', function () {
		player.send("Goodbye.");
		stream.end();
	});

});  

server.listen(CONFIG.port);
sys.puts("Now listening on "+CONFIG.port);
