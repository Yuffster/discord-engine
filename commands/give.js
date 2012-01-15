module.exports = new Class({

	Extends: Command,

	init: function() {
		this.set_syntax('<indirect:object> to <indirect:living>');
	},

	execute: function(item,target) {
		if (this.giveItem(item, target)) {
			this.emit(
				"%You hand%s "+item.get('definite')+" to %Name.",
				target
			);
			return true;
		} else { return true; }
	}

});
