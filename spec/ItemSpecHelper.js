/**
 * Defines common expectations of damage specified to the constructor of `Item`.
 *
 * NOTE: assumes that `maxDamage` is greater than 0.
 *
 * @method defineItemConstructorDamageExpectations
 * @static
 * @param factory {function}
 *     The factory function of an instance to be tested.
 *     Takes damage as an argument.
 * @param maxDamage {number}
 *     The maximum damage of an instance to be tested.
 */
function defineItemConstructorDamageExpectations(factory, maxDamage) {
	it('Should have damage', function () {
		var item = factory(0);
		expect(item.damage).toBe(0);
		item = factory(1);
		expect(item.damage).toBe(1);
	});

	it('Should have maxDamage = ' + maxDamage, function () {
		var item = factory(0);
		expect(item.maxDamage).toBe(maxDamage);
	});

	it('Should truncate damage to 0 if a value < 0 specified', function () {
		var item = factory(-1);
		expect(item.damage).toBe(0);
	});

	it('Should truncate damage to maxDamage if a value > maxDamage is specified', function () {
		var item = factory(maxDamage + 1);
		expect(item.damage).toBe(maxDamage);
	});

	it('Should not have damage unspecified', function () {
		expect(function () { factory(null) }).toThrow();
		expect(function () { factory() }).toThrow();
	});

	it('Should not have a non-number damage', function () {
		expect(function () { factory('0') }).toThrow();
		expect(function () { factory(true) }).toThrow();
	});
}

/**
 * Defines common expectations of damage of an `Item`.
 *
 * NOTE: assumes that the maximum damage is greater than 0.
 *
 * @method defineItemDamageExpectations
 * @static
 * @param factory {function}
 *     The factory function of an instance to be tested.
 *     Takes no arguments.
 *     A returning instance must have `damage = 0`.
 */
function defineItemDamageExpectations(factory) {
	it(':damage can be set to another value', function () {
		var item = factory();
		item.damage = 1;
		expect(item.damage).toBe(1);
		item.damage = item.maxDamage;
		expect(item.damage).toBe(item.maxDamage);
	});

	it(':damage should be truncated to 0 if a value < 0 is specified', function () {
		var item = factory();
		item.damage = -1;
		expect(item.damage).toBe(0);
	});

	it(':damage should be truncated to maxDamage if value > maxDamage is specified', function () {
		var item = factory();
		item.damage = item.maxDamage + 1;
		expect(item.damage).toBe(item.maxDamage);
	});

	it(':damage should not be set unspecified', function () {
		var item = factory();
		expect(function () { item.damage = null }).toThrow();
		expect(function () { item.damage = undefined }).toThrow();
	});

	it(':damage should not be set to a non-number', function () {
		var item = factory();
		expect(function () { item.damage = '0' }).toThrow();
		expect(function () { item.damage = true }).toThrow();
	});

	it('Can be spoiled', function () {
		var item = factory();
		item.spoil();
		expect(item.damage).toBe(1);
	});

	it('Should not be spoiled more than maxDamage', function () {
		var item = factory();
		for (var i = 0; i < item.maxDamage; ++i) {
			item.spoil();
		}
		expect(item.damage).toBe(item.maxDamage);
		item.spoil();
		expect(item.damage).toBe(item.maxDamage);
	});
}
