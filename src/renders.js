/**
 * Defines the render system.
 *
 * @module renders
 */

/**
 * The interface of a renderable object.
 *
 * @class Renderable
 * @constructor
 * @param render {function(Context)}
 *     The rendering method.
 */
function Renderable(render) {
    var self = this;

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
 * The render system.
 *
 * May be referred to as `rs`.
 *
 * @class RenderSystem
 * @static
 */
const RenderSystem = {
    /**
     * Makes the specified object a `Renderable`.
     *
     * @method makeRenderable
     * @param self {Object}
     *     The object to be a `Renderable`.
     * @param render {function(Context)}
     *     The rendering method.
     * @return {Renderable}  `self`.
     */
    makeRenderable: function(self, render) {
	Renderable.call(self, render);
	return self;
    }
};

// A shortcut for the `RenderSystem`
const rs = RenderSystem;
