/**
 * A list of `Score`s.
 *
 * Initializes an empty list.
 *
 * @class ScoreList
 * @constructor
 */
ScoreList = (function () {
	function ScoreList() {
		/**
		 * The array of scores in this `ScoreList`.
		 *
		 * DO NOT manipulate this property.
		 * Use `scoreCount` and `scoreAt` instead.
		 *
		 * @property scores
		 * @type array{Score}
		 * @protected
		 */
		this.scores = [];
	}

	/**
	 * Returns whether a specified object is a `ScoreList`.
	 *
	 * A `ScoreList` must have all of the following properties,
	 *  - scoreCount: function
	 *  - scoreAt:    function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `ScoreList`. `false` if `obj` is not specified.
	 */
	ScoreList.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.scoreCount === 'function'
			&& typeof obj.scoreAt    === 'function';
	};

	/**
	 * Returns whether a specified object can be a `ScoreList`.
	 *
	 * An object which satisfies all of the following conditions can be
	 * a `ScoreList`,
	 *  - Has an array `scores`
	 *  - `scores` is empty or every element in it can be a `Score`
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `ScoreList`.
	 *     `false` is `obj` is not specified.
	 */
	ScoreList.canAugment = function (obj) {
		return obj != null
			&& Array.isArray(obj.scores)
			&& obj.scores.reduce(function (b, e) {
				return b && Score.canAugment(e);
			}, true);
	};

	/**
	 * Augments a specified object with the features of the `ScoreList`.
	 *
	 * If `obj` has an array `scores`, every element in it will be augmented by
	 * the `Score`.
	 *
	 * NOTE: never tests if `obj` can actually be a `ScoreList` because this
	 *       method can be applied to an incomplete object; i.e., a prototype.
	 *
	 * Throws an exception,
	 *  - if `obj` is not specified,
	 *  - or if `obj` has a non-empty array `scores`, but it contains `null` or
	 *    `undefined`.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`
	 */
	ScoreList.augment = function (obj) {
		for (prop in ScoreList.prototype) {
			obj[prop] = ScoreList.prototype[prop];
		}
		if (Array.isArray(obj.scores)) {
			obj.scores.forEach(function (e) {
				Score.augment(e);
			});
		}
		return obj;
	};

	/**
	 * Returns the number of scores in this `ScoreList`.
	 *
	 * @method scoreCount
	 * @return {number}
	 *     The number of scores in this `ScoreList`.
	 */
	ScoreList.prototype.scoreCount = function () {
		return this.scores.length;
	};

	/**
	 * Returns a score at a specified index in this `ScoreList`.
	 *
	 * @method scoreAt
	 * @param index {number}
	 *     The index of score.
	 * @return {Score}
	 *     The score at `index`.
	 *     `undefined` if `index < 0` or `index >= this.scoreCount()`.
	 */
	ScoreList.prototype.scoreAt = function (index) {
		return this.scores[index];
	};

	return ScoreList;
})();
