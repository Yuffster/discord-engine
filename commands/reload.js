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
			andThen = "A new "+replacement.get('short')+
			          " erupts within a flash of fire to take its place.";
			holder.addItem(replacement);
		} else {
			andThen = "A spark ignites in its place for a moment before "+
			          "fading away with a disappointing fizz.";
			if (holder.send) holder.send("The object couldn't be reloaded. "+
			                             "Please check for errors.");
		} 
		
		this.emit("%You wave%s %your hands about in an arcane manner.");
		
		if (holder instanceof Living) {
			holder.emit("%Your "+ object.get('definite') +" disappears in a "+
			            "cloud of smoke. "+andThen);
		} else {
			holder.emit(object.get('definite')+" disappears in a cloud of "+
			            "smoke. "+andThen);
		}

	},
	
	reload_room: function() {
		
		var success = this.world.reloadRoom(this.get('room')),
		    andThen;
		
		if (success) {
			andThen = "The world shimmers around you and seems to take on a "+
			          "new life.";
		} else {
			andThen = "Nothing seems to happen.";
		}
		
		this.emit("%You snap%s %your fingers. "+andThen);
		
	},
	
	reload_living: function(l) {
		
		this.emit(
			"%You chant%s something under %your breath while peering at "+
			l.get('definite')
		);
		
		if (l.player && l.name == this.name) {
			this.send("You reload yourself.");
		}
		
		if (l.player) {
			this.send(
				l.get('definite')+" is a human, what would you reload?"
			);
			return false;
		}
		
		var replacement = this.world.reloadNPC(l);
		
		if (replacement) {
			replacement.emit(
				"%You look%s startled as %you disappears into thin air for "+
				"a moment."
			 );
		} else {
			l.emit("%You cock%s %his at %them, confused.", this);
			this.send(
				"Failed to reload "+l.get('definite')+". Check for bugs!"
			);
		}
		
	}
	
});
