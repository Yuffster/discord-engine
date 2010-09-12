new Class({

	Extends: Room,

	create: function() {
		this.set_short("middle of the bar");
		this.set_long("This is the middle of the bar, it has people trying to order drinks and others just looking for somewhere to lean while observing the floor.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_item('bar', "The bar is staffed by a couple of trendy young urbanites and appears to stock all the coolest beverages.");
		this.add_exit("west", "disco_e");
		this.add_exit("northwest", "disco_ne");
		this.add_exit("southwest", "disco_se");
		this.add_exit("north", "bar_n");
		this.add_exit("south", "bar_s");
		this.add_living('bartender');
	}

});
