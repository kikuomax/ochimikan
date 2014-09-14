describe('Mikan', function () {
	it('Should be an Item', function () {
		var mikan = new Mikan(0);
		expect(Item.isClassOf(mikan)).toBe(true);
	});

	it('Should be a Renderable', function () {
		var mikan = new Mikan(0);
		expect(Renderable.isClassOf(mikan)).toBe(true);
	});

	it('Should have typeId TYPE_MIKAN', function () {
		var mikan = new Mikan(0);
		expect(mikan.typeId).toBe(Item.TYPE_MIKAN);
	});

	it('Should initially be located at (0, 0)', function () {
		var mikan = new Mikan(0);
		expect(mikan.x).toBe(0);
		expect(mikan.y).toBe(0);
	});

	defineItemConstructorDamageExpectations(function (damage) {
		return new Mikan(damage);
	}, Mikan.MAX_DAMAGE);

	defineLocatedLocationExpectations(function () {
		return new Mikan(0);
	});

	defineItemDamageExpectations(function () {
		return new Mikan(0);
	});
});

describe('Mikan as a Renderable:', function () {
	var spiedSprites;

	// spies on the sprite resources
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
		for (var i = 1; i <= Mikan.MAX_DAMAGE; ++i) {
			expect(spiedSprites[i].render).not.toHaveBeenCalled();
		}
	});

	it('Should render a corresponding sprite (damage=MAX_DAMAGE)', function () {
		var mikan = new Mikan(Mikan.MAX_DAMAGE);
		var context = {};
		mikan.render(context);
		for (var i = 0; i < Mikan.MAX_DAMAGE; ++i) {
			expect(spiedSprites[i].render).not.toHaveBeenCalled();
		}
		expect(spiedSprites[Mikan.MAX_DAMAGE].render).toHaveBeenCalledWith(context, 0, 0);
	});

	it('Should render a sprite at its location', function () {
		var mikan = new Mikan(0).locate(10, -5);
		var context = {};
		mikan.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 10, -5);
	});
});
