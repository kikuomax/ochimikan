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
		var preservativeProbability;
		var maxDamageRatio;
		statistics.addObserver(function (id) {
			switch (id) {
			case 'mikanErased':
				// updates the score and level
				var numErased = arguments[2];
				var level = statistics.level;
				statistics.score +=
					(numErased + level) * comboFactorOf(statistics.comboLength);
				while (numErased > toNextLevel) {
					numErased -= toNextLevel;
					++level;
					toNextLevel = 20;
				}
				toNextLevel -= numErased;
				statistics.level = level;
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
			toNextLevel = 20;
			updateParameters();
		}
		function updateParameters() {
			var level = statistics.level;
			speed = Math.min(2 + level / 4, 15);
			preservativeProbability =
				Math.max(0, Math.min((level - 4) / 20, 0.1));
			maxDamageRatio = Math.max(1, 5 - (level / 10));
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
		 * @type number
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
			if (Math.random() < preservativeProbability) {
				item = new Preservative();
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
			return 10 * Math.round(Math.pow(2, comboLength));
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
			&& typeof obj.nextItem === 'number';
	};

	return Difficulty;
})();
