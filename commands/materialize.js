new Class({

	Extends: Command,

	execute: function(path) {
		var item = this.world.loadItem(path);
		if (!item) return "Invalid path: "+path;
		this.emit("%You pull%s "+item.get('short')+' out of thin air.');
		this.addItem(item);
		return true;
	}

});
