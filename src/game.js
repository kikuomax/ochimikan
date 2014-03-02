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
 * # Scenarios
 *
 * 1. A page is given.
 * 1. The `Boot` locates a node in the page whose ID is "canvas".
 * 1. The `Boot` creates a `Scene` supplied with the canvas node.
 * 1. The `Boot` starts a timer which asks the `Scene` to perform a single
 *    frame at an interval.
 *
 * @method start
 */
Game.start = function() {
};
