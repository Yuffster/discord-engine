module.exports = new Class({

	Extends: Command,

	execute: function(path) {
		var npc = this.world.loadNPC(path);
		if (!npc) return "Invalid path: "+path;
		this.emit("%You summon%s "+npc.get('indefinite')+' out of thin air.');
		this.get('room').addLiving(npc);
		return true;
	}

});