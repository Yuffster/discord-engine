CommandParser = new Class({

	realParser: false,

	commands: [],

	caller: false,

	failure_message: false,

	add_failure_message: function(message) {
		this.failure_message = message;
	},

	/**
     * This method should be used on item/room creation.
     */
	add_command: function(command, patterns, method) {
		method = method || this['do_'+command];
		if (!method) { return false; }
		//Force pattern to be an array.
		if (!patterns.each) { patterns = [patterns]; }
		//Force method to be a function and not a string.
		if (method.length) { method = this[method]; }
		this.commands[command] = {
			'syntax': patterns,
			'method': method
		};
	},

	parseLine: function(line, living) {
		this.user = living;
		this.failure_message = false;
		var realParser = new AdvancedParser();
		var output = realParser.parseLine(line, this.user, this);
		if (realParser.failure_message) {
			this.failure_message = realParser.failure_message;
		} return output;
	}

});
