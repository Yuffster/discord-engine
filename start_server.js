var sys = require('sys'),
    fs  = require('fs');

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

var config = JSON.parse(fs.readFileSync(config_file));

if (!config) {
	sys.puts("Could not decode config file.  Please ensure that the file is in "+
	         "valid JSON format.");
	process.exit();
}

require('./server').start(config);
