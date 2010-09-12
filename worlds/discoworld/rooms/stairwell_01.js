new Class({

	Extends: Room,

	create: function() {
		this.set_short("stairwell");
		this.set_long("There are stairs here leading up, but they're blocked by rubble.");
		this.add_item("stairs", "They're blocked by rubble.");
		this.add_exit("east", "lobby");
	}

});
