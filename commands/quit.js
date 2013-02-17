module.exports = new Class({

	Extends: Command,

	execute: function() {
		this.fireEvent("quit");
		return true;
	}

});
