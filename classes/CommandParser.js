CommandParser = new Class({

	realParser: false,

	commands: [],

	caller: false,

	failure_message: false,

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

	parseLine: function(line, caller) {
		var realParser = new AdvancedParser();
		return realParser.parseLine(line, caller, this);
	},

	checkList: function(list, words) {
		if (!list || !words) { return false; }
		if (!list.each) { list = [list]; } //Splat
		var match = false;
		list.each(function(item) {
			if (!match && item.matches(words)) {
				match = item;
			}
		});
		return match;
	}

});
