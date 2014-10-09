/**
 * Records statistics of the game.
 *
 * The following statistics are recorded,
 *  - Current game level
 *  - Current score
 *  - Total number of erased mikans
 *  - Length of the current combo
 *
 * Events
 * ------
 *
 * `Statistics` notifies observers an event when it is changed.
 * An observer function will be invoked with the following arguments,
 *  1. Event ID (string):       The type of the event.
 *  2. Statistics (Statistics): The updated `Statistics`.
 *  3. Optional arguments:      Optional arguments depending on the event ID.
 *
 * An event ID can be one of the followings,
 *  - 'levelUpdated':
 *    Indicates that the current game level has been changed.
 *    No optional arguments.
 *  - 'scoreUpdated':
 *    Indicates that the current score has been changed. No optional arguments.
 *  - 'mikansErased':
 *    Indicates that the total number of erased mikans has increased.
 *    Takes the following additional argument,
 *     1. (number) The number of newly erased mikans.
 *  - 'preservativesErased':
 *    Indicates that the total number of erased preservatives has increased.
 *    Takes the following additional argument,
 *     1. (number) The number of newly erased preservatives.
 *  - 'comboUpdated':
 *    Indicates that the length of the current combo has been changed.
 *    No optional arguments.
 *  - 'statisticsReset':
 *    Indicates that the statistics has been reset. No optional arguments.
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
		 * The current game level.
		 *
		 * Initially 0.
		 *
		 * Changing this property notifies 'levelUpdated' to observers, but
		 * setting this property to the same value notifies nothing.
		 *
		 * Throws an exception,
		 *  - if this property is set unspecified
		 *  - or if this property is set to a non-number value
		 *  - or if this property is set to a negative number
		 *
		 * @property level
		 * @type {number}
		 */
		var level = 0;
		Object.defineProperty(self, 'level', {
			get: function () { return level },
			set: function (newLevel) {
				if (typeof newLevel !== 'number') {
					throw 'level must be a number';
				}
				if (newLevel < 0) {
					throw 'level must be >= 0';
				}
				// updates if necessary
				if (level != newLevel) {
					level = newLevel;
					self.notifyObservers('levelUpdated', self);
				}
			}
		});

		/**
		 * The current score.
		 *
		 * Initially 0.
		 *
		 * Changing this property notifies 'scoreUpdated' to observers, but
		 * setting this property to the same value notifies nothing.
		 *
		 * Throws an exception,
		 *  - if this property is set unspecified
		 *  - or if this property is set to a non-number value
		 *  - or if this property is set to a negative number
		 *
		 * @property score
		 * @type {number}
		 */
		var score = 0;
		Object.defineProperty(self, 'score', {
			get: function () { return score },
			set: function (newScore) {
				if (typeof newScore !== 'number') {
					throw 'score must be a number';
				}
				if (newScore < 0) {
					throw 'score must be >= 0';
				}
				// updates if necessary
				if (score != newScore) {
					score = newScore;
					self.notifyObservers('scoreUpdated', self);
				}
			}
		});

		/**
		 * The total number of erased mikans.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addErasedMikans` or `reset`.
		 *
		 * @property erasedMikanCount
		 * @type {number}
		 */
		var erasedMikanCount = 0;
		Object.defineProperty(self, 'erasedMikanCount', {
			get: function () { return erasedMikanCount }
		});

		/**
		 * The total number of erased preservatives.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addErasedPreservatives` or `reset`.
		 *
		 * @property erasedPreservativeCount
		 * @type {number}
		 */
		var erasedPreservativeCount = 0;
		Object.defineProperty(self, 'erasedPreservativeCount', {
			get: function () { return erasedPreservativeCount }
		});

		/**
		 * The length of the current combo.
		 *
		 * Initially 0.
		 *
		 * To change this number, use `addCombo`, `resetCombo` or `reset`.
		 *
		 * @property comboLength
		 * @type {number}
		 */
		var comboLength = 0;
		Object.defineProperty(self, 'comboLength', {
			get: function () { return comboLength }
		});

		/**
		 * Increases the total number of erased mikans.
		 *
		 * Notifies 'mikansErased' to observers unless `count` is 0.
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
				erasedMikanCount += count;
				self.notifyObservers('mikansErased', self, count);
			}
		};

		/**
		 * Increases the total number of erased preservatives.
		 *
		 * Notifies 'preservativesErased' to observers unless `count` is 0.
		 *
		 * Throws an exception if `count` is not a number.
		 *
		 * @method addErasedPreservatives
		 * @param count {number}
		 *     The number to be added to the erased preservative count.
		 */
		self.addErasedPreservatives = function (count) {
			if (typeof count !== 'number') {
				throw 'count must be a number';
			}
			if (count != 0) {
				erasedPreservativeCount += count;
				self.notifyObservers('preservativesErased', self, count);
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
			++comboLength;
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
			comboLength = 0;
			self.notifyObservers('comboUpdated', self);
		};

		/**
		 * Resets this `Statistics`.
		 *
		 * Resets the following properties to 0,
		 *  - `level`
		 *  - `score`
		 *  - `erasedMikanCount`
		 *  - `erasedPreservativeCount`
		 *  - `comboLength`
		 *
		 * Notifies `statisticsReset` to observers.
		 *
		 * @method reset
		 */
		self.reset = function () {
			level                   = 0;
			score                   = 0;
			erasedMikanCount        = 0;
			erasedPreservativeCount = 0;
			comboLength             = 0;
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
	 *     - level:                   number
	 *     - score:                   number
	 *     - erasedMikanCount:        number
	 *     - erasedPreservativeCount: number
	 *     - comboLength:             number
	 *     - addErasedMikans:         function
	 *     - addErasedPreservatives:  function
	 *     - addCombo:                function
	 *     - resetCombo:              function
	 *     - reset:                   function
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
			&& typeof obj.level                   === 'number'
			&& typeof obj.score                   === 'number'
			&& typeof obj.erasedMikanCount        === 'number'
			&& typeof obj.erasedPreservativeCount === 'number'
			&& typeof obj.comboLength             === 'number'
			&& typeof obj.addErasedMikans         === 'function'
			&& typeof obj.addErasedPreservatives  === 'function'
			&& typeof obj.addCombo                === 'function'
			&& typeof obj.resetCombo              === 'function'
			&& typeof obj.reset                   === 'function';
	};

	return Statistics;
})();
