/**
 * Provides utilities for search.
 *
 * @module search
 */

/**
 * Provides functions for search.
 *
 * @class Search
 * @static
 */
function Search() { }

/**
 * Searches the lower bound of the specified object in the specified array.
 *
 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
 * and retruns
 * - negative number if `lhs < rhs`
 * - 0 if `lhs == rhs`
 * - positive number if `lhs > rhs`
 *
 * Returning index `u` is an index such that
 * - `array[u-1] < target <= array[u]` (0 < u < array.length)
 * - `u = 0` if `target <= array[v]` for any `v` in `[0, array.length-1]`
 * - `u = array.length` if `array[v] < target` for
 *   any `v` in `[0, array.length-1]`
 *
 * NOTE: undefined if `array` isn't sorted by `comparator`.
 * @method lowerBound
 * @param array {Array}
 *     The array in which the lower bound of `target` is to be searched.
 * @param target {Object}
 *     The object whose lower bound in `array` is to be searched.
 * @param comparator {function}
 *     Compares an element in `array` and `target` for order.
 * @return {int}
 *     The lower bound of `target` in `array`.
 */
Search.lowerBound = function(array, target, comparator) {
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
 * Searches the upper bound of the specified object in the specified array.
 *
 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
 * and returns
 * - negative number if `lhs < rhs`
 * - 0 if `lhs == rhs`
 * - positive number if `lhs > rhs`
 *
 * Returning index `u` is an index such that
 * - `array[u-1] <= target < array[u]` (0 < u < array.length)
 * - `u = 0` if `target < array[v]` for any `v` in `[0, array.length-1]`
 * - `u = array.length` if `array[v] <= target` for
 *   any `v` in [0, array.length-1]
 *
 * NOTE: undefined if `array` isn't sorted by `comparator`.
 * @method upperBound
 * @param array {Array}
 *     The array in which the upper bound of `target` is to be searched.
 * @param target {Object}
 *     The object whose upper bound in `array` is to be searched.
 * @param comparator {function}
 *     Compares an element in `array` and `target` for order.
 * @return {int}
 *     The index of the upper bound of `target` in `array`.
 */
Search.upperBound = function(array, target, comparator) {
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
