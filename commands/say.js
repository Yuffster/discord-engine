module.exports = new Class({

	Extends: Command,

	execute: function(content) {
		this.emit('%You say%s: '+content, 'speech');
		return true;
	}

});
