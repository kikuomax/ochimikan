/**
 * Provides main objects in the game.
 *
 * # Use Cases
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
 */

/**
 * A mikan.
 *
 * The initial location of this mikan is (0, 0).
 *
 * Throws an exception if `damage` < 0 or `dmanage` > `Mikan.MAX_DAMAGE`.
 *
 * @class Mikan
 * @constructor
 * @uses Located
 * @uses Renderable
 * @param damage {number}
 *     The degree of damage to set. A float value is to be floored.
 */
function Mikan(damage) {
    var self = this;

    // verifies the damage
    checkDamage(damage);

    // locates at (0, 0)
    Located.call(self, 0, 0);

    /**
     * Renders this mikan.
     *
     * Renders a mikan sprite corresponding to the degree of damage.
     *
     * @method render
     * @param context {canvas context}
     *     The context in which this mikan is rendered.
     */
    Renderable.call(self, function(context) {
	Resources.SPRITES['mikan'][self.damage].render(context, self.x, self.y);
    });

    /**
     * The degree of damage on this mikan.
     *
     * The setter throws an exception if `damage` < 0 or
     * `damage` > `Mikan.MAX_DAMAGE`.
     *
     * @property damage
     * @type number
     */
    var _damage = damage;
    Object.defineProperty(self, 'damage', {
	get: function() {
	    return _damage;
	},
	set: function(damage) {
	    checkDamage(damage);
	    _damage = damage;
	}
    });

    // makes sure that the damage is in [0, MAX_DAMAGE]
    function checkDamage(damage) {
	if (damage < 0) {
	    throw 'damage must be >= 0 but ' + damage;
	}
	if (damage > Mikan.MAX_DAMAGE) {
	    throw 'damage must be <= MAX_DAMAGE but ' + damage;
	}
    }
}
Located.augment(Mikan.prototype);
Renderable.augment(Mikan.prototype);

/**
 * The maximum damage of a mikan.
 *
 * @property MAX_DAMAGE
 * @static
 * @type number
 * @final
 */
Object.defineProperty(Mikan, 'MAX_DAMAGE', { value: 3 });

/**
 * Spoils this mikan.
 *
 * The degree of damage of this mikan will be incremented unless it is
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
