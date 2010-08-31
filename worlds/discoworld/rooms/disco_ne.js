exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the northeastern corner of the dance floor");
		this.set_long("This is northeast corner of the dance floor. The music is loud, the lights are flashing and  the center is full of dancers. The bar is to the east and people occasionally push past you to get to it.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_exit("east", "bar_n");
		this.add_exit("southeast", "bar_c");
		this.add_exit("south", "disco_e");
	}

});
