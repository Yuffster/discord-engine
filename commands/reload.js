module.exports = new Class({

	Extends: Command,
	
	init: function() {
		//Epic multiple syntaxes with different handlers action!
		this.add_syntax('<object>', 'reload_item');
		this.add_syntax('<living>', 'reload_living');
		this.add_syntax('', 'reload_room');
	},

	reload_item: function(object) {
		
		    //We need to know if this object is in the room or in an inventory.
		var holder = object.getContainer(),
		    //Attempt to get a new item to replace it.
		    replacement = this.world.reloadItem(object),
		    //We'll store some text here to append to the destruction message.
		    andThen;
		
		//Take the item away.
		object.getContainer().removeItem(object);
		
		if (replacement) {
			andThen = "A new "+replacement.get('short')+" erupts within a flash of fire to take its place.";
			holder.addItem(replacement);
		} else {
			andThen = "A spark ignites in its place for a moment before fading away with a disappointing fizz.";
			if (holder.send) holder.send("The object couldn't be reloaded. Please check for errors.");
		} 
		
		if (holder instanceof Living) {
			holder.emit("%Your "+ object.get('definite') +" disappears in a cloud of smoke. "+andThen);
		} else {
			holder.emit(object.get('definite')+" disappears in a cloud of smoke. "+andThen);
		}

	},
	
	reload_room: function() {
		
		var success = this.world.reloadRoom(this.get('room')),
		    andThen;
		
		if (success) {
			andThen = "The world shimmers around you and seems to take on a new life.";
		} else {
			andThen = "Nothing seems to happen.";
		}
		
		this.emit("%You snap%s %your fingers. "+andThen);
		
	},
	
	reload_living: function(l) {
		this.send("ZOMG");
	}
	
});
