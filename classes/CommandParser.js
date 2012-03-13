/**
 * Think of this file as the basic interface all command parsers need to
 * present.  It's separated from AdvancedParser in case someone wants to
 * implement their own blend without worrying about affecting the rest of
 * the codebase in strange ways.
 */
CommandParser = new Class({

	commands: [],
	
	/**
     * This method should be used on item/room creation.
     */
	add_command: function(verbs, patterns, method) {
		//Force verbs to be an array.
		if (!verbs.each) verbs = [verbs];
		//Force pattern to be an array.
		if (!patterns.each) { patterns = [patterns]; }
		method = method || this['do_'+verbs[0]];
		if (!method) { return false; }
		//Force method to be a function and not a string.
		if (method.length) { method = this[method]; }
		this.commands.push ({
			'verbs'  : verbs,
			'syntax' : patterns,
			'handler': method
		});
	},
	
	/**
	 * This method is intended to let the developer create different handlers
	 * for different argument lists.
	 *
	 * Right now it just does one pattern and one handler, but it should 
	 * eventually be more complex.
	 */
	add_syntax: function(pattern, handler) {
		this.set_syntax(pattern, handler);
	},
		
	/**
	 * Get syntax patterns for a particular command.
	 */
	getPatterns: function(command) {
		return this.commands;
	},

	/**
	 * Overwrites all exisiting syntaxes to create one canonical syntax.
	 */
	set_syntax: function(pattern, handler) {
		handler = handler || this.execute;
		this.add_command(this.command, pattern, handler);
	},
	
	parseLine: function(line, actor) {
		
		var holder = this;
		
		line = line.trim().split(/\s/);
		
		//If the line is empty, we don't need to go through all the available
		//verbs.
		if (!line) return;
		
		var verb = line.shift(), success = false, out = '',
		    binding = (this.command) ? actor : holder;
		
		line = line.join(' ');

		//There's really no scenario where the actor should be nonexistent.
		if (!actor) throw new Error("No actor for command "+line);
		
		this.commands.each(function(c) {

			//If we've already succeeded, skip this.
			if (success) { return; }
			//If the verb provided isn't in the command verb list, skip.
			if (!c.verbs.contains(verb)) return;

			//Otherwise, we have a match, so let's parse this line using
			//this command syntax to pull out its arguments.
			
			//Instantiate a new instance of the parser.
			var parser = new AdvancedParser(actor, holder);
			
			//Next, we take the syntax patterns and pass them to the
			//parser to parse the arguments string and convert it into
			//matching game objects.
			c.syntax.each(function(syntax) {
				
				if (success) return;

				var args = parser.parse(line, syntax);
				
				//We got a failure message.
				if (typeOf(args)=='string') {
					//It's a failure message, so we'll store it in case no
					//better match can later be made.
					out = args;
				//We have arguments from this syntax, which means it's been a 
				//match.
				} else if (args && typeOf(args)=='array') {
					//Find the handler method for this syntax and pass the
					//arguments to it.
					if (binding!=actor) { //This'll be removed in a bit.
						//binding = actor means we're dealing with a Command.
						args = ([actor]).combine(args);
					}
					var result = c.handler.bind(binding).pass(args)();
					if (result!==false) {
						success = true;
						out = result || true;
					}
				}
				
				return { output: out, success: success }
				
			});
			
		});
		
		/**
		 * We return both success and output because we could have a failure
		 * message where output should be sent but success is false.
		 *
		 * This message can be overruled upon further command chain execution
		 * assuming some other command can take the same syntax pattern and
		 * convert it to a successful request.
		 */
		return {success: success, output: out};
	}

});