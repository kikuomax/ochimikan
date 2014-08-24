/**
 * The instance of the game.
 *
 * ## Scenarios
 *
 * ### The cycle of the game
 *
 *  1. A `Scene` is presented.
 *  2. The `Scene` presents a `MikanBox`.
 *  3. Two grabbed mikans appear at the top of the `MikanBox`.
 *     They are randomly damaged.
 *  4. The grabbed mikans fall toward the bottom of the `MikanBox` (ground).
 *  5. The grabbed mikans stop falling when either of them reaches the ground
 *     or a fixed mikan.
 *  6. The grabbed mikans become free.
 *  7. The free mikans fall toward the ground.
 *  8. Each of the free mikans stops falling and becomes fixed when it reaches
 *     the ground or a fixed mikan. This steps continues until all of the free
 *     mikans are fixed.
 *  9. Maximally damaged mikans are chained.
 *  10. Back to the step 3.
 *
 * #### Derivative
 *
 *  - 9 Some of the chains reaches or exceeds the limit length (active chains).
 *     1. Mikans composing the active chains explode and disappear.
 *     2. The player earns points.
 *     3. Mikans surrounding the active chains are spoiled.
 *     4. Mikans not placed on fixed mikans becom free.
 *     5. Back to the step 7.
 *
 * @class Game
 * @static
 */
Game = (function () {
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
	 * The default value is `50`.
	 *
	 * @property FRAME_INTERVAL
	 * @static
	 * @type {number}
	 */
	Game.FRAME_INTERVAL = 50;

	return Game;
})();
