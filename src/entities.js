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
    var _x = x;
    Object.defineProperty(self, "x", {
	configurable: true,
	get: function() { return _x; },
	set: function(x) { _x = x; }
    });

    /**
     * The y-coordinate value of the location.
     *
     * @property y
     * @type {Number}
     */
    var _y = y;
    Object.defineProperty(self, "y", {
	configurable: true,
	get: function() { return _y; },
	set: function(y) { _y = y; }
    });

    /**
     * Returns the location as a two dimensional array like `[x, y]`.
     *
     * @propety xy
     * @type {[Number, Number]}
     */
    Object.defineProperty(self, "xy", {
	configurable: true,
	get: function() { return [_x, _y]; }
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
