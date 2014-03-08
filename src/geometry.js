/**
 * Provides a geometry in the game.
 *
 * @module geometry
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
}

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
Located.prototype.locate = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

/**
 * Returns the location as a two dimensional array like `[x, y]`.
 *
 * @method xy
 * @return {[Number, Number]}  The location of this `Located`.
 */
Located.prototype.xy = function() {
    return [this.x, this.y];
};

/**
 * Returns whether the specified object is a `Located`.
 *
 * A `Located` has the following properties.
 * - x
 * - y
 *
 * @method isLocated
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is a `Located`. `false` if `obj` is `null` or `undefined`.
 */
Located.isLocated = function(obj) {
    return (obj != null) && (obj.x != null) && (obj.y != null);
};

/**
 * Wraps the specified object with functionalities of `Located`.
 *
 * Overwrites the following property.
 * - xy
 * - locate
 *
 * @param obj {Object}
 *     The object to be wrapped with `Located`.
 * @return {Object}  `obj`.
 */
Located.wrap = function(obj) {
    for (prop in Located.prototype) {
	obj[prop] = Located.prototype[prop];
    }
    return obj;
};
