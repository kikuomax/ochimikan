/**
 * Provides variants of binary search.
 *
 * @class Search
 * @static
 */
Search = (function () {
	function Search() { }

	/**
	 * Searches for the lower bound of a specified object in a specified array.
	 *
	 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
	 * and retruns
	 *  - negative number if `lhs < rhs`
	 *  - 0 if `lhs == rhs`
	 *  - positive number if `lhs > rhs`
	 *
	 * A returning index `i` is an index such that
	 *
	 *     array[i - 1] < target <= array[i]
	 *
	 * But
	 *
	 *     i = 0            if target <= array[0]
	 *     i = array.length if target >  array[array.length - 1]
	 *
	 * NOTE: undefined if `array` isn't sorted in ascending order defined by
	 *       `comparator`.
	 *
	 * @method lowerBound
	 * @param array {array}
	 *     The array in which the lower bound of `target` is to be searched.
	 * @param target {object}
	 *     The object whose lower bound in `array` is to be searched.
	 * @param comparator {function}
	 *     The function which compares an element in `array` and `target`
	 *     for order.
	 * @return {number}
	 *     The lower bound of `target` in `array`.
	 */
	Search.lowerBound = function (array, target, comparator) {
		var lower = 0;
		var upper = array.length;
		while (lower < upper) {
			var center = Math.floor((lower + upper) / 2);
			if (comparator(array[center], target) < 0) {
				// target is in a upper half
				lower = center + 1;
			} else {
				// target is in a lower half
				upper = center;
			}
		}
		return lower;
	};

	/**
	 * Searches for the upper bound of a specified object in a specified array.
	 *
	 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
	 * and returns
	 *  - negative number if `lhs < rhs`
	 *  - 0 if `lhs == rhs`
	 *  - positive number if `lhs > rhs`
	 *
	 * A returning index `i` satisfies
	 *
	 *     array[i - 1] <= target < array[i]
	 *
	 * But
	 *
	 *     i = 0            if target <  array[0]
	 *     i = array.length if target >= array[array.length - 1]
	 *
	 * NOTE: undefined if `array` isn't sorted in ascending order defined
	 *       by `comparator`.
	 *
	 * @method upperBound
	 * @param array {array}
	 *     The array in which the upper bound of `target` is to be searched.
	 * @param target {object}
	 *     The object whose upper bound in `array` is to be searched.
	 * @param comparator {function}
	 *     A function which compares an element in `array` and `target`
	 *     for order.
	 * @return {number}
	 *     The index of the upper bound of `target` in `array`.
	 */
	Search.upperBound = function (array, target, comparator) {
		var lower = 0;
		var upper = array.length;
		while (lower < upper) {
			var center = Math.floor((lower + upper) / 2);
			if (comparator(target, array[center]) < 0) {
				// target is in the lower half
				upper = center;
			} else {
				// target is in the upper half
				lower = center + 1;
			}
		}
		return upper;
	};

	/**
	 * Compares specified two values for order.
	 *
	 * Just applies `<` operator for comparison.
	 *
	 * @method compare
	 * @param lhs {any}
	 *     The left hand side of comparison.
	 * @param rhs {any}
	 *     The right hand side of comparison.
	 * @return {number}
	 *     Negative number if lhs <  rhs.
	 *     0               if lhs == rhs.
	 *     Positive number if lhs >  rhs.
	 */
	Search.compare = function (lhs, rhs) {
		if (lhs < rhs) {
			return -1;
		} else if (rhs < lhs) {
			return 1;
		} else {
			return 0;
		}
	};

	return Search;
})();
