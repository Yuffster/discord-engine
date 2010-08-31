exports.item = new Class({

	Extends: Item,

	create: function() {
		var color = this.get_color();
		if ([1,2,4,5].getRandom()==5) {
			color = color+' and '+this.get_color();
		}
		var type = this.get_type();
		var material = '';
		if ([1,2,3].getRandom()!=3) {
			material = this.get_material()+' ';
		}
		var pair = '';
		if ([1,2,4,5].getRandom()==1) {
			pair = 'pair of ';
			type = this.get_type_pair();
		}
		this.set_long("This is a freaking awesome "+type+".");
		this.set_short('a '+pair+color+' '+material+type);
		this.set_aliases([type, color.trim()]);
	},

	on_equp: function(player) {
		player.send("Cool "+type+"!");
	}

});
