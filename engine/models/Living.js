Living = new Class({

	Extends: Base,

	Implements: [Events,Options,Container],

	//The name of the living when seen in a list of things.
	short: null,

	//The description of the living seen when examined.
	long: null,

	gender: 'male', //OMG SEXIST!!!!!ONE!!!!

	//The UNIQUE name of this living.
	name: null,

	//The world object, filled in when the living enters the world.
	world: null,

	//The room object, filled in when the living moves to a new room.
	room: null,

	//The path name of the room. We'll save this for the player.
	location: null,

	//Commands added to the queue are executed once per heartbeat.
	queue: [],

	//Will be filled with the periodic timer when the heart is started.
	heartTimer: null,

	//How often the living will try to do something from its chatter list.
	chat_rate: null,

	//A bunch of things the living can do at random intervals.
	chatter: [],

	//Same as item aliases.
	aliases: [],

	//List of currently equipped items.
	equipped: [],

	init: function(name) {
		if (name) this.set('name', name);
		this.startHeart();
		this.create();
	},

	set_short: function(short) {
		this.short = short;
	},

	getShort: function(short) {
		return this.name || this.short || "a thing";
	},

	set_long: function(long) {
		this.long = long;
	},

	add_alias: function(alias) {
		this.aliases.push(alias);
	},

	load_chat: function(rate, chatter) {
		this.chat_rate = rate;
		this.chatter = chatter;
	},

	doChat: function() {
		var n = (Math.random()*100).floor();
		if (n<this.chat_rate) {
			this.force(this.chatter.getRandom());
		}
	},

	describeInventory: function(obsv) {
		var lines = [];
		if (this.equipped.length) {
			lines.push(this.genderize('%You %are wearing ', obsv)+
			           this.listItems(this.equipped).conjoin()+'.');
		}
		if (this.items.length) {
			lines.push(this.genderize('%You %are carrying ', obsv)+
			           this.listItems().conjoin()+'.');
		}
		if (lines.length==0) return "%You have nothing.";
		return lines;
	},

	getDescription: function(observer) {
		reply = [];
		if (!this.get('long')) reply.push(this.genderize('%you look%s pretty ordinary.', observer));
		reply.push(this.get('long'));
		this.describeInventory(observer).each(function(l) {
			reply.push(l);
		});
		return reply;
	},

	genderize: function(str, you) {

		var male = (this.gender=='male');
		var name = this.get('name');
		var pronouns = {
			'you'   : (male) ? 'he'  : 'she',
			'You'   : name, //(male) ? 'He'  : 'She',
			'yours' : (male) ? 'his' : 'her',
			'Yours' : (male) ? 'His' : 'Her',
			"You're" : name+"'s",
			"you're" : (male) ? "he's" : "she's",
			'your'  : (male) ? 'his' : 'her',
			'yourself' : (male) ? 'himself' : 'herself',
			'Your'  : name+"'s", //(male) ? 'His' : 'her',
			's'     : 's',
			'es'    : 'es',
			'y'     : 'ies',
			'are'   : 'is'
		};

		if (you) {
			var set = {};
			new Hash(pronouns).each(function(v,k) {
				set[k] = k;	
			});
			set.s = '';
			set.es = '';
			pronouns = set;
		}

		var match = str.match(/%([A-Z'a-z]+)/g);
		if (!match) return str;

		match.each(function(k) {
			var k = k.replace(/^%/, '');
			if (typeof pronouns[k] !== 'undefined') str = str.replace('%'+k, pronouns[k]);
		});

		return str;
	},

	setRoom: function(room) {
		if (this.get('room') && this.player) this.get('room').removePlayer(this);
		else if (this.get('room')) this.get('room').removeLiving(this);
		this.room = room;
		if (this.player) this.room.addPlayer(this);
		else this.room.addNPC(this);
		this.location = this.room.path;
	},
	
	getRoom: function() {
		return this.room;
	},

	setLocation: function(path) {
		sys.puts("Setting location of "+this.name+" to "+path);
		var room = this.world.getRoom(path);
		if (!room) {
			log_error("Can't find room for "+path);
			return;
		}
		sys.puts(this.world.getRoom(path));
		this.setRoom(this.world.getRoom(path));
		this.location = path;
	},

	//moveTo Includes tracking which players are where.
	moveTo: function(path) {
		sys.puts("Transporting "+this.name+" to room "+path);
		var room = this.world.getRoom(path);
		if (!room) return false;
		this.set('room', room);
		return true;
   	},

	/**
	 * If it's living, it has a heart beat.  Every time the heart beats, the 
	 * next command in the action queue will be called.
	 */
	startHeart: function() {
		this.heartTimer = (function(){ this.beatHeart(); }).periodical(1000, this);
	},

	/**
	 * If there's a queue, the next action will be called up.  If there's not,
	 * run the regen routine and check to see if the player is dead (ie, if 
	 * their heart should KEEP beating).
	 */
	beatHeart: function() {
		if (this.queue.length>0) this.callNextAction();
		else this.doChat();
	},

	/**
	 * The heart should be stopped when the player's hit points are below 0.
	 * This will cause the player to become dead.
	 */
	stopHeart: function() {
		unset(this.heartTimer);
		this.fireEvent('death');
	},

	/**
	 * Because 'send' likes to send things to the character, and NPCs don't
	 * need to be sent messages.
	 */
	send: function(message, delay) { },

	/**
	 * Emits a message to everyone in the room.
	 */
	emit: function(message, style) {
		var my = this;
		var me = this.name;
		if (!this.get('room')) {
			log_error("Living "+this.name+" should have a room but does not!");
			return;
		}
		this.get('room').get('players').each(function(player, name) {
			//If it's not the current player, send the message with she or he.
			if (player.name != me) player.send(my.genderize(message), style);
			//Otherwise, use "you".
			else player.send(my.genderize(message, true), style);
		});
	},

	/**
	 * When a player enters a command, we'll add it to the command stack.
	 */
	queueCommand: function(str) {

		this.queue.push(str);

	},

	parseCommand: function(string) {

		string = string.trim();
		var params = string.split(' ');
		var command = params.shift();
		var out = '';
		var com = this.world.getCommand(command);

		if (this.get('room') && this.get('room').hasExit(string)){
			this.force('move '+ string);
			return this.force('look');
		} else if (com){
			params = params.join(' ');
			out = com.execute.bind(this).pass(params,com)();
		}

		//The commands either have to return before this point or have
		//output that is equal to true or a string.
		//
		//Otherwise, the parser will treat it like an invalid command.

		if (out===true) return;
		if (!out) out = 'What?';
		
		this.send(out);

	},

	callNextAction: function() {
		var response = this.parseCommand(this.queue.shift());
	},

	/**
	 * Force the character to do something.
	 */
	force: function(command) {
		return this.parseCommand(command);
	},

/**
 * Item-related stuff (equipment).
 */

	getEquippedItem: function(name) {
		var name = name.split(' ')[0];
		var item = false;
		this.equipped.each(function(i){
			if (!item && i.matches(name)) item = i;
		});
		return item;
	},

	equipItem: function(item) {
		if (item.on_equip(this) === false) return false;
		this.items.erase(item);
		this.equipped.push(item);
	},

	unequipItem: function(item) {
		if (item.on_remove(this) === false) return false;
		this.items.push(item);
		this.equipped.erase(item);
	},

/**
 * Fun things to implement if we have time later.
 */

	increaseHeartrate: function(times) {

	},

	decreaseHeartrate: function(times) {

	},

	freeze: function(duration)  {

	},

	passOut: function() {

	},

	wakeUp: function() {

	}

});
