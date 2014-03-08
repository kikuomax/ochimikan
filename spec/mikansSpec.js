describe('ActorPriorities', function() {
    it('DROP < CONTROL', function() {
	expect(ActorPriorities.DROP).toBeLessThan(ActorPriorities.CONTROL);
    });

    it('CONTROL < SPAWN', function() {
	expect(ActorPriorities.CONTROL).toBeLessThan(ActorPriorities.SPAWN);
    });
});

describe('Mikan', function() {
    it('Should have damage', function() {
	expect(new Mikan(0).damage).toBe(0);
	expect(new Mikan(Mikan.MAX_DAMAGE).damage).toBe(Mikan.MAX_DAMAGE);
    });

    it('Should floor damage', function() {
	var mikan = new Mikan(0.1);
	expect(mikan.damage).toBe(0);
    });

    it('Should not have damage < 0', function() {
	expect(function() { new Mikan(-1); }).toThrow();
    });

    it('Should not have damage > Mikan.MAX_DAMAGE', function() {
	expect(function() { new Mikan(Mikan.MAX_DAMAGE + 1)}).toThrow();
    });

    it('Should initially be located at (0, 0)', function() {
	var mikan = new Mikan(0);
	expect(mikan.x).toBe(0);
	expect(mikan.y).toBe(0);
	expect(mikan.xy()).toEqual([0, 0]);
    });

    it('Can be located', function() {
	var mikan = new Mikan(0);
	expect(mikan.locate(-1, 1)).toBe(mikan);
	expect(mikan.x).toBe(-1);
	expect(mikan.y).toBe(1);
	expect(mikan.xy()).toEqual([-1, 1]);
    });

    it(':isMikan should be true for a mikan', function() {
	expect(Mikan.isMikan(new Mikan(0))).toBe(true);
	expect(Mikan.isMikan(new Mikan(Mikan.MAX_DAMAGE))).toBe(true);
    });

    it(':isMikan should be true for a mikan like object', function() {
	var mikanLike = { x: 0, y: 0, damage: 0 };
	expect(Mikan.isMikan(mikanLike)).toBe(true);
    });

    it(':isMikan should be false for null', function() {
	expect(Mikan.isMikan(null)).toBe(false);
    });

    it(':isMikan should be false for undefined', function() {
	expect(Mikan.isMikan(undefined)).toBe(false);
    });

    it(':isMikan should be false for an object which lacks location', function() {
	var obj = { damage: 0 };
	expect(Mikan.isMikan(obj)).toBe(false);
    });

    it(':isMikan should be false for an object which lacks damage', function() {
	var obj = new Located(0, 0);
	expect(Mikan.isMikan(obj)).toBe(false);
    });

    it(':damage can be set to another value', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1;
	expect(mikan.damage).toBe(1);
	mikan.damage = Mikan.MAX_DAMAGE;
	expect(mikan.damage).toBe(Mikan.MAX_DAMAGE);
    });

    it(':damage can be set to a float value but it should be floored', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1.1;
	expect(mikan.damage).toBe(1);
    });

    it(':damage can be set to another value but it should not be < 0', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = -1 }).toThrow();
    });

    it(':damage can be set to another value but it should not be > MAX_DAMAGE', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = Mikan.MAX_DAMAGE + 1 }).toThrow();
    });

    it('Can be spoiled', function() {
	var mikan = new Mikan(0);
	expect(mikan.spoil().damage).toBe(1);
	expect(mikan.spoil().damage).toBe(2);
    });

    it('Can not be spoiled more than MAX_DAMAGE', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	expect(mikan.spoil().damage).toBe(Mikan.MAX_DAMAGE);
    });
});

describe('MikanBox', function() {
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

    it('Should have its size', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(mikanBox.width).toBe(8 * 32);
	expect(mikanBox.height).toBe(12 * 32);
	mikanBox = new MikanBox(8, 10, 1);
	expect(mikanBox.width).toBe(8);
	expect(mikanBox.height).toBe(10);
    });

    it('Can have float columns, rows and squareSize but they are floored', function() {
	var mikanBox = new MikanBox(8.5, 12.4, 32.9);
	expect(mikanBox.columnCount).toBe(8);
	expect(mikanBox.rowCount).toBe(12);
	expect(mikanBox.squareSize).toBe(32);
    });

    it('Should not have columns <= 0', function() {
	expect(function() {
	    new MikanBox(0, 12, 32);
	}).toThrow();
	expect(function() {
	    new MikanBox(-1, 12, 32);
	}).toThrow();
    });

    it('Should not have rows <= 0', function() {
	expect(function() {
	    new MikanBox(8, 0, 32);
	}).toThrow();
	expect(function() {
	    new MikanBox(8, -1, 32);
	}).toThrow();
    });

    it('Should not have squareSize <= 0', function() {
	expect(function() {
	    new MikanBox(8, 12, 0);
	}).toThrow();
	expect(function() {
	    new MikanBox(8, 12, -1);
	}).toThrow();
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

describe('Placing mikans in a mikan box:', function() {
    var mikanBox;
    var mikan1, mikan2, mikan3, mikan4;

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = new Mikan(0);
	mikan2 = new Mikan(1);
	mikan3 = new Mikan(2);
	mikan4 = new Mikan(3);
    });

    it('Mikan box should place a mikan in it and arrange the location of it', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 7, 0);
	mikanBox.place(mikan3, 0, 11);
	mikanBox.place(mikan4, 7, 11);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(7, 0)).toBe(mikan2);
	expect(mikanBox.mikanAt(0, 11)).toBe(mikan3);
	expect(mikanBox.mikanAt(7, 11)).toBe(mikan4);
	expect(mikan1.xy()).toEqual([0, 11*32]);
	expect(mikan2.xy()).toEqual([7*32, 11*32]);
	expect(mikan3.xy()).toEqual([0, 0]);
	expect(mikan4.xy()).toEqual([7*32, 0]);
    });

    it('Mikan box cannot place a mikan if a specified square is not vacant', function() {
	mikanBox.place(mikan1, 0, 0);
	expect(function() {
	    mikanBox.place(mikan2, 0, 0);
	}).toThrow();
	mikanBox.place(mikan3, 7, 11);
	expect(function() {
	    mikanBox.place(mikan4, 7, 11);
	}).toThrow();
    });
});

describe('Dropping mikans in a mikan box:', function() {
    var scheduler;
    var mikanBox;
    var mikan1, mikan2, mikan3;

    beforeEach(function() {
	scheduler = new ActorScheduler();
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = new Mikan(0);
	mikan2 = new Mikan(1);
	mikan3 = new Mikan(2);
    });

    it('Mikan box should drop a mikan not placed on the ground', function() {
	mikanBox.place(mikan1, 0, 1);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.actorQueue).toEqual([mikan1]);
	expect(Actor.isActor(mikan1)).toBe(true);
	expect(mikan1.priority).toBe(ActorPriorities.DROP);
	expect(mikanBox.mikanAt(0, 1)).toBeNull();
    });

    it('Mikan box should not drop a mikan placed on the ground', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.actorQueue).toEqual([]);
	expect(Actor.isActor(mikan1)).toBe(false);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
    });

    it('Mikan box should drop mikans in different columns not placed on the ground', function() {
	mikanBox.place(mikan1, 0, 1);
	mikanBox.place(mikan2, 7, 11);
	mikanBox.place(mikan3, 3, 5);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.actorQueue.length).toBe(3);
	expect(scheduler.actorQueue).toContain(mikan1);
	expect(scheduler.actorQueue).toContain(mikan2);
	expect(scheduler.actorQueue).toContain(mikan3);
	expect(Actor.isActor(mikan1)).toBe(true);
	expect(Actor.isActor(mikan2)).toBe(true);
	expect(Actor.isActor(mikan3)).toBe(true);
	expect(mikan1.priority).toBe(ActorPriorities.DROP);
	expect(mikan2.priority).toBe(ActorPriorities.DROP);
	expect(mikan3.priority).toBe(ActorPriorities.DROP);
	expect(mikanBox.mikanAt(0, 1)).toBeNull();
	expect(mikanBox.mikanAt(7, 11)).toBeNull();
	expect(mikanBox.mikanAt(3, 5)).toBeNull();
    });

    it('Mikan box should drop mikans not placed on the ground but should not drop a mikan on the ground in the same column', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 0, 2);
	mikanBox.place(mikan3, 0, 3);
	mikanBox.dropMikans(scheduler);
	expect(scheduler.actorQueue.length).toBe(2);
	expect(scheduler.actorQueue).toContain(mikan2);
	expect(scheduler.actorQueue).toContain(mikan3);
	expect(Actor.isActor(mikan1)).toBe(false);
	expect(Actor.isActor(mikan2)).toBe(true);
	expect(Actor.isActor(mikan3)).toBe(true);
	expect(mikan2.priority).toBe(ActorPriorities.DROP);
	expect(mikan3.priority).toBe(ActorPriorities.DROP);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(0, 2)).toBeNull();
	expect(mikanBox.mikanAt(0, 3)).toBeNull();
    });

    it('Mikan box should not drop mikans on the other mikan placed on the ground', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 0, 1);
	mikanBox.place(mikan3, 0, 2);
	mikanBox.dropMikans();
	expect(scheduler.actorQueue).toEqual([]);
	expect(Actor.isActor(mikan1)).toBe(false);
	expect(Actor.isActor(mikan2)).toBe(false);
	expect(Actor.isActor(mikan3)).toBe(false);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(0, 1)).toBe(mikan2);
	expect(mikanBox.mikanAt(0, 2)).toBe(mikan3);
    });
});

describe('Rendering a mikan:', function() {
    var savedSprites;
    var dummySprites;

    // fakes the sprite resources
    beforeEach(function() {
	savedSprites = Resources.SPRITES['mikan'];
	spySprites = [
	    { render: jasmine.createSpy("dmg0") },
	    { render: jasmine.createSpy("dmg1") },
	    { render: jasmine.createSpy("dmg2") },
	    { render: jasmine.createSpy("dmg3") }
	];
	Resources.SPRITES['mikan'] = spySprites;
    });

    // restores the sprite resources
    afterEach(function() {
	Resources.SPRITES.mikan = savedSprites;
    });

    it('Mikan can be rendered', function() {
	var mikan = new Mikan(0);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).not.toHaveBeenCalled();
    });

    it('Damaged mikan can be rendered', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).not.toHaveBeenCalled();
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).toHaveBeenCalledWith(context, 0, 0);
    });

    it('Mikan can be rendered at a specified location', function() {
	var mikan = new Mikan(0).locate(10, -5);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).toHaveBeenCalledWith(context, 10, -5);
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).not.toHaveBeenCalled();
    });
});

describe('Rendering a mikan box:', function() {
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

    it('Mikan box should render placed mikans', function() {
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
