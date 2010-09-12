Item = new Class({

	Implements: Base,

	short: null,

	long: null,

	determinate: null,

	aliases: [],

	adjectives: [],

	noun: null,

	path: null,
	
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

	set_determinate: function(str) {
		this.determinate = str;
	},

	on_equip: function() {

	},

	on_remove: function() {

	},

	getDeterminate: function() {
		if (this.determinate) return this.determinate;
		else return this.short.getArticle();
	},

	getDescription: function(observer) {
		return this.long;
	},

	getShort: function() {
		if (this.short) return this.get('determinate')+' '+this.short;
		return 'thing';
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

	//Determines how well a given string matches this item's short,
	//adjectives and aliases.
	matches: function(words) {
		words = words.split(' ');
		noun  = words.pop();
		if (!this.hasNoun(noun)) return;
		var match = true;
		words.each(function(w) {
			if (match===false) return;
			if (!this.hasAdjective(w)) match = false;
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
		new Hash(data).each(function(v,k) {
			that[k] = v;
		});
	}

});
