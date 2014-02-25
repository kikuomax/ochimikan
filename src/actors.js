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
 * 1. A user makes the object an `ActorScheduler`.
 *
 * @module actors
 */

/**
 * An actor.
 *
 * @class Actor
 * @constructor
 * @param priority {int}
 *     The priority of the actor.
 * @param act {function(ActorScheduler)}
 *     The action of the actor.
 */
function Actor(priority, act) {
    var self = this;

    /**
     * The priority of this actor.
     *
     * @property priority
     * @type int
     */
    self.priority = priority;

    /**
     * Performs the action of this actor.
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
 * @method isActor
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}  Whether `obj` is an actor.
 */
Actor.isActor = function(obj) {
    return false;
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

    /**
     * Schedules the specified actor.
     *
     * @method schedule
     * @param actor {Actor}
     *     The actor to be scheduled.
     */
    self.schedule = function(actor) {
	self.actorQueue.push(actor);
    };

    /**
     * Runs scheduled actors.
     *
     * Executed actors will be deleted from the queue.
     * @method run
     */
    self.run = function() {
	// checks if any actor is scheduled
	if (self.actorQueue.length > 0) {
	    // spares the actor queue
	    var actorQueue = self.actorQueue;
	    self.actorQueue = [];
	    // sorts actors by priorities (a higher priority comes earlier)
	    actorQueue.sort(compareActorPriority);
	    // runs actors which have the highest priority
	    // and reschedules actors which have lower priorities
	    var toRun = actorQueue[0];
	    var upper = upperBound(actorQueue, toRun, compareActorPriority);
	    actorQueue.slice(0, upper).forEach(function(a) {
		a.act(self);
	    });
	    self.actorQueue = self.actorQueue.concat(actorQueue.slice(upper));
	}
    };
}

/**
 * Provides APIs of the actor system.
 *
 * May be referred to as `as`.
 *
 * @class ActorSystem
 * @static
 */
const ActorSystem = {
    /**
     * Makes the specified object an actor.
     *
     * @method makeActor
     * @param self {Object}
     *     The object to be an actor.
     * @param priority {int}
     *     The priority of the actor.
     * @param act {function(ActorScheduler)}
     *     The action of the actor.
     * @return {Actor}  `self`.
     */
    makeActor: function(self, priority, act) {
	Actor.call(self, priority, act);
	return self;
    },

    /**
     * Makes the specified object an actor scheduler.
     *
     * @method makeActorScheduler
     * @param self {Object}
     *     The object to be an actor scheduler.
     * @return {ActorScheduler}  `self`.
     */
    makeActorScheduler: function(self) {
	ActorScheduler.call(self);
	return self;
    }
}

// A shortcut for the actor system.
const as = ActorSystem;
