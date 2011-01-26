Player = new Class({

	Extends: Living,

	determinate: '',

	player: true,

	currentPrompt: null,

	promptBind: null,

	location: '', 

	prompt: function(fun, message, style) {
		this.setPrompt(fun.bind(this));
		this.send(message, style);
	},

	setPrompt: function(fun, bind) {
		this.promptBind = bind || this;
		this.currentPrompt = fun;
	},

	getPrompt: function() {
		return this.currentPrompt;
	},

	/**
	 * And nonplayer objects won't be sending any data packets to the engine,
	 * so we don't need that method there.
	 */
	onInput: function(data) {
		this.currentPrompt.bind(this.promptBind)(data.trim());
	},

	/**
	 * Puts the player in the world.
	 */
	enterWorld: function(world) {
		if (!world) world = this.world;
		if (world.getPlayer(this.get('name'))) return false;
		world.addPlayer(this);
		return true;
	},

	getDefinite: function() {
		return this.get('name');
	},

	getIndefinite: function() {
		return this.get('name');
	},

	getPlural: function() {
		return this.get('name');
	},

	dump: function() {
		var obj = {
			'location': this.location,
			'save': this.save,
			'items': [],
			'equipped': [],
			'stats': this.dumpStats()
		};
		this.items.each(function(item) {
			obj.items.push(item.dump());
		});
		this.equipped.each(function(item) {
			obj.equipped.push(item.dump());
		});
		return obj;
	},

	loadData: function(dump) {
		this.set('location', dump.location);
		this.save = dump.save;
		this.loadStats(dump.stats);
		dump.items.each(function(itm) {
			if (!itm.path) log_error(this.name+"'s item "+(itm.short)+" has failed to load!");
			var item = this.world.loadItem(itm.path);
			if (!item) return false;
			item.loadData.bind(item)(itm);
			this.addItem(item);
		}, this);
		dump.equipped.each(function(itm) {
			if (!itm.path) log_error(this.name+"'s item "+(itm.short)+" has failed to load!");
			var item = this.world.loadItem(itm.path);
			if (!item) return false;
			item.loadData(itm);
			this.equipItem(item);
		},this);
	},

	talkTo: function(npc) {
		npc.respondTo(this);
	},

	enterMenu: function(menu, target) {
		menu = new menu(this, target);
	},

	disconnect: function() {
		this.world.removePlayer(this);
		this.fireEvent('quit');
	},

	/* This method is executed when a character is created. */
	on_birth: function() {

	},

	/* Executed when a player logs in to an existing character. */
	on_login: function() {

	},

	/* Executed when a player types 'quit'. */
	on_logout: function() {

	},

	/* Executed when a player's connection is dropped. */
	on_netdead: function() {

	}, 

	/* Executed once a minute if a player hasn't typed any commands. */
	on_idle: function(minutes) {

	}

});
