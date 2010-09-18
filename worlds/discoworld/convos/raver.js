new Class({

	Extends: Conversation,

	start: function() {
		this.say("Yo, what's up?");
		return {
			"'Sup?": 'Not much.',
			"Nothing.": "Bummer, I was hoping there'd be something to do around here.",
			"You don't seem like you belong here...": this.belong_here
		};
	},

	belong_here: function() {
		this.say("What?  What's that supposed to mean?");
		return {
			"It's the disco-era and you're a raver.": this.belong_here2,
			"What year is it?": this.what_year
		};
	},

	belong_here2: function() {
		this.say("No way, man.  All the crazy lights and stuff, definitely a rave.");
	},

	what_year: function() {
		this.say("What kind of question is that?");
		return {
			'Humor me.': this.year_2005
		};
	},

	year_2005: function() {
		this.emote("grins at %you.");
		this.say("Sure.  It's 2005.");
		return {
			"I see. Thanks...": this.confused_end,
			"No, it's not, it's 1975.": this.year_1975
		};
	},

	year_1975: function() {
		this.say("You're kidding me.");
		return {
			'No, seriously.': this.awesome_1975,
			'Yeah.': "Very funny."
		}
	},

	awesome_1975: function() {
		this.say("Woah, man.");
		this.emote("stares over %your shoulder, thinking.");
		//The NPC will stop for five heartbeats before continuing.
		//(Just queuing up no command.)
		this.pause(5);
		this.say("I'm gonna go get some rollerskates.");
	},

	respond_to_party: function() {
		this.say("I have no idea what's up with this party, man.");
	},

	respond_to_time_travel: function() {
		this.say("Sorry, I can't talk about the DeLorean, man.");
	},

	confused_end: function() {
		this.emote("cocks his head at %you.");
		this.say("You're weird, dude.");
	}

});
