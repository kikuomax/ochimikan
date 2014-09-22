describe('MikanBox', function () {
	var score;

	beforeEach(function () {
		score = new Score();
	});

	it('Should be a Renderable', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(Renderable.isClassOf(mikanBox)).toBe(true);
	});

	it('Should have columnCount and rowCount', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(mikanBox.columnCount).toBe(8);
		expect(mikanBox.rowCount).toBe(12);
		mikanBox = new MikanBox(1, 12, 32, 8, score);
		expect(mikanBox.columnCount).toBe(1);
		expect(mikanBox.rowCount).toBe(12);
		mikanBox = new MikanBox(8, 1, 32, 8, score);
		expect(mikanBox.columnCount).toBe(8);
		expect(mikanBox.rowCount).toBe(1);
	});

	it('Should have cellSize', function () {
		expect(new MikanBox(8, 12, 32, 8, score).cellSize).toBe(32);
		expect(new MikanBox(8, 12, 1, 8, score).cellSize).toBe(1);
	});

	it('Should have a dimension (width, height)', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(mikanBox.width).toBe(8 * 32);
		expect(mikanBox.height).toBe(12 * 32);
		mikanBox = new MikanBox(8, 10, 1, 8, score);
		expect(mikanBox.width).toBe(8);
		expect(mikanBox.height).toBe(10);
	});

	it('Should have score', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(mikanBox.score).toBe(score);
	});

	it('Should not have columnCount unspecified', function () {
		expect(function () { new MikanBox(null, 12, 32, 8, score) }).toThrow();
		expect(function () {
			new MikanBox(undefined, 12, 32, 8, score);
		}).toThrow();
	});

	it('Should not have non-number columnCount', function () {
		expect(function () { new MikanBox('8', 12, 32, 8, score) }).toThrow();
		expect(function () { new MikanBox(true, 12, 32, 8, score) }).toThrow();
	});

	it('Should not have columnCount <= 0', function () {
		expect(function () { new MikanBox(0, 12, 32, 8, score) }).toThrow();
		expect(function () { new MikanBox(-1, 12, 32, 8, score) }).toThrow();
	});

	it('Should not have rowCount unspecified', function () {
		expect(function () { new MikanBox(8, null, 32, 8, score) }).toThrow();
		expect(function () {
			new MikanBox(8, undefined, 32, 8, score);
		}).toThrow();
	});

	it('Should not have non-number rowCount', function () {
		expect(function () { new MikanBox(8, '12', 32, 8, score) }).toThrow();
		expect(function () { new MikanBox(8, true, 32, 8, score) }).toThrow();
	});

	it('Should not have rowCount <= 0', function () {
		expect(function () { new MikanBox(8, 0, 32, 8, score) }).toThrow();
		expect(function () { new MikanBox(8, -1, 32, 8, score) }).toThrow();
	});

	it('Should not have cellSize unspecified', function () {
		expect(function () { new MikanBox(8, 12, null, 8, score) }).toThrow();
		expect(function () {
			new MikanBox(8, 12, undefined, 8, score);
		}).toThrow();
	});

	it('Should not have non-number cellSize', function () {
		expect(function () { new MikanBox(8, 12, '32', 8, score) }).toThrow();
		expect(function () { new MikanBox(8, 12, true, 8, score) }).toThrow();
	});

	it('Should not have cellSize <= 0', function () {
		expect(function () { new MikanBox(8, 12, 0, 8, score) }).toThrow();
		expect(function () { new MikanBox(8, 12, -1, 8, score) }).toThrow();
	});

	it('Should not have score unspecified', function () {
		expect(function () { new MikanBox(8, 12, 32, 8, null) }).toThrow();
		expect(function () { new MikanBox(8, 12, 32, 8) }).toThrow();
	});

	it('Should not have non-Score score', function () {
		expect(function () { new MikanBox(8, 12, 32, 8, true) }).toThrow();
		expect(function () { new MikanBox(8, 12, 32, 8, {})}).toThrow();
	});

	it('Should initially contain no items', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		for (var c = 0; c < mikanBox.columnCount; ++c) {
			for (var r = 0; r < mikanBox.rowCount; ++r) {
				expect(mikanBox.itemIn(c, r)).toBeNull();
			}
		}
	});

	it(':rowAt should interpret an y into a row', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(mikanBox.rowAt(0)).toBe(11);
		expect(mikanBox.rowAt(32 * 12 - 1)).toBe(0);
		expect(mikanBox.rowAt(-1)).toBe(12);
		expect(mikanBox.rowAt(32 * 12)).toBe(-1);
		expect(mikanBox.rowAt(32)).toBe(10);
		expect(mikanBox.rowAt(31)).toBe(11);
		expect(mikanBox.rowAt(32 * 11 - 1)).toBe(1);
		expect(mikanBox.rowAt(32 * 11)).toBe(0);
	});

	it(':columnAt should interpret an x into a column', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(mikanBox.columnAt(0)).toBe(0);
		expect(mikanBox.columnAt(32 * 8 - 1)).toBe(7);
		expect(mikanBox.columnAt(-1)).toBe(-1);
		expect(mikanBox.columnAt(32 * 8)).toBe(8);
		expect(mikanBox.columnAt(32)).toBe(1);
		expect(mikanBox.columnAt(31)).toBe(0);
		expect(mikanBox.columnAt(32 * 7 - 1)).toBe(6);
		expect(mikanBox.columnAt(32 * 7)).toBe(7);
	});

	it(':itemIn should throw an exception if a specified column is out of bounds', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(function () { mikanBox.itemIn(-1, 0) }).toThrow();
		expect(function () { mikanBox.itemIn(8, 0) }).toThrow();
	});

	it(':itemIn should throw an exception if a specified row is out of bounds', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(function () { mikanBox.itemIn(0, -1) }).toThrow();
		expect(function () { mikanBox.itemIn(0, 12) }).toThrow();
	});
});

describe('MikanBox placing items', function () {
	var mikanBox;
	var item1, item2, item3, item4;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		item1 = new Mikan(0);
		item2 = new Mikan(1);
		item3 = new Preservative();
		item4 = new Preservative();
	});

	it('Should place an item in a specified cell and not arrange the location of it if align is false', function () {
		item2.locate(100,  20);
		item3.locate(200, -10);
		item4.locate(50,   50);
		mikanBox.place(item1, 0,  0, false);
		mikanBox.place(item2, 7,  0, false);
		mikanBox.place(item3, 0, 11, false);
		mikanBox.place(item4, 7, 11, false);
		expect(mikanBox.itemIn(0,  0)).toBe(item1);
		expect(mikanBox.itemIn(7,  0)).toBe(item2);
		expect(mikanBox.itemIn(0, 11)).toBe(item3);
		expect(mikanBox.itemIn(7, 11)).toBe(item4);
		expect(item1.x).toEqual(0);
		expect(item1.y).toEqual(0);
		expect(item2.x).toEqual(100);
		expect(item2.y).toEqual(20);
		expect(item3.x).toEqual(200);
		expect(item3.y).toEqual(-10);
		expect(item4.x).toEqual(50);
		expect(item4.y).toEqual(50);
	});

	it('Should place an item in a specified cell and arrange the location of it if align is true', function () {
		mikanBox.place(item1, 0,  0, true);
		mikanBox.place(item2, 7,  0, true);
		mikanBox.place(item3, 0, 11, true);
		mikanBox.place(item4, 7, 11, true);
		expect(mikanBox.itemIn(0,  0)).toBe(item1);
		expect(mikanBox.itemIn(7,  0)).toBe(item2);
		expect(mikanBox.itemIn(0, 11)).toBe(item3);
		expect(mikanBox.itemIn(7, 11)).toBe(item4);
		expect(item1.x).toEqual(0);
		expect(item1.y).toEqual(11 * 32);
		expect(item2.x).toEqual(7 * 32);
		expect(item2.y).toEqual(11 * 32);
		expect(item3.x).toEqual(0);
		expect(item3.y).toEqual(0);
		expect(item4.x).toEqual(7 * 32);
		expect(item4.y).toEqual(0);
	});

	it('Should not place an item if a specified column is out of bounds', function () {
		expect(function () { mikanBox.place(item1,  8, 0, true) }).toThrow();
		expect(function () { mikanBox.place(item1, -1, 0, true) }).toThrow();
	});

	it('Should not place an item if a specified row is out of bounds', function () {
		expect(function () { mikanBox.place(item1, 0, 12, true) }).toThrow();
		expect(function () { mikanBox.place(item1, 0, -1, true) }).toThrow();
	});

	it('Should not place an item if a specified cell is not vacant', function () {
		mikanBox.place(item1, 0, 0, true);
		expect(function () { mikanBox.place(item2, 0, 0, true) }).toThrow();
		mikanBox.place(item3, 7, 11, true);
		expect(function () { mikanBox.place(item4, 7, 11, true) }).toThrow();
	});

	it('Should not place a non-Item object', function () {
		expect(function () { mikanBox.place({}, 0, 0, true) }).toThrow();
		expect(function () {
			mikanBox.place(new Located(0, 0), 0, 0, true);
		}).toThrow();
	});
});

describe('MikanBox dropping Items', function () {
	var mikanBox;
	var scheduler;
	var item1, item2, item3;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		scheduler = new ActorScheduler();
		item1 = new Mikan(0);
		item2 = new Mikan(1);
		item3 = new Preservative();
	});

	it('Should drop an item not placed on the ground', function () {
		// | o
		// | .
		// +--
		mikanBox.place(item1, 0, 1, true);
		// drops
		mikanBox.scheduleToDrop(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | .
		// | o
		// +--
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 0)).toBe(item1);
	});

	it('Should drop items in different columns not placed on the ground', function () {
		// | . . . . . . . o |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . o . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | o . . . . . . . |
		// | . . . . . . . . |
		// +-----------------+
		mikanBox.place(item1, 0,  1, true);
		mikanBox.place(item2, 7, 11, true);
		mikanBox.place(item3, 3,  5, true);
		// drops
		mikanBox.scheduleToDrop(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | . . . . . . . . |
		// | o . . o . . . o |
		// +-----------------+
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(7, 11)).toBeNull();
		expect(mikanBox.itemIn(3, 5)).toBeNull();
		expect(mikanBox.itemIn(0, 0)).toBe(item1);
		expect(mikanBox.itemIn(7, 0)).toBe(item2);
		expect(mikanBox.itemIn(3, 0)).toBe(item3);
	});

	it('Should drop items not placed on the ground but should not drop an item on the ground in the same column', function () {
		// | o
		// | o
		// | .
		// | o
		// +--
		mikanBox.place(item1, 0, 0, true);
		mikanBox.place(item2, 0, 2, true);
		mikanBox.place(item3, 0, 3, true);
		// drops
		mikanBox.scheduleToDrop(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | .
		// | o
		// | o
		// | o
		// +--
		expect(mikanBox.itemIn(0, 0)).toBe(item1);
		expect(mikanBox.itemIn(0, 1)).toBe(item2);
		expect(mikanBox.itemIn(0, 2)).toBe(item3);
		expect(mikanBox.itemIn(0, 3)).toBeNull();
	});
});

describe('MikanBox chaining Mikans:', function () {
	var mikanBox;
	var mikans;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		mikans = [];
		for (var i = 0; i < 8; ++i) {
			mikans.push(new Mikan(Mikan.MAX_DAMAGE));
		}
	});

	it('Should make a horiztontal chain comprising 4 mikans', function () {
		// o o o o
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 1, 0, true);
		mikanBox.place(mikans[2], 2, 0, true);
		mikanBox.place(mikans[3], 3, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(4);
		expect(chains[0]).toContain([0, 0]);
		expect(chains[0]).toContain([1, 0]);
		expect(chains[0]).toContain([2, 0]);
		expect(chains[0]).toContain([3, 0]);
	});

	it('Should make a chain comprising 4 mikans at the top-right corner', function () {
		// o o
		// o o
		mikanBox.place(mikans[0], 6, 10, true);
		mikanBox.place(mikans[1], 7, 10, true);
		mikanBox.place(mikans[2], 6, 11, true);
		mikanBox.place(mikans[3], 7, 11, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(4);
		expect(chains[0]).toContain([6, 10]);
		expect(chains[0]).toContain([7, 10]);
		expect(chains[0]).toContain([6, 11]);
		expect(chains[0]).toContain([7, 11]);
	});

	it('Should make a vertical chain comprising 4 mikans', function () {
		// o
		// o
		// o
		// o
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 0, 1, true);
		mikanBox.place(mikans[2], 0, 2, true);
		mikanBox.place(mikans[3], 0, 3, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(4);
		expect(chains[0]).toContain([0, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([0, 2]);
		expect(chains[0]).toContain([0, 3]);
	});

	it('Should make a chain comprising 5 mikans (crank 1)', function () {
		// . . o
		// o o o
		// o . .
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 0, 1, true);
		mikanBox.place(mikans[2], 1, 1, true);
		mikanBox.place(mikans[3], 2, 1, true);
		mikanBox.place(mikans[4], 2, 2, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(5);
		expect(chains[0]).toContain([0, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([1, 1]);
		expect(chains[0]).toContain([2, 1]);
		expect(chains[0]).toContain([2, 2]);
	});

	it('Should make a chain comprising 5 mikans (crank 2)', function () {
		// o . .
		// o o o
		// . . o
		mikanBox.place(mikans[0], 2, 0, true);
		mikanBox.place(mikans[1], 0, 1, true);
		mikanBox.place(mikans[2], 1, 1, true);
		mikanBox.place(mikans[3], 2, 1, true);
		mikanBox.place(mikans[4], 0, 2, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(5);
		expect(chains[0]).toContain([2, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([1, 1]);
		expect(chains[0]).toContain([2, 1]);
		expect(chains[0]).toContain([0, 2]);
	});

	it('Should make a chain comprising 5 mikans (cross)', function () {
		// . o .
		// o o o
		// . o .
		mikanBox.place(mikans[0], 3, 4, true);
		mikanBox.place(mikans[1], 2, 5, true);
		mikanBox.place(mikans[2], 3, 5, true);
		mikanBox.place(mikans[3], 4, 5, true);
		mikanBox.place(mikans[4], 3, 6, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(5);
		expect(chains[0]).toContain([3, 4]);
		expect(chains[0]).toContain([2, 5]);
		expect(chains[0]).toContain([3, 5]);
		expect(chains[0]).toContain([4, 5]);
		expect(chains[0]).toContain([3, 6]);
	});

	it('Should make a chain comprising 6 mikans (eta)', function () {
		// o o o
		// o . o
		// . . o
		mikanBox.place(mikans[0], 2, 0, true);
		mikanBox.place(mikans[3], 0, 1, true);
		mikanBox.place(mikans[1], 2, 1, true);
		mikanBox.place(mikans[2], 0, 2, true);
		mikanBox.place(mikans[4], 1, 2, true);
		mikanBox.place(mikans[5], 2, 2, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(6);
		expect(chains[0]).toContain([2, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([2, 1]);
		expect(chains[0]).toContain([0, 2]);
		expect(chains[0]).toContain([1, 2]);
		expect(chains[0]).toContain([2, 2]);
	});

	it('Should not make a chain comprising 2 mikans', function () {
		// o o
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 1, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not make a chain comprising 3 mikans', function () {
		// o o o
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 1, 0, true);
		mikanBox.place(mikans[2], 2, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not chain mikans which are not damaged', function () {
		// x x x x
		mikanBox.place(new Mikan(0), 0, 0, true);
		mikanBox.place(new Mikan(0), 1, 0, true);
		mikanBox.place(new Mikan(0), 2, 0, true);
		mikanBox.place(new Mikan(0), 3, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not chain mikans which are not maximally damaged', function () {
		// x x x x
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 3, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should avoid chaining mikans which are not maximally damaged', function () {
		// o x x
		// o x o
		// o o x
		mikanBox.place(mikans[0],                       0, 0, true);
		mikanBox.place(mikans[1],                       1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0, true);
		mikanBox.place(mikans[2],                       0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 1, true);
		mikanBox.place(mikans[3],                       2, 1, true);
		mikanBox.place(mikans[4],                       0, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 2, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(1);
		expect(chains[0].length).toBe(4);
		expect(chains[0]).toContain([0, 0]);
		expect(chains[0]).toContain([1, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([0, 2]);
	});

	it('Should make two mikan chains', function () {
		// o . . . . .
		// o . . . . .
		// o . . . . .
		// o . o o o o
		mikanBox.place(mikans[0], 0, 0, true);
		mikanBox.place(mikans[1], 0, 1, true);
		mikanBox.place(mikans[2], 0, 2, true);
		mikanBox.place(mikans[3], 0, 3, true);
		mikanBox.place(mikans[4], 2, 0, true);
		mikanBox.place(mikans[5], 3, 0, true);
		mikanBox.place(mikans[6], 4, 0, true);
		mikanBox.place(mikans[7], 5, 0, true);
		var chains = mikanBox.chainMikans();
		expect(chains.length).toBe(2);
		expect(chains[0].length).toBe(4);
		expect(chains[0]).toContain([0, 0]);
		expect(chains[0]).toContain([0, 1]);
		expect(chains[0]).toContain([0, 2]);
		expect(chains[0]).toContain([0, 3]);
		expect(chains[1].length).toBe(4);
		expect(chains[1]).toContain([2, 0]);
		expect(chains[1]).toContain([3, 0]);
		expect(chains[1]).toContain([4, 0]);
		expect(chains[1]).toContain([5, 0]);
	});
});

describe('MikanBox erasing Mikans', function () {
	var mikanBox;
	var scheduler;
	var controlTrigger;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		scheduler = new ActorScheduler();
		// dummy trigger actors
		controlTrigger = new Actor(ActorPriorities.CONTROL, function () {
			this.triggered = true;
		});
	});

	// creates a damaged preservative.
	function createDamagedPreservative(cure) {
		var preservative = new Preservative();
		preservative.damage = Preservative.MAX_DAMAGE - cure;
		return preservative;
	}

	// runs Actors until all of `ActorPriorities.FALL`s have done
	function runUntilMovesHaveDone() {
		runUntilActorHasRun(scheduler, ActorPriorities.FALL + 0.1);
	}

	it('Should erase chained mikans', function () {
		// | 3 3
		// | 3 3
		// +----
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 1, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . .
		// | . .
		// +----
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
	});

	it('Should erase chained mikans and spoil surrounding mikans', function () {
		// | 3 .
		// | 3 0
		// | 3 1
		// | 3 2
		// +----
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 3, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 1, 2, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . .
		// | . 1
		// | . 2
		// | . 3
		// +----
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(0, 3)).toBeNull();
		expect(mikanBox.itemIn(1, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.itemIn(1, 2).damage).toBe(Mikan.MAX_DAMAGE - 2);
	});

	it('Should erase chained mikans and spoil surrounding preservatives', function () {
		//  . m3 |
		// p2 m3 |
		// p1 m3 |
		// p0 m3 |
		// ------+
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  7, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  7, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  7, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  7, 3, true);
		mikanBox.place(createDamagedPreservative(4), 6, 0, true);
		mikanBox.place(createDamagedPreservative(3), 6, 1, true);
		mikanBox.place(createDamagedPreservative(2), 6, 2, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		//  . . |
		// p3 . |
		// p2 . |
		// p1 . |
		// -----+
		expect(mikanBox.itemIn(7, 0)).toBeNull();
		expect(mikanBox.itemIn(7, 1)).toBeNull();
		expect(mikanBox.itemIn(7, 2)).toBeNull();
		expect(mikanBox.itemIn(7, 3)).toBeNull();
		expect(mikanBox.itemIn(6, 0).damage).toBe(Preservative.MAX_DAMAGE - 3);
		expect(mikanBox.itemIn(6, 1).damage).toBe(Preservative.MAX_DAMAGE - 2);
		expect(mikanBox.itemIn(6, 2).damage).toBe(Preservative.MAX_DAMAGE - 1);
	});

	it('Should erase, spoil and drop mikans', function () {
		// | 2 1 0 .
		// | 3 3 3 3
		// +--------
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     2, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     3, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 2, 1, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.ERASE);
		runUntilActorHasRun(scheduler, ActorPriorities.SPOIL);
		// | 3 2 1 .
		// | . . . .
		// +--------
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(2, 0)).toBeNull();
		expect(mikanBox.itemIn(3, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.itemIn(2, 1).damage).toBe(Mikan.MAX_DAMAGE - 2);
		// drops
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . . . .
		// | 3 2 1 .
		// +--------
		expect(mikanBox.itemIn(0, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(1, 0).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.itemIn(2, 0).damage).toBe(Mikan.MAX_DAMAGE - 2);
		expect(mikanBox.itemIn(3, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 1)).toBeNull();
	});

	it('Should erase, spoil, drop, erase, spoil and drop mikans', function () {
		// | 3 . 0 .
		// | 3 2 2 .
		// | 3 3 2 3
		// +--------
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 1, true);
		mikanBox.place(new Mikan(0),                    2, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     3, 0, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.ERASE);
		runUntilActorHasRun(scheduler, ActorPriorities.SPOIL);
		// | . . 0 .
		// | . 3 3 .
		// | . . 3 3
		// +--------
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(2, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(2, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(2, 2).damage).toBe(0);
		expect(mikanBox.itemIn(3, 0).damage).toBe(Mikan.MAX_DAMAGE);
		// drops
		runUntilMovesHaveDone();
		// | . . 0 .
		// | . . 3 .
		// | . 3 3 3
		// +--------
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(1, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(2, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(2, 2).damage).toBe(0);
		expect(mikanBox.itemIn(3, 0).damage).toBe(Mikan.MAX_DAMAGE);
		// erases
		runUntilActorHasRun(scheduler, ActorPriorities.ERASE);
		runUntilActorHasRun(scheduler, ActorPriorities.SPOIL);
		// | . . 1 .
		// | . . . .
		// | . . . .
		// +--------
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 0)).toBeNull();
		expect(mikanBox.itemIn(2, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 2).damage).toBe(1);
		expect(mikanBox.itemIn(3, 0)).toBeNull();
		// drops
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . . . .
		// | . . . .
		// | . . 1 .
		// +--------
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 0).damage).toBe(1);
		expect(mikanBox.itemIn(2, 1)).toBeNull();
		expect(mikanBox.itemIn(2, 2)).toBeNull();
		expect(mikanBox.itemIn(3, 0)).toBeNull();
	});

	it('Should erase mikans, and spoil preservatives and erase maximally damaged preservatives', function () {
		// | m3 .
		// | m3 p3
		// | m3 p3
		// | m3 p3
		// +------
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  0, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),  0, 3, true);
		mikanBox.place(createDamagedPreservative(1), 1, 0, true);
		mikanBox.place(createDamagedPreservative(1), 1, 1, true);
		mikanBox.place(createDamagedPreservative(1), 1, 2, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | . .
		// | . .
		// | . .
		// | . .
		// +----
		expect(mikanBox.itemIn(0, 0)).toBeNull();
		expect(mikanBox.itemIn(0, 1)).toBeNull();
		expect(mikanBox.itemIn(0, 2)).toBeNull();
		expect(mikanBox.itemIn(0, 3)).toBeNull();
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(1, 2)).toBeNull();
	});

	it('Should erase mikans, and prevent mikans which are close to preservatives to be spoiled, and spoil preservatives which prevent mikans to be spoiled', function () {
		// |  . m3  .  .  .
		// |  . m3 m0  .  .
		// | p0 m3 m0  .  .
		// | m0 m3 m0 p0 p0
		// +------------
		mikanBox.place(new Mikan(0),                0, 0, true);
		mikanBox.place(new Preservative(),          0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 2, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 3, true);
		mikanBox.place(new Mikan(0),                2, 0, true);
		mikanBox.place(new Mikan(0),                2, 1, true);
		mikanBox.place(new Mikan(0),                2, 2, true);
		mikanBox.place(new Preservative(),          3, 0, true);
		mikanBox.place(new Preservative(),          4, 0, true);
		// erases
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// |  . .  .  .  .
		// |  . . m1  .  .
		// | p1 . m0  .  .
		// | m0 . m0 p1 p0
		// +--------------
		expect(mikanBox.itemIn(0, 0).damage).toBe(0);
		expect(mikanBox.itemIn(0, 1).damage).toBe(1);
		expect(mikanBox.itemIn(1, 0)).toBeNull();
		expect(mikanBox.itemIn(1, 1)).toBeNull();
		expect(mikanBox.itemIn(1, 2)).toBeNull();
		expect(mikanBox.itemIn(1, 3)).toBeNull();
		expect(mikanBox.itemIn(2, 0).damage).toBe(0);
		expect(mikanBox.itemIn(2, 1).damage).toBe(0);
		expect(mikanBox.itemIn(2, 2).damage).toBe(1);
		expect(mikanBox.itemIn(3, 0).damage).toBe(1);
		expect(mikanBox.itemIn(4, 0).damage).toBe(0);
	});

	it('Should not erase mikans if no mikans are chained', function () {
		// | 3 1
		// | 4 2
		// +----
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 1, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 0, true);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 1, 1, true);
		mikanBox.scheduleToErase(scheduler);
		runUntilActorHasRun(scheduler, ActorPriorities.CONTROL);
		// | 3 1
		// | 4 2
		// +----
		expect(mikanBox.itemIn(0, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.itemIn(0, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.itemIn(1, 0).damage).toBe(Mikan.MAX_DAMAGE - 2);
		expect(mikanBox.itemIn(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 3);
	});
});

describe('MikanBox as a Renderable:', function () {
	var mikanBox;
	var mikan1, mikan2, mikan3;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		mikan1 = mockMikan();
		mikan2 = mockMikan();
		mikan3 = mockMikan();
		mikanBox.place(mikan1, 0,  0, true);
		mikanBox.place(mikan2, 7, 11, true);
		mikanBox.place(mikan3, 3,  7, true);
	});

	it('Should render placed mikans', function () {
		var context = {};
		mikanBox.render(context);
		expect(mikan1.render).toHaveBeenCalledWith(context);
		expect(mikan2.render).toHaveBeenCalledWith(context);
		expect(mikan3.render).toHaveBeenCalledWith(context);
	});

	// mocks out a new Mikan
	function mockMikan() {
		var mikan = new Mikan(0);
		Renderable.call(mikan, jasmine.createSpy("render"));
		return mikan;
	}
});
