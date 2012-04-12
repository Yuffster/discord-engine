Prompts = {

	login: function(data) {
		if (!data) {
			this.send("Please enter your name: ");
			return;
		}
		name = data.split(' ').shift();
		if (name.match(/\W|\d/)) {
			this.send("Letters only, please.");
			return;
		}
		if (this.world.getPlayer(name)) {
			this.send(name+" is already connected.  Please try another name.");
		}
		this.name = name;
		this.prompt(Prompts.gender, "Are you (M)ale or (F)emale?");
	},

	gender: function(data) {
		data = data.toLowerCase();
		if (!data || !['m','f'].contains(data)) {
			this.send("That's not a valid choice.  (M)ale or (F)emale?");
			return;
		}
		this.gender = (data=='m') ? 'male' : 'female';
		this.enterWorld();
		this.prompt(Prompts.command);
	},

	password: function(data) {
		if (data!='letmein') {
			this.send("Password invalid, please try again (the password is 'letmein').");
		} else {
			this.setPrompt(Prompts.command);
		}
	},

	command: function(data) {
		this.send_raw("> "+data, 'prompt');
		this.queueCommand(data);
	}

};
