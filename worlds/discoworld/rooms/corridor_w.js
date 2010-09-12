new Class({

	Extends: Room,

	create: function() {
		this.set_short("the beginning of a short corridor");
		this.set_long("Are you sure you should be here? This is an unremarkable little corridor, there are a couple of doors at the other end. The bar is back to the west.");
		this.add_exit("west", "bar_n");
		this.add_exit("east", "corridor_e");
	}

});
