exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the dj's booth");
		this.set_long("The DJ's booth is a bit of a mess really, full of records and snacks.");
		this.add_item('floor', "The dance floor is a collection of lights that alternate in time with the music. Groovy.");
		this.add_item('records', "An astounding collection of records, enough to really impress some kind of music geek.");
		this.add_exit("south", "disco_n");
	}

});
