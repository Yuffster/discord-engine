Container = new Class({

	Extends: Base,

	items: [],

	getItem: function(name) {
		var item = false;
		this.get('items').each(function(i){
			if (!item && i.matches(name)) { item = i; }
		});
		return item;
	},

	countItem: function(name) {
		var n = 0;
		this.get('items').each(function(i){
			if (i.matches(name)) { n++; }
		});
		return n;
	},

	addItem: function(item) {
		item.container = this;
		this.items.push(item);
	},

	removeItem: function(item) {
		item.container = null;
		this.items.erase(item);
	},

	getItems: function() {
		return this.items;
	},

	listItems: function(items) {

		if (!items) items = this.items;
		var clump = {};
		var shorts = {};
		items.each(function(i) {
			var short = i.get('short');
			if (clump[short]) { clump[short]++; }
			else {
				clump[short]  = 1;
				shorts[short] = i;
			}
		});
		var strs = [];
		Object.each(clump, function(n,short) {
			var i   = shorts[short];
			var obj = this.getItem(i);
			if (!obj) { return []; }
			var plural = obj.get('plural');
			if (n==1) {
				strs.push(obj.get('indefinite'));
			} else if(n<20) {
				strs.push(n.toWord()+' '+plural);
			} else if (n>19&&n<101) {
				strs.push('dozens of '+plural);
			} else if (n>100&&n<201) {
					strs.push('over a hundred '+plural);
			} else if (n>200) {
				strs.push('hundreds of '+plural);
			}
		}, this);
		return strs;
	}

});
