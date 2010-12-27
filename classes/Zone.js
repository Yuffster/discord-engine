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
			//This is our first room, so we'll just arbitrarily pick 0,0 as its
			//coordinates.
			coords = [0,0,0];
		}

		//Default z-axis is 0.
		if (coords.length==2) { coords.push(0); }

		//Don't parse rooms more than once each.
		if (this.mapped[room.path]) { return false; } 

		this.placeRoom(room,coords);
	
 		//Remember that we mapped it.
		this.mapped[room.path] = coords;

		//Go through the exits, calculate the coordinates for those.
		//Mixed directions are not currently supported.
		Object.each(room.getExitRooms(), function(room, dir) {
			var c = coords;
			if (dir=='east') {
				c[0] = c[0]+1;
			} else if (dir=='west') { 
				c[0] = c[0]-1;
			} else if (dir=="north")  {
				c[1] = c[1]+1;
			} else if (dir=="south") {
				c[1] = c[1]-1;
			} else if (dir=="up") {
				c[2] = c[2]+1;
			} else if (dir=="down") {
				c[2] = c[2]-1;
			} else {
				log_error("Unmappable room direction: "+dir);
			}
			this.mapRoom(room, c);
		}, this);

	},

	placeRoom: function (room,coords) {
		var x = coords[0], y = coords[1], z = coords[2];
		if (!this.map[x]) { this.map[x] = {}; }
		if (!this.map[x][y]) { this.map[x][y] = {}; }
		var other = this.map[x][y][z];
		if (other) {
			log_error("Room coordinate conflict! ("+room.path+", "+other.path+")");
		}
		this.map[x][y][z] = room;
	},

	getCoordinates: function(room) {
		return this.mapped[room.path];
	},

	getRoom: function(coords) {
		if (!this.map[x]) { return false; }
		if (!this.map[x][y]) { return false; }
		if (!this.map[x][y][z]) { return false; }
		return this.map[x][y][z];
	},

	remap: function() {
		//Get the lowest set of coordinates.
		//Calculate the offset to [0,0,0].
		//Add that offset to every point in the graph.
	}

});
