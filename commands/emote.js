new Class({

	Extends: Command,

	execute: function(content) {
		this.emit([
			"You emote: "+this.get('short').capitalize()+' '+content,
			content
		]);
		return true;
	}

});
