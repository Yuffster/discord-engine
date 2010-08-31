Item = new Class({

	Implements: Base,

	short: null,

	long: null,

	aliases: [],
	
	set_short: function(desc) {
		this.short = desc;
	},

	get_color: function() {
		return ['green', 'silver', 'red', 'purple', 'yellow', 'neon pink'].getRandom();
	},

	get_material: function() {
		var mats = ['dull', 'fluffy', 'weathered', 'oversized', 'shiny', 'fuzzy', 'sparkling', 'rhinestone-encrusted', 'leather', 'velvet', 'satin', 'silk'];
		return mats.getRandom();
	},

	get_type: function() {
		return ['jacket', 'hat', 'shirt', 'bracelet', 'scarf', 'bowtie'].getRandom();
	},

	get_type_pair: function() {
		return ['gloves', 'pants', 'skates', 'bracelets', 'shoes', 'boots'].getRandom();
	},

	on_equip: function() {

	},

	on_remove: function() {

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

	getDescription: function(observer) {
		return this.long;
	},

	getShort: function() {
		if (this.short) return this.short;
		return 'a thing';
	},

	hasAlias: function(alias) {
		return (this.aliases.contains(alias));
	}

});
