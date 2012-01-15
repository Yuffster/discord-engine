module.exports = new Class({

	Extends: Command,

	execute: function() {
		return this.describeInventory(this);
	}

});
