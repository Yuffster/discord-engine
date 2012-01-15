module.exports = new Class({

	Extends: Command,

	execute: function() {
		this.emit("%You leave%s the game.");
		this.world.savePlayer(this);
		this.addEvent('save', this.disconnect.bind(this));
		return true;
	}

});
