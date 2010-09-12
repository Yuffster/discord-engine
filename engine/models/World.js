World = new Class({

	Extends: Base,

	players: {},

	rooms: {},

	commands: {},

	items: {},

	npcs: {},

	name: null,

	basePath: null,

	enginePath: 'engine/',

	commandPath: 'commands/',

	roomPath: 'rooms/',

	itemPath: 'items/',

	npcPath: 'npcs/',

	savePath: 'saves/',

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
		player.world = this;
		this.players[player.name.toLowerCase()] = player;
		this.announce(player.name+" has entered the world.");
		var data = this.loadPlayerData(name);
		if (data) player.loadData(data);
		else player.set('location', 'lobby');
	},

	loadPlayerData: function(name) {
		var file = 'worlds/'+this.basePath+this.savePath+name;
		sys.puts("Loading player save: "+file);
		try {
			return require(file).data;
		} catch (e) {
			log_error(e);
			return false;
		} 
	},

	savePlayer: function(player) {
		var file = 'worlds/'+this.basePath+this.savePath+player.name;
		var dump = player.dump();
		if (!dump) return false;
		var json = JSON.encode(dump);
		fs.writeFile(file, 'exports.data='+json, function (e) {
  			if (e) log_error(e);
			player.send("Game data saved.");
		});
	},

	removePlayer: function(player) {
		delete(this.players[player.name.toLowerCase()]);
		this.announce(player.name+" has left the world.");
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
			sys.puts("Loading Room: "+file);
			try {
				var room  = require(file).room;
				this.rooms[path] = new room(this);
				this.rooms[path].path = path;
			} catch (e) {
				log_error("Error loading "+file+": "+e);
				return false;
			}
		} return this.rooms[path];
	},

	getCommand: function(command) {
		if (!this.commands[command]) {
			var file = this.enginePath+this.commandPath+command;
			sys.puts("Loading Command: "+file);
			try {
				var com = require(file).command;
				this.commands[command] = new com();
			} catch (e) {
				log_error("Error loading "+file+": "+e);
				return false;
			}
		} return this.commands[command];
	},

	loadItem: function(path) {
		if (!this.items[path]) {
			var file = 'worlds/'+this.basePath+this.itemPath+path;
			sys.puts("Loading Item: "+file);
			try {
				var item  = require(file).item;
				item.implement({path:path});
				this.items[path] = item;
			} catch (e) {
				log_error("Error loading "+file+": "+e);
				return false;
			}
		} return new this.items[path]();
	},

	loadNPC: function(path) {
		if (!this.npcs[path]) {
			var file = 'worlds/'+this.basePath+this.npcPath+path;
			sys.puts("Loading NPC: "+file);
			try {
				var npc = require(file).npc;
				this.npcs[path] = npc;
			} catch (e) {
				log_error("Required npc file ("+file+") not found.");
				return false;
			}
		}
		var npc   = new this.npcs[path]();
		npc.path  = path;
		npc.world = this;
		return npc;
	}

});
