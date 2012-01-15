exports.main = new Class({

	Extends: Command,

	init: function() {
		this.set_syntax('<indirect:living>');
	},

	execute: function(target) {
		this.emit(
			"%You huggle%s "+target.get('definite')+".",
			target
		);
		return true;
	}

});
