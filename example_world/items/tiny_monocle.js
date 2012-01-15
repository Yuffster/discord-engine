module.exports =  new Class({

	Extends: Item,

	create: function() {
	
		this.set_short('tiny monocle');

		this.set_long(
			"At first, you almost mistook this tiny monocle for a piece of "+
			"confetti.  It's bordered in delicate gold and a thread-thin "+
			"chain of silver hangs from it."
		);

	},

	on_equip: function(lv) {
		if (!lv.matches('rat')) { 
			lv.send("You attempt to wear the monocle, but it's far too small.");
			return false;
		}
	}

});
