/**
 * A mikan box.
 *
 * No mikans are placed initially.
 *
 * NOTE: (column, row)=(0, 0) will come to the bottom-left in a screen
 * coordinate and (column, row)=(columnCount-1, rowCount-1) will come
 * to the top-right in a screen coordinate.
 *
 * Throws an exception,
 * - if `columnCount` <= 0
 * - or if `rowCount` <= 0
 * - or if `squareSize` <= 0
 *
 * ## Scenarios
 *
 * ### Placing a mikan
 *
 * 1. A `Mikan` is given.
 * 1. A `MikanBox` is given.
 * 1. A user places the `Mikan` somewhere in the `MikanBox`.
 *
 * ### Dropping mikans
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to drop `Mikan`s in it.
 * 1. The `Mikan`s in the `MikanBox` which are not stable fall towards
 *    the ground.
 *
 * ### Erasing mikans
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to chain and erase `Mikan`s in it
 *    which are maximally damaged.
 * 1. The chained `Mikan`s explode with `Spray`s.
 * 1. The explosion spoils surrounding `Mikan`s.
 * 1. Unstable `Mikan`s remaining in the `MikanBox` fall towards the ground.
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
 */
function MikanBox(columnCount, rowCount, squareSize) {
    var self = this;

    // a table to access surrounding location.
    var SURROUNDINGS = [
	[-1, -1], [0, -1], [1, -1],
	[-1,  0],          [1,  0],
	[-1,  1], [0,  1], [1,  1]
    ];
    // a unit velocities of spreading sprays.
    var VELOCITIES = SURROUNDINGS.map(function(v) {
	norm = Math.sqrt(v[0]*v[0] + v[1]*v[1]);
	return [ v[0]/norm, v[1]/norm ]
    });

    // verifies arguments
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
    rowCount = Math.floor(rowCount);
    squareSize = Math.floor(squareSize);

    /**
     * Renders this mikan box.
     *
     * Renders each mikan in this mikan box.
     *
     * @method render
     * @param context {canvas context}
     *     The context in which this mikan box is rendered.
     */
    Renderable.call(self, function(context) {
	mikanGrid.forEach(function(mikan) {
	    if (mikan !== null) {
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
     * Returns the mikan in the specified square in this mikan box.
     *
     * Throws an exception
     * - if `column` < 0 or `column` >= `columnCount`
     * - or if `row` < 0 or `row` >= `rowCount`
     *
     * @method mikanAt
     * @param column {number}
     *     The column of the square from which a mikan is to be obtained.
     * @param row {number}
     *     The row of the square from which a mikan is to be obtained.
     * @return {Mikan}
     *     The mikan at (`column`, `row`). `null` if no mikan is in the square.
     */
    self.mikanAt = function(column, row) {
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
     * - if `column < 0` or `column >= columnCount`
     * - or if `row < 0` or `row >= rowCount`
     * - or if other mikan is already in the squared (`column`, `row`)
     *
     * @method place
     * @param mikan {Mikan}
     *     The mikan to be placed.
     * @param column {number}
     *     The column of the square in which the mikan is to be placed.
     * @param row {number}
     *     The row of the square in which the mikan is to be placed.
     */
    self.place = function(mikan, column, row) {
	checkSquare(column, row);
	// makes sure that the square is vacant
	var idx = indexOf(column ,row);
	if (mikanGrid[idx] != null) {
	    throw "square [" + column + ", " + row + "] isn't vacant";
	}
	mikanGrid[idx] = mikan;
	mikan.locate(columnToX(column), rowToY(row));
    };

    /**
     * Drops mikans in this mikan box.
     *
     * For each mikan in this mikan box which isn't placed on the ground,
     * 1. Releases the mikan from this mikan box.
     * 1. Makes the mikan an actor which moves toward the ground
     *    (ActorPriorities.MOVE).
     * 1. Schedules the mikan in `scheduler`.
     * 
     * @method dropMikans
     * @param scheduler {ActorScheduler}
     *     The actor scheduler in which actors are to be scheduled.
     */
    self.dropMikans = function(scheduler) {
	for (var c = 0; c < columnCount; ++c) {
	    var height = 0;
	    for (var r = 0; r < rowCount; ++r) {
		var idx = indexOf(c, r);
		var mikan = mikanGrid[idx];
		if (mikan != null) {
		    // moves the mikan toward the ground
		    // if it's not on the ground
		    if (r > height) {
			Actor.call(mikan, ActorPriorities.MOVE, function(scheduler) {
			});
			scheduler.schedule(mikan);
			mikanGrid[idx] = null;
		    }
		    ++height;
		}
	    }
	}
    };

    /**
     * Erases chained mikans in this box.
     *
     * ## Behavior
     *
     * 1. Collects chained mikans.
     * 1. For each mikan chain
     *    1. Erases mikans composing the chain.
     *    1. Creates sprays spreading (in 8 directions) from the chained mikans
     *       and schedules them in `scheduler`.
     * 1. Creates an actor which spoils mikans surrounding the chained mikans
     *    and schedules it in `scheduler` (ActorPriorities.SPOIL).
     * 1. Creates an actor which drops mikans and schedules it in `scheduler`
     *    (ActorPriorities.DROP).
     *
     * @method eraseMikans
     * @param scheduler {ActorScheduler}
     *     The actor scheduler in which actors are to be scheduled.
     */
    self.eraseMikans = function(scheduler) {
    };

    /**
     * Chains mikans in this box.
     *
     * A chain is composed of at least `MikanBox.CHAIN_LENGTH`
     * maximally damaged mikans.
     *
     * @method chainMikans
     * @return {Array}
     *     An array of chains. Each chain comprising an array of
     *     locations (column, row) of chained mikans.
     */
    self.chainMikans = function() {
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
			function propagate(c2, r2) {
			    tryToChain(c2 - 1, r2);
			    tryToChain(c2 + 1, r2);
			    tryToChain(c2, r2 - 1);
			    tryToChain(c2, r2 + 1);
			}
			function tryToChain(c2, r2) {
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
     * Creates and schedules `Spray`s spreading, toward 8 directions, from each
     * mikan composing `chains`.
     *
     * @method scheduleSprays
     * @param chains {Array}
     *     The array of chains from which sprays spread.
     *     Each element is an array of [column, row] locations.
     * @param scheduler {ActorScheduler}
     *     The `ActorScheduler` in which `Spray`s are to be scheduled.
     */
    self.scheduleSprays = function(chains, scheduler) {
	chains.forEach(function(c) {
	    c.forEach(function(loc) {
		VELOCITIES.forEach(function(v) {
		    var x = columnToX(loc[0]);
		    var y = rowToY(loc[1]);
		    scheduler.schedule(new Spray(x, y, v[0], v[1], 15));
		});
	    });
	});
    };

    /**
     * Creates an `Actor` which spoils mikans surrounding specified chains.
     *
     * A spoiler `Actor` has the following properites,
     * - priority = SPOIL
     * - targets:
     *   The array of squares (column, row) to be spoiled.
     *   Surrounding squares of `chains`.
     *
     * @method scheduleSpoiler
     * @param chains {Array}
     *     The array of chains whose surrounding mikans are to be spoiled.
     *     Each element is an array of [column, row] locations.
     * @param scheduler {ActorScheduler}
     *     The `ActorScheduler` in which the spoiler `Actor` is to be scheduled.
     */
    self.scheduleSpoiler = function(chains, scheduler) {
	var targets = [];
	var spoilMap = new Array(columnCount * rowCount);
	// never spoils chains
	chains.forEach(function(chain) {
	    chain.forEach(function(loc) {
		spoilMap[indexOf(loc[0], loc[1])] = true;
	    });
	});
	// spoils surrounding mikans
	chains.forEach(function(chain) {
	    chain.forEach(function(loc) {
		SURROUNDINGS.forEach(function(d) {
		    var c = loc[0] + d[0];
		    var r = loc[1] + d[1];
		    if (0 <= c && c < columnCount &&
			0 <= r && r < rowCount)
		    {
			var idx = indexOf(c, r);
			if (!spoilMap[idx]) {
			    targets.push([c, r]);
			    spoilMap[idx] = true;
			}
		    }
		});
	    });
	});
	scheduler.schedule(Actor.augment({
	    priority: ActorPriorities.SPOIL,
	    act: function() {},
	    targets: targets
	}));
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
     * - 0 <= `column` < `columnCount`
     * - 0 <= `row` < `rowCount`
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
	return (column >= 0) && (column < columnCount) && (row >= 0) && (row < rowCount)
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
	if ((column < 0) || (column >= columnCount)) {
	    throw "column must be in [0, " + (columnCount - 1) + "] but " + column;
	}
	if ((row < 0) || (row >= rowCount)) {
	    throw "row must be in [0, " + (rowCount - 1) + "] but " + row;
	}
    }

    /**
     * Returns the left location of a specified column.
     *
     * @method columnToX
     * @param column {number}
     *     The column to be converted.
     * @return {number}
     *     The left location of the column.
     * @private
     */
    function columnToX(column) {
	return column * squareSize;
    }

    /**
     * Returns the top location of a specified row.
     *
     * @method rowToY
     * @param row {number}
     *     The row to be converted.
     * @return {number}
     *     The top location of the row.
     * @private
     */
    function rowToY(row) {
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
	return (mikan != null) && (mikan.damage == Mikan.MAX_DAMAGE);
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
