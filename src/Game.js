/**
 * The instance of the game.
 *
 * ## Scenarios
 *
 * ### Starting the game
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
 * Throws an exception
 * - if `canvas` is not a `GameCanvas`
 * - or if `resourceManager` is not a `ResourceManager`
 *
 * @method start
 * @static
 * @param canvas {GameCanvas}
 *     The `GameCanvas` on which the game runs.
 * @param resourceManager {ResourceManager}
 *     The `ResouceManager` which resolves resources.
 */
Game.start = function (canvas, resourceManager) {
	// loads the resources
	Resources.loadSprites(resourceManager);
	// creates a Scene associated with the canvas
	var scene = new Scene(canvas);
	canvas.width = scene.width;
	canvas.height = scene.height;
	// runs the game
	window.setInterval(function () {
		// runs and renders a frame
		scene.run();
		scene.render();
	}, Game.FRAME_INTERVAL);
};

/**
 * The interval between frames (in milliseconds).
 *
 * `FRAME_INTERVAL = 50`
 *
 * @property FRAME_INTERVAL
 * @static
 * @type {number}
 * @final
 */
Object.defineProperty(Game, 'FRAME_INTERVAL', { value: 50 });
