Container = new Class({

	Extends: Base,

	items: [],
	equipped: [],

	getItem: function(name) {
		if (this.getEquippedItem(name)) return this.getEquippedItem(name);
		var name = name.split(' ')[0];
		var item = false;
		this.items.each(function(i){
			if (!item && i.hasAlias(name)) item = i;
		});
		return item;
	},

	getEquippedItem: function(name) {
		var name = name.split(' ')[0];
		var item = false;
		this.equipped.each(function(i){
			if (!item && i.hasAlias(name)) item = i;
		});
		return item;
	},

	equipItem: function(item) {
		if (item.on_equip.pass(this)() === false) return false;
		this.items.erase(item);
		this.equipped.push(item);
	},

	unequipItem: function(item) {
		if (item.on_remove.pass(this)() === false) return false;
		this.items.push(item);
		this.equipped.erase(item);
	},

	addItem: function(item) {
		this.items.push(item);
	},

	removeItem: function(item) {
		this.items.erase(item);
	}

});
