describe('Mikan', function () {
	it('Should be a Located', function () {
		var mikan = new Mikan(0);
		expect(Located.isClassOf(mikan)).toBe(true);
	});

	it('Should be a Renderable', function () {
		var mikan = new Mikan(0);
		expect(Renderable.isClassOf(mikan)).toBe(true);
	});

	it('Should have damage', function () {
		expect(new Mikan(0).damage).toBe(0);
		expect(new Mikan(Mikan.MAX_DAMAGE).damage).toBe(Mikan.MAX_DAMAGE);
	});

	it('Should initially be located at (0, 0)', function () {
		var mikan = new Mikan(0);
		expect(mikan.x).toBe(0);
		expect(mikan.y).toBe(0);
	});

	it('Should not have damage unspecified', function () {
		expect(function () { new Mikan(null) }).toThrow();
		expect(function () { new Mikan() }).toThrow();
	});

	it('Should not have non-number damage', function () {
		expect(function () { new Mikan('0') }).toThrow();
		expect(function () { new Mikan(true) }).toThrow();
	});

	it('Should not have damage < 0', function () {
		expect(function () { new Mikan(-1); }).toThrow();
	});

	it('Should not have damage > Mikan.MAX_DAMAGE', function () {
		expect(function () { new Mikan(Mikan.MAX_DAMAGE + 1)}).toThrow();
	});

	defineLocatedSpec(function () {
		return new Mikan(0);
	});

	it(':damage can be set to another value', function () {
		var mikan = new Mikan(0);
		mikan.damage = 1;
		expect(mikan.damage).toBe(1);
		mikan.damage = Mikan.MAX_DAMAGE;
		expect(mikan.damage).toBe(Mikan.MAX_DAMAGE);
	});

	it(':damage should not be set unspecified', function () {
		var mikan = new Mikan(0);
		expect(function () { mikan.damage = null }).toThrow();
		expect(function () { mikan.damage = undefined }).toThrow();
	});

	it(':damage should not be set to a non-number', function () {
		var mikan = new Mikan(0);
		expect(function () { mikan.damage = '0' }).toThrow();
		expect(function () { mikan.damage = true }).toThrow();
	});

	it(':damage should not be set to a value < 0', function () {
		var mikan = new Mikan(0);
		expect(function () { mikan.damage = -1 }).toThrow();
	});

	it(':damage should not be set to a value > MAX_DAMAGE', function () {
		var mikan = new Mikan(0);
		expect(function () { mikan.damage = Mikan.MAX_DAMAGE + 1 }).toThrow();
	});

	it('Can be spoiled', function () {
		var mikan = new Mikan(0);
		expect(mikan.spoil().damage).toBe(1);
		expect(mikan.spoil().damage).toBe(2);
	});

	it('Should not be spoiled more than MAX_DAMAGE', function () {
		var mikan = new Mikan(Mikan.MAX_DAMAGE);
		expect(mikan.spoil().damage).toBe(Mikan.MAX_DAMAGE);
	});
});

describe('Mikan as a Renderable:', function () {
	var spiedSprites;

	// fakes the sprite resources
	beforeEach(function () {
		spiedSprites = Resources.SPRITES['mikan'];
		spiedSprites.forEach(function (sprite) {
			spyOn(sprite, 'render');
		});
	});

	it('Should render a corresponding sprite (damage=0)', function () {
		var mikan = new Mikan(0);
		var context = {};
		mikan.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
		expect(spiedSprites[1].render).not.toHaveBeenCalled();
		expect(spiedSprites[2].render).not.toHaveBeenCalled();
		expect(spiedSprites[3].render).not.toHaveBeenCalled();
	});

	it('Should render a corresponding sprite (MAX_DAMAGE)', function () {
		var mikan = new Mikan(Mikan.MAX_DAMAGE);
		var context = {};
		mikan.render(context);
		expect(spiedSprites[0].render).not.toHaveBeenCalled();
		expect(spiedSprites[1].render).not.toHaveBeenCalled();
		expect(spiedSprites[2].render).not.toHaveBeenCalled();
		expect(spiedSprites[3].render).toHaveBeenCalledWith(context, 0, 0);
	});

	it('Should render a sprite at its location', function () {
		var mikan = new Mikan(0).locate(10, -5);
		var context = {};
		mikan.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 10, -5);
		expect(spiedSprites[1].render).not.toHaveBeenCalled();
		expect(spiedSprites[2].render).not.toHaveBeenCalled();
		expect(spiedSprites[3].render).not.toHaveBeenCalled();
	});
});
