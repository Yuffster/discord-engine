module.exports = new Class({

	Extends: Command,

	execute: function(item) {
		if (!item) return "Wear what?";
		if (this.getItem(item)) var success = this.equipItem(this.getItem(item));
		else return "You don't have that.";
		if (success!==false) this.emit("%You wear%s "+this.getItem(item).get('indefinite')+'.');
		else this.send("That isn't wearable.");
		return true;
	}

});
