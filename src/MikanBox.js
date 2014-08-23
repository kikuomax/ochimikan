/**
 * A mikan box.
 *
 * No mikans are placed initially.
 *
 * NOTE: (column, row)=(0, 0) comes to the bottom-left in the screen
 *       coordinate and (column, row)=(columnCount-1, rowCount-1) comes to
 *       the top-right in the screen coordinate.
 *
 * Throws an exception,
 *  - if `columnCount` is not a number
 *  - or if `rowCount` is not a number
 *  - or if `squareSize` is not a number
 *  - or if `rowMargin` is not a number
 *  - or if `columnCount` <= 0
 *  - or if `rowCount` <= 0
 *  - or if `squareSize` <= 0
 *  - or if `rowMargin` < 0
 *
 * ## Scenarios
 *
 * ### Placing, Dropping and Erasing mikans
 *
 *  1. A `MikanBox` is given.
 *  2. A user places a `Mikan` somewhere in the `MikanBox`.
 *  3. The user asks the `MikanBox` to `scheduleToDropMikans` in it.
 *  4. The user asks the `MikanBox` to `scheduleToErase` mikans in it.
 *
 * @class MikanBox
 * @constructor
 * @uses Renderable
 * @param columnCount {number}
 *     The number of columns in the mikan box.
 * @param rowCount {number}
 *     The number of rows in the mikan box.
 * @param squareSize {number}
 *     The size (in pixels) of each square in the mikan box.
 * @param rowMargin {number}
 *     The number of extra rows which store mikans stacked above the mikan box.
 */
MikanBox = (function () {
	// a table to access surrounding location.
	var SURROUNDINGS = [
		[-1, -1], [0, -1], [1, -1],
		[-1,  0],          [1,  0],
		[-1,  1], [0,  1], [1,  1]
	];

	// a unit velocities of spreading sprays.
	var VELOCITIES = SURROUNDINGS.map(function (v) {
		norm = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
		return [ v[0]/norm, v[1]/norm ]
	});

	function MikanBox(columnCount, rowCount, squareSize, rowMargin) {
		var self = this;

		// verifies arguments
		if (typeof columnCount !== 'number') {
			throw 'columnCount must be a number';
		}
		if (typeof rowCount !== 'number') {
			throw 'rowCount must be a number';
		}
		if (typeof squareSize !== 'number') {
			throw 'squareSize must be a number';
		}
		if (columnCount <= 0) {
			throw 'columnCount must be > 0 but ' + columnCount;
		}
		if (rowCount <= 0) {
			throw 'rowCount must be > 0 but ' + rowCount;
		}
		if (squareSize <= 0) {
			throw 'squareSize must be > 0 but ' + squareSize;
		}

		// floors the parameters
		columnCount = Math.floor(columnCount);
		rowCount    = Math.floor(rowCount);
		squareSize  = Math.floor(squareSize);

		/**
		 * Renders this mikan box.
		 *
		 * Renders each mikan in this mikan box.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this mikan box is rendered.
		 */
		Renderable.call(self, function (context) {
			mikanGrid.forEach(function (mikan) {
				if (mikan != null) {
					mikan.render(context);
				}
			});
		});

		// creates the grid where mikans are placed
		var mikanGrid = new Array(columnCount * rowCount);
		for (var i = 0; i < mikanGrid.length; ++i) {
			mikanGrid[i] = null;
		}

		/**
		 * The number of columns in this mikan box.
		 *
		 * @property columnCount
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'columnCount', { value: columnCount });

		/**
		 * The number of rows in this mikan box.
		 *
		 * @property rowCount
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'rowCount', { value: rowCount });

		/**
		 * The size (in pixels) of each square in this mikan box.
		 *
		 * @property squareSize
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'squareSize', { value: squareSize });

		/**
		 * The width (in pixels) of this mikan box.
		 *
		 * @property width
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'width', { value: columnCount * squareSize });

		/**
		 * The height (in pixels) of this mikan box.
		 *
		 * @property height
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'height', { value: rowCount * squareSize });

		/**
		 * Returns the row which includes a specified y-coordinate value.
		 *
		 * @method rowAt
		 * @param y {number}
		 *     The y-coordinate value included in the requested row.
		 * @retrun {number}
		 *     The row which includes `y`.
		 *     This number can exceeds the size of this `MikanBox`.
		 */
		self.rowAt = function (y) {
			return Math.floor((self.height - y - 1) / squareSize);
		};

		/**
		 * Returns the column which includes a specified x-coordinate value.
		 *
		 * @method columnAt
		 * @param x {number}
		 *     The x-coordinate value included in the requested column.
		 * @return {number}
		 *     The column which includes `x`.
		 *     This number can exceeds the size of this `MikanBox`.
		 */
		self.columnAt = function (x) {
			return Math.floor(x / squareSize);
		};

		/**
		 * Returns the mikan in the specified square in this mikan box.
		 *
		 * Throws an exception
		 *  - if `column` < 0 or `column` >= `columnCount`
		 *  - or if `row` < 0 or `row` >= `rowCount`
		 *
		 * @method mikanAt
		 * @param column {number}
		 *     The column of the square from which a mikan is to be obtained.
		 * @param row {number}
		 *     The row of the square from which a mikan is to be obtained.
		 * @return {Mikan}
		 *     The mikan at (`column`, `row`). `null` if no mikan is in
		 *     the square.
		 */
		self.mikanAt = function (column, row) {
			checkSquare(column, row);
			return mikanGrid[indexOf(column, row)];
		};

		/**
		 * Places the specified mikan in the specified square in this mikan box.
		 *
		 * The location of `mikan` is arranged so that its top-left corner comes
		 * to the top-left corner of the specified square in a screen.
		 *
		 * Thorows an exception
		 *  - if `column < 0` or `column >= columnCount`
		 *  - or if `row < 0` or `row >= rowCount`
		 *  - or if other mikan is already in the squared (`column`, `row`)
		 *
		 * @method place
		 * @param mikan {Mikan}
		 *     The mikan to be placed.
		 * @param column {number}
		 *     The column of the square in which the mikan is to be placed.
		 * @param row {number}
		 *     The row of the square in which the mikan is to be placed.
		 */
		self.place = function (mikan, column, row) {
			checkSquare(column, row);
			// makes sure that the square is vacant
			var idx = indexOf(column ,row);
			if (mikanGrid[idx] != null) {
				throw "square [" + column + ", " + row + "] isn't vacant";
			}
			mikanGrid[idx] = mikan;
			mikan.locate(xAt(column), yAt(row));
		};

		/**
		 * Schedules to drop mikans in this mikan box.
		 *
		 * Schedules an `Actor` which does the followings,
		 *
		 *  1. For each mikan in this mikan box, which isn't placed on
		 *     the ground,
		 *     1. Releases the mikan from this mikan box.
		 *     2. Makes the mikan an actor which moves toward the ground
		 *        (ActorPriorities.MOVE).
		 *     3. Schedules the mikan in `scheduler`.
		 *
		 * @method scheduleToDrop
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the dropper is to be scheduled.
		 */
		self.scheduleToDrop = function (scheduler) {
			var dropper = new Actor(ActorPriorities.DROP, function (scheduler) {
				for (var c = 0; c < columnCount; ++c) {
					var height = 0;
					for (var r = 0; r < rowCount; ++r) {
						var idx = indexOf(c, r);
						var mikan = mikanGrid[idx];
						if (mikan != null) {
							// moves the mikan toward the ground
							// if it's not on the ground
							if (r > height) {
								scheduler.schedule(makeFall(mikan, height));
								mikanGrid[idx] = null;
							}
							++height;
						}
					}
				}
			});
			scheduler.schedule(dropper);
		};

		/**
		 * Schedules to erase chained mikans in this box.
		 *
		 * Schedules an `Actor` which does the followings,
		 *
		 *  1. Collects chained mikans.
		 *  1. For each mikan chain
		 *     1. Erases mikans composing the chain.
		 *     1. Creates sprays spreading (in 8 directions) from the chained
		 *        mikans and schedules them in `scheduler`.
		 *  1. Schedules an actor which spoils mikans surrounding the chained
		 *     mikans (ActorPriorities.SPOIL).
		 *  1. Schedules an actor which drops mikans (ActorPriorities.DROP).
		 *  1. Schedules itself again.
		 *
		 * If no mikans are chained, the `Actor` will stop.
		 *
		 * @method scheduleToErase
		 * @param scheduler {ActorScheduler}
		 *     The actor scheduler in which actors are to be scheduled.
		 */
		self.scheduleToErase = function (scheduler) {
			var eraser = new Actor(ActorPriorities.ERASE, function (scheduler) {
				// chains mikans
				var chains = self.chainMikans();
				if (chains.length > 0) {
					// erases the mikans in the chains
					chains.forEach(function (chain) {
						chain.forEach(function (loc) {
							mikanGrid[indexOf(loc[0], loc[1])] = null;
						});
					});
					// sprays
					self.createSprays(chains, scheduler);
					// schedules to spoil mikans
					self.scheduleToSpoil(chains, scheduler);
					// schedules to drop mikans
					self.scheduleToDrop(scheduler);
					// schedules itself again
					scheduler.schedule(this);
				}
			});
			scheduler.schedule(eraser);
		};

		/**
		 * Chains mikans in this box.
		 *
		 * A chain is composed of at least `MikanBox.CHAIN_LENGTH`
		 * maximally damaged mikans.
		 *
		 * @method chainMikans
		 * @private
		 * @return {array}
		 *     An array of chains. Each chain comprising an array of
		 *     locations (column, row) of chained mikans.
		 */
		self.chainMikans = function () {
			var chainGrid = new Array(columnCount * rowCount);
			var chains = [];
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < rowCount; ++r) {
					// starts chaining from a maximally damaged mikan
					// but avoids chaining already chained mikans
					var idx = indexOf(c, r);
					if (isMaxDamaged(mikanGrid[idx])) {
						if (chainGrid[idx] == null) {
							// creates a new chain
							var chain = [[c, r]];
							chainGrid[idx] = chain;
							propagate(c, r);
							if (chain.length >= MikanBox.CHAIN_LENGTH) {
								chains.push(chain);
							}
							function propagate (c2, r2) {
								tryToChain(c2 - 1, r2);
								tryToChain(c2 + 1, r2);
								tryToChain(c2, r2 - 1);
								tryToChain(c2, r2 + 1);
							}
							function tryToChain (c2, r2) {
								if (isValidSquare(c2, r2)) {
									var idx2 = indexOf(c2, r2);
									if (isMaxDamaged(mikanGrid[idx2])) {
										if (chainGrid[idx2] == null) {
											chain.push([c2, r2]);
											chainGrid[idx2] = chain;
											propagate(c2, r2);
										}
									}
								}
							}
						}
					}
				}
			}
			return chains;
		};

		/**
		 * Creates and schedules `Spray`s spreading from specified chains.
		 *
		 * Creates and schedules `Spray`s spreading, toward 8 directions,
		 * from each mikan composing `chains`.
		 *
		 * @method createSprays
		 * @param chains {Array}
		 *     The array of chains from which sprays spread.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which `Spray`s are to be scheduled.
		 */
		self.createSprays = function (chains, scheduler) {
			chains.forEach(function (c) {
				c.forEach(function (loc) {
					VELOCITIES.forEach(function (v) {
						scheduler.schedule(new Spray(xAt(loc[0]),
													 yAt(loc[1]),
													 v[0] * 1.5,
													 v[1] * 1.5,
													 15));
					});
				});
			});
		};

		/**
		 * Schedules to spoil mikans surrounding specified chains.
		 *
		 * Schedules an `Actor` which has `ActorPriorities.SPOIL` and spoils
		 * mikans surrounding `chains`.
		 *
		 * @method scheduleToSpoil
		 * @private
		 * @param chains {array}
		 *     The array of chains whose surrounding mikans are to be spoiled.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the spoiler `Actor` is to be
		 *     scheduled.
		 */
		self.scheduleToSpoil = function (chains, scheduler) {
			var targets = self.collectSpoilingTargets(chains);
			var spoiler =
				new Actor(ActorPriorities.SPOIL, function (scheduler) {
					targets.forEach(function (loc) {
						var idx = indexOf(loc[0], loc[1]);
						if (mikanGrid[idx]) {
							mikanGrid[idx].spoil();
						}
					});
				});
			scheduler.schedule(spoiler);
		};

		/**
		 * Collects spoiling targets.
		 *
		 * @method collectSpoilingTargets
		 * @private
		 * @param chains {array}
		 *     The array of chains whose surrounding mikans are to be spoiled.
		 *     Each element is an array of [column, row] locations.
		 * @return {array}
		 *     An array of [column, row] locations to be spoiled.
		 */
		self.collectSpoilingTargets = function (chains) {
			var targets = [];
			var spoilMap = new Array(columnCount * rowCount);
			// avoids spoiling chains
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					spoilMap[indexOf(loc[0], loc[1])] = true;
				});
			});
			// collects surrounding locations
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					SURROUNDINGS.forEach(function (d) {
						var column = loc[0] + d[0];
						var row = loc[1] + d[1];
						if (0 <= column && column < columnCount
							&& 0 <= row && row < rowCount)
						{
							var idx = indexOf(column, row);
							if (!spoilMap[idx]) {
								targets.push([column, row]);
								spoilMap[idx] = true;
							}
						}
					});
				});
			});
			return targets;
		};

		/**
		 * Returns the index of the specified square.
		 *
		 * @method indexOf
		 * @private
		 * @param column {number}
		 *     The column of the square.
		 * @param row {number}
		 *     The row of the square.
		 * @return {number}
		 *     The index of the square (`column`, `row`).
		 */
		function indexOf(column, row) {
			return row + (column * rowCount);
		}

		/**
		 * Returns whether the specified column and row are valid.
		 *
		 * A valid square is
		 *  - 0 <= `column` < `columnCount`
		 *  - 0 <= `row` < `rowCount`
		 *
		 * @method isValidSquare
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 * @return {boolean}
		 *     Whether (`column`, `row`) is a valid square.
		 */
		function isValidSquare(column, row) {
			return column >= 0 && column < columnCount
				&& row >= 0 && row < rowCount;
		}

		/**
		 * Checks if the specified column and row are valid.
		 *
		 * Throws an exception
		 * - if `column` < 0 or `column` >= `columnCount`
		 * - or if `row` < 0 or `row` >= `rowCount`
		 *
		 * @method checkSquare
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 */
		function checkSquare(column, row) {
			if (column < 0 || column >= columnCount) {
				throw "column must be in [0, "
					+ (columnCount - 1) + "] but " + column;
			}
			if (row < 0 || row >= rowCount) {
				throw "row must be in [0, " + (rowCount - 1) + "] but " + row;
			}
		}

		/**
		 * Returns the left location of a specified column.
		 *
		 * @method xAt
		 * @private
		 * @param column {number}
		 *     The column to be converted.
		 * @return {number}
		 *     The left location of the column.
		 */
		function xAt(column) {
			return column * squareSize;
		}

		/**
		 * Returns the top location of a specified row.
		 *
		 * @method yAt
		 * @private
		 * @param row {number}
		 *     The row to be converted.
		 * @return {number}
		 *     The top location of the row.
		 */
		function yAt(row) {
			return (rowCount - row - 1) * squareSize;
		}

		/**
		 * Returns whether the specified mikan is maximally damaged.
		 *
		 * @method isMaxDamaged
		 * @private
		 * @param mikan {Mikan}
		 *     The mikan to be tested.
		 * @return {boolean}
		 *     Whether `mikan` has `damage=Mikan.MAX_DAMAGE`.
		 *     `false` if `mikan` is `null` or `undefined`.
		 */
		function isMaxDamaged(mikan) {
			return mikan != null && mikan.damage == Mikan.MAX_DAMAGE;
		}

		/**
		 * Makes a specified mikan fall to a specified row.
		 *
		 * @method makeFall
		 * @param mikan {Mikan}
		 *     The mikan to fall.
		 * @param dstRow {number}
		 *     The destination row of the falling mikan.
		 * @return {Mikan, Actor}
		 *     `mikan` as an Actor.
		 */
		function makeFall(mikan, dstRow) {
			Actor.call(mikan, ActorPriorities.MOVE, function (scheduler) {
				var bottom = mikan.y + 10 + squareSize - 1;
				var bottomRow = self.rowAt(bottom);
				if (bottomRow >= dstRow) {
					mikan.y += 10;
					scheduler.schedule(mikan);
				} else {
					self.place(mikan, self.columnAt(mikan.x), dstRow);
				}
			});
			return mikan;
		}
	}

	/**
	 * The minimum length of a chain.
	 *
	 * `CHAIN_LENGTH = 4`
	 *
	 * @property CHAIN_LENGTH
	 * @type {number}
	 * @final
	 */
	Object.defineProperty(MikanBox, 'CHAIN_LENGTH', { value: 4 });

	return MikanBox;
})();
