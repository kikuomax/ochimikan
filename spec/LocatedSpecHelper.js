/**
 * Defines common expectations of the constructor of the `Located`.
 *
 * @method defineLocatedConstructorExpectations
 * @static
 * @param factory {function}
 *     The factory function of an instance to be tested.
 *     Takes x- and y-coordinate values of the location.
 */
function defineLocatedConstructorExpectations(factory) {
	it('Should have location (x, y)', function () {
		var loc = factory(0, 0);
		expect(loc.x).toBe(0);
		expect(loc.y).toBe(0);
		loc = factory(-1, 2);
		expect(loc.x).toBe(-1);
		expect(loc.y).toBe(2);
	});

	it('Should not have an x unspecified', function () {
		expect(function () { factory(null, 0) }).toThrow();
		expect(function () { factory(undefined, 0) }).toThrow();
	});

	it('Should not have a non-number x', function () {
		expect(function () { factory('0', 0) }).toThrow();
		expect(function () { factory(true, 0) }).toThrow();
	});

	it('Should not have a y unspecified', function () {
		expect(function () { factory(0, null) }).toThrow();
		expect(function () { factory(0) }).toThrow();
	});

	it('Should not have a non-number y', function () {
		expect(function () { factory(0, '0') }).toThrow();
		expect(function () { factory(0, true) }).toThrow();
	});
}

/**
 * Defines common expectations of the `isClassOf` of the `Located`.
 *
 * @method defineLocatedIsClassOfExpectations
 * @static
 * @param clazz {function}
 *     The class to be tested; i.e., its constructor.
 * @param factory {function}
 *     The factory function of an instance to be tested.
 *     Takes no arguments.
 */
function defineLocatedIsClassOfExpectations(clazz, factory) {
	it(':isClassOf should be false for an object whose x is not a number', function () {
		var locatedLike = factory();
		delete locatedLike.x;
		expect(clazz.isClassOf(locatedLike)).toBe(false);
		locatedLike.x = 'x';
		expect(clazz.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose y is not a number', function () {
		var locatedLike = factory();
		delete locatedLike.y;
		expect(clazz.isClassOf(locatedLike)).toBe(false);
		locatedLike.y = 'y';
		expect(clazz.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose locate is not a function', function () {
		var locatedLike = factory();
		delete locatedLike.locate;
		expect(clazz.isClassOf(locatedLike)).toBe(false);
		locatedLike.locate = 'locate';
		expect(clazz.isClassOf(locatedLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose translate is not a function', function () {
		var locatedLike = factory();
		delete locatedLike.translate;
		expect(clazz.isClassOf(locatedLike)).toBe(false);
		locatedLike.translate = 'translate';
		expect(clazz.isClassOf(locatedLike)).toBe(false);
	});
}

/**
 * Defines common expectations of `canAugment` of the `Located`.
 *
 * @method defineLocatedCanAugmentExpectations
 * @static
 * @param clazz {function}
 *     The class to be tested; i.e., its constructor.
 * @param factory {function}
 *     The factory function of an instance to be tested.
 *     Takes no arguments.
 */
function defineLocatedCanAugmentExpectations(clazz, factory) {
	it(':canAugment should be false for an object whose x is not a number', function () {
		var augmentable = factory();
		augmentable.x = 'x';
		expect(clazz.canAugment(augmentable)).toBe(false);
		delete augmentable.x;
		expect(clazz.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose y is not a number', function () {
		var augmentable = factory();
		augmentable.y = 'y';
		expect(clazz.canAugment(augmentable)).toBe(false);
		delete augmentable.y;
		expect(clazz.canAugment(augmentable)).toBe(false);
	});
}

/**
 * Defines common expectations of the location of the `Located`.
 *
 * @method defineLocatedLocationExpectations
 * @static
 * @param factory {function}
 *     The factory function of an object to be tested.
 *     Takes no arguments.
 *     A resulting `Located` must be located at (0, 0).
 */
function defineLocatedLocationExpectations(factory) {
	it(':x can be changed to another value', function () {
		var loc = factory();
		loc.x = 1;
		expect(loc.x).toBe(1);
		loc.x = -5;
		expect(loc.x).toBe(-5);
	});

	it(':y can be changed to another value', function () {
		var loc = factory();
		loc.y = 1;
		expect(loc.y).toBe(1);
		loc.y = -5;
		expect(loc.y).toBe(-5);
	});

	it('Can be located at another location', function () {
		var loc = factory();
		expect(loc.locate(1, 2)).toBe(loc);
		expect(loc.x).toBe(1);
		expect(loc.y).toBe(2);
		expect(loc.locate(-10, -5)).toBe(loc);
		expect(loc.x).toBe(-10);
		expect(loc.y).toBe(-5);
	});

	it('Can be translated', function () {
		var loc = factory();
		expect(loc.translate(0, 0)).toBe(loc);
		expect(loc.x).toBe(0);
		expect(loc.y).toBe(0);
		expect(loc.translate(1, 0)).toBe(loc);
		expect(loc.x).toBe(1);
		expect(loc.y).toBe(0);
		expect(loc.translate(0, 1)).toBe(loc);
		expect(loc.x).toBe(1);
		expect(loc.y).toBe(1);
		expect(loc.translate(-3, 2.5)).toBe(loc);
		expect(loc.x).toBe(-2);
		expect(loc.y).toBe(3.5);
	});
}
