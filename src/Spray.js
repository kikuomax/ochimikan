/**
 * A spray.
 *
 * An actor whose a priority is `ActorPriorities.SPRAY`.
 *
 * Throws an exception,
 *  - if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `ttl` is not a number
 *  - if `move` is not a function
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
 * @param ttl {number}
 *     The time to live.
 * @param move {function}
 *     The function to move the `Spray` everytime `run` is called.
 *     This function will be invoked in the context of the `Spray`.
 */
Spray = (function () {
	function Spray(x, y, ttl, move) {
		var self = this;

		Located.call(self, x, y);

		if (typeof ttl != 'number') {
			throw 'ttl must be a number';
		}
		if (typeof move != 'function') {
			throw 'move must be a function';
		}

		/**
		 * *Spray specific behavior.*
		 *
		 * Behavior
		 * --------
		 *
		 *  1. Decrements `ttl`.
		 *  2. Invokes `move`.
		 *  3. Increments `frameIndex`.
		 *  4. Asks `scheduler` to `schedule` this again.
		 *
		 * ### Derivative
		 *
		 *  - 1 `ttl` expires (<= 0)
		 *     1. END
		 *  - 3 `frameIndex` reaches `Spray.FRAME_COUNT`.
		 *     1. Resets `frameIndex` to 0.
		 *     2. Proceeds to the step 3.
		 *
		 * @method act
		 */
		Actor.call(self, ActorPriorities.SPRAY, function (scheduler) {
			// moves and reschedules if ttl has not expired
			if (ttl > 0) {
				--ttl;
				move.call(this);
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
		Renderable.call(self, function (context) {
			Resources.SPRITES['spray'][frameIndex].render(context,
														  self.x, self.y);
		});

		/**
		 * The time to live.
		 *
		 * @property ttl
		 * @type {number}
		 */
		Object.defineProperty(self, 'ttl', {
			get: function () { return ttl; }
		});

		/**
		 * The function which moves everytime `run` is called.
		 *
		 * @property move
		 * @type {function}
		 */
		Object.defineProperty(self, 'move', { value: move });

		/**
		 * The frame index.
		 *
		 * @property frameIndex
		 * @type {number}
		 */
		var frameIndex = 0;
		Object.defineProperty(self, 'frameIndex', {
			get: function () { return frameIndex; }
		});
	};
	Located.augment(Spray.prototype);
	Actor.augment(Spray.prototype);
	Renderable.augment(Spray.prototype);

	/**
	 * The frame count of a spray.
	 *
	 *     FRAME_COUNT = 4
	 *
	 * @property FRAME_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Spray, 'FRAME_COUNT', { value: 4 });

	/**
	 * Returns a simple move function which adds specified speed.
	 *
	 * @method moveLinear
	 * @static
	 * @param dX {number}
	 *     The speed along the x-axis.
	 * @param dY {number}
	 *     The speed along the y-axis.
	 * @return {function}
	 *     A move function which adds `dX` and `dY` to the location of a spray.
	 */
	Spray.moveLinear = function (dX, dY) {
		return function () {
			this.translate(dX, dY);
		};
	};

	return Spray;
})();
