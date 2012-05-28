var Brush = new Class({

	Extends: Item,

	create: function() {
		this.set_short('scrubbing brush');
		this.set_long(
			"This is a rectangular brush with coarse bristles, the "+
			"kind used for polishing jewelery or scrubbing floors."
		);
		this.add_command('polish', '<indirect:object> with <direct:object>');
	},

	do_polish: function(actor, item, me) {
		if (item.has_attribute('shiny')) {
			actor.send(item.get('definite')+' is already shiny.');
		} else {
			actor.emit("You polish "+item.get('definite')+" with "+me.get('definite')+".");
			item.add_attribute('shiny');
			item.remove_attribute('dirty');
		}
	}

}), brush = new Brush();

var Locket = new Class({

	Extends: Item,

	create: function() {
		this.add_attribute('dirty');
		this.set_short('brass locket');
		this.set_long("This is a small locket.");
	}

}), locket = new Locket();

var Strawberry = new Class({
	
	Extends: Item,
	
	create: function() {
		this.set_short('strawberry');
	}
	
});

var Polisher = new Class({

	Extends: Living,

	create: function() {

		this.set_short('polisher');

	}

}), living = new Polisher();

var world = new World({
	name: 'test',
	world_path: WORLD_PATH,
	start_room: 'lobby',
	port: '1111'
});

living.world = world;
living.moveTo('lobby');
living.addItem(brush);
living.addItem(locket);

function getGuy() {
	var guy = new Living();
	guy.world = world;
	guy.moveTo('lobby');
	return guy;
};

describe('item counts', {
	
	'one of an item shows up as one': function() {
		var guy = getGuy();
		guy.addItem(new Strawberry());
		guy.testCommand('inventory', 'You are carrying a strawberry.');
	},

	'between 2 and 19 of an item should show up as the number': function() {
		var guy = getGuy();
		guy.addItem(new Strawberry());
		for (var i=2;i<=19;i++) {
			guy.addItem(new Strawberry());
			guy.testCommand('inventory', 'You are carrying '+i.toWord()+' strawberries.');
		};	
	},

	'between 20 and 100 of an item should show up as dozens': function() {
		var guy = getGuy();
		(20).times(function() { guy.addItem(new Strawberry()); });
		guy.testCommand('inventory', 'You are carrying dozens of strawberries.');
		(80).times(function() { guy.addItem(new Strawberry()); });
		guy.testCommand('inventory', 'You are carrying dozens of strawberries.');
	},

	'between 101 and 200 of an item should show up as over a hundred': function() {
		var guy = getGuy();
		(101).times(function() { guy.addItem(new Strawberry()); });
		guy.testCommand('inventory', 'You are carrying over a hundred strawberries.');
		(99).times(function() { guy.addItem(new Strawberry()); });
		guy.testCommand('inventory', 'You are carrying over a hundred strawberries.');
	},

	'>100 of an item should show up as hundreds': function() {
		var guy = getGuy();
		(201).times(function() { guy.addItem(new Strawberry()); });
		guy.testCommand('inventory', 'You are carrying hundreds of strawberries.');
	}

});

describe('item attributes', {

	'items should be able to have attributes upon initialization': function() {
		assert.equal(locket.has_attribute('dirty'), true);
	},

	'attributes may be added during interactions': function() {
		living.do("polish locket with brush");
		assert.equal(locket.has_attribute('shiny'), true);
	},

	'attributes may be removed': function() {
		living.do("polish locket with brush");
		assert.equal(locket.has_attribute('dirty'), false);
	}

});
