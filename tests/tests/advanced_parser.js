var brush = new Class({

	Extends: Item,

	create: function() {
		this.set_short('scrubbing brush');
		this.set_long(
			"This is a rectangular brush with coarse bristles, the "+
			"kind used for polishing jewelery or scrubbing floors."
		);
		this.add_command('polish', [
			'<indirect:object> with <direct:object>',
			'<indirect:object> using <direct:object>'
		]);
		this.add_command('rebristle', '<direct:object>');
		this.add_command('scrub', 'floor');
	},

	do_polish: function(actor, item, me) {
		actor.emit("You polish "+item.get('definite')+" with "+me.get('definite')+".");
	},

	do_rebristle: function(actor, me) {
		actor.emit("%You rebristle%s "+me.get('definite'));
	}

});

var locket = new Class({

	Extends: Item,

	create: function() {
		this.set_short('brass locket');
		this.set_long("This is a small locket.");
		this.add_command('open', '<direct:object>', 'whoah');
	},

	whoah: function(actor, me) {
		return "There are narwhals inside!";	
	}

});

var toothbrush = new Class({

	Extends: Item,

	create: function() {
		this.set_short("toothbrush");
		this.add_command("polish", "<indirect:object> with <direct:object>");
	},

	do_polish: function(actor, obj, me) {
		actor.emit("You polish "+obj.get('definite')+" with "+me.get('definite')+".");
	}

});


var polisher = new Class({

	Extends: Living,

	create: function() {

		this.set_short('polisher');

	}

});

var world = new World({
	name: 'test',
	world_path: WORLD_PATH,
	start_room: 'lobby',
	port: '1111'
});

var living = new polisher();
living.world = world;
living.moveTo('lobby');
living.addItem(new brush());
living.addItem(new locket());
living.addItem(new toothbrush());

describe('advanced parsing', {

	'getArgument should return string arguments': function() {
		var parser = new brush();
		var args = new AdvancedParser().extractArguments(
			"locket with brush",
			"<indirect:object> with <direct:object>"
		);
		var expected = '[{"str":"locket","tag":"indirect:object"},{"str":"brush","tag":"direct:object"}]';
		var result = JSON.encode(args);
		assert.equal(expected, result);
	},

	'polish locket with brush: <direct:object> and <indirect:object> from caller inventory': function() {
		living.testCommand( 
			"polish locket with brush",
			"You polish the brass locket with the scrubbing brush."
		);
	},

	'polish locket using brush: alternate syntax (using vs. with)': function() {
		living.testCommand( 
			"polish locket with brush",
			"You polish the brass locket with the scrubbing brush."
		);
	},

	'polish brush with brush: direct object called instead of indirect': function() {
		living.testCommand(
			"polish brush with brush",
			"You can't do that with the scrubbing brush."
		);
	},

	'rebristle locket: indirect object called instead of direct': function() {
		living.testCommand(
			"rebristle locket",
			"You can't do that with the brass locket."
		);
	},

	'open locket: single argument <direct:object>, no delimiters, custom handler': function() {
		living.testCommand(
			'open locket',
			'There are narwhals inside!'
		);
	},

	'polish brush with toothbrush: pass through failures': function() {
		living.testCommand(
			"polish brush with toothbrush",
			"You polish the scrubbing brush with the toothbrush."
		);
	},
	
	'take object from environment': function(){
		var player = new Player();
		player.name = 'trogdor';
		player.enterWorld(world);
		player.moveTo('lobby');
		player.testCommand(
			'take strawberry',
			"You take the strawberry."
		);
	},

	'feed strawberry to rat: <indirect:living> within room': function() {
		var player  = new Player();
		player.name = 'trogdorr';
		player.enterWorld(world);
		player.moveTo('lobby');
		player.do('look');
		player.do('materialize strawberry');
		player.testCommand(
			'feed strawberry to rat',
			"You feed the strawberry to the lab rat."
		);
	},
	
	'room command (pull lever)': function() {
		living.testCommand('pull lever', 'You pull the lever.');
	}

});
