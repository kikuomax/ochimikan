/**
 * The interface of a renderable object.
 *
 * Throws an exception if `render` isn't a function.
 *
 * @class Renderable
 * @constructor
 * @param render {function}
 *     The rendering function which performs rendering in a specified context.
 *     Takes a canvas context.
 */
Renderable = (function () {
	function Renderable(render) {
		var self = this;

		// makes sure that render is a function
		if (typeof render !== 'function') {
			throw 'render must be a function';
		}

		/**
		 * Renders this `Renderable`.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which the rendering is to be performed.
		 */
		self.render = render;
	}

	/**
	 * Returns whether a specified object is a `Renderable`.
	 *
	 * A `Renderable` must have the following property.
	 *  - render: function 
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Renderable`. `false` if `obj` is not specified.
	 */
	Renderable.isClassOf = function (obj) {
		return obj != null && typeof obj.render === 'function';
	};

	/**
	 * Returns whether a specified object can be a `Renderable`.
	 *
	 * An object which has the following property can be a `Renderable`.
	 *  - render: function
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Renderable`.
	 *     `false` if `obj` is not specified.
	 */
	Renderable.canAugment = function (obj) {
		return obj != null && typeof obj.render === 'function';
	};

	/**
	 * Augments a specified object with features of the `Renderable`.
	 *
	 * Never checks if `obj` can actually be a `Renderable` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Renderable.augment = function (obj) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		return obj;
	};

	return Renderable;
})();
