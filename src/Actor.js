/**
 * An actor.
 *
 * Throws an exception
 *  - if `priority` is not a number
 *  - or if `act` is not a function
 *
 * @class Actor
 * @constructor
 * @param priority {number}
 *     The priority of the actor.
 *     The lower this number is, the higher priority is.
 * @param act {function}
 *     The action of the actor.
 *     Takes an `ActorScheduler`.
 */
Actor = (function () {
	function Actor(priority, act) {
		var self = this;

		// verifies arguments
		if (typeof priority !== 'number') {
			throw "priority must be specified"
		}
		if (typeof act !== "function") {
			throw "act must be a function";
		}

		/**
		 * The priority of this actor.
		 *
		 * The lower this number is, the higher priority is.
		 *
		 * @property priority
		 * @type {number}
		 */
		self.priority = priority;

		/**
		 * Performs the action of this actor.
		 *
		 * `scheduler.schedule` may be invoked in this method.
		 *
		 * @method act
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` which is running this actor.
		 */
		self.act = act;
	}

	/**
	 * Returns whether a specified object is an `Actor`.
	 *
	 * An `Actor` must have the following properties,
	 *  - priority: number
	 *  - act:      function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Actor`. `false` if `obj` is not specified.
	 */
	Actor.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.priority === 'number'
			&& typeof obj.act      === 'function';
	};

	/**
	 * Returns whether a specified object can be an `Actor`.
	 *
	 * An object which has the following properties can be an `Actor`.
	 *  - priority: number
	 *  - act: function
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `Actor`. `false` is `obj` is not specified.
	 */
	Actor.canAugment = function (obj) {
		return obj != null
			&& typeof obj.priority === 'number'
			&& typeof obj.act      === 'function';
	};

	/**
	 * Augments a specified object with features of `Actor`.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * Never checks if `obj` can actually be an `Actor` because this method
	 * may be applied to incomplete objects; i.e., prototypes.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Actor.augment = function (obj) {
		if (obj == null) {
			throw 'obj must be specified';
		}
		return obj;
	};

	/**
	 * A comparator which compares priorities of specified two `Actor`s
	 * for order.
	 *
	 * @method comparePriorities
	 * @static
	 * @param lhs {Actor}
	 *     The left hand side of comparison.
	 * @param rhs {Actor}
	 *     The right hand side of comparison.
	 * @return {number}
	 *     Negative number if `lhs.priority` <  `rhs.priority`
	 *     0               if `lhs.priority` == `rhs.priority`
	 *     Positive number if `lhs.priority` >  `rhs.priority`
	 */
	Actor.comparePriorities = function (lhs, rhs) {
		return Search.compare(lhs.priority, rhs.priority);
	};

	return Actor;
})();
