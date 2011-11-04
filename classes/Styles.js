//Color styles for outputting classed text to the terminal.
Styles = {

	'tell'         : ['bold','yellow'],
	'speech'       :  'cyan',
	'exits'        :  'green',
	'peril'        : ['bold', 'red'],
	'label'        :  'purple',
	'redacted'     : ['black', 'bgblack'],
	'reset'        : ['reset']

};

String.implement({

	style: function(style) {
		if (Styles[style]) {
			var classes = (Styles[style]),my=this;
			if (!classes.each) classes = [classes];
			classes.each(function(color) {
				my = my.color(color);
			});
		} return this;
	},

});
