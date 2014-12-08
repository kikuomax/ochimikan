/**
 * The instance of the game.
 *
 * Scenarios
 * ---------
 *
 * ### The cycle of the game
 *
 *  1. A `MainScene` is presented.
 *  2. The `MainScene` presents a `MikanBox`.
 *  3. A player can see which items will be dropped in an `ItemQueue`.
 *  4. Two grabbed items appear at the top of the `MikanBox`. They can be any
 *     combination of the followings,
 *      - A randomly damaged mikan
 *      - A preservative
 *  5. The grabbed items fall toward the bottom of the `MikanBox` (ground).
 *     The player can control the grabbed items during they are falling.
 *  6. The grabbed items stop falling when either of them reaches the ground
 *     or a fixed item.
 *  7. The grabbed items become free.
 *  8. The free items fall toward the ground.
 *  9. Each of the free items stops falling and becomes fixed when it reaches
 *     the ground or a fixed item. This steps continues until all of the free
 *     items are fixed.
 *  10. Maximally damaged mikans are chained.
 *  11. Back to the step 3.
 *
 * #### Derivative
 *
 *  - 4 Stacked items have reached the top of the `MikanBox`.
 *       1. The game ends.
 *       2. The player is prompted to enter his/her name and choose if his/her
 *          score is sent to the server.
 *       3. The player can see the rank of his/her score.
 *       4. END
 *
 *  - 10 Some of the chains reaches or exceeds the limit length (active chains).
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
 * Events
 * ------
 *
 * A `Game` notifies events to its observers. Observers will receive at least
 * the following arguments,
 *  1. Event ID: A string which tells the event type
 *  2. The instance of `Game`
 *
 * An event ID can be one of the following,
 *  - "gameEnded":
 *    Notified when the game has ended.
 *    Observers will receive the following additional argument,
 *     1. Statistics of the last game
 *
 * @class Game
 * @constructor
 * @extends Observable
 */
Game = (function () {
	function Game() {
		var self = this;

		Observable.call(self);
	}
	Observable.augment(Game.prototype);

	/**
	 * Starts the game.
	 *
	 * Throws an exception
	 *  - if `mainScene` is not an `Element`,
	 *  - or if `mainScene` is not a `GamePad`,
	 *  - or if `itemQueue` is not an `Element`,
	 *  - or if `resourceManager` is not a `ResourceManager`,
	 *  - or if `statistics` is not a `Statistics`,
	 *  - or if `difficulty` is not a `Difficulty`
	 *
	 * @method start
	 * @static
	 * @param mainScene {Element, GamePad}
	 *     The canvas element on which the game will be rendered.
	 *     This must be a `GamePad` at the same time.
	 * @param itemQueue {Element}
	 *     The canvas element on which the queued items will be rendered.
	 * @param resourceManager {ResourceManager}
	 *     The `ResouceManager` which resolves resources.
	 * @param statistics {Statisitcs}
	 *     The `Statistics` of the game.
	 * @param difficulty {Difficulty}
	 *     The `Difficulty` of the game.
	 * @return {Game}
	 *     A new instance of `Game`.
	 */
	Game.start = function (mainScene,
						   itemQueue,
						   resourceManager,
						   statistics,
						   difficulty)
	{
		// verifies arguments
		if (!(mainScene instanceof Element)) {
			throw 'mainScene must be an Element';
		}
		if (!GamePad.isClassOf(mainScene)) {
			throw 'mainScene must be a GamePad';
		}
		if (!(itemQueue instanceof Element)) {
			throw 'itemQueue must be an Element';
		}
		if (!ResourceManager.isClassOf(resourceManager)) {
			throw 'resourceManager must be a ResourceManager';
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statisitcs';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		var game = new Game();
		// loads the resources
		Resources.loadSprites(resourceManager);
		// creates a MainScene associated with `mainScene`
		game.mainScene = new MainScene(mainScene, statistics, difficulty);
		game.mainScene.addObserver(function (id) {
			if (id == 'gameEnded') {
				game.notifyObservers('gameEnded', game, statistics);
			}
		});
		// creates an ItemQueue associated with `itemQueue`
		game.itemQueue = new ItemQueue(itemQueue, 4, difficulty);
		// runs the game loop
		window.setInterval(function () {
			game.mainScene.run();
			game.itemQueue.run();
			game.mainScene.render();
			game.itemQueue.render();
		}, Game.FRAME_INTERVAL);
		return game;
	};

	/** Restarts the game. */
	Game.prototype.restart = function () {
		this.mainScene.reset();
	};

	/**
	 * The interval between frames (in milliseconds).
	 *
	 *     Game.FRAME_INTERVAL = 40
	 *
	 * @property FRAME_INTERVAL
	 * @type {number}
	 * @static
	 */
	Game.FRAME_INTERVAL = 40;

	return Game;
})();
