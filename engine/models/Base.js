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

	save: function (k, v) {
		this.save[k] = v;
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
		else this[k] = v;
	}

});
