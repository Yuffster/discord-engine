exports.main = new Class({

	Extends: Room,

	create: function() {
		this.set_short("an empty room");
		this.set_long(
			"This is a large, empty room, which smells of fresh " +
		    "paint and sawdust.  You can't help but feel a sense " +
		    "of endless possibility as you stand here."
		);
		this.add_living('rat');
		this.load_item('strawberry');
	}

});
