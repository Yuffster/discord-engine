exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the western of the dance floor");
		this.set_long("This is edge of the dance floor. The music is loud, the lights are flashing and  the center is full of dancers. The entry to the chill out zone is to the west.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_exit("west", "chill");
		this.add_exit("east", "disco_center");
		this.add_exit("south", "disco_sw");
		this.add_exit("north", "disco_nw");
	}

});
