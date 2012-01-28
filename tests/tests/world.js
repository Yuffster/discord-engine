var actor = new Class({

	Extends: Living,

	create: function() {

		this.set_short('actor');

	}

});

var world = new World({
	name: 'test',
	world_path: WORLD_PATH,
	start_room: 'lobby',
	port: '1111'
});

var living = new actor();
living.world = world;
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
