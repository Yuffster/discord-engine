module.exports = new Class({

	Extends: Command,

	execute: function(target) {
		var target = this.room.getLiving(target);
		if (!target) return "Can't find "+target+".";
		this.startCombat(target);
		return true;
	}

});
