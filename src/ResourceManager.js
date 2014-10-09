/**
 * A resource manager.
 *
 * Behavior of an instance created by this constructor is different from
 * the prototype.
 *
 * ### loadImage
 *
 * An instance created by this constructor caches loaded images.
 *
 * @class ResourceManager
 * @constructor
 */
ResourceManager = (function () {
	function ResourceManager() {
		var self = this;

		// default implementation
		var imageCache = {};
		self.loadImage = function (url) {
			if (url == null) {
				throw 'url must be specified';
			}
			var image = imageCache[url];
			if (!image) {
				image = new Image();
				image.src = url;
				imageCache[url] = image;
			}
			return image;
		};
	};

	/**
	 * Returns if a specified object is a `ResourceManager`.
	 *
	 * A `ResourceManager` must have all of the following property,
	 *  - loadImage: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `ResourceManager`.
	 *     `false` if `obj` is not specified.
	 */
	ResourceManager.isClassOf = function (obj) {
		return obj != null && typeof obj.loadImage === 'function';
	};

	/**
	 * Returns if a specified object can be a `ResourceManager`.
	 *
	 * Any object can be a `ResourceManager`.
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     `true` unless `obj` is unspecified.
	 */
	ResourceManager.canAugment = function (obj) {
		return obj != null;
	};

	/**
	 * Augments a specified object with features of `ResourceManager`.
	 *
	 * The following property of `obj` will be overwritten,
	 *  - loadImage
	 *
	 * Never checks if `obj` actually can be a `ResourceManager`, because this
	 * method may be applied to incomplete instances; i.e. prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	ResourceManager.augment = function (obj) {
		for (prop in ResourceManager.prototype) {
			obj[prop] = ResourceManager.prototype[prop];
		}
		return obj;
	};

	/**
	 * Loads an `Image` associated with a specified URL.
	 *
	 * This method may cache a loaded image and returns it everytime
	 * the same URL is requested.
	 *
	 * `url` may be redirected by some `ResourceManager`.
	 *
	 * Throws an exception if `url` is not specified.
	 *
	 * NOTE: prototype does nothing and returns `undefined`.
	 *
	 * @method loadImage
	 * @param url {string}
	 *     The URL to be loaded.
	 * @return {Image}
	 *     An `Image` object associated with `url`.
	 */
	ResourceManager.prototype.loadImage = function (url) {};

	return ResourceManager;
})();
