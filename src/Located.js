/**
 * A located object which has a location (`x`, `y`).
 *
 * Throws an exception
 *  - if `x` is not a number
 *  - or if `y` is not a number
 *
 * @class Located
 * @constructor
 * @param x {number}
 *     The x-coordinate value of the initial location.
 * @param y {number}
 *     The y-coordinate value of the initial location.
 */
Located = (function () {
	function Located(x, y) {
		var self = this;

		// verifies arguments
		if (typeof x !== 'number') {
			throw 'x must be a number';
		}
		if (typeof y !== 'number') {
			throw 'y must be a number';
		}

		/**
		 * The x-coordinate value of the location.
		 *
		 * Do not set this property to a non-number.
		 *
		 * @property x
		 * @type {number}
		 */
		self.x = x;

		/**
		 * The y-coordinate value of the location.
		 *
		 * Do not set this property to a non-number.
		 *
		 * @property y
		 * @type {number}
		 */
		self.y = y;
	}

	/**
	 * Returns whether a specified object is a `Located`.
	 *
	 * A `Located` must have the following properties.
	 *  - x:         number
	 *  - y:         number
	 *  - locate:    function
	 *  - translate: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Located`. `false` if `obj` is not specified.
	 */
	Located.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.x         === 'number'
			&& typeof obj.y         === 'number'
			&& typeof obj.locate    === 'function'
			&& typeof obj.translate === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Located`.
	 *
	 * An object which has all of the following properties can be a `Located`.
	 *  - x: number
	 *  - y: number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {Boolean}
	 *     Whether `obj` can be a `Located`. `false` if `obj` is not specified.
	 */
	Located.canAugment = function (obj) {
		return obj != null
			&& typeof obj.x === 'number'
			&& typeof obj.y === 'number';
	};

	/**
	 * Augments a specified object with features of the `Located`.
	 *
	 * The following property of `obj` will be overwritten.
	 *  - locate
	 *  - translate
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` actually can be a `Located` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Located.augment = function (obj) {
		for (prop in Located.prototype) {
			obj[prop] = Located.prototype[prop];
		}
		return obj;
	};

	/**
	 * Locates at another location.
	 *
	 * NOTE: never checks if `x` and `y` is a number because location will
	 *       frequently be updated.
	 *
	 * @method locate
	 * @param x {number}
	 *     The x-coordinate value of the new location.
	 * @param y {number}
	 *     The y-coordinate value of the new location.
	 * @chainable
	 */
	Located.prototype.locate = function (x, y) {
		this.x = x;
		this.y = y;
		return this;
	};

	/**
	 * Translates this location.
	 *
	 * @method translate
	 * @param dX {number}
	 *     The movement along the x-axis.
	 * @param dY {number}
	 *     The movement along the y-axis.
	 * @chainable
	 */
	Located.prototype.translate = function (dX, dY) {
		this.x += dX;
		this.y += dY;
		return this;
	};

	return Located;
})();
