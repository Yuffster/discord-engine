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

	do_polish: function(item, me) {
		return "You polish "+item.get('definite')+" with "+me.get('definite')+".";
	},

	do_rebristle: function(me) {
		if (!me) { return "WTF?"; }
		return "You rebristle "+me.get('definite')+".";
	}

});

var locket = new Class({

	Extends: Item,

	create: function() {
		this.set_short('brass locket');
		this.set_long("This is a small locket.");
		this.add_command('open', '<direct:object>', 'whoah');
	},

	whoah: function(me) {
		return "There are narwhals inside!";	
	}

});

var toothbrush = new Class({

	Extends: Item,

	create: function() {
		this.set_short("toothbrush");
		this.add_command("polish", "<indirect:object> with <direct:object>");
	},

	do_polish: function(obj, me) {
		return "You polish "+obj.get('definite')+" with "+me.get('definite')+".";
	}

});


var polisher = new Class({

	Extends: Living,

	create: function() {
	}

});

var world = new World({
	name: 'test',
	world_path: 'example_world',
	start_room: 'lobby',
	port: '1111'
});

var living = new polisher();
living.world = world;
living.addItem(new brush());
living.addItem(new locket());
living.addItem(new toothbrush());


var successMessage = "You polish the brass locket with the scrubbing brush.";
describe('advanced parsing', {

	'getArgument should return string arguments': function() {
		var parser = new brush();
		var args = new AdvancedParser().extractArguments(
			"<indirect:object> with <direct:object>",
			"locket with brush"
		);
		var expected = '[{"str":"locket","tag":"indirect:object"},{"str":"brush","tag":"direct:object"}]';
		var result = JSON.encode(args);
		assert.equal(expected, result);
	},

	'polish locket with brush: <direct:object> and <indirect:object> from caller inventory': function() {
		var result = living.do("polish locket with brush");
		assert.equal(result, successMessage);
	},

	'polish locket using brush: alternate syntax (using vs. with)': function() {
		var result = living.do("polish locket using brush");
		assert.equal(result, successMessage);
	},

	'polish brush with brush: direct object called instead of indirect': function() {
		var result = living.do("polish brush with brush");
		assert.equal(result, "You can't do that with the scrubbing brush.");
	},

	'rebristle locket: indirect object called instead of direct': function() {
		var result = living.do("rebristle locket");
		assert.equal(result, "You can't do that with the brass locket.");
	},

	'open locket: single argument <direct:object>, no delimiters, custom handler': function() {
		var result = living.do("open locket");
		assert.equal(result, "There are narwhals inside!");
	},

	'polish brush with toothbrush: pass through failures': function() {
		var result = living.do("polish brush with toothbrush");
		assert.equal(result, "You polish the scrubbing brush with the toothbrush.");
	},

	'feed strawberry to rat': function() {
		var player = new Player();
		player.name = 'trogdor';
		player.enterWorld(world);
		player.moveTo('lobby');
		player.do('take strawberry');
	}

});
