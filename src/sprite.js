/**
 * Defines `Sprite` class.
 *
 * # Scenarios
 *
 * ## Loading a sprite
 *
 * 1. Constructs a sprite with a URL of an image and a part to be rendered.
 * 2. Loads a sprite.
 *
 * ## Rendering a sprite
 *
 * 1. Renders a sprite.
 *
 * @module sprite
 */

/**
 * A sprite which renders a specified part of an image.
 *
 * @class Sprite
 * @constructor 
 * @param url {String}
 *     The URL of the image data. The image may contain multiple sprites in it.
 * @param x {int}
 *     The x-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param y {int}
 *     The y-coordinate value of the top-left corner of the part to be rendered
 *     as the sprite.
 * @param width {int}
 *     The width of the sprite.
 * @param height {int}
 *     The height of the sprite.
 */
function Sprite(url, x, y, width, height) {
    var self = this;
    self.url = url;
    self.x = x;
    self.y = y;
    self.width = width;
    self.height = height;

    /**
     * Loads the sprite specified by this definition.
     *
     * @method load
     */
    self.load = function() {
	self.image = new Image();
	self.image.src = self.url;
    };

    /**
     * Renders this sprite at the specified location.
     *
     * Does nothing if this sprite isn't yet loaded.
     *
     * @method render
     * @param context {Context}
     *     The Context which rendering is to be performed.
     * @param x {int}
     *     The x-coordinate value of the top-left corner of the destination.
     * @param y {int}
     *     The y-coordinate value of the top-left corner of the destination.
     */
    self.render = function(context, x, y) {
	if ((self.image !== null) && (self.image !== undefined)) {
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
