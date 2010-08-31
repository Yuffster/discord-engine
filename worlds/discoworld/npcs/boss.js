exports.npc = new Class({

	Extends: Living,

	create: function() {

		this.set_short('The Boss');
    this.set('name', 'The Boss');

		this.add_alias('boss');

		this.set_long(
      "This is the boss. He's very well dressed (if you consider well dressed to mean "+
      "encrusted with rhinestones). He looks a bit surprised that you're in his office"
		);

		this.load_chat(4, [
			"say 'What are you after?",
			"say I must insist that you leave, customers should stick to the front rooms",
			"say Leave now or I have you turned into toothpicks",
			"@quietly chews on a toothbrush."
		]);

	}

});
