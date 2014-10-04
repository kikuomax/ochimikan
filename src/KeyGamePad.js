/**
 * A `GameCanvas` implemented for key inputs.
 *
 * This constructor must be invoked in the context of an `HTMLElement`.
 * You should use `attachTo` instead of this constructor.
 *
 * Throws an exception if `this` does not have `addEventListener` method.
 *
 * @class KeyGamePad
 * @constructor
 * @extends GameCanvas
 */
KeyGamePad = (function () {
	function KeyGamePad() {
		var self = this;

		GameCanvas.call(self);

		// this must be a canvas
		if (!('addEventListener' in this)) {
			throw 'canvas must be an HTMLElement';
		}

		// direction listeners
		var directionListeners = [];

		/**
		 * *KeyGamePad specific behavior.*
		 *
		 * `listener` will receive,
		 *  - `moveLeft`:               when a user pressed a left arrow key
		 *  - `moveRight`:              when a user pressed a right arrow key
		 *  - `rotateClockwise`:        when a user pressed a down arrow key
		 *  - `rotateCounterClockwise`: when a user pressed a up arrow key
		 *  - `releaseControl`:         when a user pressed a spacebar
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

		// processes key down events on this canvas
		window.addEventListener('keydown', handleKeyDown, false);

		// handles a key down event
		function handleKeyDown(evt) {
			var direction;
			if ('key' in evt) {
				switch (evt.key) {
				case 'ArrowLeft':
				case 'Left':
					direction = 'moveLeft';
					break;
				case 'ArrowRight':
				case 'Right':
					direction = 'moveRight';
					break;
				case 'ArrowDown':
				case 'Down':
					direction = 'rotateClockwise';
					break;
				case 'ArrowUp':
				case 'Up':
					direction = 'rotateCounterClockwise';
					break;
				case 'Spacebar':
				case ' ':
					direction = 'releaseControl';
					break;
				}
			} else {
				switch (evt.keyCode) {
				case 0x25:
					// arrow left
					direction = 'moveLeft';
					break;
				case 0x27:
					// arrow right
					direction = 'moveRight';
					break;
				case 0x28:
					// arrow down
					direction = 'rotateClockwise';
					break;
				case 0x26:
					// arrow up
					direction = 'rotateCounterClockwise';
					break;
				case 0x20:
					// space
					direction = 'releaseControl';
					break;
				}
			}
			// sends the direction to `DirectionListener`s if it exists
			if (direction) {
				evt.preventDefault();
				directionListeners.forEach(function (listener) {
					listener[direction](self);
				});
			}
		}
	}

	/**
	 * Attaches the features of `KeyGamePad` to a specified canvas.
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
	 *     The canvas to attach.
	 * @return {HTMLElement}
	 *     `canvas`.
	 */
	KeyGamePad.attachTo = function (canvas) {
		if (canvas == null) {
			throw 'canvas must be specified';
		}
		KeyGamePad.call(canvas);
		return canvas;
	};

	return KeyGamePad;
})();
