module.exports = new Class({

	Extends: Command,
	
	init: function() {
		this.set_syntax('<object>');
	},

	execute: function(object) {
		this.world.reloadItem(object);
		this.removeItem(object);
		var item = this.world.loadItem('strawberry');
		if (!item) return "Invalid path: "+object.file_path;
		this.send("You reload "+item.get('definite')+".");
		this.addItem(item);
		return true;
	}

});
