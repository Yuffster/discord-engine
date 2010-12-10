/**
 * Super basic hack'n'slash combat engine.
 * 
 * No magic system.  Death when HP is less than 0. Simple stats instead of
 * skill tree.
 *
 * Scale notes:
 *
 *     Stats go from 1 (useless) to 20 (mastery) with a strong curve upwards
 *     for additional points, making 25 almost technically impossible.
 *
 * @author Michelle Steigerwalt <msteigerwalt.com>
 * @copyright 2010 Michelle Steigerwalt
 */
CombatStandard = new Class({

	Extends: Combat,

	stats     : {
		hp        : 10,
		strength  : 1, //Strength affects attack damage
		dexterity : 1, //Dexterity affects attack likelihood (aim)
		speed     : 1, //Speed affects dodge and heartbeat speed
		defense   : 1, //Defense affects damage received and hit points
	},

	target    : false, //The current target of this living.

	/**
	 * Calculates the beats per five seconds of Living's heart (max is 5).
	 */
	getHeartrate: function() {
		var rate = Math.floor(this.speed/5);
		if (rate<1) rate = 1;
		if (rate>5) rate = 5;
		return rate;
	},

	getMaxHP: function() {
		return this.stats.defense*25;
	},
	
	getHP: function() {
		if (this.stats.hp===null) this.stats.hp = this.getMaxHP();
		return this.stats.hp;
	},

	getAim: function() {
		this.rollStat('dexterity');
	},

	getDodge: function() {
		this.rollStat('speed');
	},

	getDamage: function() {
		return this.rollStat('strength');
	},

	getAbsorb: function(points, type) {
		//Type isn't implemented yet (ie, fire, sharp, blunt).
		var less = this.rollStat('defense');
		var total = points-less;
		if (total > 0) return total;
		//No healing absorbs.
		return 0;
	},

	rollStat: function(name) {
		this.practice(name);
		return this.roll(this.stats[name]);
	},

	/**
	 * A very minimalist approach to skill advancement.  Every time a skill
	 * is utilized, there's a slight chance of increasing that skill by one
	 * point.
	 *
	 * The chance of increasing a skill becomes much harder as skill points
	 * increase.
	 */
	practice: function(skill) {

		var current = this.stats[skill];
		var chances = 1/(current*current)/10;
		var roll    = Math.random();

		var text = {
			'strength'  : 'stronger',
			'dexterity' : 'more agile',
			'defense'   : 'more able to take a beating',
			'speed'     : 'faster'
		};

		if (roll<=chances) {
			this.stats[skill]++;
			var skillText = text[skill] || 'more skilled at '+skill;
			this.send("You feel "+skillText+".");
		}

	},

	roll: function(high) {
		return Math.floor(Math.random()*high);
	},

	startCombat: function(target) {
		//No PVP yet.
		if (target.player) {
			this.send("You can't bring yourself to attack "+ target.get('short')+".");
			return false;
		}
		this.target   = target;
		target.target = this;
	},

	/** Happens once a heartbeat during combat if nothing is queued. **/
	combatTurn: function() {
		//No combat if the combatants aren't in the same room.
		if (!this.target || this.get('room') != this.target.get('room')) return false;
		//Don't need to pass the target to the attack method since this.target
		//by definition is the character the current character is focused on.
		this.attack();
		this.send("[HP: "+this.getHP()+"]");
		return true;
	},

	attack: function() {
		if (this.target.dodge(this)) {
			this.send("You attempt to hit "+this.target.get('short')+" but miss.");	
			this.target.send(this.get('short')+" attempts to hit you, but you dodge the attack.");
		}
		var damage = this.getDamage();
		var total = this.target.takeDamage(damage);
		this.send("You hit "+this.target.get('short')+" for "+total+" points of damage.");
		this.target.send(this.get('short')+" hits you for "+total+" points of damage.");
		if (this.target.isDead()) {
			this.doVictory();
		}
	},

	dodge: function(attacker) {
		if (this.getDodge() > this.getAim()) return true;
		return false;
	},

	/** Happens once a heartbeat if nothing is queued. **/
	rest: function() {
		if (this.getHP() < this.getMaxHP()) this.stats.hp++;
	},

	takeDamage: function(points, type) {
		var total = this.getAbsorb(points, type);
		this.stats.hp = this.getHP() - total;
		if (this.getHP() < 0) this.die();
		return total;
	},

	isDead: function() {
		return this.getHP()<=0;
	},

	die: function() {
		//No corpse system.
		this.emit("%You turn%s to ash and disappear%s.");
		var room = this.get('room');
		if (room) room.removeLiving(this);
		this.stopHeart();
		if (this.player) this.disconnect();
	},

	/**
	 * This is where XP would be determined, if we were using XP.
	 */
	doVictory: function() {
		this.send("You have slain "+this.target.get('short')+".");
		//Break up the fight.
		this.stopCombat();
	},

	dumpStats: function() {
		return this.stats;
	},

	loadStats: function(data) {
		if (data) this.stats = data;
	},

	checkStats: function() {
		if (this.getHP() <= 0) this.die();
	}

});
