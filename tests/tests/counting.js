var world = new World({
	name: 'test',
	world_path: WORLD_PATH,
	start_room: 'lobby',
	port: '1111'
});

var Strawberry = new Class({
	
	Extends: Item,
	
	create: function() {
		this.set_short('strawberry');
	}
	
});

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