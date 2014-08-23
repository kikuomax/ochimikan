/**
 * Augments a canvas with features for game.
 *
 * @class GameCanvas
 * @constructor
 */
GameCanvas = (function () {
function GameCanvas() {}
	/**
	 * Returns whehter a specified object is a `GameCanvas`.
	 *
	 * A `GameCanvas` must satisfy all of the following conditions,
	 * - an `Element`
	 * - has all of the following properties,
	 *   - addDirectionListener: function
	 *   - removeDirectionListener: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `GameCanvas`. `false` if `obj` is not specified.
	 */
	GameCanvas.isClassOf = function (obj) {
		return obj instanceof Element
			&& typeof obj.addDirectionListener === 'function'
			&& typeof obj.removeDirectionListener === 'function';
	};

	/**
	 * Adds a specified `DirectionListener` to this `GameCanvas`.
	 *
	 * Default implementation does nothing.
	 *
	 * @method addDirectionListener
	 * @param listener {DirectionListener}
	 *     The listener to listen to directional input.
	 */
	GameCanvas.prototype.addDirectionListener = function (listener) {};

	/**
	 * Removes a specified `DirectionListener` from this `GameCanvas`.
	 *
	 * Default implementation does nothing.
	 *
	 * @method removeDirectionListener
	 * @param listener {DirectionListener}
	 *     The listener to be removed from this `GameCanvas`.
	 */
	GameCanvas.prototype.removeDirectionListener = function (listener) {};

	return GameCanvas;
})();

/**
 * An interface to listen to directional input from a `GameCanvas`.
 *
 * @class DirectionListener
 * @constructor
 */
DirectionListener = (function () {
	function DirectionListener() {}

	/**
	 * Returns whether a specified object is a `DirectionListener`.
	 *
	 * A `DirectionListener` must have all of the following properties,
	 * - moveLeft: function
	 * - moveRight: function
	 * - rotateClockwise: function
	 * - rotateCounterClockwise: function
	 *
	 * @method isClassOf
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `DirectionListener`.
	 *     `false` if `obj` is not specified.
	 */
	DirectionListener.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.moveLeft === 'function'
			&& typeof obj.moveRight === 'function'
			&& typeof obj.rotateClockwise === 'function'
			&& typeof obj.rotateCounterClockwise === 'function';
	};

	/**
	 * Handles a move left direction from a `GameCanvas`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveLeft
	 * @param canvas {GameCanvas}
	 *     The `GameCanvas` which is directing move.
	 */
	DirectionListener.prototype.moveLeft = function (canvas) {};

	/**
	 * Handles a move right direction from a `GameCanvas`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveRight
	 * @param canvas {GameCanvas}
	 *     The `GameCanvas` which is directing move.
	 */
	DirectionListener.prototype.moveRight = function (canvas) {};

	/**
	 * Handles a rotate clockwise direction from a `GameCanvas`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method rotateClockwise
	 * @param canvas {GameCanvas}
	 *     The `GameCanvas` which is directing rotation.
	 */
	DirectionListener.prototype.rotateClockwise = function (canvas) {};

	/**
	 * Handles a rotate counter-clockwise direction from a `GameCanvas`.
	 *
	 * @method rotateCounterClockwise
	 * @param canvas {GameCanvas}
	 *     The `GameCanvas` which is directing rotation.
	 */
	DirectionListener.prototype.rotateCounterClockwise = function (canvas) {};

	return DirectionListener;
})();
