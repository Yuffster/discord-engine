new Class({

	Extends: Room,

	create: function() {
		this.set_short("the southeastern corner of the dance floor");
		this.set_long("This is southeast corner of the dance floor. The music is loud, the lights are flashing and  the center is full of dancers. The bar is to the east and people occasionally push past you to get to it.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_exit("west", "disco_s");
		this.add_exit("northwest", "disco_center");
		this.add_exit("east", "bar_s");
		this.add_exit("northeast", "bar_c");
		this.add_exit("north", "disco_e");
	}

});
