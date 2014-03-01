/**
 * Defines the render system.
 *
 * @module renders
 */

/**
 * The interface of a renderable object.
 *
 * Throws "render must be a function" if `render` isn't a function.
 *
 * @class Renderable
 * @constructor
 * @param render {Function(Context)}
 *     The rendering function which performs rendering in a specified context.
 */
function Renderable(render) {
    var self = this;

    // makes sure that render is a function
    if (typeof render != "function") {
	throw "render must be a function";
    }

    /**
     * Renders this `Renderable`.
     *
     * @method render
     * @param context {Context}
     *     The context in which the rendering is to be performed.
     */
    self.render = render;
}

/**
 * Makes the specified object renderable.
 *
 * @method makeRenderable
 * @static
 * @param self {Object}
 *     The object to be renderable.
 * @param render {Function(Context)}
 *     The rendering function which performs rendering in a specified context.
 * @return {Renderable}  `self`.
 */
Renderable.makeRenderable = function(self, render) {
    Renderable.call(self, render);
    return self;
};

/**
 * Returns whetehr the specified object is a `Renderable`.
 *
 * A `Renderable` must have the following property,
 *
 * - `render`: function 
 *
 * @method isRenderable
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}  Whether `obj` is a `Renderable`.
 */
Renderable.isRenderable = function(obj) {
    return (obj != null) && (typeof obj.render == "function");
};
