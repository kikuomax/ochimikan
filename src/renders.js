/**
 * Defines the render system.
 *
 * @module renders
 */

/**
 * The interface of a renderable object.
 *
 * Throws an exception if `render` isn't a function.
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
 * Returns whether the specified object is a `Renderable`.
 *
 * A `Renderable` must have the following property.
 * - render: Function 
 *
 * @method isClassOf
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is a `Renderable`. `false` if `obj` isn't specified.
 */
Renderable.isClassOf = function(obj) {
    return (obj != null) && (typeof obj.render == "function");
};
