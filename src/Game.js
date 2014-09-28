/**
 * The instance of the game.
 *
 * Scenarios
 * ---------
 *
 * ### The cycle of the game
 *
 *  1. A `Scene` is presented.
 *  2. The `Scene` presents a `MikanBox`.
 *  3. Two grabbed items appear at the top of the `MikanBox`. They can be any
 *     combination of the followings,
 *      - A randomly damaged mikan
 *      - A preservative
 *  4. The grabbed items fall toward the bottom of the `MikanBox` (ground).
 *     A user can control the grabbed items during they are falling.
 *  5. The grabbed items stop falling when either of them reaches the ground
 *     or a fixed item.
 *  6. The grabbed items become free.
 *  7. The free items fall toward the ground.
 *  8. Each of the free items stops falling and becomes fixed when it reaches
 *     the ground or a fixed item. This steps continues until all of the free
 *     items are fixed.
 *  9. Maximally damaged mikans are chained.
 *  10. Back to the step 3.
 *
 * #### Derivative
 *
 *  - 9 Some of the chains reaches or exceeds the limit length (active chains).
 *       1. Mikans composing the active chains explode and disappear.
 *       2. The player earns points.
 *       3. If the number of erased mikans reaches the criteria of the current
 *          game level, the game level increases.
 *       4. Mikans surrounding the active chains are spoiled. But if there are
 *          preservatives next to mikans, such mikans are not spoiled and
 *          preservatives next to them are spoiled instead.
 *       5. Maximally damaged preservatives disappear.
 *       6. Items not placed on the ground or fixed items become free.
 *       7. Back to the step 7 of the main scenario.
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
	 * @param statistics {Statisitcs}
	 *     The `Statistics` of the game.
	 */
	Game.start = function (canvas, resourceManager, statistics) {
		var game = new Game();
		// loads the resources
		Resources.loadSprites(resourceManager);
		// creates a Scene associated with the canvas
		game.scene = new Scene(canvas, statistics);
		canvas.width = game.scene.width;
		canvas.height = game.scene.height;
		// runs the game
		window.setInterval(function () {
			// runs and renders a frame
			game.scene.run();
			game.scene.render();
		}, Game.FRAME_INTERVAL);
		return game;
	};

	/** Restarts the game. */
	Game.prototype.restart = function () {
		this.scene.reset();
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
	Game.FRAME_INTERVAL = 40;

	return Game;
})();
