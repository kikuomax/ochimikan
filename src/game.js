/**
 * Provides the instance of the game.
 *
 * # Use Cases
 *
 * ## Booting the game
 *
 * 1. A page is given.
 * 1. A user asks the `Boot` to start.
 * 1. The game is associated with the page and runs on it.
 *
 * @module game
 */

/**
 * The instance of the game.
 *
 * @class Game
 * @static
 */
function Game() {}

/**
 * Starts the game.
 *
 * Throws an exception if there's no element whose ID is `CANVAS_ID`
 *
 * # Scenarios
 *
 * 1. A page is given.
 * 1. The `Game` locates an element in the page whose ID is `CANVAS_ID`
 * 1. The `Game` loads resources (sprites).
 * 1. The `Game` creates a `Scene` supplied with the canvas node.
 * 1. The `Game` starts a timer which asks the `Scene` to run a single
 *    frame at the interval (`FRAME_INTERVAL`).
 *
 * @method start
 */
Game.start = function() {
    // locates the canvas
    var canvas = document.getElementById(Game.CANVAS_ID);
    if (canvas === null) {
	throw 'Document must have a canvas';
    }
    // loads the resources
    Resources.loadSprites();
    var context = canvas.getContext('2d');
    canvas.addEventListener("touchstart", function(event) {
    }, false);
    canvas.addEventListener("touchmove", function(event) {
    }, false);
    canvas.addEventListener("touchend", function(event) {
    }, false);
    window.setInterval(function() {
	// runs a frame
    }, Game.FRAME_INTERVAL);
};

/**
 * The ID of a canvas to be associated with the game.
 *
 * `CANVAS_ID = mikanCanvas`
 *
 * @property CANVAS_ID
 * @type {String}
 * @final
 */
Object.defineProperty(Game, 'CANVAS_ID', { value: 'mikanCanvas' });

/**
 * The interval between frames.
 *
 * `FRAME_INTERVAL = 50`
 *
 * @property FRAME_INTERVAL
 * @type {Number}
 * @final
 */
Object.defineProperty(Game, 'FRAME_INTERVAL', { value: 50 });
