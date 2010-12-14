Container = new Class({

	Extends: Base,

	items: [],

	getItem: function(name) {
		var item = false;
		this.items.each(function(i){
			if (!item && i.matches(name)) item = i;
		});
		return item;
	},

	countItem: function(name) {
		var n = 0;
		this.items.each(function(i){
			if (i.matches(name)) { n++; }
		});
		return n;
	},

	addItem: function(item) {
		item.container = this;
		this.items.push(item);
	},

	removeItem: function(item) {
		this.items.erase(item);
	},

	listItems: function(items) {
		if (!items) items = this.items;
		var clump = {};
		var shorts = {};
		items.each(function(i) {
			if (clump[i.short]) clump[i.short]++;
			else {
				clump[i.short]  = 1;
				shorts[i.short] = i;
			}
		});
		var strs = [];
		var my = this;
		Object.each(clump, function(n,short) {
			var i   = shorts[short];
			var obj = my.getItem(i);
			if (!obj) { return; }
			if (n==1) {
				strs.push(obj.get('indefinite'));
			} else {
				var plural = obj.get('plural');
				strs.push(n.toWord()+' '+plural);
			}
		}); return strs;
	}

});
