exports.item = new Class({

	Extends: Item,

	create: function() {
		var color = this.get_color();
		if ([1,2,4,5].getRandom()==5) {
			var color = color+' and '+this.get_color();
		}
		var material = '';
		if ([1,2,3].getRandom()!=3) {
			material = this.get_material()+' ';
		}
		this.set_long("This is a freaking awesome "+type+".");
		this.set_short('a '+color+' '+material+type);
		this.set_aliases(['hat']);
	},

	on_equp: function(player) {
		player.send("Cool hat!");
	}

});
