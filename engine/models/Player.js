Player = new Class({


	Extends: Living,
	player: true,
	currentPrompt: null,

	/**
	 * The main engine will add an event to the player object to output data.
	 */
	send: function(message, style) {
		if (!message) return;
		if (!message.each) message = [message];
		message.each(function(line) {
			if (!line) return;
		    var f = line.charAt(0).toUpperCase();
			line  = f + line.substr(1);
			this.fireEvent('output', [line,style]);
		}, this);
	},

	prompt: function(fun, message) {
		this.setPrompt(fun.bind(this));
		this.send(message);
	},

	setPrompt: function(fun) {
		this.currentPrompt = fun;
	},

	/**
	 * And nonplayer objects won't be sending any data packets to the engine,
	 * so we don't need that method there.
	 */
	onInput: function(data) {
		this.currentPrompt.bind(this)(data.trim());
	},

	/**
	 * Puts the player in the world.
	 */
	enterWorld: function(world) {
		if (!world) world = this.world;
		if (world.getPlayer(this.get('name'))) return false;
		this.gender = 'female';
		world.addPlayer(this);
		this.world = world;
		this.set('location', 'lobby');
		this.force('look');
		return true;
	},

	disconnect: function() {
		this.world.removePlayer(this);
		this.fireEvent('quit');
	},

	on_birth: function() {

	},

	on_login: function() {

	}

});
