/**
 * An actor scheduler.
 *
 * @class ActorScheduler
 * @constructor
 */
function ActorScheduler() {
    var self = this;

    /**
     * The queue of the scheduled actors.
     *
     * NOTE: for internal use. please use `schedule` or `run` instead.
     *
     * @property actorQueue
     * @protected
     * @type Array
     */
    self.actorQueue = [];
}

/**
 * Schedules the specified actor.
 *
 * @method schedule
 * @param actor {Actor}
 *     The actor to be scheduled.
 * @chainable
 */
ActorScheduler.prototype.schedule = function(actor) {
    this.actorQueue.push(actor);
    return this;
};

/**
 * Runs scheduled actors.
 *
 * Runs actors which satisfies one of the following conditions,
 * - has negative priority
 * - has the highest priority (>=0) among the scheduled actors
 *
 * Executed actors will be deleted from the queue of this actor scheduler.
 *
 * @method run
 * @chainable
 */
ActorScheduler.prototype.run = function() {
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
	actorQueue.slice(0, upper).forEach(function(a) {
	    a.act(self);
	});
	// reschedules actors which have lower priorities
	self.actorQueue = self.actorQueue.concat(actorQueue.slice(upper));
    }
    return self;
};

/**
 * Returns whether the specified object is an `ActorScheduler`.
 *
 * An `ActorScheduler` must have the following property.
 * - schedule: Function
 * - run: Function
 *
 * NOTE: `actorQueue` isn't a necessary property of an `ActorScheduler`.
 *
 * @method isClassOf
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is an actor scheduler. `false` if `obj` isn't specified.
 */
ActorScheduler.isClassOf = function(obj) {
    return (obj != null) &&
	(typeof obj.schedule == 'function') &&
	(typeof obj.run == 'function');
};

/**
 * Augments the specified object with functionalities of the `ActorScheduler`.
 *
 * Overwrites the following properties.
 * - schedule
 * - run
 *
 * @method augment
 * @static
 * @param obj {Object}
 *     The object to be augmented with functionalities of `ActorScheduler`.
 * @return {Object}
 *     The augmented object. `obj`.
 */
ActorScheduler.augment = function(obj) {
    for (prop in ActorScheduler.prototype) {
	obj[prop] = ActorScheduler.prototype[prop];
    }
    return obj;
};
