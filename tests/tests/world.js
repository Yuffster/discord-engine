var actor = new Class({

	Extends: Living,

	create: function() {

		this.set_short('actor');

	}

});

var living = new actor();
living.world = makeWorld();
living.moveTo('lobby');

describe('world engine', {

	'world-specific commands': function() {
		living.testCommand(
			"huggle rat",
			"You huggle the lab rat."
		);
		living.testCommand(
			"huggle strawberry",
			"You can't do that with the strawberry."
		);
	}
	
});