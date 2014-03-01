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

    // the location
    var _loc = [x, y];

    /**
     * The x-coordinate value of the location.
     *
     * @property x
     * @type Number
     */
    Object.defineProperty(self, "x", {
	configurable: true,
	get: function() { return _loc[0]; },
	set: function(x) { _loc[0] = x; }
    });

    /**
     * The y-coordinate value of the location.
     *
     * @property y
     * @type Number
     */
    Object.defineProperty(self, "y", {
	configurable: true,
	get: function() { return _loc[1]; },
	set: function(y) { _loc[1] = y; }
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
	_loc[0] = x;
	_loc[1] = y;
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
