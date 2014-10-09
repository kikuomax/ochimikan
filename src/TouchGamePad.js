/**
 * A `GamePad` implemented for touch events.
 *
 * This constructor should be invoked in the context of an `HTMLElement`.
 * You should use `attachTo` function instead of this constructor.
 *
 * Throws an exception if `this` is not an `EventTarget`.
 *
 * @class TouchGamePad
 * @constructor
 * @extends GamePad
 * @param canvas {canvas EventTarget}
 *     The canvas element to attach.
 */
TouchGamePad = (function () {
	function TouchGamePad() {
		var self = this;

		GamePad.call(self);

		// verifies this object
		if (!('addEventListener' in self)) {
			throw 'canvas must be an EventTarget';
		}

		// listens touch events of this canvas
		self.addEventListener('touchstart',  handleTouchStart, false);
		self.addEventListener('touchmove',   handleTouchMove,  false);
		self.addEventListener('touchend',    handleTouchEnd,   false);
		self.addEventListener('touchleave',  handleTouchEnd,   false);
		self.addEventListener('touchcancel', handleTouchEnd,   false);

		// the ID of touch being tracked
		var touchId = -1;
		// the last touched location
		var x, y;
		// when touch started
		var touchTimeStamp = 0;
		// whether touch has moved
		var moved = false;

		// starts tracking touch
		function handleTouchStart(evt) {
			if (touchId === -1) {
				evt.preventDefault();
				// remembers the initial touch information
				var touch = evt.changedTouches[0];
				touchId = touch.identifier;
				x = touch.pageX;
				y = touch.pageY;
				touchTimeStamp = evt.timeStamp;
				moved = false;
			}
		}

		// tracks touch
		function handleTouchMove(evt) {
			var touches = evt.changedTouches;
			for (var i = 0; i < touches.length; ++i) {
				var touch = touches[i];
				if (touch.identifier === touchId) {
					evt.preventDefault();
					// interprets the motion
                    var dX = touch.pageX - x;
                    var dY = touch.pageY - y;
                    var direction;
                    if (Math.abs(dX) > Math.abs(dY)) {
                        if (Math.abs(dX)
							> TouchGamePad.HORIZONTAL_SENSITIVITY)
						{
                            if (dX < 0) {
                                direction = 'moveLeft';
                            } else {
                                direction = 'moveRight';
                            }
                        }
                    } else {
                        if (Math.abs(dY) > TouchGamePad.VERTICAL_SENSITIVITY) {
                            if (dY < 0) {
                                direction = 'rotateCounterClockwise';
                            } else {
                                direction = 'rotateClockwise';
                            }
                        }
                    }
					// notifies `DirectionListener`s
					// and updates the tracking record
					// if there is a direction
                    if (direction) {
						self.sendDirection(direction);
                        moved = true;
                        x = touch.pageX;
                        y = touch.pageY;
                    }
				}
			}
		}

		// ends tracking touch
		function handleTouchEnd(evt) {
			var touches = evt.changedTouches;
			for (var i = 0; i < touches.length; ++i) {
				var touch = touches[i];
				if (touch.identifier === touchId) {
					evt.preventDefault();
					// seizes tracking
					touchId = -1;
					// releases the control if the user has tapped
					if (!moved) {
						var interval = evt.timeStamp - touchTimeStamp;
						if (interval <= TouchGamePad.MAX_TAP_INTERVAL) {
							self.sendDirection('releaseControl');
						}
					}
				}
			}
		}
	}

	/**
	 * Attaches the features of `TouchGamePad` to a specified canvas element.
	 *
	 * The following properties of `canvas` will be overwritten,
	 *  - addDirectionListener
	 *  - removeDirectionListener
	 *
	 * Throws an exception
	 *  - if `canvas` is not specified,
	 *  - or if `canvas` does not have `addEventListener` method
	 *
	 * @method attachTo
	 * @static
	 * @param canvas {HTMLElement}
	 *     The canvas element to attach.
	 * @return {HTMLElement}
	 *     `canvas`.
	 */
	TouchGamePad.attachTo = function (canvas) {
		if (canvas == null) {
			throw 'canvas must be specified';
		}
		TouchGamePad.call(canvas);
		return canvas;
	};

	/**
	 * The sensitivity (in pixels) on a horizontal swipe.
	 *
	 * The default is 15.
	 *
	 * @property HORIZONTAL_SENSITIVITY
	 * @type number
	 */
	TouchGamePad.HORIZONTAL_SENSITIVITY = 15;

	/**
	 * The sensitivity (in pixels) on a vertical swipe.
	 *
	 * The default is 30.
	 *
	 * @property VERTICAL_SENSITIVITY
	 * @type number
	 */
	TouchGamePad.VERTICAL_SENSITIVITY = 30;

	/**
	 * The maximum interval (in milliseconds) between touch start and end,
	 * which is interpreted as a tap.
	 *
	 * The default is 200.
	 *
	 * @property MAX_TAP_INTERVAL
	 * @type number
	 */
	TouchGamePad.MAX_TAP_INTERVAL = 200;

	// the following is only for documentation
	/**
	 * *TouchGamePad specific behavior.*
	 *
	 * `listener` will receive,
	 *  - `moveLeft`:               when a user swiped leftward
	 *  - `moveRight`:              when a user swiped rightward
	 *  - `rotateClockwise`:        when a user swiped downward
	 *  - `rotateCounterClockwise`: when a user swiped upward
	 *  - `releaseControl`:         when a user tapped
	 *
	 * @method addDirectionListener
	 */

	return TouchGamePad;
})();
