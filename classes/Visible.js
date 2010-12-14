/**
 * This class implements things used for all things that can be looked at.
 * Rooms, items, living, etc.
 */
Visible = new Class({

	Extends: Base,

	determinate: 'the ',

	article: false,

	plural: false,

	set_determinate: function(det) {
		this.determinate = det;
	},

	set_article: function(a) {
		this.article = a;
	},

	set_plural: function(p) {
		this.plural = p;
	},

	getDeterminate: function() {
		return this.determinate || 'the ';
	},

	getPlural: function() {
		return this.plural || this.short.pluralize();
	},

	getArticle: function() {
		var art = this.article || this.short.getArticle();
		return art+" ";
	},

	getDefinite: function() {
		var det   = this.get('determinate');
		var short = this.get('short');
		if (this.getCount()>1) {
			return "one of "+det+this.get('plural');
		} return det+short;
	},

	getIndefinite: function() {
		var txt = this.get('short');
		var article = this.get('article') || txt.get('article');
		return article+txt;
	},

	/**
	 * This is to be extended by Living and Item to count other objects and
	 * characters in the same environment.
	 */
	getCount: function() {
		return 1;
	}

});
