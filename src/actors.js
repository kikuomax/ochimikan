/**
 * Defines the actor system.
 *
 * # Use Cases
 *
 * ## Creating a new actor
 *
 * 1. A user defines an action of an `Actor`.
 * 2. The user creates a new `Actor` with the action and a priority.
 *
 * ## Making an existing object an actor
 *
 * 1. An object is given.
 * 2. A user defines an action of an `Actor`.
 * 3. The user makes the object with the action and a priority.
 *
 * ## Making an existing object an actor scheduler
 *
 * 1. An object is given.
 * 2. A user makes the object an `ActorScheduler`.
 *
 * ## Scheduling an actor
 *
 * 1. An `Actor` is given.
 * 2. An `ActorScheduler` is given.
 * 3. A user asks the `ActorScheduler` to schedule the `Actor`.
 * 4. The `ActorScheduler` schedules the `Actor`.
 *
 * ## Running actors
 *
 * 1. An `ActorScheduler` is given.
 * 2. A user asks the `ActorScheduler` to run `Actor`s scheduled in it.
 * 3. The `ActorScheduler` selects `Actor`s to run and asks them to act.
 *
 * ## Self-reproducing actor
 *
 * 1. An `ActorScheduler` is given.
 * 2. An `Actor` scheduled in the `ActorScheduler` is given.
 * 3. The `ActorScheduler` asks the `Actor` to act.
 * 4. The `Actor` acts and asks the `ActorScheduler` to schedule it again.
 *
 * @module actors
 */

/**
 * An actor.
 *
 * Throws an exception if,
 * - `priority` is `null` or `undefined`
 * - `act` isn't a function
 *
 * @class Actor
 * @constructor
 * @param priority {Number}
 *     The priority of the actor.
 *     The lower this number is, the higher priority is.
 * @param act {Function}
 *     The action of the actor.
 */
function Actor(priority, act) {
    var self = this;

    // makes sure that priority is specified
    if (priority == null) {
	throw "priority must be specified"
    }
    // makes sure that act is a function
    if (typeof act != "function") {
	throw "act must be a function";
    }

    /**
     * The priority of this actor.
     *
     * The lower this number is, the higher priority is.
     *
     * @property priority
     * @type {Number}
     * @final
     */
    self.priority = priority;

    /**
     * Performs the action of this actor.
     *
     * `scheduler.schedule` may be invoked in this method.
     *
     * @method act
     * @param scheduler {ActorScheduler}
     *     The actor scheduler which is running this actor.
     */
    self.act = act;
}

/**
 * Returns whether the specified object is an actor.
 *
 * An actor has the following properties,
 * - priority
 * - act: Function
 *
 * @method isActor
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}  Whether `obj` is an actor.
 */
Actor.isActor = function(obj) {
    return (obj != null) && (obj.priority != null) && (typeof obj.act == "function");
};

/**
 * A comparator which compares priorities of specified two actors for order.
 *
 * @method comparePriorities
 * @static
 * @param lhs {Actor}
 *     The left hand side of comparison.
 * @param rhs {Actor}
 *     The right hand side of comparison.
 * @return {Number}
 *     - negative number if `lhs.priority < rhs.priority`
 *     - 0 if `lhs.priority == rhs.priority`
 *     - positive number if `lhs.priority > rhs.priority`
 */
Actor.comparePriorities = function(lhs, rhs) {
    var order;
    if (lhs.priority < rhs.priority) {
	order = -1;
    } else if (lhs.priority > rhs.priority) {
	order = 1;
    } else {
	order = 0;
    }
    return order;
};

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
     * @property actorQueue
     * @type Array[Actor]
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
 * - has the highes priority (>=0) among the scheduled actors
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
 * Returns whether the specified object is an actor scheduler.
 *
 * An actor scheduler must have the following property.
 * - actorQueue
 *
 * @method isActorScheduler
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is an actor scheduler.
 *     `false` if `obj` is `null` or `undefined`.
 */
ActorScheduler.isActorScheduler = function(obj) {
    return (obj != null) && (obj.actorQueue != null);
};

/**
 * Wraps the specified object with functionalities of `ActorScheduler`.
 *
 * Overwrites the following properties.
 * - schedule
 * - run
 *
 * @method wrap
 * @static
 * @param obj {Object}
 *     The object to be wrapped with functionalities of `ActorScheduler`.
 * @return {Object}  `obj`.
 */
ActorScheduler.wrap = function(obj) {
    for (prop in ActorScheduler.prototype) {
	obj[prop] = ActorScheduler.prototype[prop];
    }
    return obj;
};
