describe('Preservative', function () {
	it('Should be an Item', function () {
		var preservative = new Preservative();
		expect(Item.isClassOf(preservative)).toBe(true);
	});

	it('Should be Renderable', function () {
		var preservative = new Preservative();
		expect(Renderable.isClassOf(preservative)).toBe(true);
	});

	it('Should initially be located at (0, 0)', function () {
		var preservative = new Preservative();
		expect(preservative.x).toBe(0);
		expect(preservative.y).toBe(0);
	});

	it('Should have typeId TYPE_PRESERVATIVE', function () {
		var preservative = new Preservative();
		expect(preservative.typeId).toBe(Item.TYPE_PRESERVATIVE);
	});

	it('Should not initially be damaged', function () {
		var preservative = new Preservative();
		expect(preservative.damage).toBe(0);
	});

	it('Should have maxDamage = 4', function () {
		var preservative = new Preservative();
		expect(preservative.maxDamage).toBe(4);
	});

	defineLocatedLocationExpectations(function () {
		return new Preservative();
	});

	defineItemDamageExpectations(function () {
		return new Preservative();
	});
});

describe('Preservative as a Renderable', function () {
	var spiedSprites;

	beforeEach(function () {
		spiedSprites = Resources.SPRITES['preservative'];
		spiedSprites.forEach(function (sprite) {
			spyOn(sprite, 'render');
		});
	});

	it('Should render a corresponding sprite (damage=0)', function () {
		var preservative = new Preservative();
		var context = {};
		preservative.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
		for (var i = 1; i <= Preservative.MAX_DAMAGE; ++i) {
			expect(spiedSprites[i].render).not.toHaveBeenCalled();
		}
	});

	it('Should render a corresponding sprite (damage=MAX_DAMAGE)', function () {
		var preservative = new Preservative();
		preservative.damage = Preservative.MAX_DAMAGE;
		var context = {};
		preservative.render(context);
		for (var i = 0; i < Preservative.MAX_DAMAGE; ++i) {
			expect(spiedSprites[i].render).not.toHaveBeenCalled();
		}
		expect(spiedSprites[Preservative.MAX_DAMAGE].render).toHaveBeenCalledWith(context, 0, 0);
	});

	it('Should render a sprite at a specified location', function () {
		var preservative = new Preservative();
		preservative.locate(20, -11);
		var context = {};
		preservative.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 20, -11);
	});
});
