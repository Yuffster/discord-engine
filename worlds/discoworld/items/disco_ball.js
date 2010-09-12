new Class({

	Extends: Item,

	create: function() {

		this.set_short('disco ball');
		this.set_long('This disco ball is all sparkly and stuff.');

	},

	on_equip: function(player) {
		player.emit("%You tr%y to wear the disco ball as a hat and fail%s.");
		return false;
	}

});
