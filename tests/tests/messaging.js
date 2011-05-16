var Jack = new Class({
	Extends: Living,
	create: function() {
		this.set_determinate('');
		this.set_short("Jack");
		this.gender = 1;
	}
});

var Jill = new Class({
	Extends: Living,
	create: function() {
		this.set_determinate('');
		this.set_short("Jill");
		this.gender = 2;
	}
});

var actor  = new Jack();
var target = new Jill();

var expectations = {

	'actor should be a male named Jack': function() {
		assert.equal(actor.get('short'), "Jack");
		assert.equal(actor.get('gender'), 1);
	},

	'target should be a female named Jill': function() {
		assert.equal(target.get('short'), "Jill");
		assert.equal(target.get('gender'), 2);
	}

};

var examples = {

	'%You jump%s over %Name.': [
		"You jump over Jill.",
		"Jack jumps over you.",
		"Jack jumps over Jill."
	],

	'%You carr%ies %Name up the hill.': [
		"You carry Jill up the hill.",
		'Jack carries you up the hill.',
		'Jack carries Jill up the hill.'
	],

	'%You dance%s with %Name.': [
		"You dance with Jill.",
		"Jack dances with you.",
		"Jack dances with Jill."
	],

	"%You tug%s on %your jacket and point%s at %Name with both hands. %Name%'S overcome with desire and clearly struggle%S to keep %their composure.": [
		"You tug on your jacket and point at Jill with both hands. Jill's overcome with desire and clearly struggles to keep her composure.",
		"Jack tugs on his jacket and points at you with both hands. You're overcome with desire and clearly struggle to keep your composure.",
		"Jack tugs on his jacket and points at Jill with both hands. Jill's overcome with desire and clearly struggles to keep her composure."
	],

	"%You tell%s %Name that Santa isn't real. %they %IS overcome with grief.": [
		"You tell Jill that Santa isn't real. She is overcome with grief.",
		"Jack tells you that Santa isn't real. You are overcome with grief.",
		"Jack tells Jill that Santa isn't real. She is overcome with grief."
	],

	"%You give%s %Name a pep-talk. %Their glass is half-full!": [
		"You give Jill a pep-talk. Jill's glass is half-full!",
		"Jack gives you a pep-talk. Your glass is half-full!",
		"Jack gives Jill a pep-talk. Jill's glass is half-full!"
	],

	"%You give%s %Name a pep-talk. %their glass is half-full!": [
		"You give Jill a pep-talk. Her glass is half-full!",
		"Jack gives you a pep-talk. Your glass is half-full!",
		"Jack gives Jill a pep-talk. Her glass is half-full!"
	],

	"%You rake%s %Name with %your vicious claws!": [
		"You rake Jill with your vicious claws!",
		"Jack rakes you with his vicious claws!",
		"Jack rakes Jill with his vicious claws!"
	],

	"%You %has a broken crown, while %Name %HAS no injuries.": [
		"You have a broken crown, while Jill has no injuries.",
		"Jack has a broken crown, while you have no injuries.",
		"Jack has a broken crown, while Jill has no injuries."
	]


};

Object.each(examples, function(expected,mess) {

	expectations[expected.join(' / ')] = function() {

		var result = mess.expand(actor, target);
		expected.each(function(str,i) {
			assert.equal(str, result[i], "\nExpected: \n\t"+str+"\nResult: \n\t"+result[i]);
		});

	}

});

var untargeted = {
	"%You dance%s with %yourself.": [
		'You dance with yourself.',
		'Jack dances with himself.',
		'Jack dances with himself.'
	]
}

Object.each(untargeted, function(expected,mess) {

	expectations["Untargeted: "+expected.join(' / ')] = function() {

		var result = mess.expand(actor);
		expected.each(function(str,i) {
			assert.equal(str, result[i], "\nExpected: \n\t"+str+"\nResult: \n\t"+result[i]);
		});

	}

});

describe('message expansion', expectations);
