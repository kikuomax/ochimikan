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

	it('Should have location (x, y)', function () {
		var loc = new Located(0, 0);
		expect(loc.x).toBe(0);
		expect(loc.y).toBe(0);
		loc = new Located(-1, 2);
		expect(loc.x).toBe(-1);
		expect(loc.y).toBe(2);
	});

	it('Should not have an x unspecified', function () {
		expect(function () { new Located(null, 0) }).toThrow();
		expect(function () { new Located(undefined, 0) }).toThrow();
	});

	it('Should not have a non-number x', function () {
		expect(function () { new Located('0', 0) }).toThrow();
		expect(function () { new Located(true, 0) }).toThrow();
	});

	it('Should not have a y unspecified', function () {
		expect(function () { new Located(0, null) }).toThrow();
		expect(function () { new Located(0) }).toThrow();
	});

	it('Should not have a non-number y', function () {
		expect(function () { new Located(0, '0') }).toThrow();
		expect(function () { new Located(0, true) }).toThrow();
	});

	defineIsClassOfSpec(Located, function () {
		return locatedLike;
	});

	it(':isClassOf should be false for an object whose x is not a number', function () {
		delete locatedLike.x;
		expect(Located.isClassOf(locatedLike)).toBe(false);
		locatedLike.x = 'x';
		expect(Located.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose y is not a number', function () {
		delete locatedLike.y;
		expect(Located.isClassOf(locatedLike)).toBe(false);
		locatedLike.y = 'y';
		expect(Located.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose locate is not a function', function () {
		delete locatedLike.locate;
		expect(Located.isClassOf(locatedLike)).toBe(false);
		locatedLike.locate = 'locate';
		expect(Located.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose translate is not a function', function () {
		delete locatedLike.translate;
		expect(Located.isClassOf(locatedLike)).toBe(false);
		locatedLike.translate = 'translate';
		expect(Located.isClassOf(locatedLike)).toBe(false);
	});

	defineCanAugmentSpec(Located, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose x is not a number', function () {
		augmentable.x = 'x';
		expect(Located.canAugment(augmentable)).toBe(false);
		delete augmentable.x;
		expect(Located.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose y is not a number', function () {
		augmentable.y = 'y';
		expect(Located.canAugment(augmentable)).toBe(false);
		delete augmentable.y;
		expect(Located.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Located, function () {
		return augmentable;
	});

	it(':augment should overwrite properties of a target', function () {
		augmentable.locate = 'locate';
		expect(Located.augment(augmentable)).toBe(augmentable);
		expect(Located.isClassOf(augmentable)).toBe(true);
	});

	defineLocatedSpec(function () {
		return new Located(0, 0);
	});
});

describe('Augmented Located', function () {
	defineLocatedSpec(function () {
		return Located.augment({ x: 0, y: 0 });
	});
});
