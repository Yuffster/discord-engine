Container = new Class({

	Extends: Base,

	items: [],

	getItem: function(name) {
		var item;
		if (this.equipped && this.getEquippedItem(name)) {
			return this.getEquippedItem(name);
		}
		item = false;
		this.items.each(function(i){
			if (!item && i.matches(name)) item = i;
		});
		return item;
	},

	addItem: function(item) {
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
		Object.each(clump, function(n,short) {
			var i = shorts[short];
			if (n==1) {
				var article = i.get('determinate') || short.getArticle();
				strs.push(article+' '+short);
			} else {
				var plural = i.get('plural') || short.getPlural();
				strs.push(n.toWord()+' '+plural);
			}
		}); return strs;
	}

});
