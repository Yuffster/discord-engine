exports.main = new Class({

	Extends: Command,

	execute: function(content) {
		this.send(content);
		this.emit('%You say%s: '+content, 'speech');
		return true;
	}

});
