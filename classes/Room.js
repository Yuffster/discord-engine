Room = new Class({

	Extends: Base,
	Implements: [Container,Visible,CommandParser],
	long: null,
	short: null,
	exits: {},
	desc_items: {},
	players: {},
	living: [],

	initialize: function(world) {
		this.world   = world;
		this.create();
	},

	load_item: function(path) {
		var item = this.world.loadItem(path);
		if (item) {
			this.addItem(item);
		}
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
		living.room = false;
		if (living.player) {
			this.removePlayer(living);
		} else {
			this.living.erase(living);
		}
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
			living = this.living;
			living.combine(this.get('players'));
			return living;
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

	hasExit: function(exit) {
		return typeof this.exits[exit] !== 'undefined';
	},

	getDescription: function(observer) {

		if (!observer) return;
		var lines = [];
		observer.send(this.get('long'));

		var exits = [];
		Object.each(this.get('exits'), function(v,k) {
			exits.push(k);
		});
		if (exits.length==0) observer.send('There are no obvious exits.', 'exits');
		else observer.send('Exits: '+exits.join(', '), 'exits');
		
		var living = this.listLiving(observer);
		lines.push(
			living.join(', ') +
			(living.length>1 ? " are" : " is") + " standing here."
		);

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
				living[living.length-2] = living[living.length-2].replace(/, $/, ' ');
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

	add_exit: function(dir, loc) {
		this.exits[dir] = loc;
	},

	add_living: function(path) {
		var npc = this.world.loadNPC(path);
		npc.set('room', this);
	},

	//add an item view inside the room desc. LPC naming style.
	add_item: function(keyword, desc, aliases) {
		this.desc_items[keyword] = desc;
		var that = this;
		Object.each(aliases, function(alias) { that.desc_items[alias] = keyword; });
	},

	getDetail: function(item) {
		return this.desc_items[item];
	},

	create: function() {
		this.set_short("empty place");
		this.set_long("This room is broken. Pretend you didn't see it");
	}
	
});
