/**
 * This class implements things used for all things that can be looked at.
 * Rooms, items, living, etc.
 */
Visible = new Class({

	Extends: Base,

	determinate: 'the ',

	article: false,

	plural: false,

	aliases: [],

	adjectives: [],

	noun: false,

	set_determinate: function(det) {
		this.determinate = det;
	},

	set_article: function(a) {
		this.article = a;
	},

	set_plural: function(p) {
		this.plural = p;
	},

	set_aliases: function(aliases) {
		this.aliases = aliases;
	},

	add_alias: function(alias) {
		this.aliases.push(alias);
	},

	add_adjective: function(adj) {
		this.adjectives.push(adj);
	},

	set_adjectives: function(adj) {
		this.adjectives = adj;
	},

	getNoun: function() {
		if (!this.short) { return false; }
		if (this.noun) { return this.noun; }
		return this.short.split(' ').pop();
	},

	hasNoun: function(alias) {
		return (alias==this.get('noun')) ? true : this.aliases.contains(alias);
	},

	getAdjectives: function() {
		var shortAdjs = this.get('short').split(' ');
		shortAdjs.pop();
		return shortAdjs.concat(this.adjectives);
	},

	hasAdjective: function(adj) {
		return (this.get('adjectives').contains(adj));
	},

	//Determines if a given string matches this item's short,
	//adjectives and aliases.
	matches: function(words) {
		//If this is an item.
		if (!words.split && words.short) { words = words.short; }
		words = words.split(' ');
		noun  = words.pop();
		if (!this.hasNoun(noun)) { return; }
		var match = true;
		words.each(function(w) {
			if (match===false) { return; }
			if (!this.hasAdjective(w)) { match = false; }
		}, this);
		return match;
	},

	getDeterminate: function() {
		return this.determinate;
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
