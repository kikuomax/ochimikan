/**
 * Score.
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
		 * Resets this `Score`.
		 *
		 * Sets `score` to 0.
		 *
		 * Notifies "scoreReset" to the observers.
		 *
		 * @method reset
		 */
		self.reset = function () {
			self.score = 0;
			self.notifyObservers('scoreReset', self);
		};

		/**
		 * Adds score to this `Score`.
		 *
		 * Notifies "scoreUpdated" to the observers unless `amount` is 0.
		 *
		 * @method addScore
		 * @param amount {number}
		 *     The number to be added to this `Score`.
		 */
		self.addScore = function (amount) {
			if (amount !== 0) {
				var oldScore = self.score;
				self.score += amount;
				self.notifyObservers('scoreUpdated', self,
									 oldScore, self.score);
			}
		};
	}
	Observable.augment(Score.prototype);

	/**
	 * Returns whether a specified object is a `Score`.
	 *
	 * A `Score` must satisfy all of the following conditions,
	 *  - is an `Observable`
	 *  - has all of the following properties,
	 *     - score:    number
	 *     - addScore: function
	 *     - reset:    function
	 *
	 * @method isClassOf
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whetehr `obj` is a `Score`. `false` if `obj` is not specified.
	 */
	Score.isClassOf = function (obj) {
		return Observable.isClassOf(obj)
			&& typeof obj.score === 'number'
			&& typeof obj.reset === 'function'
			&& typeof obj.addScore === 'function';
	};

	return Score;
})();
