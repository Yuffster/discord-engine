String.implement({

	wordwrap: function(n, br) {
		n  = n  || 80;
		br = br || '\n';
		var patt = '(.{1,'+n+'})( +|$\n?)|(.{1,10})';
		return this.match(new RegExp(patt, 'g')).join(br);
	}

});
