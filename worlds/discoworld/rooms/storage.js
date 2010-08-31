exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("a cluttered storage room");
		this.set_long("This room is full of everything from broken lights to empty crates. Maybe you should search it?");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_exit("north", "corridor_e");
	}

});
