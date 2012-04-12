Item = new Class({

	Implements: [Base, Visible, CommandParser],

	short: null,

	long: null,

	aliases: [],

	adjectives: [],

	noun: null,

	path: null,

	container: null,
	
	set_short: function(desc) {
		this.short = desc;
	},

	set_long: function(desc) {
		this.long = desc;
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

	on_equip: function() {
	},

	on_remove: function() {
	},

	on_drop: function() {
	},

	getDescription: function() {
		return this.long;
	},
	
	getContainer: function() {
		return this.container;
	},

	getNoun: function() {
		if (this.noun) return this.noun;
		else return this.short.split(' ').pop();
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

	/**
	 * Returns how many of the same object are present within the same
	 * container.
	 */
	getCount: function() {
		if (this.container) {
			return this.container.countItem(this.short);
		} return 1;
	},

	//Determines how well a given string matches this item's short,
	//adjectives and aliases.
	matches: function(words) {
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

	dump: function() {
		var obj = {
			'short': this.short,
			'long':  this.long,
			'aliases': this.aliases,
			'noun': this.noun,
			'determinate': this.determinate,
			'path': this.path,
			'save': this.save
		};
		return obj;
	},

	loadData: function(data) {
		var that = this;
		Object.each(data, function(v,k) {
			that[k] = v;
		});
	}

});
