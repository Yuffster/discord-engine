Living = new Class({

	Extends: Base,

	Implements: [Events, Options, Container, CombatStandard, Visible, CommandParser],

	//The name of the living when seen in a list of things.
	short: null,

	//The description of the living seen when examined.
	long: null,

	gender: 0, //0: Neutral, 1: male, 2: female

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
		obsv = obsv || this;
		var lines = [];
		if (this.equipped.length) {
			lines.push(
				'%You %is wearing '+
			    	this.listItems(this.equipped).conjoin()+
				'.'
			);
		} else if (this.get('race')=='human') {
			lines.push('%You %is naked.');
		}
		if (this.items.length) {
			lines.push(
				'%You %is carrying '+this.listItems().conjoin()+'.'
			);
		}
		var n = (this==obsv) ? 0 : 1;
		var me = this;
		lines.each(function(l,i) {
			lines[i] = l.expand(me)[n];
		});
		return lines;
	},

	getDescription: function(observer) {
		reply = [];
		reply.push(this.get('long'));
		this.describeInventory(observer).each(function(l) {
			reply.push(l);
		});
		return reply;
	},

	getShort: function(short) {
		return this.name || this.short || "a thing";
	},

	getLong: function(long) {
		return this.long || "%you look%s pretty ordinary.".expand(this)[1];
	},

	getCount: function() {
		if (this.room) {
			return this.room.countItem(this.get('short'));
		} return 1;
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
		if (!this.room) return false;
		return this.room;
	},

	setLocation: function(path) {
		var room = this.world.getRoom(path);
		if (!room) {
			log_error("Can't find room for "+path);
			return;
		}
		this.setRoom(this.world.getRoom(path));
		this.location = path;
	},

	//moveTo Includes tracking which players are where.
	moveTo: function(path) {
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
		this.heartTimer = this.beatHeart.periodical(1000, this);
	},

	/**
	 * If there's a queue, the next action will be called up.  If there's not,
	 * run the regen routine and check to see if the player is dead (ie, if 
	 * their heart should KEEP beating).
	 */
	beatHeart: function() {
		this.checkStats();
		if (this.callNextAction()) return true;
		//If no action is queued, do a chat and rest.
		this.doChat();
		this.rest();
	},

	/**
	 * Stops the character from acting.  Should happen upon death, but
	 * heartbeat should NOT be confused with a physical, game-mechanic
	 * heartbeat.
	 */
	stopHeart: function() {
		clearTimeout(this.heartTimer);
		this.heartTimer = null;
	},

	/**
	 * Because 'send' likes to send things to the character, and NPCs don't
	 * need to be sent messages.
	 */
	send: function(message, delay) { },

	/**
	 * Emits a message to everyone in the room.
	 */
	emit: function(message, target, style) {

		if (target && target.length) {
			style = target;
			target = false;
		}

		var messages = message.expand(this, target);

		var my = this;
		var me = this.get('short');

		if (!this.get('room')) {
			log_error("Living "+this.get('short')+" should have a room but does not!");
			return;
		}

		Object.each(this.get('room').get('players'), function(player, name) {
			if (target && player.name == target.name) {
				player.send(messages[1], style);
			} else if (player.name != me) {
				player.send(messages[2], style);
			} else if (player.name == me) {
				player.send(messages[0], style);
			}
		});

	},

	/**
	 * When a player enters a command, we'll add it to the command stack.
	 */
	queueCommand: function(str) {

		this.queue.push(str);

	},

	parseCommand: function(string) {

		if (!string) return;

		string = string.trim();

		if (string=='__wait') return;

		var params = string.split(' ');
		var command = params.shift();
		var out = '';
		var com = this.world.getCommand(command);

		if (this.get('room') && this.get('room').hasExit(string)){
			this.force('move '+ string);
			return this.force('look');
		} else if (com){
			params = params.join(' ');
			if (com.can_execute.bind(this)) {
				out = com.execute.bind(this).pass(params,com)();
			}
		}

		this.getItems().each(function(item) {
			if (!out && item.parseLine) {
				out = item.parseLine(string, this);
			} 
		}, this);

		//The commands either have to return before this point or have
		//output that is equal to true or a string.
		//
		//Otherwise, the parser will treat it like an invalid command.

		if (out===true) return;
		if (!out) out = 'What?';

		if (out.charAt) {
			out.charAt(0).toUpperCase() + out.slice(1);
		} else if (out.each) { 
			out.each(function(ln, i) {
				ln[i] = ln.charAt(0).toUpperCase + ln.slice(1);
			});
		}
		
		this.send(out);

		return out;

	},

	callNextAction: function() {
		if (this.queue.length) {
			return this.parseCommand(this.queue.shift());
		} else if (this.target) {
			return this.combatTurn();
		}
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

	/* Triggered when someone gives this character something. */
	on_get: function(item, source) { return; },

	giveItem: function(item, target) {

		//Check to see if there's a on_drop function on the item (for cursed
		//items and the like).
		var success = item.on_drop(this);
		if (success===false) { return false; }

		//Remove this item from the giver's inventory.
		this.removeItem(item);
		target.addItem(item);
		target.on_get(item, this);

		return true;

	},

	getItem: function(name) {
		var items = this.get('items');
		if (this.equipped) { items = ([items,this.equipped]).flatten(); }
		var item = false;
		items.each(function(i){
			if (!item && i.matches(name)) item = i;
		});
		return item;
	},

	getEquippedItem: function(name) {
		var item = false;
		this.equipped.each(function(i){
			if (!item && i.matches(name)) { item = i; }
		}); return item;
	},

	equipItem: function(item) {
		if (item.on_equip(this) === false) {
			return false;
		}
		if (!this.items.contains(item)) { return false; }
		this.equipped.push(item);
		this.items.erase(item);
	},

	unequipItem: function(item) {
		if (item.on_remove(this) === false) return false;
		this.items.push(item);
		this.equipped.erase(item);
	},

	respondTo: function(player, keyword) {
		if (this.talkMenu) this.world.enterMenu(this.talkMenu, player, this);
	},

/**
 * Fun things to implement if we have time later.
 */

	increaseHeartrate: function(times) {

	},

	decreaseHeartrate: function(times) {

	},

	wait: function(turns)  {
		var me = this;
		turns.toInt().times(function() { me.force('__wait'); });
	},

	freeze: function() {
		unset(this.heartTimer);
	},

	unfreeze: function() {
		this.startHeart();
	},

	passOut: function() {

	},

	wakeUp: function() {

	}

});
