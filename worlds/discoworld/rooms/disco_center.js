new Class({

	Extends: Room,

	create: function() {
		this.set_short("the middle of the dance floor");
		this.set_long("This is the center dance floor. The music is loud, the lights are flashing and everyone around you is dancing.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_exit("west", "disco_w");
		this.add_exit("east", "disco_e");
		this.add_exit("south", "disco_s");
		this.add_exit("north", "disco_n");
		this.add_exit("southwest", "disco_sw");
		this.add_exit("northwest", "disco_nw");
		this.add_exit("southeast", "disco_se");
		this.add_exit("northeast", "disco_ne");
		this.add_living('trav');
	}

});
