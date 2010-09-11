exports.command = new Class({

	Extends: Command,

	execute: function(target) {
		if (!target) return "Take what?";
		var item = this.get('room').getItem(target);
		if (!item) return "You don't see that.";
		this.emit("%You take%s "+item.get('short'));
		this.get('room').removeItem(item);
		this.addItem(item);
		return true;
	}

});
