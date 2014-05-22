/**
 * Provides main objects in the game.
 *
 * # Use Cases
 *
 * ## Producing a mikan
 *
 * 1. A user randomly chooses a degree of damage.
 * 1. The user creates a `Mikan` supplied with the degree of damage.
 *
 * ## Creating a mikan box
 *
 * 1. A user determines the number of columns and rows in a mikan box.
 * 1. The user creates a `MikanBox` with the size (# of column, # of row).
 *
 * ## Placing a mikan
 *
 * 1. A `Mikan` is given.
 * 1. A `MikanBox` is given.
 * 1. A user places the `Mikan` somewhere in the `MikanBox`.
 *
 * ## Dropping mikans
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to drop `Mikan`s in it.
 * 1. The `Mikan`s in the `MikanBox` which aren't placed on the ground
 *    fall towards the ground.
 *
 * ## Erasing mikans
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to chain and erase `Mikan`s in it
 *    which are maximally damaged.
 * 1. The chained `Mikan`s explode with `Spray`s.
 * 1. The explosion spoils surrounding `Mikan`s.
 * 1. `Mikan`s remaining in the `MikanBox` fall towards the ground.
 *
 * ## Rendering a mikan box
 *
 * 1. A context is given.
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to render in the context.
 * 1. The user can see the `MikanBox` in the context.
 *
 * ## Rendering a mikan
 *
 * 1. A context is given.
 * 1. A `Mikan` is given.
 * 1. A user asks the `Mikan` to render in the context.
 * 1. The user can see the `Mikan` in the context.
 *
 * ## Rendering a spray
 *
 * 1. A context is given.
 * 1. A `Spray` is given.
 * 1. A user asks the `Spray` to render in the context.
 * 1. The user can see the `Spray` in the context.
 *
 * @module mikans
 */

/**
 * A mikan.
 *
 * The location `(x, y)` of mikan is set to `(0, 0)`.
 *
 * Throws an exception if `damage < 0` or `dmanage > Mikan.MAX_DAMAGE`.
 *
 * # Scenarios
 *
 * ## Rendering a mikan
 *
 * 1. A context is given.
 * 1. A `Mikan` asks the `Resources` for a mikan sprite corresponding to
 *    its degree of damage.
 * 1. The `Mikan` renders the sprite at its location in the context.
 *
 * @class Mikan
 * @constructor
 * @uses Located
 * @uses Renderable
 * @param damage {Number}
 *     The degree of damage to set. A float value is to be floored.
 */
function Mikan(damage) {
    var self = this;

    // validates the damage
    checkDamage(damage);

    // locates at (0, 0)
    Located.call(self, 0, 0);

    // makes mikan renderable
    Renderable.call(self, function(context) {
	Resources.SPRITES['mikan'][self.damage].render(context, self.x, self.y);
    });

    /**
     * The degree of damage on this mikan.
     *
     * The setter throws an exception if `damage < 0` or
     * `damage > Mikan.MAX_DAMAGE`.
     *
     * The setter floors the argument.
     *
     * @property damage
     * @type Number
     */
    var _damage = Math.floor(damage);
    Object.defineProperty(self, "damage", {
	get: function() {
	    return _damage;
	},
	set: function(damage) {
	    checkDamage(damage);
	    _damage = Math.floor(damage);
	}
    });

    // makes sure that the damage is in [0, MAX_DAMAGE]
    function checkDamage(damage) {
	if (damage < 0) {
	    throw "damage must be >= 0 but " + damage;
	}
	if (damage > Mikan.MAX_DAMAGE) {
	    throw "damage must be <= MAX_DAMAGE but " + damage;
	}
    }
}
Located.augment(Mikan.prototype);

/**
 * Spoils this mikan.
 *
 * The degree of damage of this mikan will be incremented unless it's
 * `Mikan.MAX_DAMAGE`.
 *
 * @method spoil
 * @chainable
 */
Mikan.prototype.spoil = function() {
    if (this.damage < Mikan.MAX_DAMAGE) {
	++this.damage;
    }
    return this;
};

/**
 * The maximum damage of a mikan.
 *
 * @property MAX_DAMAGE
 * @static
 * @type Number
 * @final
 */
Object.defineProperty(Mikan, 'MAX_DAMAGE', { value: 3, writable: false });

/**
 * Returns whether the specified object is a `Mikan`.
 *
 * A `Mikan` must satisfies the following conditions,
 * - is a `Located`
 * - has the following property,
 *   - damage
 *
 * @method isMikan
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is a mikan. `false` if `obj` is `null` or `undefined`.
 */
Mikan.isMikan = function(obj) {
    return Located.isClassOf(obj) && (obj.damage != null);
};

/**
 * A spray.
 *
 * Is an actor which has a priority = `ActorPriorities.SPRAY`.
 *
 * # Scenarios
 *
 * ## Spreading
 *
 * 1. A `Spray` is asked to act.
 * 1. The `Spray` decrements `ttl`.
 * 1. The `Spray` moves the specified amount (`dX`, `dY`)
 * 1. The `Spray` increments its frame index.
 * 1. The `Spray` reschedules itself in a given actor scheduler.
 *
 * ### Stop spreading
 *
 * - 2 The time to live expired (`ttl <= 0`)
 *   1. The `Spray` stops.
 * - 4 The frame index is `Spray.FRAME_COUNT`.
 *   1. The `Spray` resets the frame index (`=0`)
 *   1. Proceeds to the step 5.
 *
 * ## Rendering a `Spray`
 *
 * 1. A context is given.
 * 1. A `Spray` asks the `Resources` for a spray sprite corresponding to
 *    its frame index.
 * 1. The `Spray` renders the sprite at its location in the context.
 *
 * @class Spray
 * @constructor
 * @uses Located
 * @uses Actor
 * @uses Renderable
 * @param x {Number}
 *     The x-coordinate value of the initial location.
 * @param y {Number}
 *     The y-coordinate value of the initial location.
 * @param dX {Number}
 *     The speed along in the x-coordinate.
 * @param dY {Number}
 *     The speed along in the y-coordinate.
 * @param ttl {Number}
 *     The time to live.
 */
function Spray(x, y, dX, dY, ttl) {
    var self = this;

    Located.call(self, x, y);

    Actor.call(self, ActorPriorities.SPRAY, function(scheduler) {
	// moves and reschedules if ttl hasn't expired
	if (ttl > 0) {
	    --ttl;
	    self.x += dX;
	    self.y += dY;
	    ++frameIndex;
	    if (frameIndex == Spray.FRAME_COUNT) {
		frameIndex = 0;
	    }
	    scheduler.schedule(self);
	}
    });

    Renderable.call(self, function(context) {
	Resources.SPRITES['spray'][frameIndex].render(context, self.x, self.y);
    });

    /**
     * The speed along in the x-coordinate.
     *
     * @property dX
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'dX', { value: dX });

    /**
     * The speed along in the y-coordinate.
     *
     * @property dY
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'dY', { value: dY });

    /**
     * The time to live.
     *
     * @property ttl
     * @type {Number}
     */
    Object.defineProperty(self, 'ttl', {
	get: function() { return ttl; }
    });

    /**
     * The frame index.
     *
     * @property frameIndex
     * @type {Number}
     */
    var frameIndex = 0;
    Object.defineProperty(self, 'frameIndex', {
	get: function() { return frameIndex; }
    });
};
Located.augment(Spray.prototype);

/**
 * The frame count of a spray.
 *
 * `FRAME_COUNT = 4`
 *
 * @property FRAME_COUNT
 * @type {Number}
 * @final
 */
Object.defineProperty(Spray, 'FRAME_COUNT', { value: 4 });
