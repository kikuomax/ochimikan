/**
 * A spray.
 *
 * An actor whose a priority is `ActorPriorities.SPRAY`.
 *
 * ## Scenarios
 *
 * ### Spreading
 *
 * @class Spray
 * @constructor
 * @uses Located
 * @uses Actor
 * @uses Renderable
 * @param x {number}
 *     The x-coordinate value of the initial location.
 * @param y {number}
 *     The y-coordinate value of the initial location.
 * @param dX {number}
 *     The speed along the x-coordinate axis.
 * @param dY {number}
 *     The speed along the y-coordinate axis.
 * @param ttl {number}
 *     The time to live.
 */
function Spray(x, y, dX, dY, ttl) {
    var self = this;

    Located.call(self, x, y);

    /**
     * Performs the action of this spray.
     *
     * ## Behavior
     *
     * 1. Decrements `ttl`.
     * 1. Moves the specified amount (`dX`, `dY`)
     * 1. Increments `frameIndex`.
     * 1. Asks `scheduler` to `schedule` this again.
     *
     * ### Derivative
     *
     * - 1 `ttl` expires (<= 0)
     *   1. END
     * - 3 `frameIndex` reaches `Spray.FRAME_COUNT`.
     *   1. Resets `frameIndex` to 0.
     *   1. Proceeds to the step 3.
     *
     * @param scheduler {ActorScheduler}
     *     The `ActorScheduler` which is running this actor.
     */
    Actor.call(self, ActorPriorities.SPRAY, function(scheduler) {
	// moves and reschedules if ttl has not expired
	if (ttl > 0) {
	    --ttl;
	    self.x += dX;
	    self.y += dY;
	    ++frameIndex;
	    if (frameIndex == Spray.FRAME_COUNT) {
		frameIndex = 0;
	    }
	    scheduler.schedule(self);
	}
    });

    /**
     * Renders this spray.
     *
     * Renders a spray sprite corresponding to the frame at the location of
     * this spray.
     *
     * @method render
     * @param context {canvas context}
     *     The context in which this spray is rendered.
     */
    Renderable.call(self, function(context) {
	Resources.SPRITES['spray'][frameIndex].render(context, self.x, self.y);
    });

    /**
     * The speed along the x-coordinate axis.
     *
     * @property dX
     * @type {number}
     * @final
     */
    Object.defineProperty(self, 'dX', { value: dX });

    /**
     * The speed along the y-coordinate axis.
     *
     * @property dY
     * @type {number}
     * @final
     */
    Object.defineProperty(self, 'dY', { value: dY });

    /**
     * The time to live.
     *
     * @property ttl
     * @type {number}
     */
    Object.defineProperty(self, 'ttl', {
	get: function() { return ttl; }
    });

    /**
     * The frame index.
     *
     * @property frameIndex
     * @type {number}
     */
    var frameIndex = 0;
    Object.defineProperty(self, 'frameIndex', {
	get: function() { return frameIndex; }
    });
};
Located.augment(Spray.prototype);
Actor.augment(Spray.prototype);
Renderable.augment(Spray.prototype);

/**
 * The frame count of a spray.
 *
 * `FRAME_COUNT = 4`
 *
 * @property FRAME_COUNT
 * @type {number}
 * @final
 */
Object.defineProperty(Spray, 'FRAME_COUNT', { value: 4 });
