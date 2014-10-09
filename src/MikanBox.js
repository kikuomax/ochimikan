/**
 * A mikan box.
 *
 * No items are placed initially.
 *
 * NOTE: (column, row)=(0, 0) comes to the bottom-left in the screen
 *       coordinate and (column, row)=(columnCount-1, rowCount-1) comes to
 *       the top-right in the screen coordinate. Rows from `rowCount` to
 *       `rowCount + rowMargin - 1` are not visible in the screen.
 *
 * Throws an exception,
 *  - if `columnCount` is not a number
 *  - or if `rowCount` is not a number
 *  - or if `rowMargin` is not a number
 *  - or if `cellSize` is not a number
 *  - or if `statistics` is not a `Statistics`
 *  - or if `columnCount` <= 0
 *  - or if `rowCount` <= 0
 *  - or if `rowMargin` < 0
 *  - or if `cellSize` <= 0
 *
 * ## Scenarios
 *
 * ### Placing, Dropping and Erasing items
 *
 *  1. A `MikanBox` is given.
 *  2. A user places a `Mikan` or `Preservative` somewhere in the `MikanBox`.
 *  3. The user asks the `MikanBox` to `scheduleToDrop` items in it.
 *  4. The user asks the `MikanBox` to `scheduleToErase` items in it.
 *
 * @class MikanBox
 * @constructor
 * @uses Renderable
 * @param columnCount {number}
 *     The number of columns in the mikan box.
 * @param rowCount {number}
 *     The number of rows in the mikan box.
 * @param rowMargin {number}
 *     The number of extra rows which store items stacked above the mikan box.
 * @param cellSize {number}
 *     The size (in pixels) of each cell in the mikan box.
 * @param statistics {Statistics}
 *     The `Statistics` of the game.
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
		norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
		return [ v[0] / norm, v[1] / norm ]
	});

	// a marker for a mikan in a chain
	var MARKER_CHAIN = 1;

	// a marker for an item to be spoiled
	var MARKER_SPOIL = 2;

	// the speed of falling mikan
	var FALLING_SPEED = 20;

	// constructor
	function MikanBox(columnCount, rowCount, rowMargin, cellSize, statistics) {
		var self = this;

		// verifies arguments
		if (typeof columnCount !== 'number') {
			throw 'columnCount must be a number';
		}
		if (typeof rowCount !== 'number') {
			throw 'rowCount must be a number';
		}
		if (typeof rowMargin !== 'number') {
			throw 'rowMargin must be a number';
		}
		if (typeof cellSize !== 'number') {
			throw 'cellSize must be a number';
		}
		if (columnCount <= 0) {
			throw 'columnCount must be > 0 but ' + columnCount;
		}
		if (rowCount <= 0) {
			throw 'rowCount must be > 0 but ' + rowCount;
		}
		if (rowMargin < 0) {
			throw 'rowMargin must be >= 0 but ' + rowMargin;
		}
		if (cellSize <= 0) {
			throw 'cellSize must be > 0 but ' + cellSize;
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}

		// floors the parameters
		columnCount = Math.floor(columnCount);
		rowCount    = Math.floor(rowCount);
		cellSize    = Math.floor(cellSize);

		// creates the cells where items are placed
		var maxRowCount = rowCount + rowMargin;
		var cells = new Array(columnCount * maxRowCount);
		for (var i = 0; i < cells.length; ++i) {
			cells[i] = null;
		}

		/**
		 * Renders this `MikanBox`.
		 *
		 * Renders visible items in this mikan box.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this mikan box is rendered.
		 */
		Renderable.call(self, function (context) {
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < rowCount; ++r) {
					var item = cells[indexOf(c, r)];
					if (item) {
						item.render(context);
					}
				}
			}
		});

		/**
		 * The number of columns in this `MikanBox`.
		 *
		 * @property columnCount
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'columnCount', { value: columnCount });

		/**
		 * The number of rows in this `MikanBox`.
		 *
		 * @property rowCount
		 * @type {number}
		 */
		Object.defineProperty(self, 'rowCount', { value: rowCount });

		/**
		 * The number of extra rows which stack items above this `MikanBox`.
		 *
		 * @property rowMargin
		 * @type {number}
		 */
		Object.defineProperty(self, 'rowMargin', { value: rowMargin });

		/**
		 * The size (in pixels) of each cell in this `MikanBox`.
		 *
		 * @property cellSize
		 * @type {number}
		 */
		Object.defineProperty(self, 'cellSize', { value: cellSize });

		/**
		 * The width (in pixels) of this `MikanBox`.
		 *
		 * @property width
		 * @type {number}
		 */
		Object.defineProperty(self, 'width', { value: columnCount * cellSize });

		/**
		 * The height (in pixels) of this `MikanBox`.
		 *
		 * @property height
		 * @type {number}
		 */
		Object.defineProperty(self, 'height', { value: rowCount * cellSize });

		/**
		 * The `Statistics` associated with this `MikanBox`.
		 *
		 * @property statistics
		 * @type {Statistics}
		 */
		Object.defineProperty(self, 'statistics', { value: statistics });

		/**
		 * Returns the column which includes a specified x-coordinate value.
		 *
		 * @method columnAt
		 * @param x {number}
		 *     The x-coordinate value included in the requested column.
		 * @return {number}
		 *     The column which includes `x`.
		 *     This number can be less than 0, or equal to or greater than
		 *     the number of columns in this `MikanBox`.
		 */
		self.columnAt = function (x) {
			return Math.floor(x / cellSize);
		};

		/**
		 * Returns the row which includes a specified y-coordinate value.
		 *
		 * @method rowAt
		 * @param y {number}
		 *     The y-coordinate value included in the requested row.
		 * @retrun {number}
		 *     The row which includes `y`.
		 *     This number can be less than 0, or equal to or greater than
		 *     the number of rows in this `MikanBox`.
		 */
		self.rowAt = function (y) {
			return Math.floor((self.height - y - 1) / cellSize);
		};

		/**
		 * Returns the item in the specified cell in this `MikanBox`.
		 *
		 * Throws an exception
		 *  - if `column` < 0 or `column` >= `columnCount`
		 *  - or if `row` < 0 or `row` >= `rowCount + rowMargin`
		 *
		 * @method itemIn
		 * @param column {number}
		 *     The column of the cell from which an item is to be obtained.
		 * @param row {number}
		 *     The row of the cell from which an item is to be obtained.
		 * @return {Mikan}
		 *     The item at (`column`, `row`). `null` if no item is in
		 *     the cell.
		 */
		self.itemIn = function (column, row) {
			checkCell(column, row);
			return cells[indexOf(column, row)];
		};

		/**
		 * Places a specified item in a specified cell of this `MikanBox`.
		 *
		 * If `align` if true, the location of `item` is arranged so that
		 * its top-left corner comes to the top-left corner of the specified
		 * cell in a screen.
		 *
		 * Throws an exception
		 *  - if `item` is not an `Item`
		 *  - or if `column < 0` or `column >= columnCount`
		 *  - or if `row < 0` or `row >= rowCount + rowMargin`
		 *  - or if other item is already in the cell (`column`, `row`)
		 *
		 * @method place
		 * @param item {Item}
		 *     The item to be placed.
		 * @param column {number}
		 *     The column of the cell in which `item` is to be placed.
		 * @param row {number}
		 *     The row of the cell in which `item` is to be placed.
		 * @param align {boolean}
		 *     Whether the location of `item` is to be aligned to the cell.
		 */
		self.place = function (item, column, row, align) {
			if (item.typeId == null) {
				throw 'item must be a Item';
			}
			checkCell(column, row);
			// makes sure that the cell is vacant
			var idx = indexOf(column ,row);
			if (cells[idx] != null) {
				throw 'cell [' + column + ', ' + row + '] is not vacant';
			}
			if (align) {
				item.locate(self.leftXOf(column), self.topYOf(row));
			}
			cells[idx] = item;
		};

		/**
		 * Schedules to drop items in this mikan box.
		 *
		 * Schedules an `Actor` which does the followings,
		 *
		 *  1. For each item in this mikan box, which isn't placed on
		 *     the ground,
		 *      1. Releases the item from this mikan box.
		 *      2. Makes the item an actor which moves toward the ground
		 *         (ActorPriorities.FALL).
		 *      3. Schedules the item in `scheduler`.
		 *
		 * A falling item reschedules itself until it reaches the ground or
		 * a fixed item.
		 *
		 * @method scheduleToDrop
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the actor is to be scheduled.
		 */
		self.scheduleToDrop = function (scheduler) {
			var dropper = new Actor(ActorPriorities.DROP, function (scheduler) {
				for (var c = 0; c < columnCount; ++c) {
					var height = 0;
					for (var r = 0; r < maxRowCount; ++r) {
						var idx = indexOf(c, r);
						var item = cells[idx];
						if (item != null) {
							// moves the item toward the ground
							// if it's not on the ground
							if (r > height) {
								scheduler.schedule(makeFall(item, height));
								cells[idx] = null;
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
		 * Schedules an `Actor` which has `ActorPriorities.ERASE` and does
		 * the followings,
		 *  1. Collects chained mikans.
		 *  2. For each mikan chain
		 *      1. Erases mikans composing the chain.
		 *      2. Creates sprays spreading from the chained mikans and
		 *         schedules them in `scheduler`.
		 *  3. Schedules an actor which spoils items surrounding the chained
		 *     mikans (ActorPriorities.SPOIL). The actor also spoils
		 *     preservatives which prevent mikans to be spoiled, and erases
		 *     maximally damaged preservatives.
		 *  4. Schedules an actor which drops items toward the ground
		 *     (ActorPriorities.DROP).
		 *  5. Schedules itself again.
		 *
		 * If no mikans are chained, the `Actor` will stop; i.e., does not
		 * reschedule itself.
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
					var numErased = 0;
					chains.forEach(function (chain) {
						chain.forEach(function (loc) {
							cells[indexOf(loc[0], loc[1])] = null;
							++numErased;
						});
					});
					statistics.addCombo();
					statistics.addErasedMikans(numErased);
					// sprays
					self.scheduleSprays(chains, scheduler);
					// schedules to spoil items
					self.scheduleToSpoil(chains, scheduler);
					// schedules to drop items
					self.scheduleToDrop(scheduler);
					// schedules itself again
					scheduler.schedule(this);
				} else {
					statistics.resetCombo();
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
			var chainCells = new Array(columnCount * maxRowCount);
			var chains = [];
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < maxRowCount; ++r) {
					// starts chaining from a maximally damaged mikan
					// but avoids chaining already chained mikans
					var idx = indexOf(c, r);
					if (isMaxDamagedMikan(cells[idx])) {
						if (chainCells[idx] == null) {
							// creates a new chain
							var chain = [[c, r]];
							chainCells[idx] = chain;
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
								if (isValidCell(c2, r2)) {
									var idx2 = indexOf(c2, r2);
									if (isMaxDamagedMikan(cells[idx2])) {
										if (chainCells[idx2] == null) {
											chain.push([c2, r2]);
											chainCells[idx2] = chain;
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
		 * @method scheduleSprays
		 * @param chains {Array}
		 *     The array of chains from which sprays spread.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which `Spray`s are to be scheduled.
		 */
		self.scheduleSprays = function (chains, scheduler) {
			chains.forEach(function (c) {
				c.forEach(function (loc) {
					VELOCITIES.forEach(function (v) {
						var move = Spray.moveLinear(v[0] * 1.5, v[1] * 1.5);
						scheduler.schedule(new Spray(self.leftXOf(loc[0]),
													 self.topYOf(loc[1]),
													 15,
													 move));
					});
				});
			});
		};

		/**
		 * Schedules to spoil items surrounding specified mikan chains.
		 *
		 * Determines which mikans and preservatives are to be spoiled,
		 * and then schedules the following `Actor`s,
		 *  1. An `Actor` which has `ActorPriorities.ABSORB` and creates
		 *     `Spray`s being absorbed into items to be spoiled.
		 *  2. An `Actor` which has `ActorPriorities.SPOIL` and spoils mikans
		 *     and preservatives. It also erases maximally damaged
		 *     preservatives.
		 *
		 * @method scheduleToSpoil
		 * @private
		 * @param chains {array}
		 *     The array of chains whose surrounding mikans are to be spoiled.
		 *     Each element is an array of [column, row] locations.
		 * @param scheduler {ActorScheduler}
		 *     The `ActorScheduler` in which the actor is to be scheduled.
		 */
		self.scheduleToSpoil = function (chains, scheduler) {
			// marks cells
			var cellMarkers = new Array(columnCount * maxRowCount);
			self.markSpoilingTargets(chains, cellMarkers);
			self.markAbsorbers(cellMarkers);
			// absorbs sprays
			var absorber =
				new Actor(ActorPriorities.ABSORB, function (scheduler) {
					for (var c = 0; c < columnCount; ++c) {
						for (var r = 0; r < maxRowCount; ++r) {
							var idx = indexOf(c, r);
							if (cellMarkers[idx] == MARKER_SPOIL) {
								var x = self.leftXOf(c);
								var y = self.topYOf(r);
								for (var i = 0; i < 4; ++i) {
									var angle = i * Math.PI / 2;
									var move = (function (x, y, angle) {
										return function () {
											angle += Math.PI / 30;
											var r = 1.5 * this.ttl
											this.x = x + r * Math.cos(angle);
											this.y = y + r * Math.sin(angle);
										};
									})(x, y, angle);
									var x2 = x + 15 * Math.cos(angle);
									var y2 = y + 15 * Math.sin(angle);
									var spray = new Spray(x2, y2, 10, move);
									scheduler.schedule(spray);
								}
							}
						}
					}
				});
			scheduler.schedule(absorber);
			// spoils items
			var spoiler =
				new Actor(ActorPriorities.SPOIL, function (scheduler) {
					var erasedPreservativeCount = 0;
					for (var c = 0; c < columnCount; ++c) {
						for (var r = 0; r < maxRowCount; ++r) {
							var idx = indexOf(c, r);
							if (cellMarkers[idx] == MARKER_SPOIL) {
								var item = cells[idx];
								item.spoil();
								if (item.typeId == Item.TYPE_PRESERVATIVE
									&& Item.isMaxDamaged(item))
								{
									++erasedPreservativeCount;
									// destroys the preservative after
									// few frames
									(function (item, ttl) {
										Actor.call(item, ActorPriorities.SPOIL, function (scheduler) {
											--ttl;
											if (ttl > 0) {
												scheduler.schedule(this);
											} else {
												for (var i = 0; i < 3; ++i) {
													var x2 = this.x + Math.random(5) - 2;
													var y2 = this.y + Math.random(5) - 2;
													var spray = new Spray(x2, y2, 5, Spray.moveLinear(0, -1.5));
													scheduler.schedule(spray);
												}

											}

										});
										scheduler.schedule(item);
									})(cells[idx], 3);
									cells[idx] = null;
								}
							}
						}
					}
					// updates the statistics when preservatives have
					// disappeared
					if (erasedPreservativeCount > 0) {
						var timer = (function (ttl) {
							return new Actor(
								ActorPriorities.SPOIL, function (scheduler) {
									--ttl;
									if (ttl > 0) {
										scheduler.schedule(this);
									} else {
										statistics.addErasedPreservatives(erasedPreservativeCount);
									}
								}
							);
						})(3);
						scheduler.schedule(timer);
					}
				});
			scheduler.schedule(spoiler);
		};

		/**
		 * Marks items to be spoiled.
		 *
		 * `cellMarkers` will be modified like the followings,
		 *  - Mikans in `chains` are as `MARKER_CHAIN`.
		 *  - Items to be spoiled as `MARKER_SPOIL`.
		 *
		 * Other cells are retained.
		 *
		 * NOTE: this function does not mark preservatives which prevent mikans
		 *       from being spoiled.
		 *
		 * @method markSpoilingTargets
		 * @private
		 * @param chains {array}
		 *     An array of mikan chains.
		 * @param cellMarkers {array}
		 *     An array similar to `cells`, in which markers are to be stored.
		 */
		self.markSpoilingTargets = function (chains, cellMarkers) {
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					cellMarkers[indexOf(loc[0], loc[1])] = MARKER_CHAIN;
				});
			});
			chains.forEach(function (chain) {
				chain.forEach(function (loc) {
					SURROUNDINGS.forEach(function (d) {
						var column = loc[0] + d[0];
						var row    = loc[1] + d[1];
						if (isValidCell(column, row)) {
							var idx = indexOf(column, row);
							var item = cells[idx];
							if (cellMarkers[idx] !== MARKER_CHAIN && item) {
								cellMarkers[idx] = MARKER_SPOIL;
							}
						}
					});
				});
			});
		};

		/**
		 * Marks preservatives which prevent mikans from being spoiled.
		 *
		 * Also clears markers, marks as 0, for mikans which are prevented from
		 * being spoiled.
		 *
		 * @method markAbsorbers
		 * @private
		 * @param cellMarkers {array}
		 *     An array similar to `cells`, which records markers.
		 */
		self.markAbsorbers = function (cellMarkers) {
			for (var c = 0; c < columnCount; ++c) {
				for (var r = 0; r < maxRowCount; ++r) {
					var idx = indexOf(c, r);
					if (cellMarkers[idx] == MARKER_SPOIL
					    && cells[idx].typeId == Item.TYPE_MIKAN)
					{
						SURROUNDINGS.forEach(function (d) {
							var c2 = c + d[0];
							var r2 = r + d[1];
							if (isValidCell(c2, r2)) {
								var idx2 = indexOf(c2, r2);
								var item = cells[idx2];
								if (item
									&& item.typeId == Item.TYPE_PRESERVATIVE)
								{
									cellMarkers[idx2] = MARKER_SPOIL;
									cellMarkers[idx]  = 0;
								}
							}
						});
					}
				}
			}
		};

		/**
		 * Returns the index of the specified cell.
		 *
		 * @method indexOf
		 * @private
		 * @param column {number}
		 *     The column of the cell.
		 * @param row {number}
		 *     The row of the cell.
		 * @return {number}
		 *     The index of the cell (`column`, `row`).
		 */
		function indexOf(column, row) {
			return row + (column * maxRowCount);
		}

		/**
		 * Returns whether the specified column and row are valid.
		 *
		 * A valid cell is
		 *  - 0 <= `column` < `columnCount`
		 *  - 0 <= `row` < `maxRowCount`
		 *
		 * @method isValidCell
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 * @return {boolean}
		 *     Whether (`column`, `row`) is a valid cell.
		 */
		function isValidCell(column, row) {
			return column >= 0 && column < columnCount
				&& row >= 0 && row < maxRowCount;
		}

		/**
		 * Checks if the specified column and row are valid.
		 *
		 * Throws an exception
		 *  - if `column` < 0 or `column` >= `columnCount`
		 *  - or if `row` < 0 or `row` >= `maxRowCount`
		 *
		 * @method checkCell
		 * @private
		 * @param column {number}
		 *     The column to be tested.
		 * @param row {number}
		 *     The row to be tested.
		 */
		function checkCell(column, row) {
			if (column < 0 || column >= columnCount) {
				throw "column must be in [0, "
					+ (columnCount - 1) + "] but " + column;
			}
			if (row < 0 || row >= maxRowCount) {
				throw "row must be in [0, "
					+ (maxRowCount - 1) + "] but " + row;
			}
		}

		/**
		 * Returns the x-coordinate value of the left edge of a specified
		 * column.
		 *
		 * @method leftXOf
		 * @param column {number}
		 *     The column to be converted.
		 * @return {number}
		 *     The the x-coordinate value of the left edge of `column`.
		 */
		self.leftXOf = function (column) {
			return column * cellSize;
		};

		/**
		 * Returns the y-coordinate value of the top edge of a specified row.
		 *
		 * @method topYOf
		 * @param row {number}
		 *     The row to be converted.
		 * @return {number}
		 *     The the y-coordinate value of the top edge of `row`.
		 */
		self.topYOf = function (row) {
			return (rowCount - row - 1) * cellSize;
		}

		/**
		 * Returns whether the specified item is a maximally damaged mikan.
		 *
		 * @method isMaxDamagedMikan
		 * @private
		 * @param item {Item}
		 *     The item to be tested.
		 * @return {boolean}
		 *     Whether `item` is a `Mikan` and maximally damaged.
		 *     `false` if `item` is not specified.
		 */
		function isMaxDamagedMikan(item) {
			return item
				&& item.typeId == Item.TYPE_MIKAN
				&& Item.isMaxDamaged(item);
		}

		/**
		 * Makes a specified item fall to a specified row.
		 *
		 * @method makeFall
		 * @param item {Item}
		 *     The item to fall.
		 * @param dstRow {number}
		 *     The destination row of the falling item.
		 * @return {Item, Actor}
		 *     `item` as an Actor.
		 */
		function makeFall(item, dstRow) {
			Actor.call(item, ActorPriorities.FALL, function (scheduler) {
				var bottom = item.y + FALLING_SPEED + cellSize - 1;
				var bottomRow = self.rowAt(bottom);
				if (bottomRow >= dstRow) {
					item.y += FALLING_SPEED;
					scheduler.schedule(item);
				} else {
					self.place(item, self.columnAt(item.x), dstRow, true);
				}
			});
			return item;
		}
	}

	/**
	 * The minimum length of a chain.
	 *
	 *     CHAIN_LENGTH = 4
	 *
	 * @property CHAIN_LENGTH
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MikanBox, 'CHAIN_LENGTH', { value: 4 });

	return MikanBox;
})();
