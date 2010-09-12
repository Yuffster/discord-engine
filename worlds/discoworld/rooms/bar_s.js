new Class({

	Extends: Room,

	create: function() {
		this.set_short("south end of the bar")
		this.set_long("This is the south end of the bar, closest to the door and first port of call for anyone needing some liquid courage before they hit the dance floor.")
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_item('bar', "The bar is staffed by a couple of trendy young urbanites and appears to stock all the coolest beverages.");
		this.add_exit("west", "disco_se");
		this.add_exit("northwest", "disco_e");
		this.add_exit("north", "bar_c");
	}

});
