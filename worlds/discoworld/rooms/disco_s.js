exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the southern edge of the dance floor");
		this.set_long("This is the southern edge of the dance floor. The music is loud, the lights are flashing and  the center is full of dancers.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
    this.add_exit("south", "lobby");
		this.add_exit("north", "disco_center");
		this.add_exit("northeast", "disco_e");
		this.add_exit("northwest", "disco_w");
		this.add_exit("west", "disco_sw");
		this.add_exit("east", "disco_se");
	}

});
