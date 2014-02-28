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
 * Searches the upper bound of the specified object in the specified array.
 *
 * `comparator` must be a function which accepts two objects (`lhs`, `rhs`)
 * and returns
 * - negative number if `lhs < rhs`
 * - `0` if `lhs == rhs`
 * - positive number if `lhs > rhs`
 *
 * Returning index `u` is an index such that
 * - `array[u-1] <= obj < array[u]`
 * - `u = 0` if `obj < array[v]` for any `0 <= v < array.length`
 * - `u = array.length` if `obj >= array[v]` for any `0 <= v < array.length`
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
