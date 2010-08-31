exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("the chillout zone");
		this.set_long("This a a quiter place away from the dance floor. People can relax and chat while sitting in the comfortable couches.");
		this.add_item('couches', "The couches are dark leather and look extremely comfortable");
		this.add_exit("east", "disco_w");
		this.add_living('lounger');
	}

});
