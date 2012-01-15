module.exports = new Class({

	Extends: Command,

	execute: function(content) {
		this.send("You don't emote: "+this.get('definite').capitalize()+' '+content);
		/* Recursion error is somewhere in the advanced emit handler.
		this.emit([
			"You emote: "+this.get('short').capitalize()+' '+content,
			content
		]); */
		return true;
	}

});
