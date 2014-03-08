/**
 * Provides main objects in the game.
 *
 * # Use Cases
 *
 * ## Producing a mikan
 *
 * 1. A user randomly chooses a degree of damage.
 * 1. The user creates a `Mikan` supplied with the degree of damage.
 *
 * ## Creating a mikan box
 *
 * 1. A user determines the number of columns and rows in a mikan box.
 * 1. The user creates a `MikanBox` with the size (# of column, # of row).
 *
 * ## Creating a mikan in a mikan box
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to create a `Mikan` in it.
 * 1. The new `Mikan` belongs to the `MikanBox` but not placed yet.
 *
 * ## Drops a mikan
 *
 * 1. A `Mikan` is given.
 * 1. A `MikanBox` is given.
 * 1. A user drops the `Mikan` in the `MikanBox`.
 * 1. The `Mikan` starts falling in the `MikanBox`.
 *
 * ## Placing a mikan
 *
 * 1. A `Mikan` is given.
 * 1. A `MikanBox` is given.
 * 1. A user places the `Mikan` somewhere in the `MikanBox`.
 *
 * ## Rendering a mikan
 *
 * 1. A context is given.
 * 1. A `Mikan` is given.
 * 1. A user asks the `Mikan` to render in the context.
 * 1. The user can see the `Mikan` in the context. It's placed at its location
 *    and has appearance reflecting its degree of damage.
 *
 * ## Chaining damaged mikans in a mikan box
 *
 * 1. A `MikanBox` is given.
 * 1. A user asks the `MikanBox` to chain damaged mikans.
 * 1. Maximumly damaged `Mikan`s in the `MikanBox` are chained. And `Mikan`s
 *    composing each chain explodes if the size of the chain reaches the limit.
 * 1. The explosion erases the `Mikan`s in that chain and spoils surrounding
 *    `Mikan`s. The explosion can be seen as `Spray`s.
 * 1. `Mikan`s remaining in the `MikanBox` fall under gravity
 *    (move to another place).
 * 1. Further more chaining may happen after every `Mikan` is sticked
 *    in the `MikanBox`.
 *
 * @module mikans
 */

/**
 * Defines priorities of actors.
 *
 * @class ActorPriorities
 * @static
 */
const ActorPriorities = {
    /**
     * A priority of an actor which draps mikans.
     *
     * @property DROP
     * @type {Number}
     * @final
     */
    DROP: 0,
    /**
     * A priority of an actor which controls mikans.
     *
     * @property CONTROL
     * @type {Number}
     * @final
     */
    CONTROL: 1,
    /**
     * A priority of an actor which spawns mikans.
     *
     * @property SPAWN
     * @type {Number}
     * @final
     */
    SPAWN: 2
};

/**
 * A mikan.
 *
 * The location `(x, y)` of mikan is set to `(0, 0)`.
 *
 * Throws an exception if `damage < 0` or `dmanage > Mikan.MAX_DAMAGE`.
 *
 * # Scenarios
 *
 * ## Rendering a mikan
 *
 * 1. A context is given.
 * 1. A `Mikan` asks for the `Resources` for a mikan sprite corresponding to
 *    its degree of damage.
 * 1. The `Mikan` renders the sprite at its location in the context.
 *
 * @class Mikan
 * @constructor
 * @extends Located
 * @extends Renderable
 * @param damage {Number}
 *     The degree of damage to set. A float value is to be floored.
 */
function Mikan(damage) {
    var self = this;

    // validates the damage
    checkDamage(damage);

    // locates at (0, 0)
    Located.call(self, 0, 0);

    // makes mikan renderable
    Renderable.call(self, function(context) {
	Resources.SPRITES['mikan'][self.damage].render(context, self.x, self.y);
    });

    /**
     * The degree of damage on this mikan.
     *
     * The setter throws an exception if `damage < 0` or
     * `damage > Mikan.MAX_DAMAGE`.
     *
     * The setter floors the argument.
     *
     * @property damage
     * @type Number
     */
    var _damage = Math.floor(damage);
    Object.defineProperty(self, "damage", {
	get: function() {
	    return _damage;
	},
	set: function(damage) {
	    checkDamage(damage);
	    _damage = Math.floor(damage);
	}
    });

    // makes sure that the damage is in [0, MAX_DAMAGE]
    function checkDamage(damage) {
	if (damage < 0) {
	    throw "damage must be >= 0 but " + damage;
	}
	if (damage > Mikan.MAX_DAMAGE) {
	    throw "damage must be <= MAX_DAMAGE but " + damage;
	}
    }
}
// extends Located
Located.wrap(Mikan.prototype);

/**
 * Spoils this mikan.
 *
 * The degree of damage of this mikan will be incremented unless it's
 * `Mikan.MAX_DAMAGE`.
 *
 * @method spoil
 * @chainable
 */
Mikan.prototype.spoil = function() {
    if (this.damage < Mikan.MAX_DAMAGE) {
	++this.damage;
    }
    return this;
};

/**
 * The maximum damage of a mikan.
 *
 * @property MAX_DAMAGE
 * @static
 * @type Number
 * @final
 */
Object.defineProperty(Mikan, 'MAX_DAMAGE', { value: 3, writable: false });

/**
 * Returns whether the specified object is a mikan.
 *
 * A mikan is a `Located` and has the following property.
 * - damage
 *
 * @method isMikan
 * @static
 * @param obj {Object}
 *     The object to be tested.
 * @return {Boolean}
 *     Whether `obj` is a mikan. `false` if `obj` is `null` or `undefined`.
 */
Mikan.isMikan = function(obj) {
    return Located.isLocated(obj) && (obj.damage != null);
};

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
 * - if `columnCount <= 0`
 * - or if `rowCount <= 0`
 * - or if `squareSize <= 0`
 *
 * # Scenarios
 *
 * ## Rendering a mikan box
 *
 * 1. A context is given.
 * 1. A `MikanBox` asks each `Mikan` in it to render the `Mikan` in the context.
 *
 * ## Dropping mikans in a mikan box
 *
 * 1. A `ActorScheduler` is given.
 * 1. A `MikanBox` collects `Mikan`s in it which aren't placed on the ground.
 * 1. For each of those `Mikan`s, the `MikanBox` makes it float
 *    and schedules it as an actor in the `ActorScheduler` as an actor
 *    which moves downward until it reaches the ground.
 *
 * @class MikanBox
 * @constructor
 * @extends Renderable
 * @param columnCount {Number}
 *     The number of columns in the mikan box. Any float value will be floored.
 * @param rowCount {Number}
 *     The number of rows in the mikan box. Any float value will be floored.
 * @param squareSize {Number}
 *     The size (in pixels) of each square in the mikan box.
 */
function MikanBox(columnCount, rowCount, squareSize) {
    var self = this;

    // makes sure that columnCount > 0
    if (columnCount <= 0) {
	throw "columnCount must be > 0 but " + columnCount;
    }
    // makes sure that rowCount > 0
    if (rowCount <= 0) {
	throw "rowCount must be > 0 but " + rowCount;
    }
    // makes sure that squareSize > 0
    if (squareSize <= 0) {
	throw "squareSize must be > 0 but " + squareSize;
    }

    // floors the parameters
    columnCount = Math.floor(columnCount);
    rowCount = Math.floor(rowCount);
    squareSize = Math.floor(squareSize);

    // makes mikan box renderable
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
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'columnCount', { value: columnCount });

    /**
     * The number of rows in this mikan box.
     *
     * @property rowCount
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'rowCount', { value: rowCount });

    /**
     * The size (in pixels) of each square in this mikan box.
     *
     * @property squareSize
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'squareSize', { value: squareSize });

    /**
     * The width (in pixels) of this mikan box.
     *
     * @property width
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'width', { value: columnCount * squareSize });

    /**
     * The height (in pixels) of this mikan box.
     *
     * @property height
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'height', { value: rowCount * squareSize });

    /**
     * Returns the mikan in the specified square in this mikan box.
     *
     * Throws an exception
     * - if `column < 0` or `column >= columnCount`
     * - or if `row < 0` or `row >= rowCount`
     *
     * @method mikanAt
     * @param column {Number}
     *     The column of the square from which a mikan is to be obtained.
     * @param row {Number}
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
     * @param column {Number}
     *     The column of the square in which the mikan is to be placed.
     * @param row {Number}
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
	mikan.locate(column * squareSize, (rowCount - row - 1) * squareSize);
    };

    /**
     * Drops mikans in this mikan box.
     *
     * For each mikan in this mikan box which isn't placed on the ground,
     * 1. Releases the mikan from this mikan box
     * 1. Makes the mikan an actor which moves toward the ground
     *    (ActorPriorities.DROP)
     * 1. Schedules the mikan in `scheduler`
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
		    // drops the mikan if it's not on the ground
		    if (r > height) {
			Actor.call(mikan, ActorPriorities.DROP, function(scheduler) {
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
     * Returns the index of the specified square.
     *
     * @method indexOf
     * @private
     * @param column {Number}
     *     The column of the square.
     * @param row {Number}
     *     The row of the square.
     * @return {Number}  The index of the square (`column`, `row`).
     */
    function indexOf(column, row) {
	return row + (column * rowCount);
    }

    /**
     * Checks if the specified column and row are valid.
     *
     * Throws an exception
     * - if `column < 0` or `column >= columnCount`
     * - or if `row < 0` or `row >= rowCount`
     *
     * @method checkSquare
     * @private
     * @param column {Number}
     *     The column to be tested.
     * @param row {Number}
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
}
