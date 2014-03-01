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
 * 1. A user determines the number of columns in a mikan box.
 * 1. The user determines the number of rows in a mikan box.
 * 1. The user creates a `MikanBox` with the size (# of column, # of row).
 *
 * ## Placing a mikan
 *
 * 1. A `Mikan` is given.
 * 1. A `MikanBox` is given.
 * 1. A user places the `Mikan` somewhere in the `MikanBox`.
 *
 * ## Rendering a mikan
 *
 * 1. A context is given.
 * 1. A `Mikan` is given.
 * 1. A user asks the `Mikan` to render in the context.
 * 1. The user can see the `Mikan` in the context. It's placed at its location
 *    and has appearance reflecting its degree of damage.
 *
 * ## Chaining damaged mikans in a mikan box
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to chain damaged mikans.
 * 1. Maximumly damaged `Mikan`s in the `MikanBox` are chained. And `Mikan`s
 *    composing each chain explodes if the size of the chain reaches the limit.
 * 1. The explosion erases the `Mikan`s in that chain and spoils surrounding
 *    `Mikan`s. The explosion can be seen as `Spray`s.
 * 1. `Mikan`s remaining in the `MikanBox` fall under gravity
 *    (move to another place).
 * 1. Further more chaining may happen after every `Mikan` is sticked
 *    in the `MikanBox`.
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
 * 1. A `Mikan` asks for the `Resources` for a mikan sprite corresponding to
 *    its degree of damage.
 * 1. The `Mikan` renders the sprite at its location in the context.
 *
 * @class Mikan
 * @constructor
 * @extends Located
 * @extends Renderable
 * @param damage {Number}
 *     The degree of damage to set. A float value is to be floored.
 */
function Mikan(damage) {
    var self = this;

    // validates the damage
    checkDamage(damage);

    // locates at (0, 0)
    Located.makeLocated(self, 0, 0);

    // makes mikan renderable
    Renderable.makeRenderable(self, function(context) {
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

    /**
     * Spoils this mikan.
     *
     * The degree of damage of this mikan will be incremented unless it's
     * `Mikan.MAX_DAMAGE`.
     *
     * @method spoil
     * @chainable
     */
    self.spoil = function() {
	if (_damage < Mikan.MAX_DAMAGE) {
	    ++_damage;
	}
	return self;
    };

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

/**
 * The maximum damage of a mikan.
 *
 * @property MAX_DAMAGE
 * @static
 * @type Number
 * @final
 */
Object.defineProperty(Mikan, "MAX_DAMAGE", { value: 3, writable: false });
