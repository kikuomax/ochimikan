/**
 * Provides entities in the game.
 *
 * @module entities
 */

/**
 * A located object which has a location (`x`, `y`).
 *
 * @class Located
 * @constructor
 * @param x {Number}
 *     The x-coordinate value of the initial location.
 * @param y {Number}
 *     The y-coordinate value of the initial location.
 */
function Located(x, y) {
    var self = this;

    /**
     * The x-coordinate value of the location.
     *
     * @property x
     * @type {Number}
     */
    Object.defineProperty(self, "x", {
	value: x,
	configurable: true,
	writable: true
    });

    /**
     * The y-coordinate value of the location.
     *
     * @property y
     * @type {Number}
     */
    Object.defineProperty(self, "y", {
	value: y,
	configurable: true,
	writable: true
    });

    /**
     * Returns the location as a two dimensional array like `[x, y]`.
     *
     * @propety xy
     * @type {[Number, Number]}
     */
    Object.defineProperty(self, "xy", {
	configurable: true,
	get: function() { return [self.x, self.y]; }
    });

    /**
     * Locates at another location.
     *
     * @method locate
     * @param x {Number}
     *     The x-coordinate value of the new location.
     * @param y {Number}
     *     The y-coordinate value of the new location.
     * @chainable
     */
    self.locate = function(x, y) {
	self.x = x;
	self.y = y;
	return self;
    };
}

/**
 * Makes an existing object a located object.
 *
 * Overwrites the following properties,
 * - x
 * - y
 *
 * @method makeLocated
 * @static
 * @param self {Object}
 *     The object to be a located object.
 * @param x {Number}
 *     The x-coordinate value of the initial location.
 * @param y {Number}
 *     The y-coordinate value of the initial location.
 * @return {Located}  `self`.
 */
Located.makeLocated = function(self, x, y) {
    Located.call(self, x, y);
    return self;
};
