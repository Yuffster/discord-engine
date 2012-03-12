/**
 * Command classes are bound to the player.
 */
Command = new Class({

	Implements: CommandParser,

	//Command is filled in by the object that instantiates this object, since it
	//knows the file name and we don't.
	command: '', 

	initialize: function(command) {
		this.command = command;
		this.init();
		if (!this.getPatterns(this.command)) {
			this.add_command(this.command, this.syntax || '*', this.execute);
		}
	},

	//Should be defined by the child class.
	init: function() {
		this.add_command(this.command, '*', this.execute);
	},

	execute: function() {

	},

	/**
	 * This method will be run before calling execute.  If this method fails,
	 * the game will act as if the command does not exist.
	 *
	 * This will enable us to easily create administrator and class-specific
	 * commands.
	 */
	can_execute: function() {
		return true;
	}

});
