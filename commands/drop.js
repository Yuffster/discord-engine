module.exports = new Class({

	Extends: Command,

	execute: function(target) {
		if (!target) return "Drop what?";
		var item = this.getItem(target);
		if (!target) return "You don't have that.";
		this.emit("%You drop%s "+item.get('short')+'.');
		this.get('room').addItem(item);
		this.removeItem(item);
		return true;
	}

});
