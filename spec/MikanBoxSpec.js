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

	it('Should have squareSize', function () {
		expect(new MikanBox(8, 12, 32, 8, score).squareSize).toBe(32);
		expect(new MikanBox(8, 12, 1, 8, score).squareSize).toBe(1);
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

	it('Should not have squareSize unspecified', function () {
		expect(function () { new MikanBox(8, 12, null, 8, score) }).toThrow();
		expect(function () {
			new MikanBox(8, 12, undefined, 8, score);
		}).toThrow();
	});

	it('Should not have non-number squareSize', function () {
		expect(function () { new MikanBox(8, 12, '32', 8, score) }).toThrow();
		expect(function () { new MikanBox(8, 12, true, 8, score) }).toThrow();
	});

	it('Should not have squareSize <= 0', function () {
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

	it('Should initially contain no mikans', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		for (var c = 0; c < mikanBox.columnCount; ++c) {
			for (var r = 0; r < mikanBox.rowCount; ++r) {
				expect(mikanBox.mikanAt(c, r)).toBeNull();
			}
		}
	});

	it(':rowAt should interpret a y into a column', function () {
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

	it(':mikanAt should throw an exception if a specified square is not in it', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		expect(function () { mikanBox.mikanAt(-1, 0) }).toThrow();
		expect(function () { mikanBox.mikanAt(8, 0) }).toThrow();
		expect(function () { mikanBox.mikanAt(0, -1) }).toThrow();
		expect(function () { mikanBox.mikanAt(0, 12) }).toThrow();
	});

	it(':place should throw an exception if a specified square is not in it', function () {
		var mikanBox = new MikanBox(8, 12, 32, 8, score);
		var mikan = new Mikan(0);
		expect(function () { mikanBox.place(mikan, -1, 0) }).toThrow();
		expect(function () { mikanBox.place(mikan, 8, 0) }).toThrow();
		expect(function () { mikanBox.place(mikan, 0, -1) }).toThrow();
		expect(function () { mikanBox.place(mikan, 0, 12) }).toThrow();
	});
});

describe('MikanBox placing Mikans:', function () {
	var mikanBox;
	var mikan1, mikan2, mikan3, mikan4;

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		mikan1 = new Mikan(0);
		mikan2 = new Mikan(1);
		mikan3 = new Mikan(2);
		mikan4 = new Mikan(3);
	});

	it('Should place a mikan in it and arrange the location of it', function () {
		mikanBox.place(mikan1, 0, 0);
		mikanBox.place(mikan2, 7, 0);
		mikanBox.place(mikan3, 0, 11);
		mikanBox.place(mikan4, 7, 11);
		expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
		expect(mikanBox.mikanAt(7, 0)).toBe(mikan2);
		expect(mikanBox.mikanAt(0, 11)).toBe(mikan3);
		expect(mikanBox.mikanAt(7, 11)).toBe(mikan4);
		expect(mikan1.x).toEqual(0);
		expect(mikan1.y).toEqual(11*32);
		expect(mikan2.x).toEqual(7*32);
		expect(mikan2.y).toEqual(11*32);
		expect(mikan3.x).toEqual(0);
		expect(mikan3.y).toEqual(0);
		expect(mikan4.x).toEqual(7*32);
		expect(mikan4.y).toEqual(0);
	});

	it('Should not place a mikan if a specified square is not vacant', function () {
		mikanBox.place(mikan1, 0, 0);
		expect(function () { mikanBox.place(mikan2, 0, 0) }).toThrow();
		mikanBox.place(mikan3, 7, 11);
		expect(function () { mikanBox.place(mikan4, 7, 11) }).toThrow();
	});
});

describe('MikanBox dropping Mikans:', function () {
	var scheduler;
	var mikanBox;
	var mikan1, mikan2, mikan3;

	beforeEach(function () {
		scheduler = new ActorScheduler();
		spyOn(scheduler, 'schedule').and.callThrough();
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		mikan1 = new Mikan(0);
		mikan2 = new Mikan(1);
		mikan3 = new Mikan(2);
	});

	it('Should drop a mikan not placed on the ground', function () {
		// o
		// .
		// -
		mikanBox.place(mikan1, 0, 1);
		// schedules
		mikanBox.scheduleToDrop(scheduler);
		expect(scheduler.schedule).toHaveBeenCalled();
		scheduler.schedule.calls.reset();
		// runs
		scheduler.run();
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan1);
		expect(Actor.isClassOf(mikan1)).toBe(true);
		expect(mikan1.priority).toBe(ActorPriorities.FALL);
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
	});

	it('Should not drop a mikan placed on the ground', function () {
		// o
		// -
		mikanBox.place(mikan1, 0, 0);
		// schedules
		mikanBox.scheduleToDrop(scheduler);
		expect(scheduler.schedule).toHaveBeenCalled();
		scheduler.schedule.calls.reset();
		// runs
		scheduler.run();
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(Actor.isClassOf(mikan1)).toBe(false);
		expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	});

	it('Should drop mikans in different columns not placed on the ground', function () {
		mikanBox.place(mikan1, 0, 1);
		mikanBox.place(mikan2, 7, 11);
		mikanBox.place(mikan3, 3, 5);
		// schedules
		mikanBox.scheduleToDrop(scheduler);
		expect(scheduler.schedule).toHaveBeenCalled();
		scheduler.schedule.calls.reset();
		// runs
		scheduler.run();
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan1);
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan2);
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan3);
		expect(Actor.isClassOf(mikan1)).toBe(true);
		expect(Actor.isClassOf(mikan2)).toBe(true);
		expect(Actor.isClassOf(mikan3)).toBe(true);
		expect(mikan1.priority).toBe(ActorPriorities.FALL);
		expect(mikan2.priority).toBe(ActorPriorities.FALL);
		expect(mikan3.priority).toBe(ActorPriorities.FALL);
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(7, 11)).toBeNull();
		expect(mikanBox.mikanAt(3, 5)).toBeNull();
	});

	it('Should drop mikans not placed on the ground but should not drop a mikan on the ground in the same column', function () {
		// o
		// o
		// .
		// o
		// -
		mikanBox.place(mikan1, 0, 0);
		mikanBox.place(mikan2, 0, 2);
		mikanBox.place(mikan3, 0, 3);
		// schedules
		mikanBox.scheduleToDrop(scheduler);
		expect(scheduler.schedule).toHaveBeenCalled();
		scheduler.schedule.calls.reset();
		// runs
		scheduler.run();
		expect(scheduler.schedule).not.toHaveBeenCalledWith(mikan1);
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan2);
		expect(scheduler.schedule).toHaveBeenCalledWith(mikan3);
		expect(Actor.isClassOf(mikan1)).toBe(false);
		expect(Actor.isClassOf(mikan2)).toBe(true);
		expect(Actor.isClassOf(mikan3)).toBe(true);
		expect(mikan2.priority).toBe(ActorPriorities.FALL);
		expect(mikan3.priority).toBe(ActorPriorities.FALL);
		expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(0, 3)).toBeNull();
	});

	it('Should not drop mikans on the other mikan placed on the ground', function () {
		// o
		// o
		// o
		// -
		mikanBox.place(mikan1, 0, 0);
		mikanBox.place(mikan2, 0, 1);
		mikanBox.place(mikan3, 0, 2);
		// schedules
		mikanBox.scheduleToDrop(scheduler);
		expect(scheduler.schedule).toHaveBeenCalled();
		scheduler.schedule.calls.reset();
		// runs
		scheduler.run();
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(Actor.isClassOf(mikan1)).toBe(false);
		expect(Actor.isClassOf(mikan2)).toBe(false);
		expect(Actor.isClassOf(mikan3)).toBe(false);
		expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
		expect(mikanBox.mikanAt(0, 1)).toBe(mikan2);
		expect(mikanBox.mikanAt(0, 2)).toBe(mikan3);
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
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 1, 0);
		mikanBox.place(mikans[2], 2, 0);
		mikanBox.place(mikans[3], 3, 0);
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
		mikanBox.place(mikans[0], 6, 10);
		mikanBox.place(mikans[1], 7, 10);
		mikanBox.place(mikans[2], 6, 11);
		mikanBox.place(mikans[3], 7, 11);
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
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 0, 1);
		mikanBox.place(mikans[2], 0, 2);
		mikanBox.place(mikans[3], 0, 3);
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
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 0, 1);
		mikanBox.place(mikans[2], 1, 1);
		mikanBox.place(mikans[3], 2, 1);
		mikanBox.place(mikans[4], 2, 2);
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
		mikanBox.place(mikans[0], 2, 0);
		mikanBox.place(mikans[1], 0, 1);
		mikanBox.place(mikans[2], 1, 1);
		mikanBox.place(mikans[3], 2, 1);
		mikanBox.place(mikans[4], 0, 2);
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
		mikanBox.place(mikans[0], 3, 4);
		mikanBox.place(mikans[1], 2, 5);
		mikanBox.place(mikans[2], 3, 5);
		mikanBox.place(mikans[3], 4, 5);
		mikanBox.place(mikans[4], 3, 6);
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
		mikanBox.place(mikans[0], 2, 0);
		mikanBox.place(mikans[3], 0, 1);
		mikanBox.place(mikans[1], 2, 1);
		mikanBox.place(mikans[2], 0, 2);
		mikanBox.place(mikans[4], 1, 2);
		mikanBox.place(mikans[5], 2, 2);
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
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 1, 0);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not make a chain comprising 3 mikans', function () {
		// o o o
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 1, 0);
		mikanBox.place(mikans[2], 2, 0);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not chain mikans which are not damaged', function () {
		// x x x x
		mikanBox.place(new Mikan(0), 0, 0);
		mikanBox.place(new Mikan(0), 1, 0);
		mikanBox.place(new Mikan(0), 2, 0);
		mikanBox.place(new Mikan(0), 3, 0);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should not chain mikans which are not maximally damaged', function () {
		// x x x x
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 3, 0);
		var chains = mikanBox.chainMikans();
		expect(chains).toEqual([]);
	});

	it('Should avoid chaining mikans which are not maximally damaged', function () {
		// o x x
		// o x o
		// o o x
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0);
		mikanBox.place(mikans[2], 0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 1);
		mikanBox.place(mikans[3], 2, 1);
		mikanBox.place(mikans[4], 0, 2);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 2);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 2);
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
		mikanBox.place(mikans[0], 0, 0);
		mikanBox.place(mikans[1], 0, 1);
		mikanBox.place(mikans[2], 0, 2);
		mikanBox.place(mikans[3], 0, 3);
		mikanBox.place(mikans[4], 2, 0);
		mikanBox.place(mikans[5], 3, 0);
		mikanBox.place(mikans[6], 4, 0);
		mikanBox.place(mikans[7], 5, 0);
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

describe('MikanBox scheduling Sprays', function () {
	var mikanBox;
	var scheduler;
	var directions = [
		[-1, -1], [0, -1], [1, -1],
		[-1,  0],          [1,  0],
		[-1,  1], [0,  1], [1,  1]
	];

	beforeEach(function () {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
		scheduler = new ActorScheduler();
		spyOn(scheduler, 'schedule').and.callThrough();
		// adds ambiguous equality of Sprays
		// compares only signs for speeds and never compares ttls
		jasmine.addCustomEqualityTester(function (lhs, rhs) {
			if (Actor.isClassOf(lhs) && Actor.isClassOf(rhs)) {
				if (lhs.priority == ActorPriorities.SPRAY
					&& rhs.priority == ActorPriorities.SPRAY)
				{
					return lhs.x == rhs.x && lhs.y == rhs.y
						&& sign(lhs.dX) == sign(rhs.dX)
						&& sign(lhs.dY) == sign(rhs.dY);
				}
			}
		});

		function sign(x) {
			return x ? (x > 0 ? 1 : -1) : 0;
		}
	});

	it('Should schedule 8 sprays for a single mikan', function () {
		// o
		chains = [ [ [0, 0] ] ];
		mikanBox.scheduleSprays(chains, scheduler);
		expect(scheduler.schedule.calls.count()).toBe(8);
		for (var i = 0; i < 8; ++i) {
			expect(scheduler.schedule.calls.argsFor(i)[0].priority).toBe(ActorPriorities.SPRAY);
		}
	});

	it('Should schedule 24 sprays for 4 mikans', function () {
		// o . . .
		// o . o o
		chains = [
			[ [0, 0], [0, 1] ],
			[ [2, 0], [3, 0] ]
		];
		mikanBox.scheduleSprays(chains, scheduler);
		expect(scheduler.schedule.calls.count()).toBe(8 * 4);
		for (var i = 0; i < 8 * 4; ++i) {
			expect(scheduler.schedule.calls.argsFor(i)[0].priority).toBe(ActorPriorities.SPRAY);
		}
	});
});

describe('MikanBox collecting spoiling targets', function() {
	var mikanBox;

	beforeEach(function() {
		mikanBox = new MikanBox(8, 12, 32, 8, new Score());
	});

	it('Should return locations surrounding a single mikan', function () {
		// x x x
		// x o x
		// x x x
		var chains = [ [ [1, 1] ] ];
		var refTargets = [
			[0, 2], [1, 2], [2, 2], [0, 1], [2, 1], [0, 0], [1, 0], [2, 0]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should return locations surrounding a chain', function () {
		// . x x x x
		// x x o o x
		// x o o x x
		// x x x x .
		var chains = [
			[ [1, 1], [2, 1], [2, 2], [3, 2] ]
		];
		var refTargets = [
			[0, 0], [1, 0], [2, 0], [3, 0],	[0, 1], [3, 1], [4, 1], [0, 2],
			[1, 2], [4, 2], [1, 3], [2, 3], [3, 3], [4, 3]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should collect locations surrounding chains', function () {
		// x x x . . .
		// x o x x x x
		// x o x o o x
		// x x x x x x
		var chains = [
			[ [1, 1], [1, 2] ],
			[ [3, 1], [4, 1] ]
		];
		var refTargets = [
			[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 3], [2, 0], [2, 1],
			[2, 2], [2, 3], [3, 0], [3, 2], [4, 0], [4, 2], [5, 0], [5, 1],
			[5, 2]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should not collect locations beyond left boundary', function () {
		// | x x
		// | o x
		// | x x
		var chains = [ [ [0, 1] ] ];
		var refTargets = [
			[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should not collect locations beyond right boundary', function () {
		// x x |
		// x o |
		// x x |
		var chains = [ [ [7, 1] ] ];
		var refTargets = [
			[6, 0], [6, 1], [6, 2], [7, 0], [7, 2]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should not collection locations beyond top boundary', function () {
		// -----
		// x o x
		// x x x
		var chains = [ [ [1, 11] ] ];
		var refTargets = [
			[0, 10], [0, 11], [1, 10], [2, 10], [2, 11]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
	});

	it('Should not collection locations beyond bottom boundary', function () {
		// x x x
		// x o x
		// -----
		var chains = [ [ [1, 0] ] ];
		var refTargets = [
			[0, 0], [0, 1], [1, 1], [2, 0], [2, 1]
		];
		var targets = mikanBox.collectSpoilingTargets(chains);
		expect(targets.length).toBe(refTargets.length);
		for (var i = 0; i < refTargets.length; ++i) {
			expect(targets).toContain(refTargets[i]);
		}
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

	// waits until an `Actor` with a specified priority runs
	function waitUntil(priority) {
		var timeout = 10000;
		var trigger = new Actor(priority, function () {
			this.triggered = true;
		});
		scheduler.schedule(trigger);
		while (!trigger.triggered && timeout > 0) {
			scheduler.run();
			--timeout;
		}
		expect(trigger.triggered).toBeTruthy();
	}

	// waits until `ActorPriorities.CONTROL` runs
	function waitUntilControlIsBack() {
		waitUntil(ActorPriorities.CONTROL);
	}

	// waits until `ActorPriorities.ERASE` runs
	function waitUntilEraseHasDone() {
		waitUntil(ActorPriorities.ERASE);
	}

	// waits until all of `ActorPriorities.FALL`s have done
	function waitUntilMovesHaveDone() {
		waitUntil(ActorPriorities.FALL + 0.1);
	}

	// waits until `ActorPriorities.SPOIL` has done
	function waitUntilSpoilHasDone() {
		waitUntil(ActorPriorities.SPOIL);
	}

	it('Should erase Mikans', function () {
		// 4 4
		// 4 4
		// ---
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 1, 1);
		mikanBox.scheduleToErase(scheduler);
		waitUntilControlIsBack();
		// . .
		// . .
		// ---
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(1, 0)).toBeNull();
		expect(mikanBox.mikanAt(1, 1)).toBeNull();
	});

	it('Should erase and spoil Mikans', function () {
		// 4 .
		// 4 1
		// 4 2
		// 4 3
		// ---
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 2);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 3);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 1, 2);
		mikanBox.scheduleToErase(scheduler);
		waitUntilControlIsBack();
		// . .
		// . 2
		// . 3
		// . 4
		// ---
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(0, 3)).toBeNull();
		expect(mikanBox.mikanAt(1, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.mikanAt(1, 2).damage).toBe(Mikan.MAX_DAMAGE - 2);
	});

	it('Should erase, spoil and drop Mikans', function () {
		// 3 2 1 .
		// 4 4 4 4
		// -------
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     2, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     3, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 2, 1);
		mikanBox.scheduleToErase(scheduler);
		waitUntilEraseHasDone();
		waitUntilSpoilHasDone();
		// 4 3 2 .
		// . . . .
		// -------
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(1, 0)).toBeNull();
		expect(mikanBox.mikanAt(2, 0)).toBeNull();
		expect(mikanBox.mikanAt(3, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.mikanAt(2, 1).damage).toBe(Mikan.MAX_DAMAGE - 2);
		waitUntilControlIsBack();
		// . . . .
		// 4 3 2 .
		// -------
		expect(mikanBox.mikanAt(0, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(1, 0).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.mikanAt(2, 0).damage).toBe(Mikan.MAX_DAMAGE - 2);
		expect(mikanBox.mikanAt(3, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(1, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 1)).toBeNull();
	});

	it('Should erase, spoil, drop, erase, spoil and drop Mikans', function () {
		// 4 . 1 .
		// 4 3 3 .
		// 4 4 3 4
		// -------
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 2);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 1);
		mikanBox.place(new Mikan(0), 2, 2);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE), 3, 0);
		mikanBox.scheduleToErase(scheduler);
		waitUntilEraseHasDone();
		waitUntilSpoilHasDone();
		// . . 1 .
		// . 4 4 .
		// . . 4 4
		// -------
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(1, 0)).toBeNull();
		expect(mikanBox.mikanAt(1, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(2, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(2, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(2, 2).damage).toBe(0);
		expect(mikanBox.mikanAt(3, 0).damage).toBe(Mikan.MAX_DAMAGE);
		waitUntilMovesHaveDone();
		// . . 1 .
		// . . 4 .
		// . 4 4 4
		// -------
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(1, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(1, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(2, 1).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(2, 2).damage).toBe(0);
		expect(mikanBox.mikanAt(3, 0).damage).toBe(Mikan.MAX_DAMAGE);
		waitUntilEraseHasDone();
		waitUntilSpoilHasDone();
		// . . 2 .
		// . . . .
		// . . . .
		// -------
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(1, 0)).toBeNull();
		expect(mikanBox.mikanAt(1, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 0)).toBeNull();
		expect(mikanBox.mikanAt(2, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 2).damage).toBe(1);
		expect(mikanBox.mikanAt(3, 0)).toBeNull();
		waitUntilControlIsBack();
		// . . . .
		// . . . .
		// . . 2 .
		// -------
		expect(mikanBox.mikanAt(0, 0)).toBeNull();
		expect(mikanBox.mikanAt(0, 1)).toBeNull();
		expect(mikanBox.mikanAt(0, 2)).toBeNull();
		expect(mikanBox.mikanAt(1, 0)).toBeNull();
		expect(mikanBox.mikanAt(1, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 0).damage).toBe(1);
		expect(mikanBox.mikanAt(2, 1)).toBeNull();
		expect(mikanBox.mikanAt(2, 2)).toBeNull();
		expect(mikanBox.mikanAt(3, 0)).toBeNull();
	});

	it('Should not erase Mikans', function () {
		// 3 1
		// 4 2
		// ---
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE),     0, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 1);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 2), 1, 0);
		mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 3), 1, 1);
		mikanBox.scheduleToErase(scheduler);
		waitUntilControlIsBack();
		// 3 1
		// 4 2
		// ---
		expect(mikanBox.mikanAt(0, 0).damage).toBe(Mikan.MAX_DAMAGE);
		expect(mikanBox.mikanAt(0, 1).damage).toBe(Mikan.MAX_DAMAGE - 1);
		expect(mikanBox.mikanAt(1, 0).damage).toBe(Mikan.MAX_DAMAGE - 2);
		expect(mikanBox.mikanAt(1, 1).damage).toBe(Mikan.MAX_DAMAGE - 3);
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
		mikanBox.place(mikan1, 0, 0);
		mikanBox.place(mikan2, 7, 11);
		mikanBox.place(mikan3, 3, 7);
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
