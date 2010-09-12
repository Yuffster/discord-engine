Base = new Class({

	save: {},

	initialize: function(name) {
		this.init.bind(this).pass(arguments)();
		this.create.bind(this).pass(arguments)();
	},

	init: function() {

	},

	create: function() {

	},

	get: function(k) {
		var meth = 'get'+k.capitalize();
		if (this[meth])  return this[meth]();
		else if (this[k]) return this[k];
		else if (this.save[k]) return this.save[k];
		else return null;
	},

	set: function(k ,v) {
		var meth = 'set'+k.capitalize();
		if (this[meth]) this[meth](v);
		if (this[k]) this[k] = v;
		else this.save[k] = v;
	},

	/**
	 * Any model that needs to be saved to disk has to be able to dump its
	 * contents into an object or array.
	 */
	dump: function() {
		return null;
	},

	/**
	 * Reload the object based on its dumped data.
	 */
	 loadData: function(dump) {

	 }

});
