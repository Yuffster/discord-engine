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
 * Note that the files within the core repository are not sufficient to run a
 * server out of the box.
 *
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt
 */

require.paths.push('./');
require.paths.push('../');

sys = require('sys');
fs  = require('fs');
require('lib/mootools').apply(GLOBAL);
require('engine');

/**
 * Parse the config file to figure out the port and world directory 
 * location.
 */
var config_file = process.argv[2];
if (!config_file) {
	sys.puts("Config file is required. See example.config.json for more info.");
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
	sys.puts("Could not decode config file.  Please esnure that the file is in "+
	         "valid JSON format.");
	process.exit();
}

var world = new World(CONFIG);

log_error = function(err) {
	sys.puts('ERROR: '.color('red')+err);
}

on_error = log_error;
process.on('uncaughException', log_error);

var net = require('net');
var server = net.createServer(function (stream) {

	stream.setEncoding('utf8');

	var player = new Player();

	/* Error handling, notifies admins of errors. */
	stream.on('uncaughtException', function (message) {
		if (player.admin) { player.send("ERROR: ".color('red')+message); }
	});

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

server.listen(CONFIG.port);
sys.puts("Now listening on "+CONFIG.port);
