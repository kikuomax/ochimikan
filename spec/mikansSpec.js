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
    });

    it('damage can be set to another value', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1;
	expect(mikan.damage).toBe(1);
	mikan.damage = Mikan.MAX_DAMAGE;
	expect(mikan.damage).toBe(Mikan.MAX_DAMAGE);
    });

    it('damage can be set to a float value but it should be floored', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1.1;
	expect(mikan.damage).toBe(1);
    });

    it('damage can be set to another value but it should not be < 0', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = -1 }).toThrow();
    });

    it('damage can be set to another value but it should not be > MAX_DAMAGE', function() {
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

describe('rendering mikan', function() {
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
