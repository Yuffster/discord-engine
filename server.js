/**
 * Main server script for Discord mudlib.  Most of the code is still messy from
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
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010-2012 Michelle Steigerwalt
 */

require('./engine');
var sys = require('util'),
    fs  = require('fs');

log_error = function (e) {
	console.log("ERROR:".color('red'), e );
	console.log(e.stack || console.trace());
}

exports.start = function(config) {

	var world = new World(config);

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
			var brk = (enhanced) ? "\\r\\n" : "\r\n";
			var str = message.style(style);
			stream.write(str.wordwrap(80)+brk);
		});

		player.addEvent('guiOutput', function(obj, handler) {
			if (!enhanced) { return false; }
			var data = {'data':obj, 'handler':handler};
			var json = JSON.encode(data);
			stream.write("<!-- \n"+json+"\n-->\n\\r\\n");
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

	return {
		listen: function(port) {
			console.log("Game engine listening on port", port);
			server.listen(port);
		}
	};

};