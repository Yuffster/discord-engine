require(__dirname+'/../engine');
require("describe");

assert = require('assert');

WORLD_PATH = __dirname+"/../example_world/";

var glob = require("glob");

glob(__dirname+"/tests/**/*.js", {cwd: __dirname}, function (er, files) {
	files.each(function(f) {
		require(__dirname+'/'+f);
	});
	process.exit();
});