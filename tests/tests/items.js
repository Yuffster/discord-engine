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

var Polisher = new Class({

	Extends: Living,

	create: function() {

		this.set_short('polisher');

	}

}), living = new Polisher();

living.world = makeWorld();
living.moveTo('lobby');
living.addItem(brush);
living.addItem(locket);

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
