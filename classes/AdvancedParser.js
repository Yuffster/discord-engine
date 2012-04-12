/**
 * Mangled port of a command parser based on LPC/Discworld syntax.
 *
 * Provides objects with an add_command method which takes a command, such as
 * "pull" and a syntax, just as "<direct:object>".
 *
 * The Discworld parser is a marvel, so this will probably never be a complete
 * imitation.
 * 
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt
 */
AdvancedParser = new Class({
	
	command: {},
	
	actor: null, //The actor object calling the command.

	holder: null, //The object this command is defined on.

	initialize: function(actor, holder) {
		this.actor  = actor;
		this.holder = holder;
	},
	
	/**
	 * This method is intended to let the developer create different handlers
	 * for different argument lists.
	 *
	 * Right now it just does one pattern and one handler, but it should 
	 * eventually be more complex.
	 *
	add_syntax: function(pattern, handler) {
		this.set_syntax(pattern, handler);
	},

	set_syntax: function(pattern, handler) {
		handler = handler || this.execute;
		this.add_command(this.command, pattern, handler);
	},
	
	/**
	 * Get syntax patterns for a particular command.
	 */
	getPatterns: function(command, commands) {
		commands = commands || this.commands;
		var com = commands[command];
		return (com) ? com.syntax : false;
	},
	
	add_failure_message: function(message) {
		this.failure_message = '';
	},

	/**
	 * Figures out which function to use to handle a command.
	 */
	getHandler: function(command, commands) {
		commands = commands || this.commands;
		var com = commands[command];
		return (com) ? com.method : false;
	},

	/**
	 * Takes an arguments string for a command and parses out the <> syntax
	 * arguments.  Mangled form of LPC/Discworld-based command strings.
	 */
	parse: function(line, syntax) {
		
		var args = this.extractArguments(line,syntax);

		if (args===false) { return false; }
		
		var valid = true, lastFail = '';
		args.each(function(obj, i) {
					
			if (!valid) { return; }
			
			if (!obj.tag) {
				args[i] = obj.str;
				return;
			}
			
			args[i] = this.findObject(obj.tag, obj.str);
			
			//If we didn't find anything, it means this set of arguments are
			//invalid for this particular command execution.  Let's see if the
			//player is calling invalid items, or if they items are entirely
			//nonexistent.
			if (!args[i]) {
				valid = false;
				var any = this.findAnyObject(obj.str);
				if (!any) {
					//If no matching object is found.
					lastFail = "Cannot find '"+obj.str+"'.";
				} else {
					//If a matching object is found which doesn't fit the
					//syntax pattern.
					lastFail = "You can't do that with "+any.get('definite')+".";
				}
			}
			
		}, this);
		
		//If we have arguments and the syntax hasn't been discounted.
		if (valid) {
			return args;
		} else return lastFail;

	},

	/**
	 * Takes a syntax string and converts it into arguments.
	 */
	extractArguments: function(line,syntax) {
	
		//If there is no syntax, just return the string unaltered.
		if (syntax=="*") { return [{str:line, tag:false}]; }

		//The ' is a delimiter within a tag for user-friendly syntax
		// display.
		var patt = /(<[\w:']*>)/g;
		var items = syntax.split(patt).filter(function(i) { 
			return (i) ? true : false;
		});

		//Matches all the delimiters, such as "with", "to", "from", etc.
		var delimiters = items.filter(function(i) { 
			return (i.match(patt)) ? false : true;
		});

		var valid = true;
		sections = [];

		//Use the delimiters to split the string into tags.
		delimiters.each(function(d) {
			if (!valid) { return; }
			var exp = new RegExp(d);
			if (!line.match(exp)) { 
				valid = false;
			} else {
				//Split the line at the first occurance of the delimiter.
				sections.push(line.replace(exp, '||').split('||'));
			}
		});

		/**
         * If there are no delimiters, it means we have only one tag, right?
		 * This is true at least for now -- otherwise, we'd have to do a
		 * word-by-word walk to match multiword phrases with no delimiters.
		 *
		 * I don't want to code that, do you?
		 */
		if (!delimiters.length) {
			sections = [line];
		}

		sections = sections.flatten();

		var tags = items.filter(function(t) {
			return t.match(patt) ? true : false;
		});
		
		//If there aren't any tags, there aren't any arguments.
		if (!tags.length) { return []; }
		
		valid = true;
		var args = [];
		
		sections.each(function(sec, i) {
			if (!tags[i]) { 
				valid = false; 
				return false;
			}
			//Optional '* match is for implementing living-friendly syntax
			//output.
			var tag = tags[i].replace(/^<|('[\w]+)?>$/g, '');
			args[i] =  {str: sec, tag: tag};
		});
		
		if (args.length!=tags.length) valid = false;

		return (valid) ? args : false;

	},

	findObject: function(tag, words) {
		
		if (words.trim().length==0) return false;
		
		if (!tag) return words;
		
		var obj       = this.holder,
		    actor     = this.actor,
		    list      = [], 
			room      = (actor.get('room')) ? actor.get('room').getItems()   : [],
		    container = (actor.getItems()), 
		    everyone  = (actor.get('room')) ? actor.get('room').getLiving()  : [],
		    players   = (actor.get('room')) ? actor.get('room').getPlayers() : [];

		// A lot of reproduction of code here!  This will make it easier for people
		// to understand exactly what each tag will return.
		if (tag=='direct') {
			list.push(obj);
		} else if (tag == "object") {
			list.combine(container);
			list.combine(room);
		} else if (tag == "living") {
			list.combine(everyone);
		} else if (tag == "direct:living") {
			list.push(actor);
		} else if (tag == "direct:object") {
			list.push(obj);
		} else if (tag == "direct:player") {
			if (actor.player) { list.push(actor); }
		} else if (tag=="indirect") {
			list.combine(container);
			list.combine(everyone);
			list.erase(actor);
			list.erase(obj);
		} else if (tag == "indirect:object") {
			list.combine(container).combine(room);
			list.erase(obj);
		} else if (tag == "indirect:object:me") {
			list.combine(container);
			list.erase(obj);
		} else if (tag == "indirect:object:here") {
			list.combine(room);
			list.erase(obj);
		} else if (tag == "indirect:object:me:here") {
			list.combine(obj).combine(room);
			list.erase(obj);
		} else if (tag == "indirect:object:here:me") {
			list.combine(room);
			list.combine(container);
			list.erase(obj);
		} else if (tag == "indirect:living") {
			list.combine(everyone).erase(actor);
		} else if (tag == "indirect:player") {
		} else if (tag == "string") {
			return words;
		} else if (tag == "number") {
			if (words.toInt()) { return words.toInt(); }
		} else if (tag == "fraction") {
			
		} else if (tag == "preposition") {
			//I just threw a list of random prepositions together.
			var preps = [
				'on', 'in', 'under', 'of', 'around', 'above',
				'against', 'along', 'after', 'before', 'among',
				'beneath', 'beside', 'between', 'by', 'into', 
				'inside', 'past', 'to', 'towards', 'underneath', 
				'with', 'within'
			];
			if (preps.contains(words)) { return words; }
		} else {
			throw new Error("Unsupported command tag: "+tag);
			return false;
		}

		list = list.filter(function(item) { return (item.get) ? 1 : 0; });

		if (!list || !list.length) { return false; }

		return this.checkList(list, words) || false;

	},

	/**
	 * Tries to find a match with anything in the environment.
	 */
	findAnyObject: function(words) {
		var list = [];
		if (this.holder.container) {
			list.combine(this.holder.container.getItems());
		}
		if (this.actor.room) {
			list.combine(this.actor.room.getLiving());
			list.combine(this.actor.room.getItems());
		}
		return this.checkList(list, words);
	},

	/**
	 * Checks a list of items to see if they match a given string of words.
	 */
	checkList: function(list, words) {

		if (!list.length || !list || !words) { return false; }
		if (!list.each) { list = [list]; } //Splat

		list = list.filter(function(item) { return (item.get) ? true : false; });

		var match = false;
		list.each(function(item) {
			if (!match && item.matches(words)) {
				match = item;
			}
		});

		return match;

	}

});
