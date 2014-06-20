/**
 * Provides resources in the game.
 *
 * # Use Cases
 *
 * ## Loading sprites
 *
 * 1. A user asks the `Resources` to load sprites.
 *
 * @module resources
 */

/**
 * Resources.
 *
 * @class Resources
 * @static
 */
function Resources() { }

/**
 * A collection of sprites.
 *
 * Each subproperty in this property is an array of sprites.
 *
 * - mikan: an array of mikan sprites.
 *   each index corresponds to a degree of damage.
 * - spray: an array of spray sprites.
 *   each index corresponds to a frame index.
 * @property SPRITES
 * @type {Object}
 */
Resources.SPRITES = {
    mikan: [
	new Sprite("imgs/mikan.png",  0, 0, 32, 32),
	new Sprite("imgs/mikan.png", 32, 0, 32, 32),
	new Sprite("imgs/mikan.png", 64, 0, 32, 32),
	new Sprite("imgs/mikan.png", 96, 0, 32, 32)
    ],
    spray: [
	new Sprite("imgs/spray.png",  0, 0, 32, 32),
	new Sprite("imgs/spray.png", 32, 0, 32, 32),
	new Sprite("imgs/spray.png", 64, 0, 32, 32),
	new Sprite("imgs/spray.png", 96, 0, 32, 32)
    ]
};

/**
 * Loads sprites.
 *
 * Loads every sprite in `Resources.SPRITES`.
 * @method loadSprite
 */
Resources.loadSprites = function() {
    for (prop in Resources.SPRITES) {
	Resources.SPRITES[prop].forEach(function(sprite) {
	    sprite.load();
	});
    }
};
