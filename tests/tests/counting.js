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

var Rat = new Class({
	
	Extends: Living,
	
	create: function() {
		this.set_short('rat');
	}
	
});

var Guy = new Class({
	
	Extends: Living,
	
	create: function() {
		this.set_short('guy');
	}
	
});

var Setting = new Class({
	
	Extends: Room,
	
	create: function() {
		this.set_short('an empty room');
	}
	
});

function getGuy() {
	var guy = new Guy();
	guy.world = makeWorld();
	new Setting().addLiving(guy);
	guy.look = function(mess) {
		guy.do('look');
		assert.equal(mess, guy.messageLog[guy.messageLog.length-1]);
	}
	return guy;
};

describe('item counts in inventory', {
	
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

describe('item counts in surroundings', {
	
	'one of an item shows up as one': function() {
		var guy = getGuy();
		guy.get('room').addItem(new Strawberry());
		guy.testCommand('look', 'A strawberry is on the ground.');
	},

	'between 2 and 19 of an item should show up as the number': function() {
		var guy = getGuy();
		guy.get('room').addItem(new Strawberry());
		for (var i=2;i<=19;i++) {
			guy.get('room').addItem(new Strawberry());
			guy.testCommand('look', i.toWord().capitalize()+' strawberries are on the ground.');
		};	
	},

	'between 20 and 100 of an item should show up as dozens': function() {
		var guy = getGuy();
		(20).times(function() { guy.get('room').addItem(new Strawberry()); });
		guy.testCommand('look', 'Dozens of strawberries are on the ground.');
		(80).times(function() { guy.get('room').addItem(new Strawberry()); });
		guy.testCommand('look', 'Dozens of strawberries are on the ground.');
	},

	'between 101 and 200 of an item should show up as over a hundred': function() {
		var guy = getGuy();
		(101).times(function() { guy.get('room').addItem(new Strawberry()); });
		guy.testCommand('look', 'Over a hundred strawberries are on the ground.');
		(99).times(function() { guy.get('room').addItem(new Strawberry()); });
		guy.testCommand('look', 'Over a hundred strawberries are on the ground.');
	},

	'>100 of an item should show up as hundreds': function() {
		var guy = getGuy();
		(201).times(function() { guy.get('room').addItem(new Strawberry()); });
		guy.testCommand('look', 'Hundreds of strawberries are on the ground.');
	}

});

describe('npc counts', {
	
	'one of an NPC shows up as one': function() {
		var guy = getGuy();
		guy.get('room').addLiving(new Rat());
		guy.look('A rat is standing here.');
	},

	'between 2 and 19 of an NPC should show up as the number': function() {
		var guy = getGuy();
		guy.get('room').addLiving(new Rat());
		for (var i=2;i<=19;i++) {
			guy.get('room').addLiving(new Rat());
			guy.look(i.toWord().capitalize()+' rats are standing here.');
		};	
	},

	'between 20 and 100 of an NPC should show up as dozens': function() {
		var guy = getGuy();
		(20).times(function() { guy.get('room').addLiving(new Rat()); });
		guy.look('Dozens of rats are standing here.');
		(80).times(function() { guy.get('room').addLiving(new Rat()); });
		guy.look('Dozens of rats are standing here.');
	},

	'between 101 and 200 of an NPC should show up as over a hundred': function() {
		var guy = getGuy();
		(101).times(function() { guy.get('room').addLiving(new Rat()); });
		guy.look("Over a hundred rats are standing here.");
		(99).times(function() { guy.get('room').addLiving(new Rat()); });
		guy.look("Over a hundred rats are standing here.");
	},

	'>100 of an NPC should show up as hundreds': function() {
		var guy = getGuy();
		(201).times(function() { guy.get('room').addLiving(new Rat()); });
		guy.look("Hundreds of rats are standing here.");
	}
	
});