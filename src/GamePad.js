/**
 * The interface of an interpreter of user inputs.
 *
 * @class GamePad
 * @constructor
 */
GamePad = (function () {
	function GamePad() {
		var self = this;

		/**
		 * The list of `DirectionListener`s.
		 *
		 * DO NOT directly manipulate this property.
		 * Use `addDirectionListener` or `removeDirectionListener` instead.
		 *
		 * @property directionListeners
		 * @type {Array}
		 * @private
		 */
		var directionListeners = [];

		/**
		 * Adds a specified `DirectionListener` to this `GamePad`.
		 *
		 * Throws an exception if `listener` is not a `DirectionListener`.
		 *
		 * @method addDirectionListener
		 * @param listener {DirectionListener}
		 *     The listener to listen to directional input.
		 */
		self.addDirectionListener = function (listener) {
			if (!DirectionListener.isClassOf(listener)) {
				throw 'listener must be a DirectionListener';
			}
			directionListeners.push(listener);
		};

		/**
		 * Removes a specified `DirectionListener` from this `GamePad`.
		 *
		 * No effect if `listener` is not listening to this `GamePad`.
		 *
		 * @method removeDirectionListener
		 * @param listener {DirectionListener}
		 *     The listener to be removed from this `GamePad`.
		 */
		self.removeDirectionListener = function (listener) {
			var idx = directionListeners.indexOf(listener);
			if (idx != -1) {
				directionListeners.splice(idx, 1);
			}
		};

		/**
		 * Sends a specified direction to `DirectionListener`s listening to
		 * this `GamePad`.
		 *
		 * Throws an exception if `direction` does not match any of
		 * the `DirectionListener` methods.
		 *
		 * @method sendDirection
		 * @protected
		 * @param direction {string}
		 *     The direction to be sent to `DirectionListener`s.
		 *     The name of a direction method.
		 */
		self.sendDirection = function (direction) {
			directionListeners.forEach(function (listener) {
				listener[direction](self);
			});
		};
	}

	/**
	 * Returns whehter a specified object is a `GamePad`.
	 *
	 * A `GamePad` must have all of the following properties,
	 *  - addDirectionListener:    function
	 *  - removeDirectionListener: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `GamePad`. `false` if `obj` is not specified.
	 */
	GamePad.isClassOf = function (obj) {
		return typeof obj.addDirectionListener    === 'function'
			&& typeof obj.removeDirectionListener === 'function';
	};

	return GamePad;
})();

/**
 * An interface to listen to directional input from a `GamePad`.
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
	 *  - moveLeft:               function
	 *  - moveRight:              function
	 *  - rotateClockwise:        function
	 *  - rotateCounterClockwise: function
	 *  - releaseControl:         function
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
			&& typeof obj.moveLeft               === 'function'
			&& typeof obj.moveRight              === 'function'
			&& typeof obj.rotateClockwise        === 'function'
			&& typeof obj.rotateCounterClockwise === 'function'
			&& typeof obj.releaseControl         === 'function';
	};

	/**
	 * Handles a move left direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveLeft
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing move.
	 */
	DirectionListener.prototype.moveLeft = function (pad) {};

	/**
	 * Handles a move right direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method moveRight
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing move.
	 */
	DirectionListener.prototype.moveRight = function (pad) {};

	/**
	 * Handles a rotate clockwise direction from a `GamePad`.
	 *
	 * The default implementation does nothing.
	 *
	 * @method rotateClockwise
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing rotation.
	 */
	DirectionListener.prototype.rotateClockwise = function (pad) {};

	/**
	 * Handles a rotate counter-clockwise direction from a `GamePad`.
	 *
	 * @method rotateCounterClockwise
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing rotation.
	 */
	DirectionListener.prototype.rotateCounterClockwise = function (pad) {};

	/**
	 * Handles a release control direction from a `GamePad`.
	 *
	 * @method releaseControl
	 * @param pad {GamePad}
	 *     The `GamePad` which is directing releasing.
	 */
	DirectionListener.prototype.releaseControl = function (pad) {};

	return DirectionListener;
})();
