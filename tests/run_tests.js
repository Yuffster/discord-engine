require(__dirname+'/../engine');
require("describe");

assert = require('assert');

(['messaging', 'advanced_parser']).each(function(test_module) {
	require(__dirname+"/tests/"+test_module);
});

process.exit();
