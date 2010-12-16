exports.main = new Class({

	Extends: Item,

	create: function() {
	
		this.set_short('strawberry');

		this.add_adjective('berry');

		this.set_long(
			'This is a fresh strawberry that has been left here for unknown '+
			'reasons.  It looks like it will somehow remain fresh forever.'
		);

		this.add_command('feed', '<direct:object> to <indirect:living>');

	},

	/* This method will be fed all the arguments after 'to', assuming that the
	   first bit of the command matches this object.
	*/
	do_feed: function(item, target) {
		if (!target) {
			this.emit(
				"%You attempt%s to feed "+this.get('short')+" to %their "+
			    "imaginary friend."
			); return true;
		}
		this.living.removeItem(item);
		this.living.emit("%You feed%s "+this.get('short')+" to %Name.", target);
		return "You feel kinder!";
	}

});
