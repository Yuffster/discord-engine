exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the end of the corridor");
		this.set_long("You are at the end of the \"Staff Only\" corridor. To the south is a door marked \"storage\" while an unmarked and rather more ornate door is to the east.");
		this.add_exit("west", "corridor_w");
		this.add_exit("east", "office");
		this.add_exit("south", "storage");
	}

});
