Item = new Class({

	Implements: [Base,English],

	short: null,

	long: null,

	aliases: [],

	adjectives: [],
	
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

	getDescription: function(observer) {
		return this.long;
	},

	getShort: function() {
		if (this.short) return this.short;
		return 'a thing';
	},

	hasAlias: function(alias) {
		return (this.aliases.contains(alias));
	},

	hasAdjective: function(adj) {
		return (this.adjectives.contains(adj));
	}

});
