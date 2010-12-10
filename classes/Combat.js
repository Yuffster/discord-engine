/**
 * This is the base Combat class which includes the specific methods to be
 * called by the Living object.
 *
 * To use a different combat engine, use the following code within the
 * initialization routine of your world:
 *
 * 		Living.implement(<CombatClass>);
 *
 * See StandardCombat for an example implementation of a simple combat system.
 *
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt
 */
Combat = new Class({

	target : null,

	//This flag is here because there's no HP system set.  For a real combat
	//system, death should be a much more complex determination.
	dead   : false,

	/**
	 * Determines how many actions a character can perform in a given five
	 * second block.
	 */
	getHeartrate: function() {
		return 2;
	},

	/**
	 * Initiated when a combat command is used and a target is found.
	 */
	startCombat: function(target) {
		this.target = target;
		this.send("You want to attack "+target.get('short')+"? That's mean!");
		this.stopCombat();
	},

	/**
	 * Clears the active target from each of the fighters.  Should 
	 * theoretically stop the fighting.
	 */
	stopCombat: function() {
		this.target.target = null;
		this.target = null;
	},

	/**
	 * This happens when a user is in a fight and there is no queued action
	 * at the time of a heartbeat.
	 */
	combatTurn: function() {
		return;
	},

	/**
	 * This happens every heartbeat during which an action isn't queued.
	 */
	rest: function() {
		return;
	},

	/**
	 * Can happen outside of combat whenever living.die() is called.
	 */
	die: function() {
		this.dead = true;
	},

	/**
	 * Returns true if the player is dead.
	 */
	isDead: function() {
		return this.dead;
	},

	/**
	 * Should return combat-related data to save to the player object.
	 */
	dumpStats: function() {
		return false;
	},

	/**
	 * Takes the object formed in saveStats above and loads it.
	 */
	loadStats: function(stats) {
		return false;
	},

	/**
	 * Happens once a heartbeat.  Can be used to apply poison effects, regulate 
	 * blood loss, etc.
	 */
	 checkStats: function() {

	 }
	
});
