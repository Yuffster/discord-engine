exports.command = new Class({

	Extends: Command,

	execute: function() {
		this.world.savePlayer(this);
		return "Saving...";
	}

});
