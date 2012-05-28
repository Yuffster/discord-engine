Attributes = new Class({
	
	attributes: [],
	
	add_attribute: function() {
		for (var i=0;i<arguments.length;i++) {
			this.attributes.push(arguments[i]);
		}
	},	
	
	remove_attribute: function(attribute) {
		for (var i=0;i<arguments.length;i++) {
			this.attributes.erase(arguments[i]);
		}
	},
	
	has_attribute: function(attribute) {
		for (var i=0;i<arguments.length;i++) {
			if (!this.attributes.contains(arguments[i])) {
				return false;
			}
		} return true;
	}
	
});