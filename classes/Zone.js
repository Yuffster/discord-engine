/**
 * Keeps track of rooms in terms of their coordinates.
 */
Zone = new Class({

	//The world object this zone belongs to.
	world: null,

	//Hash containing the x, y, and z coordinates of each room.
	//{<x>:<y>:<z>:room}
	map: {},

	//Array of rooms that have been mapped. {path: [coords]}
	mapped: {},

	//An array of all the room objects.
	rooms: [],

	initialize: function(name) {
		this.name = name;
	},

	addRoom: function(room) {
		this.rooms.push(room);
	},

	mapRooms: function() {
		this.mapRoom(this.rooms[0]);
	},

	mapRoom: function(room, coords) {

		if (!coords) {
			if (this.mapped.length) { 
				log_error("Can't map room: no coordinates provided.");
				return false;
			}
			//This is our first room, so we'll just arbitrarily pick 0,0 as
			//its coordinates.
			coords = [0,0,0];
		}

		//Default z-axis is 0.
		if (coords.length==2) { coords.push(0); }

		//Don't parse rooms more than once each.
		if (this.mapped[room.path]) { return false; } 

		this.placeRoom(room,coords);

		this.mapped[room.path] = coords.clone();

		//Go through the exits, calculate the coordinates for those.
		//Mixed directions are not currently supported.
		Object.each(room.getExitRooms(), function(room, dir) {
			var c = Array.clone(coords);
			if (dir=='east') {
				c[0] = c[0]+1;
			} else if (dir=='west') { 
				c[0] = c[0]-1;
			} else if (dir=="north")  {
				c[1] = c[1]-1;
			} else if (dir=="south") {
				c[1] = c[1]+1;
			} else if (dir=="up") {
				c[2] = c[2]+1;
			} else if (dir=="down") {
				c[2] = c[2]-1;
			} else {
				log_error("Unmappable room direction: "+dir);
			} this.mapRoom(room, c);
		}, this);

	},

	//If set to true, we'll have to walk rooms every time we want 
	//surroundings.
	coordinateConflict: false,

	placeRoom: function (room,coords) {
		this.mapped[room] = coords;
		var x = coords[0], y = coords[1], z = coords[2];
		if (!this.map[x]) { this.map[x] = {}; }
		if (!this.map[x][y]) { this.map[x][y] = {}; }
		var other = this.map[x][y][z];
		if (other) {
			log_error("Room coordinate conflict! (["+[x,y,z]+"]: "+
			           room.path+", "+other.path+")");
			this.coordinateConflict = true;
			return;
		} this.map[x][y][z] = room;
	},

	getCoordinates: function(room) {
		return this.mapped[room.path] || false;
	},

	getRoom: function(coords) {
		var x = coords[0], y = coords[1], z = coords[2];
		if (!this.map[x]) { return false; }
		if (!this.map[x][y]) { return false; }
		if (!this.map[x][y][z]) { return false; }
		return this.map[x][y][z] || false;
	},

	getAdjacentRooms: function(start, range, zRange) {
		zRange = zRange || 0;
		var x = start[0], y = start[1], z = start[2];
		var rooms = [], coords = [], c = [], map = {};
		for(var i = x-range; i <= x+range; i++){
			for(var j = y-range; j <= y+range; j++){
				c = [i,j,z];
				coords.push(c);
				var room = this.getRoom(c);
				if (!room) { rooms.push({'coords':c, room:false}); }
				else { rooms.push({coords:c, room:room}); }
			}
		}
		return rooms;
	},

	remap: function() {
		//Get the lowest set of coordinates.
		//Calculate the offset to [0,0,0].
		//Add that offset to every point in the graph.
	}

});
