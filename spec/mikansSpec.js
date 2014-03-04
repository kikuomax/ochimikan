describe('Mikan', function() {
    it('should have damage', function() {
	expect(new Mikan(0).damage).toBe(0);
	expect(new Mikan(Mikan.MAX_DAMAGE).damage).toBe(Mikan.MAX_DAMAGE);
    });

    it('should floor damage', function() {
	var mikan = new Mikan(0.1);
	expect(mikan.damage).toBe(0);
    });

    it('should not have damage < 0', function() {
	expect(function() { new Mikan(-1); }).toThrow();
    });

    it('should not have damage > Mikan.MAX_DAMAGE', function() {
	expect(function() { new Mikan(Mikan.MAX_DAMAGE + 1)}).toThrow();
    });

    it('should initially be located at (0, 0)', function() {
	var mikan = new Mikan(0);
	expect(mikan.x).toBe(0);
	expect(mikan.y).toBe(0);
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

    it('can be spoiled', function() {
	var mikan = new Mikan(0);
	expect(mikan.spoil().damage).toBe(1);
	expect(mikan.spoil().damage).toBe(2);
    });

    it('can not be spoiled more than MAX_DAMAGE', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	expect(mikan.spoil().damage).toBe(Mikan.MAX_DAMAGE);
    });
});

describe('MikanBox', function() {
    it('should have columns and rows', function() {
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

    it('should have a square size', function() {
	expect(new MikanBox(8, 12, 32).squareSize).toBe(32);
	expect(new MikanBox(8, 12, 1).squareSize).toBe(1);
    });

    it('should have its size', function() {
	var mikanBox = new MikanBox(8, 12, 32);
	expect(mikanBox.width).toBe(8 * 32);
	expect(mikanBox.height).toBe(12 * 32);
	mikanBox = new MikanBox(8, 10, 1);
	expect(mikanBox.width).toBe(8);
	expect(mikanBox.height).toBe(10);
    });

    it('can have float columns, rows and squareSize but they are floored', function() {
	var mikanBox = new MikanBox(8.5, 12.4, 32.9);
	expect(mikanBox.columnCount).toBe(8);
	expect(mikanBox.rowCount).toBe(12);
	expect(mikanBox.squareSize).toBe(32);
    });

    it('should not have columns <= 0', function() {
	expect(function() {
	    new MikanBox(0, 12, 32);
	}).toThrow();
	expect(function() {
	    new MikanBox(-1, 12, 32);
	}).toThrow();
    });

    it('should not have rows <= 0', function() {
	expect(function() {
	    new MikanBox(8, 0, 32);
	}).toThrow();
	expect(function() {
	    new MikanBox(8, -1, 32);
	}).toThrow();
    });

    it('should not have squareSize <= 0', function() {
	expect(function() {
	    new MikanBox(8, 12, 0);
	}).toThrow();
	expect(function() {
	    new MikanBox(8, 12, -1);
	}).toThrow();
    });

    it('should initially contain no mikans', function() {
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

describe('placing mikans in a mikan box:', function() {
    var mikanBox;
    var mikan1, mikan2, mikan3, mikan4;

    beforeEach(function() {
	mikanBox = new MikanBox(8, 12, 32);
	mikan1 = new Mikan(0);
	mikan2 = new Mikan(1);
	mikan3 = new Mikan(2);
	mikan4 = new Mikan(3);
    });

    it('mikan box should place a mikan in it and arrange the location of it', function() {
	mikanBox.place(mikan1, 0, 0);
	mikanBox.place(mikan2, 7, 0);
	mikanBox.place(mikan3, 0, 11);
	mikanBox.place(mikan4, 7, 11);
	expect(mikanBox.mikanAt(0, 0)).toBe(mikan1);
	expect(mikanBox.mikanAt(7, 0)).toBe(mikan2);
	expect(mikanBox.mikanAt(0, 11)).toBe(mikan3);
	expect(mikanBox.mikanAt(7, 11)).toBe(mikan4);
	expect(mikan1.xy).toEqual([0, 11*32]);
	expect(mikan2.xy).toEqual([7*32, 11*32]);
	expect(mikan3.xy).toEqual([0, 0]);
	expect(mikan4.xy).toEqual([7*32, 0]);
    });

    it('mikan box cannot place a mikan if a specified square is not vacant', function() {
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

describe('rendering a mikan:', function() {
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

    it('mikan can be rendered', function() {
	var mikan = new Mikan(0);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).not.toHaveBeenCalled();
    });

    it('damaged mikan can be rendered', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).not.toHaveBeenCalled();
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).toHaveBeenCalledWith(context, 0, 0);
    });

    it('mikan can be rendered at a specified location', function() {
	var mikan = new Mikan(0).locate(10, -5);
	var context = {};
	mikan.render(context);
	expect(spySprites[0].render).toHaveBeenCalledWith(context, 10, -5);
	expect(spySprites[1].render).not.toHaveBeenCalled();
	expect(spySprites[2].render).not.toHaveBeenCalled();
	expect(spySprites[3].render).not.toHaveBeenCalled();
    });
});

describe('rendering a mikan box:', function() {
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

    it('mikan box should render placed mikans', function() {
	var context = {};
	mikanBox.render(context);
	expect(mikan1.render).toHaveBeenCalledWith(context);
	expect(mikan2.render).toHaveBeenCalledWith(context);
	expect(mikan3.render).toHaveBeenCalledWith(context);
    });

    // mocks out a new Mikan
    function mockMikan() {
	return Renderable.makeRenderable(new Mikan(0),
					 jasmine.createSpy("render"));
    }
});
