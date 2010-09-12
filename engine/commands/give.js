new Class({

	Extends: Command,

	execute: function(content) {
		this.emit('%You say%s: '+content);
		return true;
	}

});
