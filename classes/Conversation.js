Conversation = new Class({

	//The player character in the conversation.
	player: null,
	//The (main) NPC in the conversation.
	target: null,
	//The next method to be run.
	nextAction: this.start,
	//The set of current options.
	currentOptions: [],
	//An integer representing how much the target likes the player.
	//(Stored in the NPC's memory; generic NPCs pool the same memory.)
	relationship: 0,
	//Flags determining what the target and player have been through.
	history: {},
	//Remember where the player was so we can put them back again.
	lastPrompt: null,

	initialize: function(player, target) {
		this.player = player;
		this.target = target;
		//later, we'll pull out the history and relationship from 
		//the player or NPC save.
		this.startConversation();
	},

	startConversation: function(about) {
		this.player.fireEvent('conversationStart');
		this.lastPrompt = this.player.get('prompt');
		//We pass the second argument so that the prompt isn't bound to the
		//player by default.
		this.player.setPrompt(this.parseInput, this);
		this.advanceConversation(this.start);
	},

	endConversation: function(text) {
		if (text) this.say(text);
		else this.end();
		this.player.fireEvent('conversationEnd');
		this.player.setPrompt(this.lastPrompt);
	},

	/**
	 * Takes the response of the player and returns the next function or string
	 * in the conversation.
	 */
	parseInput: function(input) {
		var next = '';
		var n = input.toInt()-1;
		if (this.currentOptions[n]) {
			next = this.currentOptions[n].response;
		} else if (input+"".toLowerCase()=="q") {
			next = this.end;
		} else {
			this.player.send("Invalid choice.  To leave this conversation, use 'Q'.");
			return this.sendCurrentChoices();
		} this.advanceConversation(next);
	},

	/**
	 * Takes the function that comes next, handles its return value (either a 
	 * string or a hash of player options and the NPC's response.
	 */
	advanceConversation: function(next) {
		var choices = this.getResponses(next);
		if (!choices) this.endConversation();
		else {
			this.currentOptions = choices;
			this.sendCurrentChoices();
		}
	},

	/**
	 * Takes a response function or string and converts it into an array of options,
	 * or ends the conversation if there's nothing to choose.
	 */
	getResponses: function(next) {
		if (typeOf(next) == 'string') {
			//If just a string is returned, the conversation is over.
			this.endConversation(next);
		} else if (typeOf(next) == 'function') {
			//Convert the hash returned from the next conversation method into
			//an array of indexed options.
			opts = next.bind(this)();
			if (!opts) return this.endConversation();
			var arr = [];
			Object.each(opts, function(fun, text) {
				//Player's choice, NPC's response
				arr.push({'choice':text, 'response':fun});
			});
			return arr;
		} return false;
	},

	/** 
	 * Takes the array structure from getResponses and outputs them to the player.
	 * Note that this is only for the options -- the text of what the NPC says is
	 * placed by the conversation method that returns the response options.
	 */
	sendCurrentChoices: function() {
		var player = this.player;
		this.currentOptions.each(function(obj, i) {
			player.send((""+(i+1)).style('option')+": "+obj.choice);
		});
	},

	say: function(message) {
		this.target.force("say "+message);
	},

	emote: function() {

	},

	pause: function() {

	},

	/**
	 * Generic start -- should be implemented in the conversation.
	 */
	start: function() {
		this.say("Hello.");
	},

	/**
	 * Generic end -- should be implemented in the conversation.
	 */
	end: function() { },

	goodbye: function() {
		this.say("Goodbye.");
	}


});
