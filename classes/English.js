String.implement({

	/** 
	 * Outputs the article ("a" or "an") of a string based on very simple rules.
	 * 
	 * For exceptional cases, it is necessary to manually set the determinate
	 * using set_determinate();
	 */
	getArticle: function() {
		if (['a','e','i','o','u'].contains(this[0])) return "an";
		return "a";
	},
	
	/**
	 * Ensures that a given string is a "sentence" by enforcing a capital
	 * beginning letter and a punctuation mark at the end. Will default to a
	 * period as ending punctuation for now, until I can get the irony mark
	 * to render correctly.
	 */
	makeSentence: function() {
		var str = this.trim();
		str = this.charAt(0).toUpperCase() + this.slice(1);
		if (!str.match(/[?!\.]$/)) str = str+'.';
		return str;
	},

	/**
	 * Determines the plural form of the singular short.
	 *
	 * For exceptional cases, it is necessary to manually set the plural
	 * form using set_plural().
	 */
	getPlural: function() {
		//Pluralizes the first part in "<x> of <y>"
		var bundle = this.match(/(\w+)\sof\s\w+/);
		if (bundle) return this.replace(bundle[1], bundle[1].getPlural());
		str = this.replace(/([^aeiou])y$/, '$1ies');
		if (str==this) str = str.replace(/([ch|sh|x|s|o])$/, '$1es');
		if (str==this) str += 's';
		return str;
	},

	pluralize: function() {
		return this.getPlural();
	},

	/**
	 * Converts a string and its placeholders to plain text.
	 */
	expand: function(actor, target, vars) {

		var a = {
			name: actor.get('definite'),
			gender: actor.gender
		};

		var t = {};
		if (target) {
			t.name = target.get('definite');
			t.gender = target.get('gender');
		} else {
			t.name = 'NULL';
			t.gender = 0;
		}

		var pronouns = {
			sub:  ['it', 'he', 'she'],
			obj:  ['it', 'him', 'her'],
			pos:  ['its', 'his', 'her'],
			ref:  ['itself', 'himself', 'herself'],
			hers: ['its', 'his', 'hers']
		};

		Object.each(pronouns, function(v,k) {
			a[k] = v[a.gender] || v[0];
			if (target) { t[k] = v[t.gender] || v[0]; }
		});

		//Replacements: what the actor sees and what the target sees.
		var actor_tags = {
			'You'      : ['You',      a.name],
			"yourself" : ["yourself", a.ref],
			"your"     : ["your",     a.pos],
			'you'      : ['you',      a.sub],
			'thee'     : ['you',      a.obj],
			"yours"    : ["yours",    a.hers],
			"Your"     : ["Your",     a.name+"'s"],
			'has'      : ['have',     'has'],
			'is'       : ['are',      'is']
		};

		var target_tags = {
			'Name'     : ['You',      t.name],
			'They'     : ['You',      t.name],
			'Name'     : ['you',      t.name],
			'they'     : ['you',      t.sub],
			'them'     : ['you',      t.obj],
			"theirs"   : ["yours",    t.hers],
			"their"    : ["your",     t.pos],
			"Their"    : ["your",     t.name+"'s"],
			"themself" : ["yourself", t.ref],
			'HAS'      : ['have',     'has'],
			'IS'       : ['are',      'is']
		};

		var actor_suffixes = {
			's'        : ['', 's'],
			'es'       : ['', 'es'],
			'ies'      : ['y', 'ies'],
			"'s"       : ["'re'", "'s"]
		};

		var target_suffixes = {
			'S'        : ['', 's'],
			'ES'       : ['', 'es'],
			'IES'      : ['y', 'ies'],
			"'S"       : ["'re", "'s"]
		};

		var str = this, str_actor = this, str_target=this, str_others=this;

		Object.each(actor_suffixes, function(replace, tag) {
			var tag = new RegExp('%'+tag+'(\\s?)', 'g');
			if (!str.match(tag)) { return; }
			str_actor  = str_actor.replace(tag, replace[0]+"$1");
			if (target) {
				str_target = str_target.replace(tag, replace[1]+"$1");
			}
			str_others = str_others.replace(tag, replace[1]+"$1");
		});

		Object.each(actor_tags, function(replace, tag) {
			var tag = new RegExp('%'+tag+'(\\s?)', 'g');
			if (!str.match(tag)) { return; }
			str_actor  = str_actor.replace(tag, replace[0]+"$1");
			if (target) {
				str_target = str_target.replace(tag, replace[1]+"$1");
			}
			str_others = str_others.replace(tag, replace[1]+"$1");
		});

		//No need to waste time processing target tags if there's no target.
		if (target) {

			Object.each(target_suffixes, function(replace, tag) {
				var tag = new RegExp('%'+tag+'(\\s?)', 'g');
				if (!str.match(tag)) { return; }
				str_actor  = str_actor.replace(tag, replace[1]+"$1");
				if (target) {
					str_target = str_target.replace(tag, replace[0]+"$1");
				}
				str_others = str_others.replace(tag, replace[1]+"$1");
			});

			Object.each(target_tags, function(replace, tag) {
				var tag = new RegExp('%'+tag+'(\\s?)', 'g');
				if (!str.match(tag)) { return; }
				str_actor  = str_actor.replace(tag, replace[1]+"$1");
				if (target) {
					str_target = str_target.replace(tag, replace[0]+"$1");
				}
				str_others = str_others.replace(tag, replace[1]+"$1");
			});

		} else {
			str_target = str_others;
		}

		strs = [str_actor, str_target, str_others];

		//Auto-capitaliztion
		strs.each(function(str, i) {
			var matches = str.match(/[\.\?!]\s+[a-z]/);
			if (!matches) { return; }
			matches.each(function(m) {
				strs[i] = str.replace(m, m.toUpperCase());
			});
		});
	
		return strs;

	}

});

Number.implement({

	/** 
	 * Converts a number up to whatever comes after the trillions into English.
	 */
	toWord: function() {
		var n = this;
		if (n<20) {
			return [
				'zero', 'one', 'two', 'three', 'four', 'five',
				'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
				'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
				'seventeen', 'eighteen', 'nineteen' ][n];
		} else if (n<100) {
			var tens = Math.floor(n/10);
			var ones = n%10;
			return [
				'twenty', 'thirty', 'forty', 'fifty', 'sixty',
				'seventy', 'eighty', 'ninety'
			][tens-2]+'-'+ones.toWord();
		} else if (n<1000) {
			var hundreds = Math.floor(n/100);
			var tens = n%100;
			return hundreds.toWord()+' hundred and '+tens.toWord();
		}

		var places = ['thousand', 'million', 'billion', 'trillion'];
		var d   = Math.floor(new String(n).length/3);
		var pow = Math.pow(1000, d);
		var principle = Math.floor(n/pow);
		var remainder = n%pow;
		return principle.toWord()+' '+places[d-1]+' '+remainder.toWord();
	}

});

Array.implement({

	/**
	 * Serializes the array with commas, topped off ith an 'and' at the end.
	 */
	conjoin: function() {
		if (this.length==0) return false;
		//Don't want to modify the list!
		var items = this;
		if (items.length>1) items[items.length-1] = 'and '+items.getLast();
		if (items.length>2) return items.join(', ');
		return items.join(' ');
	}

});
