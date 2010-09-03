English = new Class({

	short: null,
	plural: null,
	determinate: null,

	/** 
	 * Outputs "the", "a", or "an" based on the short of the item.
	 * 
	 * For exceptional cases, it is necessary to manually set the determinate
	 * using set_determinate();
	 */
	getDeterminate: function() {
		if (this.determinate) return this.determinate;
		if (['a','e','i','o','u'].contains(this.short[0])) return "an";
		return "a";
	},

	set_determinate: function(str) {
		this.determinate = str;
	},

	/**
	 * Determines the plural form of the singular short.
	 *
	 * For exceptional cases, it is necessary to manually set the plural
	 * form using set_plural().
	 */
	pluralize: function() {
		var original = this.short;
		var str = original; 
		if (this.plural) return this.plural;
		str = str.replace(/[^aeiou]y$/, 'ies');
		if (str==original) str = str.replace(/([ch|sh|x|s|o])$/, '$1es');
		if (str==original) str += 's';
		return str;
	},

	set_plural: function(str) {
		this.plural = str;
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
