/**
 * The interface which controls the difficulty of the game.
 *
 * The `Difficulty` will update the score of `statistics` when mikans are
 * erased, and increment the level of `statistics` when a certain number of
 * mikans are erased.
 *
 * Throws an exception if `statistics` is not a `Statistics`.
 *
 * @class Difficulty
 * @constructor
 * @param statistics {Statistics}
 *     The `Statistics` from which the difficulty will be determined.
 */
Difficulty = (function () {
	function Difficulty(statistics) {
		var self = this;

		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}

		// updates parameters when `statistics` is updated
		var toNextLevel;
		var speed;
		var preservativeStock;
		var preservativeCount;
		var preservativeProbability;
		var maxDamageRatio;
		statistics.addObserver(function (id) {
			switch (id) {
			case 'mikansErased':
				// updates the score and level
				var numErased = arguments[2];
				var level = statistics.level;
				statistics.score += (numErased + level)
									* Difficulty.MIKAN_SCORE
									* comboFactorOf(statistics.comboLength);
				while (numErased > toNextLevel) {
					numErased -= toNextLevel;
					++level;
					toNextLevel = 20;
				}
				toNextLevel -= numErased;
				statistics.level = level;
				break;
			case 'preservativesErased':
				// updates the score
				var numErased = arguments[2];
				statistics.score += numErased
									* Difficulty.PRESERVATIVE_SCORE
									* comboFactorOf(statistics.comboLength);
				break;
			case 'levelUpdated':
				// updates the difficulty parameters
				updateParameters();
				break;
			case 'statisticsReset':
				// resets parameters
				resetParameters();
				break;
			}
		});
		function resetParameters() {
			toNextLevel       = 20;
			preservativeCount = 0;
			maxDamageRatio    = 2;
			updateParameters();
		}
		function updateParameters() {
			var level = statistics.level;
			speed = Math.min(2 + level / 4, 15);
			preservativeProbability =
				Math.max(0, Math.min((level - 4) / 250, 0.1));
			preservativeStock = Math.floor((level + 1) * (level + 2) / 10);
		}
		resetParameters();

		/**
		 * The falling speed of grabbed items.
		 *
		 * Speed will be calculated by the following expression,
		 *
		 *     2 + statistics.level / 4
		 *
		 * @property speed
		 * @type {number}
		 */
		Object.defineProperty(self, 'speed', {
			get: function () { return speed }
		});

		/**
		 * Returns the next item to fall.
		 *
		 * @method nextItem
		 * @return {Item}
		 *     The next item to fall.
		 */
		self.nextItem = function () {
			var item;
			if (preservativeCount < preservativeStock
				&& Math.random() < preservativeProbability)
			{
				item = new Preservative();
				++preservativeCount;
			} else {
				// the max damage is `maxDamageRatio` times often
				// compared to any other damage
				// in other words, damages other than max have equal chance
				var chance =
					(Mikan.MAX_DAMAGE + maxDamageRatio) * Math.random();
				var damage = 0;
				while (chance >= 1 && damage < Mikan.MAX_DAMAGE) {
					chance -= 1;
					++damage;
				}
				item = new Mikan(damage);
			}
			return item;
		};

		// Returns the score factor of a specified combo length.
		function comboFactorOf(comboLength) {
			return Math.round(Math.pow(2, (comboLength - 1)));
		}
	}

	/**
	 * Returns whether a specified object is a `Difficulty`.
	 *
	 * A `Difficulty` must have all of the following properties,
	 *  - speed:    number
	 *  - nextItem: function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is a `Difficulty`. `false` if `obj` is not specified.
	 */
	Difficulty.isClassOf = function (obj) {
		return obj != null
			&& typeof obj.speed    === 'number'
			&& typeof obj.nextItem === 'function';
	};

	/**
	 * The base score of a single mikan.
	 *
	 * The default value is 10.
	 *
	 * @property MIKAN_SCORE
	 * @type {number}
	 * @static
	 */
	Difficulty.MIKAN_SCORE = 10;

	/**
	 * The base score of a single preservative.
	 *
	 * The default value is 1000.
	 *
	 * @property PRESERVATIVE_SCORE
	 * @type {number}
	 * @static
	 */
	Difficulty.PRESERVATIVE_SCORE = 1000;

	return Difficulty;
})();
