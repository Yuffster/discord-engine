new Class({

	Extends: Living,

	create: function() {

		this.set_short('a lab rat');

		this.set_long(
			"It looks as though this cute little guy's purpose is to test "+
			"the room to make sure it's acceptable for living inhabitants. "+
			"Judging by the fact that it's sniffing the air curiously, "+
			"everything looks like it's working just fine."
		);

		this.add_alias('rat');

		this.load_chat(4, [
			"emote squeaks quietly.",
			"emote chews on a tiny piece of wood."
		]);

	}

});
