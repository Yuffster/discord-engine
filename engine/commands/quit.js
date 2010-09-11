exports.command = new Class({

	Extends: Command,

	execute: function(content) {
		this.emit("%You leave%s the game.");
		this.disconnect();
		return true;
	}

});
