/**
 * A `GamePad` implemented for key inputs.
 *
 * You should use `attachTo` instead of this constructor.
 *
 * Throws an exception if `target` is not an `EventTarget`.
 *
 * @class KeyGamePad
 * @constructor
 * @extends GamePad
 * @param target {EventTarget}
 *     The `EventTarget` on which key events are interpreted.
 */
KeyGamePad = (function () {
	function KeyGamePad(target) {
		var self = this;

		GamePad.call(self);

		// verifies the argument
		if (!('addEventListener' in target)) {
			throw 'target must be an EventTarget';
		}

		// processes key down events on this canvas
		target.addEventListener('keydown', handleKeyDown, false);

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
				self.sendDirection(direction);
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
	 *  - if `obj` is not specified,
	 *  - or if `target` is not an `EventTarget`
	 *
	 * @method attachTo
	 * @static
	 * @param obj {object}
	 *     The object to attach.
	 * @param target {EventTarget}
	 *     The `EventTarget` on which key events are interpreted.
	 * @return {object}
	 *     `obj`.
	 */
	KeyGamePad.attachTo = function (obj, target) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		KeyGamePad.call(obj, target);
		return obj;
	};

	// the following is only for documentation
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

	return KeyGamePad;
})();
