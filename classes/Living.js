Living = new Class({

	Extends: Base,

	Implements: [Events, Options, Container, CombatStandard, Visible, 
	             CommandParser],

	player: false,
	
	guid: '',

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

	//Last 20 messages sent to the player.
	messageLog: [],

	//Last 20 commands used by the player.
	history: [],

	init: function(name) {
		if (name) this.set('name', name);
		this.create();
		this.guid = String.uniqueID();
	},

	set_short: function(short) {
		this.short = short;
	},

	set_long: function(long) {
		this.long = long;
	},

	get_long: function() {
		return this;
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

	getItems: function() {
		var ret = [];
		this.items.each(function(i){
			ret.push(i);
		});
		this.equipped.each(function(i){
			ret.push(i);
		});
		return ret;
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
		return this.name || this.short || "thing";
	},

	getLong: function(long) {
		return (this.long || "%you look%s pretty ordinary.").expand(this)[1];
	},

	getCount: function() {
		if (this.room) {
			return this.room.countItem(this.get('short'));
		} return 1;
	},

	setRoom: function(room) {
		//Remove the object from any room it may be in.
		if (this.get('room')) {
			this.get('room').removeLiving(this);
		}
		room.addLiving(this);
	},
	
	getRoom: function() {
		if (!this.room) return false;
		return this.room;
	},

	setLocation: function(path) {
		//If we've been passed a room object, use that.
		if (path.addLiving) { 
			this.setRoom(path);
			return true;
		}
		var room = this.world.getRoom(path);
		if (room && room.addLiving) {
			this.setRoom(room);
			return true;
		} else return false;
	},

	//moveTo includes tracking which players are where.
	moveTo: function(path) {
		if (this.setLocation(path)) {
			return true;
		} else return false;
   	},

	/**
	 * If it's living, it has a heart beat.  Every time the heart beats, the 
	 * next command in the action queue will be called.
	 */
	startHeart: function() {
		if (this.heartTimer) return;
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
	 * The main engine will add an event to the player object to output data.
	 */
	send: function(message, style, raw) {
		if (!message) return;
		if (!message.each) message = [message];
		message.each(function(line) {
			if (!line || !line.charAt) return;
		    if (!raw) line = line.makeSentence();
			this.logOutput(line);
			this.fireEvent('output', [line,style]);
		}, this);
	},
	
	send_raw: function(message, style) {
		this.send(message, style, true);
	},

	guiSend: function(message, handler) {
		this.fireEvent('guiOutput', [message, handler]);
	},

	logOutput: function(message) {
		if (this.messageLog.length > 20) { this.messageLog.shift(); }
		this.messageLog.push(message);
	},

	getLastMessage: function() {
		return this.messageLog.getLast();
	},

	logInput: function(message) {
		if (this.history.length > 20) { this.history.shift(); }
		this.history.push(message);
	},

	getLastCommand: function() {
		return this.history.getLast();
	},

	/**
	 * Utility method -- pass in the command the expected result.  Will return
	 * true if the command's output matches the result, and false otherwise.
	 *
	 * Will first look at the output of the command (returned by the command 
	 * function).  If the command only returns true, it will look at the last
	 * message sent to the character, which will catch things like emits.
	 */
	testCommand: function(command, expected) {
		var result = this.do(command);
		if (assert && assert.equal && expected) {
			assert.equal(result, expected, "\nExpected: "+expected+
			             "\nGot: "+result);
		}
		if (!expected) { return result; }
		return (result==expected);
	},

	/**
	 * Emits a message to everyone in the room.
	 */
	emit: function(message, target, style) {

		if (target && target.length) {
			style = target;
			target = false;
		}

		var messages = (message.each) ? message : message.expand(this, target);

		var my = this;
		var me = this.get('short');

		if (!this.get('room')) {
			throw "Living "+this.get('short')+" has no room.";
		}
		
		Object.each(this.get('room').get('living'), function(player, name) {
			if (target && player.guid == target.guid) {
				player.send(messages[1], style);
			} else if (player.guid == my.guid) {
				player.send(messages[0], style);
			} else if (player.guid != my.guid) {
				player.send(messages[2], style);
			}
		});

	},

	/**
	 * When a player enters a command, we'll add it to the command stack.
	 */
	queueCommand: function(str) {

		this.logInput(str);
		if (!this.queue.length) {
			return this.do(str);
		}
		this.queue.push(str);

	},

	/**
	 * The function in charge of taking a line of text from the player and 
	 * converting it into stuff the player does.
	 */
	do: function(string) {

		if (!string) return;
		if (!this.room) {
			this.stopHeart();
			delete(this);
		}

		string = string.trim();

		if (string=='__wait') return;

		//Hard-coded aliases for directions.  I'll put them somewhere proper
		//when I've finished with the alias system.
		var aliases = {
			'nw':'northwest',
			'sw':'southwest',
			'se':'southeast',
			'ne':'northeast',
			'n' :'north',
			's' :'south',
			'e' :'east',
			'w' :'west',
			'd' :'down',
			'u' :'up'
		};

		var params = string.split(' ');
		var command = params.shift();
		var out = '';

		if (aliases[command]) { command = aliases[command]; }

		//Check to see if it's a room exit.
		if (this.get('room') && this.get('room').hasExit(string)){
			return this.do('move '+ string);
		} else if (this.get('room') && this.get('room').hasExit(command)) {
			return this.do('move '+command);
		}

		var success = (out) ? true : false;
		var caller  = this;
		
		var callables = [];
		callables.combine(this.getItems());
		callables.combine(this.getRoom().getLiving());
		callables.push(this.getRoom());
		callables.push(this.world.getCommand(command));
		
		//Now we keep calling until we've received a successful execution of
		//the command.
		callables.each(function(item) {
			if (!success && item.parseLine) {
				result = item.parseLine(string, caller);
				if (result) { 
					success = result.success;
					if (result.output) out = result.output;
				}
			}
		}, this);
		
		//The commands either have to return before this point or have
		//output that is equal to true or a string.
		//
		//Otherwise, the parser will treat it like an invalid command.

		if (!out&&!success) { out = 'What?'; }

		if (typeOf(out)=="string") {
			out = out.makeSentence();
		} else if (out && out.each) { 
			out.each(function(ln, i) {
				out[i] = ln.makeSentence();
			});
		}
		
		if (out !== true && out) {
			this.send(out);
		}

		return this.getLastMessage();

	},

	callNextAction: function() {
		if (this.queue.length) {
			return this.do(this.queue.shift());
		} else if (this.target) {
			return this.combatTurn();
		}
	},

	/**
	 * Force the character to do something.
	 */
	force: function(command) {
		return this.queueCommand(command);
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

		return target.on_get(item, this);

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
