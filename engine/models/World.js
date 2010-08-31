World = new Class({

	Extends: Base,

	players: {},

	rooms: {},

	items: {},

	npcs: {},

	name: null,

	basePath: null,

	roomPath: 'rooms/',

	itemPath: 'items/',

	npcPath: 'npcs/',

	/**
	 * The name of the world will determine the path to the world's room and
	 * object files.
	 */
	init: function(name) {
		this.set('name', name);
		this.basePath = name+'/';
		this.players = new Hash(this.players);
		this.rooms   = new Hash(this.rooms);
		this.items   = new Hash(this.items);
	},

	/**
	 * Adds the player to the world.
	 */
	addPlayer: function(player) {
		this.players[player.name.toLowerCase()] = player;
		this.announce(player.name+" has entered the world.");
	},

	getPlayer: function(name) {
		return this.players[name.toLowerCase()] || false;
	},

	announce: function(message) {
		this.players.each(function(player) {
			player.send(message);
		});
	},
	
	getRoom: function(path) {
		if (!this.rooms[path]) {
			var file = 'worlds/'+this.basePath+this.roomPath+path;
			sys.puts("Loading room: "+file);
			try {
				var room  = require(file).room;
				this.rooms[path] = new room(world);
				this.rooms[path].path = path;
			} catch (e) {
				log_error("Required room file ("+file+") not found.");
				return false;
			}
		} return this.rooms[path];
	},

	loadItem: function(path) {
		if (!this.items[path]) {
			var file = 'worlds/'+this.basePath+this.itemPath+path;
			sys.puts("Loading item: "+file);
			try {
				var item  = require(file).item;
				item.path = path;
				this.items[path] = item;
			} catch (e) {
				log_error("Required item file ("+file+") not found.");
				return false;
			}
		} return new this.items[path]();
	},

	loadNPC: function(path) {
		if (!this.npcs[path]) {
			var file = 'worlds/'+this.basePath+this.npcPath+path;
			sys.puts("Loading item: "+file);
			try {
				var npc = require(file).npc;
				npc.path = path;
				this.npcs[path] = npc;
				this.npcs[path].world = this;
			} catch (e) {
				log_error("Required npc file ("+file+") not found.");
				return false;
			}
		} return new this.npcs[path]();
	}

});
