module.exports = new Class({

	Extends: Command,

	execute: function(item) {
		if (!item) return "Remove what?";
		var obj = this.getEquippedItem(item);
		if (!obj) return "You're not wearing that.";
		this.unequipItem(obj);
		this.emit("%You remove%s "+obj.get('short')+'.');
		return true;
	}

});
