describe('Located', function () {
	var locatedLike;
	var augmentable;

	beforeEach(function () {
		locatedLike = {
			x: 0,
			y: 0,
			locate: function () {},
			translate: function () {}
		};
		augmentable = {
			x: 0,
			y: 0
		};
	});

	it('Should be a Located', function () {
		expect(Located.isClassOf(new Located(0, 0))).toBe(true);
		expect(Located.isClassOf(new Located(1, -1))).toBe(true);
	});

	defineLocatedConstructorExpectations(function (x, y) {
		return new Located(x, y);
	});

	defineIsClassOfSpec(Located, function () {
		return locatedLike;
	});

	defineLocatedIsClassOfExpectations(Located, function () {
		return locatedLike;
	});

	defineCanAugmentSpec(Located, function () {
		return augmentable;
	});

	defineLocatedCanAugmentExpectations(Located, function () {
		return augmentable;
	});

	defineAugmentSpec(Located, function () {
		return augmentable;
	});

	defineLocatedLocationExpectations(function () {
		return new Located(0, 0);
	});
});

describe('Augmented Located', function () {
	var located1, located2;

	beforeEach(function () {
		located1 = { x: 0, y: 0 };
		located2 = { x: -1, y: 2 };
	});

	it('Should retain x', function () {
		expect(located1.x).toBe(0);
		expect(located2.x).toBe(-1);
	});

	it('Should retain y', function () {
		expect(located1.y).toBe(0);
		expect(located2.y).toBe(2);
	});

	defineLocatedLocationExpectations(function () {
		return Located.augment(located1);
	});
});
