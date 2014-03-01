/**
 * Defines a scene of the game.
 *
 * # Use Cases
 *
 * ## Starting the game
 *
 * 1. A user creates a `Scene` and associates it with the screen.
 * 1. The user sees a `MikanBox` in the `Scene`.
 * 1. A pair of `Mikan`s is shown in the `Scene` and begins falling
 *    under gravity.
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
 * @class Scene
 * @contructor
 */
function Scene() {
}
