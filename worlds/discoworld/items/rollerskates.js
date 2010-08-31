exports.item = new Class({

	Extends: Item,

	create: function() {
		this.set_long("This pair of rollerskates is amazing.");
		this.set_short("a pair of "+this.get_material()+" "+this.get_color()+" roller skates");
		this.set_aliases(['skates', 'rollerskates']);
	},

	on_equip: function(player) {
		player.set('long', player.genderize("%you're skating around like a boss!"));
		player.emit("%You strap%s on %your skates and start rolling around.");
		player.send('You feel like one cool '+((player.gender=='male') ? 'dude' : 'gal')+ '!');
	},

	on_remove: function(player) {
		player.long = '';
		player.send("You suddenly feel a lot less awesome.");
	}

});
