exports.npc = new Class({

	Extends: Living,

	create: function() {

		this.set_short('bartender');

		this.add_alias('bartender');

		this.set_long(
			"This is a bartender, he works here night after night while you "+
			"have your fun on the dance floor. He probably has some pretty "+
			"crazy stories to tell.  Like all bartenders, he's currently engaged "+
			"in polishing a glass behind the bar."
		);

		this.load_chat(4, [
			"say What are you after?",
			"@grins widely.",
			"say I highly recommend Tanqueray gin.",
			"say This is just my night job.  By day, I fight giant robots from outerspace.",
			"@polishes a glass behind the bar."
		]);

	}

});
