/**
 * Score.
 *
 * Everytime mikans are erased, the score increases. And the amount of increase
 * is calculated by the following expression,
 *
 *     m * Score.getComboScore(c)
 *
 *     m: number of erased mikans
 *     c: number of combos
 *
 * Event
 * =====
 *
 * A `Score` notifies observers an event when it is changed.
 * An observer function is invoked with the following arguments.
 *  1. Event ID (string): An ID which indicates the type of the event.
 *  2. Score (Score):     The updated `Score`.
 *  3. Optional arguments: Optional arguments depending of the event ID.
 *
 * An event ID can be one of the followings,
 *  - "scoreUpdated":
 *    Indicates that the score has been changed.
 *    Takes the following optional arguments,
 *     1. Old score (number): The score value before change.
 *     2. New score (number): The score value after change.
 *  - "scoreReset":
 *    Indicates that the score has been reset. Takes no optional arguments.
 *
 * @class Score
 * @constructor
 * @extends Observable
 */
Score = (function () {
	function Score() {
		var self = this;

		Observable.call(this);

		/**
		 * The score value of this `Score`.
		 *
		 * Initially 0.
		 *
		 * @property score
		 * @type {number}
		 */
		self.score = 0;

		/**
		 * The total number of erased mikans.
		 *
		 * Initially 0.
		 *
		 * @property erasedMikanCount
		 * @type {number}
		 */
		self.erasedMikanCount = 0;

		/**
		 * The number of combos.
		 *
		 * Initially 0.
		 *
		 * @property comboCount
		 * @type {number}
		 */
		self.comboCount = 0;

		/**
		 * Resets this `Score`.
		 *
		 * Resets the following properties to 0,
		 *  - score
		 *  - erasedMikanCount
		 *  - comboCount
		 *
		 * Notifies "scoreReset" to the observers.
		 *
		 * @method reset
		 */
		self.reset = function () {
			self.score            = 0;
			self.erasedMikanCount = 0;
			self.comboCount       = 0;
			self.notifyObservers('scoreReset', self);
		};

		/**
		 * Adds the number of erased mikans.
		 *
		 * Increases the score and notifies "scoreUpdated" to the observers
		 * unless `count` is 0.
		 *
		 * @method addErasedMikans
		 * @param count {number}
		 *     The number of erased mikans to be added.
		 */
		self.addErasedMikans = function (count) {
			if (count != 0) {
				self.erasedMikanCount += count;
				var oldScore = self.score;
				self.score += count * Score.getComboScore(self.comboCount);
				self.notifyObservers('scoreUpdated', self,
									 oldScore, self.score);
			}
		};

		/**
		 * Increments the number of combos.
		 *
		 * @method addCombo
		 */
		self.addCombo = function () {
			++self.comboCount;
		};

		/**
		 * Resets the number of combos to 0.
		 *
		 * @method resetCombo
		 */
		self.resetCombo = function () {
			self.comboCount = 0;
		};
	}
	Observable.augment(Score.prototype);

	/**
	 * Returns whether a specified object is a `Score`.
	 *
	 * A `Score` must satisfy all of the following conditions,
	 *  - is an `Observable`
	 *  - has all of the following properties,
	 *     - score:            number
	 *     - erasedMikanCount: number
	 *     - comboCount:       number
	 *     - reset:            function
	 *     - addErasedMikans:  function
	 *     - addCombo:         function
	 *     - resetCombo:       function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whetehr `obj` is a `Score`. `false` if `obj` is not specified.
	 */
	Score.isClassOf = function (obj) {
		return Observable.isClassOf(obj)
			&& typeof obj.score            === 'number'
			&& typeof obj.erasedMikanCount === 'number'
			&& typeof obj.comboCount       === 'number'
			&& typeof obj.reset            === 'function'
			&& typeof obj.addErasedMikans  === 'function'
			&& typeof obj.addCombo         === 'function'
			&& typeof obj.resetCombo       === 'function';
	};

	/**
	 * Returns the score for each of erased mikans at a specified combo count.
	 *
	 * The score is calculated by the following expression by default,
	 *
	 *     Math.round(10 * Math.pow(1.6, comboCount))
	 *
	 * @method getComboScore
	 * @static
	 * @param comboCount {number}
	 *     The number of combos.
	 * @return {number}
	 *     The score for each of erased mikans at the current combo.
	 */
	Score.getComboScore = function (comboCount) {
		return Math.round(10 * Math.pow(1.6, comboCount));
	};

	return Score;
})();
