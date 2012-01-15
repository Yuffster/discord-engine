module.exports = new Class({

	Extends: Command,

	execute: function(target) {
		if (!target) return "Talk to whom about what?";
		var npc = this.get('room').getLiving(target);
		if (!npc) return "You can't find that person to talk to.";
		this.talkTo(npc);
		return "You attempt to strike up a conversation with the "+npc.get('short');
	}

});
