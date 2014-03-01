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
 * 1. A user determines the number of columns in a mikan box.
 * 1. The user determines the number of rows in a mikan box.
 * 1. The user creates a `MikanBox` with the size (# of column, # of row).
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
    Located.makeLocated(self, 0, 0);

    // makes mikan renderable
    Renderable.makeRenderable(self, function(context) {
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

    /**
     * Spoils this mikan.
     *
     * The degree of damage of this mikan will be incremented unless it's
     * `Mikan.MAX_DAMAGE`.
     *
     * @method spoil
     * @chainable
     */
    self.spoil = function() {
	if (_damage < Mikan.MAX_DAMAGE) {
	    ++_damage;
	}
	return self;
    };

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

/**
 * The maximum damage of a mikan.
 *
 * @property MAX_DAMAGE
 * @static
 * @type Number
 * @final
 */
Object.defineProperty(Mikan, "MAX_DAMAGE", { value: 3, writable: false });

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
    Renderable.makeRenderable(self, function(context) {
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
    Object.defineProperty(self, "columnCount", { value: columnCount });

    /**
     * The number of rows in this mikan box.
     *
     * @property rowCount
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, "rowCount", { value: rowCount });

    /**
     * The size (in pixels) of each square in this mikan box.
     *
     * @property squareSize
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, "squareSize", { value: squareSize });

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
	if (mikanGrid[idx] !== null) {
	    throw "square [" + column + ", " + row + "] isn't vacant";
	}
	mikanGrid[idx] = mikan;
	mikan.locate(column * squareSize, (rowCount - row - 1) * squareSize);
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
