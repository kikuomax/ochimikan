/**
 * Defines general test cases of `isClassOf`.
 *
 * @method defineIsClassOfSpec
 * @static
 * @param clazz {function}
 *     The class to be tested; i.e., constructor.
 * @param factory {function}
 *     The factory of an object to be tested.
 *     Takes no arguments.
 */
function defineIsClassOfSpec(clazz, factory) {
	it(':isClassOf should be true for an object like ' + clazz.name, function () {
		expect(clazz.isClassOf(factory())).toBe(true);
	});

	it(':isClassOf should be false if no object is specified', function () {
		expect(clazz.isClassOf(null)).toBe(false);
		expect(clazz.isClassOf()).toBe(false);
    });
}

/**
 * Defines general test cases of `canAugment`.
 *
 * @method defineCanAugmentSpec
 * @static
 * @param clazz {function}
 *     The class to be tested; i.e., constructor.
 * @param factory {function}
 *     The factory of an object to be tested.
 *     Takes no arguments.
 */
function defineCanAugmentSpec(clazz, factory) {
	it(':canAugment should be true for an object which is augmentable with ' + clazz.name, function () {
		expect(clazz.canAugment(factory())).toBe(true);
	});

	it(':canAugment should be false if no object is specified', function () {
		expect(clazz.canAugment(null)).toBe(false);
		expect(clazz.canAugment()).toBe(false);
	});
}

/**
 * Defines general test cases of `augment`.
 *
 * @method defineAugmentSpec
 * @static
 * @param clazz {function}
 *     The class to be tested; i.e., constructor.
 * @param factory {function}
 *     The factory of an object to be tested. Takes no arguments.
 */
function defineAugmentSpec(clazz, factory) {
	it(':augment should make an object a ' + clazz.name, function () {
		var obj = factory();
		expect(clazz.augment(obj)).toBe(obj);
		expect(clazz.isClassOf(obj)).toBe(true);
	});

	it(':augment should throw an exception if no object is specified', function () {
		expect(function () { clazz.augment(null) }).toThrow();
		expect(function () { clazz.augment() }).toThrow();
	});
}
