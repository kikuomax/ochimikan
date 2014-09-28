/**
 * Score.
 *
 * Everytime mikans are erased, the score increases. And the amount of increase
 * is calculated by the following expression,
 *
 *     m * Score.getComboScore(c)
 *
 *     m: number of mikans erased at that time
 *     c: current combo length (= statistics.comboLength)
 *
 * A `Score` is always driven by a `Statistics` associated with it.
 *
 * Throws an exception if `statistics` is not a `Statistics`.
 *
 * Events
 * ======
 *
 * A `Score` notifies observers an event when it is changed.
 * An observer function is invoked with the following arguments.
 *  1. Event ID (string): An ID which indicates the type of the event.
 *  2. Score (Score):     The updated `Score`.
 *
 * An event ID can be one of the followings,
 *  - "scoreUpdated": Indicates that the score has been updated.
 *  - "scoreReset":   Indicates that the score has been reset.
 *
 * @class Score
 * @constructor
 * @extends Observable
 * @param statistics {Statistics}
 *    The statistics from which score is to be calculated. 
 */
Score = (function () {
	function Score(statistics) {
		var self = this;

		Observable.call(this);

		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}

		statistics.addObserver(function (id) {
			switch (id) {
			case 'mikanErased':
				var count = arguments[2];
				_score += count * Score.getComboFactor(statistics.comboLength);
				self.notifyObservers('scoreUpdated', self);
				break;
			case 'statisticsReset':
				_score = 0;
				self.notifyObservers('scoreReset', self);
				break;
			}
		});

		/**
		 * The score value of this `Score`.
		 *
		 * Initially 0.
		 *
		 * @property score
		 * @type {number}
		 */
		var _score = 0;
		Object.defineProperty(self, 'score', {
			get: function () { return _score }
		});
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
	 * Returns the factor for each of erased mikans at a specified combo length.
	 *
	 * The factor is calculated by the following expression,
	 *
	 *     Math.round(10 * Math.pow(1.6, comboLength))
	 *
	 * @method getComboFactor
	 * @static
	 * @param comboLength {number}
	 *     The length of the combo.
	 * @return {number}
	 *     The factor for each of erased mikans at the specified combo length.
	 */
	Score.getComboFactor = function (comboLength) {
		return Math.round(10 * Math.pow(1.6, comboLength));
	};

	return Score;
})();
