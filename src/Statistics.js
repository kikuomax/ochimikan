/**
 * Records statistics of the game.
 *
 * The following statistics are recorded,
 *  - Total number of erased mikans
 *  - Length of the current combo
 *
 * Events
 * ======
 *
 * `Statistics` notifies observers an event when it is changed.
 * An observer function will be invoked with the following arguments,
 *  1. Event ID (string):       The type of the event.
 *  2. Statistics (Statistics): The updated `Statistics`.
 *  3. Optional arguments:      Optional arguments depending on the event ID.
 *
 * An event ID can be one of the followings,
 *  - 'statisticsReset':
 *    Indicates that the statistics has been reset. No optional arguments.
 *  - 'mikansErased':
 *    Indicates that the total number of erased mikans has increased.
 *    Takes the following additional argument,
 *     1. (number) The number of newly erased mikans.
 *  - 'comboUpdated':
 *    Indicates that the length of the current combo has been changed.
 *    No optional arguments.
 *
 * @class Statistics
 * @constructor
 * @extends Observable
 */
Statistics = (function () {
	function Statistics() {
		var self = this;

		Observable.call(self);

		/**
		 * The total number of erased mikans.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addErasedMikans` or `reset`.
		 *
		 * @property erasedMikanCount
		 * @type number
		 */
		var _erasedMikanCount = 0;
		Object.defineProperty(self, 'erasedMikanCount', {
			get: function () { return _erasedMikanCount }
		});

		/**
		 * The length of the current combo.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addCombo`, `resetCombo` or `reset`.
		 *
		 * @property comboLength
		 * @type number
		 */
		var _comboLength = 0;
		Object.defineProperty(self, 'comboLength', {
			get: function () { return _comboLength }
		});

		/**
		 * Increases the total number of erased mikans.
		 *
		 * Notifies 'mikanErased' to observers unless `count` is 0.
		 *
		 * Throws an exception if `count` is not a number.
		 *
		 * @method addErasedMikans
		 * @param count {number}
		 *     The number to be added to the erased mikan count.
		 */
		self.addErasedMikans = function (count) {
			if (typeof count !== 'number') {
				throw 'count must be a number';
			}
			if (count != 0) {
				_erasedMikanCount += count;
				self.notifyObservers('mikanErased', self, count);
			}
		};

		/**
		 * Increments (+1) the length of the current combo.
		 *
		 * Notifies 'comboUpdated' to observers.
		 *
		 * @method addCombo
		 */
		self.addCombo = function () {
			++_comboLength;
			self.notifyObservers('comboUpdated', self);
		};

		/**
		 * Resets the length of the current combo.
		 *
		 * Resets `comboLength` to 0.
		 *
		 * Notifies `comboUpdated` to observers.
		 *
		 * @method resetCombo
		 */
		self.resetCombo = function () {
			_comboLength = 0;
			self.notifyObservers('comboUpdated', self);
		};

		/**
		 * Resets this `Statistics`.
		 *
		 * Resets `erasedMikanCount` and `comboLength` to 0.
		 *
		 * Notifies `statisticsReset` to observers.
		 *
		 * @method reset
		 */
		self.reset = function () {
			_erasedMikanCount = 0;
			_comboLength = 0;
			self.notifyObservers('statisticsReset', self);
		};
	}
	Observable.augment(Statistics.prototype);

	/**
	 * Returns whether a specified object is a `Statistics`.
	 *
	 * A `Statistics` must satisfy all of the following conditions,
	 *  - Is a `Observable`
	 *  - Has all of the following properties,
	 *     - erasedMikanCount: number
	 *     - comboLength:      number
	 *     - addErasedMikans:  function
	 *     - addCombo:         function
	 *     - resetCombo:       function
	 *     - reset:            function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Statistics`. `false` if `obj` is not specified.
	 */
	Statistics.isClassOf = function (obj) {
		return Observable.isClassOf(obj)
			&& typeof obj.erasedMikanCount === 'number'
			&& typeof obj.comboLength      === 'number'
			&& typeof obj.addErasedMikans  === 'function'
			&& typeof obj.addCombo         === 'function'
			&& typeof obj.resetCombo       === 'function'
			&& typeof obj.reset            === 'function';
	};

	return Statistics;
})();
