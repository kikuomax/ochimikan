/**
 * A sprite which renders a specified part of an image.
 *
 * Contents associated with `url` will not be loaded until `load` is invoked.
 *
 * Throws an exception
 *  - if `url` is not a string
 *  - or if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `width` is not a number
 *  - or if `height` is not a number
 *  - or if `width < 0`
 *  - or if `height` < 0
 *
 * @class Sprite
 * @constructor 
 * @param url {string}
 *     The URL of the image data. The image may contain multiple sprites in it.
 * @param x {number}
 *     The x-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param y {number}
 *     The y-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param width {number}
 *     The width of the sprite.
 * @param height {number}
 *     The height of the sprite.
 */
Sprite = (function () {
	function Sprite(url, x, y, width, height) {
		var self = this;

		if (typeof url !== 'string') {
			throw 'url must be a string';
		}
		if (typeof x !== 'number') {
			throw 'x must be a number';
		}
		if (typeof y !== 'number') {
			throw 'y must be a number';
		}
		if (typeof width !== 'number') {
			throw 'width must be a number';
		}
		if (typeof height !== 'number') {
			throw 'height must be a number';
		}
		if (width < 0) {
			throw 'width must be >= 0 but ' + width;
		}
		if (height < 0) {
			throw 'height must be >= 0 but ' + height;
		}

		self.url = url;
		self.x = x;
		self.y = y;
		self.width = width;
		self.height = height;

		/**
		 * Loads the sprite specified by this definition.
		 *
		 * Adds a property `image:Image` associated with the URL of
		 * this `Sprite`.
		 *
		 * No effect if this sprite has already been loaded.
		 *
		 * Throws an exception if `resourceManager` is not a `ResourceManager`.
		 *
		 * @method load
		 * @param resourceManager {ResourceManager}
		 *     The `ResourceManager` which resolves a URL.
		 */
		self.load = function (resourceManager) {
			if (!ResourceManager.isClassOf(resourceManager)) {
				throw 'resourceManager must be specified';
			}
			if (!self.image) {
				self.image = resourceManager.loadImage(self.url);
			}
		};

		/**
		 * Renders this sprite at the specified location.
		 *
		 * Does nothing if this sprite isn't yet loaded.
		 *
		 * @method render
		 * @param context {Context}
		 *     The Context in which rendering is to be performed.
		 * @param x {int}
		 *     The x-coordinate value of the top-left corner of the destination.
		 * @param y {int}
		 *     The y-coordinate value of the top-left corner of the destination.
		 */
		self.render = function (context, x, y) {
			if (self.image !== undefined) {
				context.drawImage(self.image,
								  self.x,
								  self.y,
								  self.width,
								  self.height,
								  x,
								  y,
								  self.width,
								  self.height);
			}
		};
	}

	return Sprite;
})();
