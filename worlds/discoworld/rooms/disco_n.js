exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the northern edge of the dance floor");
		this.set_long("This is the northern edge of the dance floor. The music is loud, the lights are flashing and  the center is full of dancers. Just off the northern edge of the floor is the DJ's booth.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_item('booth', "The booth has lights mounted on it and a DJ inside. Perhaps he's taking requests.");
    this.add_exit("north", "dj_booth");
		this.add_exit("west", "disco_nw");
		this.add_exit("south", "disco_center");
		this.add_exit("east", "disco_ne");
		this.add_exit("southeast", "disco_e");
	}

});
