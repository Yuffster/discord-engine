module.exports = new Class({

	Extends: Command,

	execute: function(target) {
		if (!target) return "Eat what?";
		var item = this.getItem(target);
		if (!target) return "You don't have that.";
		this.emit("%You eat%s "+item.get('short')+'.');
		this.removeItem(item);
		return true;
	}

});
