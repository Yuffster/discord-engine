exports.room = new Class({

	Extends: Room,

	create: function() {
		this.set_short("an office");
		this.set_long("This is a very nicely appointed office. Factors such as desk, leather chair, bookshelf and paintings that show off the owner's \"excellent\" taste have been used to give it that respectable feeling that might otherwise be missing from a disco.");
		this.add_item('desk', "It's a very nice mahagony desk, with drawers and everything.");
		this.add_item('drawers', "The drawers have handles and are locked");
		this.add_item('bookshelf', "The bookshelf is full of get rich quick books.");
		this.add_exit("west", "corridor_e");
		this.add_living('boss');
	}

});
