//ANSI color and style codes.
ANSI = {

	'prefix'    : "\u001B[",
	'suffix'    : "m",

	//Styles
	
	'reset'     :  0,
	'bold'      :  1,
	'/bold'     : 22,
	'italic'    :  3,
	'/italic'   : 23,
	'underline' :  4,
	'/underline': 24,
	'conceal'   :  8,
	'strike'    :  9,
	'/strike'   : 29,
	'reverse'   :  7,
	'blink'     :  5,
	'blink2'    :  6,
	
	//Colors
	
	'black'     : 30,
	'red'       : 31,
	'green'     : 32,
	'yellow'    : 33,
	'blue'      : 34,
	'purple'    : 35,
	'cyan'      : 36,
	'white'     : 37,
	'default'   : 39,

	//Backgrounds

	'bgblack'   : 40,
	'bgred'     : 41,
	'bggreen'   : 42,
	'bgyellow'  : 43,
	'bgblue'    : 44,
	'bgpurple'  : 45,
	'bgcyan'    : 46,
	'bgwhite'   : 47,
	'bgdefault' : 49,

	'get': function(color) {
		code = this[color];
		if (code===false) return 0;
		return this.prefix+code+this.suffix;
	},

	'test': function() {
		Object.each(this, function(code,color) {
			if (['get','test','prefix','suffix'].contains(color)) return;
			sys.puts(ANSI.get(color)+"This line is "+color+"."+ANSI.get('reset'));
		});
	}

};

String.implement({

	style: function(style) {
		if (Styles[style]) {
			var classes = (Styles[style]);
			if (!classes.each) classes = [classes];
			var codes = '';
			var reset = ANSI.get('reset');
			classes.each(function(color) {
				if (color == 'noreset') reset = '';
				else codes += ANSI.get(color);
			});
			return codes+this+ANSI.get('reset');
		}
		return this;
	},

	color: function(colors) {
		if (!colors.each) colors = [colors];
		var code = '';
		colors.each(function(color) {
			code+=ANSI.get(color);
		});
		return code+this+ANSI.get('reset');
	},

	parseCodes: function(style) {
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
