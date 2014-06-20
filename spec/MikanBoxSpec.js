describe('MikanBox', function() {
    it('Should be a Renderable', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(Renderable.isClassOf(mikanBox)).toBe(true);
    });

    it('Should have columns and rows', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(mikanBox.columnCount).toBe(8);
	expect(mikanBox.rowCount).toBe(12);
	mikanBox = new MikanBox(1, 12, 32);
	expect(mikanBox.columnCount).toBe(1);
	expect(mikanBox.rowCount).toBe(12);
	mikanBox = new MikanBox(8, 1, 32);
	expect(mikanBox.columnCount).toBe(8);
	expect(mikanBox.rowCount).toBe(1);
    });

    it('Should have a square size', function() {
	expect(new MikanBox(8, 12, 32).squareSize).toBe(32);
	expect(new MikanBox(8, 12, 1).squareSize).toBe(1);
    });

    it('Should have a dimension (width, height)', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(mikanBox.width).toBe(8 * 32);
	expect(mikanBox.height).toBe(12 * 32);
	mikanBox = new MikanBox(8, 10, 1);
	expect(mikanBox.width).toBe(8);
	expect(mikanBox.height).toBe(10);
    });

    it('Should not have columns <= 0', function() {
	expect(function() { new MikanBox(0, 12, 32) }).toThrow();
	expect(function() { new MikanBox(-1, 12, 32) }).toThrow();
    });

    it('Should not have rows <= 0', function() {
	expect(function() { new MikanBox(8, 0, 32) }).toThrow();
	expect(function() { new MikanBox(8, -1, 32) }).toThrow();
    });

    it('Should not have squareSize <= 0', function() {
	expect(function() { new MikanBox(8, 12, 0) }).toThrow();
	expect(function() { new MikanBox(8, 12, -1) }).toThrow();
    });

    it('Should initially contain no mikans', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	for (var c = 0; c < mikanBox.columnCount; ++c) {
	    for (var r = 0; r < mikanBox.rowCount; ++r) {
		expect(mikanBox.mikanAt(c, r)).toBeNull();
	    }
	}
    });

    it(':mikanAt should throw an exception if a specified square is not in it', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(function() { mikanBox.mikanAt(-1, 0) }).toThrow();
	expect(function() { mikanBox.mikanAt(8, 0) }).toThrow();
	expect(function() { mikanBox.mikanAt(0, -1) }).toThrow();
	expect(function() { mikanBox.mikanAt(0, 12) }).toThrow();
    });

    it(':place should throw an exception if a specified square is not in it', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	var mikan = new Mikan(0);
	expect(function() { mikanBox.place(mikan, -1, 0) }).toThrow();
	expect(function() { mikanBox.place(mikan, 8, 0) }).toThrow();
	expect(function() { mikanBox.place(mikan, 0, -1) }).toThrow();
	expect(function() { mikanBox.place(mikan, 0, 12) }).toThrow();
    });
});

describe('MikanBox placing Mikans:', function() {
    var mikanBox;
    var mikan1, mikan2, mikan3, mikan4;

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = new Mikan(0);
	mikan2 = new Mikan(1);
	mikan3 = new Mikan(2);
	mikan4 = new Mikan(3);
    });

    it('Should place a mikan in it and arrange the location of it', function() {
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

    it('Should not place a mikan if a specified square is not vacant', function() {
	mikanBox.place(mikan1, 0, 0);
	expect(function() { mikanBox.place(mikan2, 0, 0) }).toThrow();
	mikanBox.place(mikan3, 7, 11);
	expect(function() { mikanBox.place(mikan4, 7, 11) }).toThrow();
    });
});

describe('MikanBox dropping Mikans:', function() {
    var scheduler;
    var mikanBox;
    var mikan1, mikan2, mikan3;

    beforeEach(function() {
	scheduler = new ActorScheduler();
	spyOn(scheduler, 'schedule').and.callThrough();
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = new Mikan(0);
	mikan2 = new Mikan(1);
	mikan3 = new Mikan(2);
    });

    it('Should drop a mikan not placed on the ground', function() {
	mikanBox.place(mikan1, 0, 1);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan1);
	expect(Actor.isClassOf(mikan1)).toBe(true);
	expect(mikan1.priority).toBe(ActorPriorities.MOVE);
	expect(mikanBox.mikanAt(0, 1)).toBeNull();
    });

    it('Should not drop a mikan placed on the ground', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.schedule).not.toHaveBeenCalled();
	expect(Actor.isClassOf(mikan1)).toBe(false);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
    });

    it('Should drop mikans in different columns not placed on the ground', function() {
	mikanBox.place(mikan1, 0, 1);
	mikanBox.place(mikan2, 7, 11);
	mikanBox.place(mikan3, 3, 5);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan1);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan2);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan3);
	expect(Actor.isClassOf(mikan1)).toBe(true);
	expect(Actor.isClassOf(mikan2)).toBe(true);
	expect(Actor.isClassOf(mikan3)).toBe(true);
	expect(mikan1.priority).toBe(ActorPriorities.MOVE);
	expect(mikan2.priority).toBe(ActorPriorities.MOVE);
	expect(mikan3.priority).toBe(ActorPriorities.MOVE);
	expect(mikanBox.mikanAt(0, 1)).toBeNull();
	expect(mikanBox.mikanAt(7, 11)).toBeNull();
	expect(mikanBox.mikanAt(3, 5)).toBeNull();
    });

    it('Should drop mikans not placed on the ground but should not drop a mikan on the ground in the same column', function() {
	// o
	// o
	// .
	// o
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 0, 2);
	mikanBox.place(mikan3, 0, 3);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.schedule).not.toHaveBeenCalledWith(mikan1);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan2);
	expect(scheduler.schedule).toHaveBeenCalledWith(mikan3);
	expect(Actor.isClassOf(mikan1)).toBe(false);
	expect(Actor.isClassOf(mikan2)).toBe(true);
	expect(Actor.isClassOf(mikan3)).toBe(true);
	expect(mikan2.priority).toBe(ActorPriorities.MOVE);
	expect(mikan3.priority).toBe(ActorPriorities.MOVE);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(0, 2)).toBeNull();
	expect(mikanBox.mikanAt(0, 3)).toBeNull();
    });

    it('Should not drop mikans on the other mikan placed on the ground', function() {
	// o
	// o
	// o
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 0, 1);
	mikanBox.place(mikan3, 0, 2);
	mikanBox.dropMikans();
	expect(scheduler.schedule).not.toHaveBeenCalled();
	expect(Actor.isClassOf(mikan1)).toBe(false);
	expect(Actor.isClassOf(mikan2)).toBe(false);
	expect(Actor.isClassOf(mikan3)).toBe(false);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(0, 1)).toBe(mikan2);
	expect(mikanBox.mikanAt(0, 2)).toBe(mikan3);
    });
});

describe('MikanBox chaining Mikans:', function() {
    var mikanBox;
    var mikans;

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	mikans = [];
	for (var i = 0; i < 8; ++i) {
	    mikans.push(new Mikan(Mikan.MAX_DAMAGE));
	}
    });

    it('Should make a horiztontal chain comprising 4 mikans', function() {
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

    it('Should make a chain comprising 4 mikans at the top-right corner', function() {
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

    it('Should make a vertical chain comprising 4 mikans', function() {
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

    it('Should make a chain comprising 5 mikans (crank 1)', function() {
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

    it('Should make a chain comprising 5 mikans (crank 2)', function() {
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

    it('Should make a chain comprising 5 mikans (cross)', function() {
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

    it('Should make a chain comprising 6 mikans (eta)', function() {
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

    it('Should not make a chain comprising 2 mikans', function() {
	// o o
	mikanBox.place(mikans[0], 0, 0);
	mikanBox.place(mikans[1], 1, 0);
	var chains = mikanBox.chainMikans();
	expect(chains).toEqual([]);
    });

    it('Should not make a chain comprising 3 mikans', function() {
	// o o o
	mikanBox.place(mikans[0], 0, 0);
	mikanBox.place(mikans[1], 1, 0);
	mikanBox.place(mikans[2], 2, 0);
	var chains = mikanBox.chainMikans();
	expect(chains).toEqual([]);
    });

    it('Should not chain mikans which are not damaged', function() {
	// x x x x
	mikanBox.place(new Mikan(0), 0, 0);
	mikanBox.place(new Mikan(0), 1, 0);
	mikanBox.place(new Mikan(0), 2, 0);
	mikanBox.place(new Mikan(0), 3, 0);
	var chains = mikanBox.chainMikans();
	expect(chains).toEqual([]);
    });

    it('Should not chain mikans which are not maximally damaged', function() {
	// x x x x
	mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 0, 0);
	mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 1, 0);
	mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 2, 0);
	mikanBox.place(new Mikan(Mikan.MAX_DAMAGE - 1), 3, 0);
	var chains = mikanBox.chainMikans();
	expect(chains).toEqual([]);
    });

    it('Should avoid chaining mikans which are not maximally damaged', function() {
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

    it('Should make two mikan chains', function() {
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

describe('MikanBox scheduling Sprays', function() {
    var mikanBox;
    var scheduler;
    var directions = [
	[-1, -1], [0, -1], [1, -1],
	[-1,  0],          [1,  0],
	[-1,  1], [0,  1], [1,  1]
    ];

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	scheduler = new ActorScheduler();
	spyOn(scheduler, 'schedule').and.callThrough();
	// adds ambiguous equality of Sprays
	// compares only signs for speeds and never compares ttls
	jasmine.addCustomEqualityTester(function(lhs, rhs) {
	    if (Actor.isClassOf(lhs) && Actor.isClassOf(rhs)) {
		if (lhs.priority == ActorPriorities.SPRAY &&
		    rhs.priority == ActorPriorities.SPRAY)
		{
		    return lhs.x == rhs.x && lhs.y == rhs.y &&
			sign(lhs.dX) == sign(rhs.dX) &&
			sign(lhs.dY) == sign(rhs.dY);
		}
	    }
	});

	function sign(x) {
	    return x ? (x > 0 ? 1 : -1) : 0;
	}
    });

    it('Should schedule sprays spreading toward 8 directions from each mikan composing a chain', function() {
	// o
	chains = [ [ [0, 0] ] ];
	mikanBox.scheduleSprays(chains, scheduler);
	expect(scheduler.schedule.calls.count()).toBe(8);
	expect(scheduler.actorQueue.length).toBe(8);
	for (var i = 0; i < directions.length; ++i) {
	    dX = directions[i][0];
	    dY = directions[i][1];
	    expect(scheduler.actorQueue).toContain(new Spray(0, 11*32, dX, dY, 15));
	}
    });

    it('Should schedule sprays spreading toward 8 directions from each mikan composing chains', function() {
	// o . . .
	// o . o o
	chains = [
	    [ [0, 0], [0, 1] ],
	    [ [2, 0], [3, 0] ]
	];
	mikanBox.scheduleSprays(chains, scheduler);
	expect(scheduler.schedule.calls.count()).toBe(8 * 4);
	expect(scheduler.actorQueue.length).toBe(8 * 4);
	for (var i = 0; i < directions.length; ++i) {
	    dX = directions[i][0];
	    dY = directions[i][1];
	    expect(scheduler.actorQueue).toContain(new Spray(0, 11*32, dX, dY, 15));
	    expect(scheduler.actorQueue).toContain(new Spray(0, 10*32, dX, dY, 15));
	    expect(scheduler.actorQueue).toContain(new Spray(2*32, 11*32, dX, dY, 15));
	    expect(scheduler.actorQueue).toContain(new Spray(3*32, 11*32, dX, dY, 15));
	}
    });
});

describe('MikanBox scheduling a spoiler', function() {
    var mikanBox;
    var scheduler;

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	scheduler = new ActorScheduler();
	spyOn(scheduler, 'schedule').and.callThrough();
    });

    it('Should schedule an actor which spoils mikans surrounding a single mikan', function() {
	// x x x
	// x o x
	// x x x
	var chains = [ [ [1, 1] ] ];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(8);
	expect(spoiler.targets).toContain([0, 2]);
	expect(spoiler.targets).toContain([1, 2]);
	expect(spoiler.targets).toContain([2, 2]);
	expect(spoiler.targets).toContain([0, 1]);
	expect(spoiler.targets).toContain([2, 1]);
	expect(spoiler.targets).toContain([0, 0]);
	expect(spoiler.targets).toContain([1, 0]);
	expect(spoiler.targets).toContain([2, 0]);
    });

    it('Should schedule an actor which spoils mikans surrounding a chain', function() {
	// . x x x x
	// x x o o x
	// x o o x x
	// x x x x .
	var chains = [
	    [ [1, 1], [2, 1], [2, 2], [3, 2] ]
	];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0]; 
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(14);
	expect(spoiler.targets).toContain([0, 0]);
	expect(spoiler.targets).toContain([1, 0]);
	expect(spoiler.targets).toContain([2, 0]);
	expect(spoiler.targets).toContain([3, 0]);
	expect(spoiler.targets).toContain([0, 1]);
	expect(spoiler.targets).toContain([3, 1]);
	expect(spoiler.targets).toContain([4, 1]);
	expect(spoiler.targets).toContain([0, 2]);
	expect(spoiler.targets).toContain([1, 2]);
	expect(spoiler.targets).toContain([4, 2]);
	expect(spoiler.targets).toContain([1, 3]);
	expect(spoiler.targets).toContain([2, 3]);
	expect(spoiler.targets).toContain([3, 3]);
	expect(spoiler.targets).toContain([4, 3]);
    });

    it('Should schedule an actor which spoils mikans surrounding chains', function() {
	// x x x . . .
	// x o x x x x
	// x o x o o x
	// x x x x x x
	var chains = [
	    [ [1, 1], [1, 2] ],
	    [ [3, 1], [4, 1] ]
	];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(17);
	expect(spoiler.targets).toContain([0, 0]);
	expect(spoiler.targets).toContain([0, 1]);
	expect(spoiler.targets).toContain([0, 2]);
	expect(spoiler.targets).toContain([0, 3]);
	expect(spoiler.targets).toContain([1, 0]);
	expect(spoiler.targets).toContain([1, 3]);
	expect(spoiler.targets).toContain([2, 0]);
	expect(spoiler.targets).toContain([2, 1]);
	expect(spoiler.targets).toContain([2, 2]);
	expect(spoiler.targets).toContain([2, 3]);
	expect(spoiler.targets).toContain([3, 0]);
	expect(spoiler.targets).toContain([3, 2]);
	expect(spoiler.targets).toContain([4, 0]);
	expect(spoiler.targets).toContain([4, 2]);
	expect(spoiler.targets).toContain([5, 0]);
	expect(spoiler.targets).toContain([5, 1]);
	expect(spoiler.targets).toContain([5, 2]);
    });

    it('Should not schedule to spoil beyond left boundary', function() {
	// | x x
	// | o x
	// | x x
	var chains = [ [ [0, 1] ] ];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(5);
	expect(spoiler.targets).toContain([0, 0]);
	expect(spoiler.targets).toContain([0, 2]);
	expect(spoiler.targets).toContain([1, 0]);
	expect(spoiler.targets).toContain([1, 1]);
	expect(spoiler.targets).toContain([1, 2]);
    });

    it('Should not schedule to spoil beyond right boundary', function() {
	// x x |
	// x o |
	// x x |
	var chains = [ [ [7, 1] ] ];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(5);
	expect(spoiler.targets).toContain([6, 0]);
	expect(spoiler.targets).toContain([6, 1]);
	expect(spoiler.targets).toContain([6, 2]);
	expect(spoiler.targets).toContain([7, 0]);
	expect(spoiler.targets).toContain([7, 2]);
    });

    it('Should not schedule to spoil beyond top boundary', function() {
	// -----
	// x o x
	// x x x
	var chains = [ [ [1, 11] ] ];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(5);
	expect(spoiler.targets).toContain([0, 10]);
	expect(spoiler.targets).toContain([0, 11]);
	expect(spoiler.targets).toContain([1, 10]);
	expect(spoiler.targets).toContain([2, 10]);
	expect(spoiler.targets).toContain([2, 11]);
    });

    it('Should not schedule to spoil beyond bottom boundary', function() {
	// x x x
	// x o x
	// -----
	var chains = [ [ [1, 0] ] ];
	mikanBox.scheduleSpoiler(chains, scheduler);
	expect(scheduler.schedule).toHaveBeenCalled();
	expect(scheduler.actorQueue.length).toBe(1);
	var spoiler = scheduler.actorQueue[0];
	expect(spoiler.priority).toBe(ActorPriorities.SPOIL);
	expect(spoiler.targets.length).toBe(5);
	expect(spoiler.targets).toContain([0, 0]);
	expect(spoiler.targets).toContain([0, 1]);
	expect(spoiler.targets).toContain([1, 1]);
	expect(spoiler.targets).toContain([2, 0]);
	expect(spoiler.targets).toContain([2, 1]);
    });
});

describe('MikanBox erasing Mikans', function() {
    it('Should erase chained Mikans', function() {
	expect(false).toBe(true);
    });
});

describe('MikanBox as a Renderable:', function() {
    var mikanBox = new MikanBox(8, 12, 32);
    var mikan1 = mockMikan();
    var mikan2 = mockMikan();
    var mikan3 = mockMikan();

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = mockMikan();
	mikan2 = mockMikan();
	mikan3 = mockMikan();
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 7, 11);
	mikanBox.place(mikan3, 3, 7);
    });

    it('Should render placed mikans', function() {
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
