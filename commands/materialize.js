module.exports = new Class({

	Extends: Command,

	execute: function(path) {
		var player = this,
		    item   = this.world.loadItem(path, {
				onFailure: function(e) {
					player.sendError(e);
				}
			});
		if (!item) return "Invalid path: "+path;
		this.emit("%You pull%s "+item.get('indefinite')+' out of thin air.');
		this.addItem(item);
		return true;
	}

});
