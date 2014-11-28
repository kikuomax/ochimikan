/**
 * An entry in a score database.
 *
 * The `date` of the `Score` will be set to the current date.
 *
 * Throws an exception,
 *  - if `value` is not a number,
 *  - or if `level` is not a number,
 *  - or if `player` is not a string,
 *  - or if `value < 0`,
 *  - or if `level < 0`.
 *
 * @class Score
 * @constructor
 * @param value {number}
 *     The value of the score.
 * @param level {number}
 *     The level at which the score was achieved.
 * @param player {string}
 *     The player who achieved the score.
*/
Score = (function () {
	function Score(value, level, player) {
		var self = this;

		// verifies arguments
		if (typeof value !== 'number') {
			throw new Error('value must be a number');
		}
		if (typeof level !== 'number') {
			throw new Error('level must be a number');
		}
		if (typeof player !== 'string') {
			throw new Error('player must be a string');
		}
		if (value < 0) {
			throw new Error('value must be >= 0');
		}
		if (level < 0) {
			throw new Error('level must be >= 0');
		}

		/**
		 * The value of this score.
		 *
		 * @property value
		 * @type number
		 */
		self.value = value;

		/**
		 * The level at which this score was achieved.
		 *
		 * @property level
		 * @type number
		 */
		self.level = level;

		/**
		 * The player who achieved this score.
		 *
		 * @property player
		 * @type string
		 */
		self.player = player;

		/**
		 * The date when this score was achieved.
		 *
		 * The number of seconds since January 1, 1970, 00:00:00 GMT.
		 *
		 * @property date
		 * @type number
		 */
		self.date = Math.floor(new Date().getTime() / 1000.0);
	}

	/**
	 * Returns whether a specified object is a `Score`.
	 *
	 * A `Score` must have all of the following properties,
	 *  - value:      number
	 *  - level:      number
	 *  - player:     string
	 *  - date:       number
	 *  - dateObject: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Score`. `false` if `obj` is not specified.
	 */
	Score.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.value      === 'number'
			&& typeof obj.level      === 'number'
			&& typeof obj.player     === 'string'
			&& typeof obj.date       === 'number'
			&& typeof obj.dateObject === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Score`.
	 *
	 * An object which has all of the following properties can be a `Score`,
	 *  - value:  number
	 *  - level:  number
	 *  - player: string
	 *  - date:   number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Score`. `false` if `obj` is not specified.
	 */
	Score.canAugment = function (obj) {
		return obj != null
			&& typeof obj.value  === 'number'
			&& typeof obj.level  === 'number'
			&& typeof obj.player === 'string'
			&& typeof obj.date   === 'number';
	};

	/**
	 * Augments a specified object with the features of the `Score`.
	 *
	 * NOTE: never checks if `obj` can actually be a `Score`, because this
	 *       method may be applied to an incomplete object; i.e., a prototype.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {Score}
	 *     `obj`.
	 */
	Score.augment = function (obj) {
		for (prop in Score.prototype) {
			obj[prop] = Score.prototype[prop];
		}
		return obj;
	};

	/**
	 * Returns the date as a `Date` object.
	 *
	 * @method dateObject
	 * @return {Date}
	 *     A `Date` when this score was achieved.
	 */
	Score.prototype.dateObject = function () {
		return new Date(this.date * 1000);
	};

	return Score;
})();
