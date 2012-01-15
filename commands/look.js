module.exports = new Class({

	Extends: Command,

	execute: function(obj) {
		obj = obj.toLowerCase();
		if (obj=='me') obj = this.get('name');
		var room = this.get('room');
		if (!room) return "You don't appear to be anywhere!";
		var reply = [];
		if (!obj) {
			return room.getDescription(this);
		} else {
			//First check local inventory.
			var item = this.getItem(obj);
			//Then check the room environment.
			if (!item) item = room.getItem(obj);
			if (!item) item = room.getLiving(obj);
			//Then check extra description details.
			if (!item) {
				var detail = this.get('room').getDetail(obj);
				if (detail) return detail;
			}
			//If we still don't have anything, return nothing.
			if (!item) return("You can't see anything interesting.");
			//Otherwise, return the item's description.
			return item.getDescription(this);
		} return reply;
	}

});
