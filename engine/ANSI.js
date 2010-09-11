//ANSI color and style codes.
ANSI = {

	'prefix':    "\u001B[",
	'suffix':    "m",

	//Styles
	
	'reset':       0,
	'bold':        1,
	'/bold':      22,
	'italic':      3,
	'/italic':    23,
	'underline':   4,
	'/underline': 24,
	'strike':      9,
	'/strike':    29,
	
	//Colors
	
	'black':      30,
	'red':        31,
	'green':      32,
	'yellow':     33,
	'blue':       34,
	'purple':     35,
	'cyan':       36,
	'white':      37,
	'default':    39,

	'get': function(color) {
		code = this[color];
		if (code===false) return 0;
		return this.prefix+code+this.suffix;
	},

	'test': function() {
		new Hash(this).each(function(code,color) {
			if (['get','test','prefix','suffix'].contains(color)) return;
			sys.puts(ANSI.get(color)+"This line is "+color+".");
		});
	}

};

String.implement({

	style: function() {
		var str    = this;
		var styles = str.match(/\%\^(\w+)\%\^/g);
		if (!styles) return this;
		styles.each(function(s) {
			var color = s.replace(/\%\^/g, '').toLowerCase();
			str = str.replace(s, ANSI.get(color));
		});
		return str+ANSI.get('reset');
	}

});
