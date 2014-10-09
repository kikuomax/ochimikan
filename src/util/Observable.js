/**
 * The interface of an observable object.
 *
 * @class Observable
 * @constructor
 */
Observable = (function () {
	function Observable() {
		var self = this;

		/**
		 * The list of observer functions.
		 *
		 * @property observers
		 * @type {Array}
		 */
		self.observers = [];
	}

	/**
	 * Returns whether a specified object is an `Observable`.
	 *
	 * An `Observable` must have all of the following properties,
	 *  - addObserver:     function
	 *  - removeObserver:  function
	 *  - notifyObservers: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Observable`. `false` if `obj` is not specified.
	 */
	Observable.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.addObserver     === 'function'
			&& typeof obj.removeObserver  === 'function'
			&& typeof obj.notifyObservers === 'function';
	};

	/**
	 * Returns whether a specified object can be an `Observable`.
	 *
	 * An object which have the following property can be an `Observable`,
	 *  - observers: Array
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be an `Observable`.
	 *     `false` if `obj`is not specified.
	 */
	Observable.canAugment = function (obj) {
		return obj != null && Array.isArray(obj.observers);
	};

	/**
	 * Augments a specified object with the features of `Observable`.
	 *
	 * The following properties of `obj` will be overwritten,
	 *  - addObserver
	 *  - removeObserver
	 *  - notifyObservers
	 *
	 * Never checks if `obj` can actually be an `Observable` because this method
	 * may be applied to incomplete instances; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Observable.augment = function (obj) {
		for (prop in Observable.prototype) {
			obj[prop] = Observable.prototype[prop];
		}
		return obj;
	};

	/**
	 * Adds a specified observer to this `Observable`.
	 *
	 * Throws an exception if `observer` is not a function.
	 *
	 * Default implementation pushes `observer` to `this.observers`.
	 *
	 * @method addObserver
	 * @param observer {function}
	 *     The observer to observe this `Observable`.
	 */
	Observable.prototype.addObserver = function (observer) {
		if (typeof observer !== 'function') {
			throw 'observer must be a function';
		}
		this.observers.push(observer);
	};

	/**
	 * Removes a specified observer from this `Observable`.
	 *
	 * Has no effect if `observer` is not observing this `Observable`.
	 *
	 * Default implementation removes `observer` from `this.observers`.
	 *
	 * @method removeObserver
	 * @param observer {function}
	 *     The observer to be removed from this `Observable`.
	 */
	Observable.prototype.removeObserver = function (observer) {
		var idx = this.observers.indexOf(observer);
		if (idx != -1) {
			this.observers.splice(idx, 1);
		}
	};

	/**
	 * Notifies observers observing this `Observable`.
	 *
	 * Arguments specified to this function will be forwarded to the observers.
	 * Observers will be invoked in the global context.
	 *
	 * Default implementation notifies observers in `this.observers`.
	 *
	 * @method notifyObservers
	 */
	Observable.prototype.notifyObservers = function () {
		var args = arguments;
		this.observers.forEach(function (observer) {
			observer.apply(null, args);
		})
	};

	return Observable;
})();
