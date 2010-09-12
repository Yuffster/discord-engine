new Class({

	Extends: Living,

	create: function() {

		this.set_short('Tony');
    this.set('name', 'Tony');

		this.add_alias('tony');

		this.set_long(
      "This guy has really hit his groove. He's absolutely dominating the center of the floor "+
      "and a number of people have just stopped to watch him. He's probably a bit of dick."
		);

		this.load_chat(4, [
			"say You make it with some of these chicks, they think you gotta dance with them.",
			"@grins widely.",
			"say Would ya just watch the hair. Ya know, I work on my hair a long time and you hit it. He hits my hair.",
      "say You assholes almost broke my pussy finger!"
		]);

	}

});
