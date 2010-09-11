exports.item = new Class({

	Extends: Item,

	create: function() {
		this.set_long("This pair of rollerskates is amazing.");
		this.set_short("pair of "+this.get_material()+" "+this.get_color()+" roller skates");
		this.set_aliases(['skates', 'rollerskates']);
	},

	on_equip: function(player) {
		player.set('long', player.genderize("%you're skating around like a boss!"));
		player.emit("%You strap%s on %your skates and start rolling around.");
		player.send('You feel like one cool '+((player.gender=='male') ? 'dude' : 'gal')+ '!');
	},
	
	get_color: function() {
		return ['green', 'silver', 'red', 'purple', 'yellow', 'neon pink'].getRandom();
	},

	get_material: function() {
		mats =  [
			'leather', 'velvet', 'pleather', 'silk', 'satin', 'corduroy', 'cotton'
		];
		return mats.getRandom();
	},

	on_remove: function(player) {
		player.long = '';
		player.send("You suddenly feel a lot less awesome.");
	}

});
