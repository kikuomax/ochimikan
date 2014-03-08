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
 * Returns whetehr the specified object is a `Renderable`.
 *
 * A `Renderable` have the following property.
 * - render: Function 
 *
 * @method isRenderable
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is a `Renderable`.
 *     `false` if `obj` is `null` or `undefined`.
 */
Renderable.isRenderable = function(obj) {
    return (obj != null) && (typeof obj.render == "function");
};
