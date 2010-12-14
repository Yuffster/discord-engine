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
