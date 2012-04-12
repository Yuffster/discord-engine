Room = new Class({

	Extends: Base,
	Implements: [Container,Visible,CommandParser],
	long: null,
	short: null,
	exits: {},
	desc_items: {},
	players: {},
	living: [],

	//The name of the zone to place this room within.
	zoneName: 'default',

	//The zone object.
	zone: null,

	initialize: function(world, path) {
		this.path   = path;
		this.world  = world;
	},

	load_item: function(path) {
		var item = this.world.loadItem(path);
		if (item) { this.addItem(item); }
	},

	addPlayer: function(player) {
		this.players[player.name.toLowerCase()] = player;
	},

	addNPC: function(npc) {
		this.living.push(npc);
	},

	removePlayer: function(player) {
		delete(this.players[player.name.toLowerCase()]);
	},

	removeLiving: function(living) {
		living.stopHeart();
		living.room = false;
		if (living.player) {
			this.removePlayer(living);
		} else {
			this.living.erase(living);
		}
	},

	addLiving: function(living) {
		living.startHeart();
		if (living.player){
			this.addPlayer(living);
		} else {
			living.startHeart();
			this.addNPC(living);
		}
		living.room = this;
		living.location = this.path;
	},

	getPlayer: function(name) {
		return this.players[name.toLowerCase()] || false;
	},

	getPlayers: function() {
		var living = [];
		Object.each(this.players, function(pl) {
			living.push(pl);
		});
		return living;
	},

	getLiving: function(name) {
		if (!name) {
			var objs = [];
			this.living.each(function(npc) {
				objs.push(npc);
			});
			Object.each(this.get('players'), function(v,k) {
				objs.push(v);
			});
			return objs;
		}
		var player = this.getPlayer(name);
		if (player) { return player; }
		var npc = null; 
		this.living.each(function(l) {
			if (!npc && l.matches(name)) { npc = l; }
		});
		return npc;
	},

	getExits: function() {
		return this.exits;
	},

	getExitRooms: function() {
		var exits = {};
		Object.each(this.exits, function(data, direction) {
			if (!data.to) return;
			var room = this.world.getRoom(data.to);
			if (room) { exits[direction] = room; }
		}, this);
		return exits;
	},

	hasExit: function(exit) {
		return typeof this.exits[exit] !== 'undefined';
	},

	getDescription: function(observer) {

		if (!observer) return;

		var lines = [];

		//GUI Map
		var rooms = this.getAdjacentRooms(3);
		var obj = []; 
		rooms.each(function(r) {
			var room = r.room;
			if (!room) {
				obj.push({coords: r.coords, room:false});
			} else {
				var c = this.getCoordinates(), d = r.coords, current = false;
				if (c[0]==d[0]&&c[1]==d[1]) { current = true; }
				obj.push({
					'coords':room.get('coordinates'),
		 			room: {
						'exits'  : room.get('exits'),
						'short'  : room.get('short'),
						'coords' : d,
						'current': current
					}
				});
			}
		}, this);
		observer.guiSend(obj, 'map');

		var debug = " ["+this.getCoordinates()+':'+this.get('path')+"]";
		observer.send(this.get('short')+debug);
		observer.send(this.get('long'));

		var exits = [];
		Object.each(this.get('exits'), function(v,k) { exits.push(k); });

		if (exits.length==0) observer.send('There are no obvious exits.',
		                                   'exits');
		else observer.send('Exits: '+exits.join(', '), 'exits');
		
		var living = this.listLiving(observer);
		if (living) {
			lines.push(
				living.join(', ') +
				(living.length>1 ? " are" : " is") + " standing here."
			);
		}

		var items = this.listItems();
		if (items.length>0){
			lines.push(
				items.join(', ') +
				(items.length>1 ? " are" : " is")
				+ " on the ground."
			);
		}

		return lines;
	},

	listLiving: function(observer) {
		var living = [];
		this.get('living').each(function(live) {
			if (live!=observer) {
				living.push(live.get('indefinite'));
			}
		});
		if (living.length>0) {
			if (living.length>1) {
				var last = living.getLast();
				living[living.length-1] = 'and '+last;
				living[living.length-2] = living[living.length-2]
				                          .replace(/, $/, ' ');
			} return living;
		}
	},

	listExits: function(observer) {

	},

	listItems: function() {
		var items = [];
		this.get('items').each(function(item) {
			var str = item.get('indefinite') || 'a thing';
			items.push(str);
		});
		if (items.length>1) {
			items[items.length-1] = 'and '+items.getLast();
		} return items;
	},
	
	/**
	 * Sends a given message to everyone in the room.
	 */
	emit: function(message) {
		Object.each(this.get('living'), function(l) {
			l.send(message);
		});
	},

	set_short: function(short) {
		this.short = short;
	},

	set_long: function(long) {
		this.long = long;
	},
	
	set_type: function(txt) {
		//Placeholder for now -- ideally, this would load the class file for a
		//specific room type and implement it.
		this.type = txt;
	},

	set_light: function(n) {

	},

	set_zone: function(name) {
		this.zoneName = name;
	},

	add_exit: function(dir, loc, type) {
		type = type || 'open';
		this.exits[dir] = {to: loc, type: type};
	},
	
	remove_exit: function(dir) {
		delete(this.exits[dir]);
	},

	add_living: function(path) {
		var npc = this.world.loadNPC(path);
		npc.moveTo(this);
	},

	//add an item view inside the room desc. LPC naming style.
	add_item: function(keyword, desc, aliases) {
		this.desc_items[keyword] = desc;
		var that = this;
		Object.each(aliases, function(alias) { 
			that.desc_items[alias] = keyword;
		});
	},

	getDetail: function(item) {
		return this.desc_items[item];
	},

	getCoordinates: function() {
		return this.zone.getCoordinates(this);
	},

	getAdjacentRooms: function(range, zRange) {
		return this.zone.getAdjacentRooms(
			               this.getCoordinates(), range, zRange
			             );
	},

	create: function() {
		this.set_short("empty place");
		this.set_long("This room is broken. Pretend you didn't see it");
	}
	
});
