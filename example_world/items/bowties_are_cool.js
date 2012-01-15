/**
 * Randomly generates a disco-themed item on creation.
 */
module.exports =  new Class({

	Extends: Item,

	create: function() {

		var color = this.get_color()+' ';
		if ((Math.random()*5).floor()==5) {
			color = color.trim();
			var extra = this.get_color();
			if (color != extra) color += ' and '+color;
			else color = 'bright '+color;
			color += ' ';
		}
		var material = this.get_material()+' ';
		var finish   = this.get_finish()+' ';
		var fit      = this.get_fit()+' ';
		var type     = this.get_type();
		var extra    = this.get_extra()+' ';

		var pair = '';
		if ((Math.random()*6).floor==1) {
			pair = 'pair of ';
			type = this.get_type_pair();
		}

		var coolLevel = (Math.random()*11).floor();
		var coolness = [
			'god-awful', 'hideous', 'dingy', 'dated', 'generic',
			'stylish', 'trend-setting', 'stunning', 'fabulous',
			'jaw-dropping', 'freaking awesome'
		];
		var bestness = [
			'imitation', 'flawed', 'stained', 'low-grade', 'mediocre',
			'passable', 'fine', 'expensive', 'rare-quality', 'super-high quality'
		];
		
		var style = coolness[coolLevel]+' ';

		var extra = '';
		if ((Math.random()*5).floor()==1) { extra = this.get_extra(); }

		var desc = "This is a "+coolness[coolLevel]+' '+type;
			desc += ' made of ';
			if (bestness[coolLevel]) desc += bestness[coolLevel]+' ';
			desc += material.trim()+', ';
			desc += 'dyed '+color+' ';
			desc += 'with a '+finish+' finish.';
			desc += '  The fit is '+fit.trim()+'.';
		desc = desc.replace(/\s+/g, ' ');

		this.set_long(desc);

		if (Math.chance(20)) color    = '';
		if (Math.chance(90)) material = '';
		if (Math.chance(90)) extra    = '';
		if (Math.chance(90)) fit      = '';
		if (Math.chance(90)) style    = '';

		this.set_short(style+pair+fit+color+material+type);
		this.set_aliases([type, color.trim(), material.trim()]);
	},

	on_equp: function(player) {
		player.send("Cool "+type+"!");
	},

	get_extra: function() {
		return ['rhinestone-encrusted', 'polka-dotted', 'ruffled'].getRandom();
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

	get_fit: function() {
		var fits = [
			'flowing', 'tight', 'skintight', 'baggy', 'oversized', 'tailored'
		];
		return fits.getRandom();
	},

	get_finish: function() {
		var lusters = [
			'dull', 'shiny', 'fuzzy', 'sparkling', 'glittery',
			'shimmering'
		];
		return lusters.getRandom();
	},

	get_type: function() {
		return [
			'jacket', 'hat', 'shirt', 'bracelet', 'scarf', 'bowtie', 'skirt',
			'fez', 'beret', 'necktie'
		].getRandom();
	},

	get_type_pair: function() {
		return [
			'gloves', 'pants', 'rollerskates', 'bracelets', 'shoes', 'boots',
			'legwarmers', 'sneakers', 'flip-flops', 'hotpants', 'sunglasses',
			'bellbottoms'
		].getRandom();
	}

});
