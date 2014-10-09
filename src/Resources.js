/**
 * Provides resources used in the game.
 *
 * @class Resources
 * @static
 */
Resources = (function () {
	function Resources() { }

	/**
	 * A collection of sprites.
	 *
	 * Each subproperty in this property is an array of sprites.
	 *  - mikan: an array of mikan sprites.
	 *    each index corresponds to a degree of damage.
	 *  - spray: an array of spray sprites.
	 *    each index corresponds to a frame index.
	 *
	 * @property SPRITES
	 * @type {object}
	 */
	Resources.SPRITES = {
		mikan: [
			new Sprite('imgs/mikan.png',  0, 0, 32, 32),
			new Sprite('imgs/mikan.png', 32, 0, 32, 32),
			new Sprite('imgs/mikan.png', 64, 0, 32, 32),
			new Sprite('imgs/mikan.png', 96, 0, 32, 32)
		],
		spray: [
			new Sprite('imgs/spray.png',  0, 0, 32, 32),
			new Sprite('imgs/spray.png', 32, 0, 32, 32),
			new Sprite('imgs/spray.png', 64, 0, 32, 32),
			new Sprite('imgs/spray.png', 96, 0, 32, 32)
		],
		preservative: [
			new Sprite('imgs/preservative.png',   0, 0, 32, 32),
			new Sprite('imgs/preservative.png',  32, 0, 32, 32),
			new Sprite('imgs/preservative.png',  64, 0, 32, 32),
			new Sprite('imgs/preservative.png',  96, 0, 32, 32),
			new Sprite('imgs/preservative.png', 128, 0, 32, 32)
		]
	};

	/**
	 * Loads sprites.
	 *
	 * Loads every sprite in `Resources.SPRITES`.
	 *
	 * Throws an exception if `resourceManager` is not a `ResourceManager`.
	 *
	 * @method loadSprites
	 * @param resourceManager {ResourceManager}
	 *     The `ResourceManager` which resolve resources.
	 */
	Resources.loadSprites = function (resourceManager) {
		if (!ResourceManager.isClassOf(resourceManager)) {
			throw 'resourceManager must be a ResourceManager';
		}
		for (prop in Resources.SPRITES) {
			Resources.SPRITES[prop].forEach(function (sprite) {
				sprite.load(resourceManager);
			});
		}
	};

	return Resources;
})();
