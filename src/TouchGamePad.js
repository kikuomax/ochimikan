/**
 * A `GameCanvas` implemented for touch events.
 *
 * This constructor should be invoked in the context of an `HTMLElement`.
 * You should use `attachTo` function instead of this constructor.
 *
 * Throws an exception if `this` does not have `addEventListener` method.
 *
 * @class TouchGamePad
 * @constructor
 * @extends GameCanvas
 * @param canvas {HTMLElement}
 *     The canvas element to attach.
 */
TouchGamePad = (function () {
	function TouchGamePad() {
		var self = this;

		GameCanvas.call(self);

		// checks this object
		if (!('addEventListener' in self)) {
			throw 'canvas must be an HTMLElement';
		}

		// direction listeners
		var directionListeners = [];

		/**
		 * *TouchGamePad specific behavior.*
		 *
		 * `listener` will receive,
		 *  - `moveLeft`:               when a user swipe leftward
		 *  - `moveRight`:              when a user swipe rightward
		 *  - `rotateClockwise`:        when a user swipe downward
		 *  - `rotateCounterClockwise`: when a user swipe upward
		 *  - `releaseControl`:         when a user tapped
		 *
		 * @method addDirectionListener
		 */
		self.addDirectionListener = function (listener) {
			directionListeners.push(listener);
		};

		// Removes a specified `DirectionListener` from this canvas.
		self.removeDirectionListener = function () {
			var idx = directionListeners.indexOf(listener);
			if (idx != -1) {
				directionListeners.splice(idx, 1);
			}
		};

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
						sendDirection(direction);
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
							sendDirection('releaseControl');
						}
					}
				}
			}
		}

		// sends a specified direction to `DirectionListeners`
		function sendDirection(direction) {
			directionListeners.forEach(function (listener) {
				listener[direction](self);
			});
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

	return TouchGamePad;
})();
