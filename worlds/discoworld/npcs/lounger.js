exports.npc = new Class({

	Extends: Living,

	create: function() {

		this.set_short('a lounger');
    this.set('name', 'lounger');

		this.add_alias('lounger');

		this.set_long(
    "Clearly all the excitement was a bit much for this girl, she's wiped out."
    );

		this.load_chat(4, [
			"say aaaah",
			"@grins groans"
		]);

	}

});
