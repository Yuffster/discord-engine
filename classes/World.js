/**
 * The World class is the main game driver.  It determines which files to load
 * and from where, stores all rooms and objects, handles loading of rooms and
 * objects, saves player data, etc.
 *
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt.
 */
World = new Class({

	Extends: Base,

	players     : {},
	rooms       : {},
	commands    : {},
	items       : {},
	npcs        : {},
	menus       : {},

	failedFiles : [],

	config      : {},
	name        : null,
	worldPath   : null,
	defaultRoom : '',

	enginePath  : './',
	commandPath : 'commands/',
	roomPath    : 'rooms/',
	itemPath    : 'items/',
	npcPath     : 'npcs/',
	savePath    : 'saves/',
	menuPath    : 'menus/',
	scriptPath  : 'convos/',


	/**
	 * The name of the world will determine the path to the world's room and
	 * object files.
	 */
	init: function(config) {
		var required = ['name', 'world_path', 'start_room', 'port'];
		required.each(function(key) {
			if (!config[key]) {
				sys.puts("Required config option \""+key+"\" not supplied.");
				process.exit();
			}
		});
		this.set('name', config.name);
		this.config      = config;
		this.worldPath   = config.world_path+'/';
		this.defaultRoom = config.start_room;

		this.loadFile('initialize');

		this.players     = this.players;
		this.rooms       = this.rooms;
		this.items       = this.items;
	},

	/**
	 * Adds the player to the world.
	 */
	addPlayer: function(player) {
		player.world = this;
		this.players[player.name.toLowerCase()] = player;
		this.announce(player.name+" has entered the world.");
		this.loadPlayerData(player);
	},

	loadPlayerData: function(player) {
		var path = this.savePath+player.name;
		var my   = this;
		this.loadFile(path, function(e,data) {
			if (!data) player.set('location', my.defaultRoom);
			else player.loadData(data);
			player.force('look');
		});
	},

	savePlayer: function(player) {
		var file = this.worldPath+this.savePath+player.name+'.js';
		var dump = player.dump();
		if (!dump) return false;
		var json = JSON.encode(dump);
		fs.writeFile(file, json, function (e) {
  			if (e) { log_error(e); }
			player.send("Game data saved.");
			player.fireEvent('save');
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
		Object.each(this.players, function(player) {
			player.send(message);
		});
	},
	
	getRoom: function(path) {
		if (!path) return;
		var that = this;
		if (!this.rooms[path]) {
			var room = this.loadModule(this.roomPath+path);
			if (room) {
				this.rooms[path]      = new room(this);
				this.rooms[path].path = path;
			}
		} return this.rooms[path];
	},

	getCommand: function(command) {
		if (!command) return;
		var that = this;
		if (!this.commands[command]) {
			/* First check the world, then check the engine. */
			var world  = that.worldPath+this.commandPath+command; 
			var engine = that.enginePath+this.commandPath+command;
			this.loadFile([world, engine], function(e,com) {
				if (!com || !com.periodical) {
					log_error(
						"Command '"+command+"' couldn't be loaded ["+com+"]."
					);
				} else { that.commands[command] = new com(that); }
			}, {'sync':true, 'rootPath':true});
		} return this.commands[command];
	},

	/**
	 * Target is optional.  In the event of a conversation, the target is
	 * the NPC being conversed with.
	 */
	enterMenu: function(name, player, target) {
		if (!name) return;
		var that = this;
		if (!this.menus[name]) {
			var path;
			//If there's a target, we'll assume it's a conversation.
			if (target) path = this.scriptPath+name;
			else path = this.menuPath+name;
			this.loadFile(path, function(e,menu) {
				if (e) log_error(e);
				if (!menu) return;
				that.menus[name] = menu;
				player.enterMenu(menu, target);
			});
		} else {
			player.enterMenu(this.menus[name], target);
		}
	},

	loadItem: function(path) {
		if (!path) { return; }
		if (!this.items[path]) {
			var file = this.itemPath+path;
			var obj  = this.loadModule(file);
			if (!obj) { return false; }
			//obj.implement({'path':path});
			this.items[path] = obj;
		} return new this.items[path]();
	},

	loadNPC: function(path) {

		if (!path) return;
		if (!this.npcs[path]) {
			var file = this.npcPath+path;
			var that = this;
			var npc = this.loadModule(file);
			if (npc) {
				this.npcs[path] = npc;
			} else {
				return false;
			}
		}

		//Create one and return it.
		var mob   = new this.npcs[path]();
		mob.path  = path;
		mob.world = this;
		return mob;

	},

	loadModule: function(path, opts) {

		var fallbacks = [];
		if (path.each) {
			if (path.length==0) return;
			fallbacks = path;
			path      = fallbacks.shift()+"";
		}

		if (!path) { return false; }

		opts = opts || {};
		var file = this.worldPath+path;
		if (opts.rootPath) file = path;

		try {
			var mod = require(file);
			if (mod.main) {
				return mod.main;
			} return mod;
		} catch (e) {
			if (fallbacks.length) {
				return this.loadModule(fallbacks, opts);
			} return false;
		}

	},

	/** 
	 * I'm putting this function last because it's the ugliest.
	 */
	loadFile: function(path, callback, opts) {

		if (!callback) callback = function() { };

		var fallbacks = [];
		if (path.each) {
			if (path.length==0) return;
			fallbacks = path;
			path      = fallbacks.shift()+"";
		}

		//Stuff that will make us not want to load files.
		if (this.failedFiles.contains(path)) return;

		opts = opts || {};
		var file = this.worldPath+path+'.js';
		if (opts.rootPath) file = path+'.js';

		var my = this;
		var err;
		var handleData = function(e,raw) {
			data = false;
			if (!raw) {
				err = e;
				my.failedFiles.push(path);
				/* Continue down our list of fallbacks. */
				if (fallbacks.length>0) {
					my.loadFile(fallbacks, callback, opts);
				} else {
					log_error("File not found: "+path);
				}
			} else {
				try { eval('data='+raw); }
				catch (e) { log_error(e); }
			}callback(err, data);
		};
		if (opts.sync) {
			try {
				var data = fs.readFileSync(file);
			} catch (e) {
				this.failedFiles.push(path);
				/* Continue down our list of fallbacks. */
				if (fallbacks.length>0) {
					return this.loadFile(fallbacks, callback, opts);
				} else return e;
			} return handleData(false,data);
		} else {
			fs.readFile(file, handleData);
		}
	}

});
