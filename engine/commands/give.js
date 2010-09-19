new Class({

	Extends: Command,

	execute: function(args) {
		if (!args.match(' to ')) return "Give what to whom?";
		var parts  = args.split(' to ');
		var thing  = parts[0].trim();
		var target = parts[1].trim();
		var item   = this.getItem(thing);
		if (!item) return "You don't have that.";
		var target = this.room.getLiving(target);
		if (!target) return "Can't find "+target+".";
		this.removeItem(item);
		target.addItem(item);
		this.emit("%You hand%s "+item.get('short')+" to "+target.get('short')+".");
		return true;
	}

});
