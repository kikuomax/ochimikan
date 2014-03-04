/**
 * Defines a scene of the game.
 *
 * # Use Cases
 *
 * ## Starting a scene
 *
 * 1. A user creates a `Scene` and associates it with the canvas.
 * 1. The user sees a `MikanBox` in the `Scene`.
 *
 * ## Running a single step
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` to run a single step.
 *
 * ## Horizontally moving a mikan pair
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user horizontally swipes the `Scene`.
 * 1. The mikan pair moves in the same direction as the user has swiped.
 *
 * ## Rotating a mikan pair clockwise
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user swipes the `Scene` upward.
 * 1. The mikan pair rotates clockwise.
 *
 * ## Rotating a mikan pair counterclockwise
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user swipes the `Scene` downward.
 * 1. The mikan pair rotates counterclockwise.
 *
 * @module scene
 */

/**
 * A scene of the game.
 *
 * # Scenarios
 *
 * ## Associating a scene with a canvas
 *
 * 1. A canvas (`Element`) is given.
 * 1. A `Scene` is given.
 * 1. A user associates the canvas with the `Scene`.
 * 1. The `Scene` listens to the canvas for the following events,
 *    - touchstart
 *    - touchmove
 *    - touchend
 * 1. The `Scene` will perform rendering on the 2D context of the canvas.
 *
 * @class Scene
 * @contructor
 * @param canvas {Node}
 *     The canvas to be associated with the scene.
 */
function Scene() {
    var self = this;

    /**
     * The canvas associated with this scene.
     *
     * `null` if no canvas is associated with this scene.
     *
     * When a canvas is assigned, touch event listeners will be added to it.
     * These touch event listener will be removed from it, when the canvas
     * is unset.
     *
     * @property canvas
     * @type {Element}
     */
    var _canvas = null;
    Object.defineProperty(self, 'canvas', {
	get: function() { return _canvas; },
	set: function(canvas) {
	    if (_canvas != null) {
		_context = null;
		// removes the touch event listeners from the old canvas
		removeListeners(_canvas);
	    }
	    _canvas = canvas;
	    if (_canvas != null) {
		_context = _canvas.getContext('2d');
		// adds the touch event listeners to the new canvas
		addListeners(_canvas);
	    }
	}
    });

    /**
     * The context of the canvas.
     *
     * `null` if no canvas is associated with this scene.
     *
     * @property context
     * @type {Context}
     */
    var _context = null;
    Object.defineProperty(self, 'context', {
	get: function() { return _context; }
    });

    /**
     * Runs a single step of this scene.
     *
     * @method run
     */
    self.run = function() {
    };

    /**
     * Handles a 'touchstart' event.
     *
     * @method touchStarted
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchStarted = function(event) {
    };

    /**
     * Handles a 'touchmove' event.
     *
     * @method touchMoved
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchMoved = function(event) {
    };

    /**
     * Handles a 'touchend' event.
     *
     * @method touchEnded
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchEnded = function(event) {
    };

    /** Adds listeners to the specified canvas. */
    function addListeners(canvas) {
	canvas.addEventListener('touchstart', self.touchStarted, false);
	canvas.addEventListener('touchmove', self.touchMoved, false);
	canvas.addEventListener('touchend', self.touchEnded, false);
    }

    /** Removes listeners from the specified canvas. */
    function removeListeners(canvas) {
	canvas.removeEventListener('touchstart', self.touchStarted, false);
	canvas.removeEventListener('touchmove', self.touchMoved, false);
	canvas.removeEventListener('touchend', self.touchEnded, false);
    }
}
