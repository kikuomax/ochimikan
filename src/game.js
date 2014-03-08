/**
 * Provides the instance of the game.
 *
 * # Use Cases
 *
 * ## Booting the game
 *
 * 1. A document is given.
 * 1. A user asks the `Game` to start.
 * 1. The game is associated with the document and runs on it.
 *
 * @module game
 */

/**
 * The instance of the game.
 *
 * # Scenarios
 *
 * ## Starting the game
 *
 * 1. A document is given.
 * 1. The `Game` locates an element (canvas) in the document
 *    whose ID is `CANVAS_ID`.
 * 1. The `Game` loads resources (sprites).
 * 1. The `Game` creates a `Scene` supplied with the canvas.
 * 1. The `Game` resizes the canvas so that the canvas contains
 *    the entire `Scene`.
 * 1. The `Game` starts a timer which asks the `Scene` to run and render
 *    a single frame at the interval (`FRAME_INTERVAL`).
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
    // creates a Scene associated with the canvas
    var scene = new Scene();
    canvas.width = scene.width;
    canvas.height = scene.height;
    scene.canvas = canvas;
    // runs the game
    window.setInterval(function() {
	// runs and renders a frame
	scene.run();
	scene.render();
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
