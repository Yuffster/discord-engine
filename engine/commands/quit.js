exports.command = new Class({

	Extends: Command,

	execute: function(content) {
		this.emit("%You leave%s the game.");
		this.send("Goodbye!");
		this.disconnect();
	}

});
