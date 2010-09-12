new Class({

	Extends: Room,

	create: function() {
		this.set_short("north end of the bar");
		this.set_long("This is the northern end of the bar, there are less people as it's darker down this end and the bar doesn't go all the way to the wall. There's space for the staff to get around it and to go into the door marked \"Staff Only\".");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_item('bar', "The bar is staffed by a couple of trendy young urbanites and appears to stock all the coolest beverages.");
		this.add_item('door', "The door looks very official, you wouldn't want to go through there.");
		this.add_exit("west", "disco_ne");
		this.add_exit("southwest", "disco_e");
		this.add_exit("east", "corridor_w");
		this.add_exit("south", "bar_c");
	}

});
