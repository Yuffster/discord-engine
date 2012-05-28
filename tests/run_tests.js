require(__dirname+'/../engine');
require("describe");

assert = require('assert');

WORLD_PATH = __dirname+"/../example_world/";

makeWorld = function() {
	return new World({
		name: 'test',
		world_path: WORLD_PATH,
		start_room: 'lobby',
		port: '1111'
	});
};

var glob = require("glob");

glob(__dirname+"/tests/**/*.js", {cwd: __dirname}, function (er, files) {
	files.each(function(f) {
		require(f);
	});
	process.exit();
});
