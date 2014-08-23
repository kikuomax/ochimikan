/**
 * An actor scheduler.
 *
 * ## Scenarios
 *
 * ### Scheduling an `Actor`
 *
 * 1. An `Actor` is given.
 * 2. An `ActorScheduler` is given.
 * 3. A user asks the `ActorScheduler` to `schedule` the `Actor`.
 *
 * ### Running `Actor`s
 *
 * 1. An `ActorScheduler` with scheduled `Actor`s is given.
 * 2. A user asks the `ActorScheduler` to `run` `Actor`s scheduled in it.
 * 3. The `ActorScheduler` selects `Actor`s to run and asks them to `act`.
 *
 * ### Self-reproducing `Actor`
 *
 * 1. An `ActorScheduler` is given.
 * 2. An `Actor` scheduled in the `ActorScheduler` is given.
 * 3. The `ActorScheduler` asks the `Actor` to act.
 * 4. The `Actor` acts and asks the `ActorScheduler` to `schedule` itself again.
 *
 * @class ActorScheduler
 * @constructor
 */
ActorScheduler = (function () {
	function ActorScheduler() {
		var self = this;

		/**
		 * The queue of the scheduled actors.
		 *
		 * Do not directly manipulate this property.
		 * Use `schedule` or `run` instead.
		 *
		 * @property actorQueue
		 * @type Array{Actor}
		 * @protected
		 */
		self.actorQueue = [];
	}

	/**
	 * Returns whether a specified object is an `ActorScheduler`.
	 *
	 * An `ActorScheduler` must have the following properties.
	 * - schedule: function
	 * - run: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `ActorScheduler`.
	 *     `false` if `obj` is not specified.
	 */
	ActorScheduler.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.schedule === 'function'
			&& typeof obj.run === 'function';
	};

	/**
	 * Returns whether a specified object can be an `ActorScheduler`.
	 *
	 * An object which has the following property can be an `ActorScheduler`.
	 * - actorQueue: Array
	 *
	 * @method canAugment
	 * @static
	 * @param obj {ojbect}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `ActorScheduler`.
	 *     `false` if `obj` is not specified.
	 */
	ActorScheduler.canAugment = function (obj) {
		return obj != null && Array.isArray(obj.actorQueue);
	};

	/**
	 * Augments a specified object with features of the `ActorScheduler`.
	 *
	 * The following properties of `obj` will be overwritten.
	 * - schedule
	 * - run
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` actually can be an `ActorScheduler` because this
	 * method may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	ActorScheduler.augment = function (obj) {
		for (prop in ActorScheduler.prototype) {
			obj[prop] = ActorScheduler.prototype[prop];
		}
		return obj;
	};

	/**
	 * Schedules a specified `Actor`.
	 *
	 * Throws an exception if `actor` is not an `Actor`.
	 *
	 * @method schedule
	 * @param actor {Actor}
	 *     The actor to be scheduled.
	 */
	ActorScheduler.prototype.schedule = function (actor) {
		if (!Actor.isClassOf(actor)) {
			throw 'actor must be an Actor';
		}
		this.actorQueue.push(actor);
	};

	/**
	 * Runs scheduled `Actor`s.
	 *
	 * Runs `Actor`s which satisfy one of the following conditions,
	 * - has negative priority
	 * - has the highest priority (>=0) among the scheduled `Actor`s
	 *
	 * Executed `Actor`s will be deleted from the queue of this
	 * `ActorScheduler`.
	 *
	 * @method run
	 */
	ActorScheduler.prototype.run = function () {
		var self = this;
		// checks if any actor is scheduled
		if (self.actorQueue.length > 0) {
			// spares the actor queue
			var actorQueue = self.actorQueue;
			self.actorQueue = [];
			// sorts actors by priorities (a higher priority comes earlier)
			actorQueue.sort(Actor.comparePriorities);
			// runs actors which have negative priorities
			// lower bound of priority=0
			// => upper bound of negative priorities
			var upper = Search.lowerBound(actorQueue,
										  { priority: 0 },
										  Actor.comparePriorities);
			// and runs actors which have the highest priority (>= 0)
			if (upper < actorQueue.length) {
				upper = Search.upperBound(actorQueue,
										  actorQueue[upper],
										  Actor.comparePriorities);
			}
			actorQueue.slice(0, upper).forEach(function (a) {
				a.act(self);
			});
			// reschedules actors which have lower priorities
			self.actorQueue = self.actorQueue.concat(actorQueue.slice(upper));
		}
	};

	return ActorScheduler;
})();
