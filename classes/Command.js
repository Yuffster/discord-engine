/**
 * Command classes are bound to the player.
 */
Command = new Class({

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
