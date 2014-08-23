/**
 * Defines common test cases 
 *
 * @method defineLocatedSpec
 * @static
 * @param factory {function}
 *     The factory function of an object to be tested.
 *     Takes no arguments.
 *     A resulting `Located` must be located at (0, 0).
 */
function defineLocatedSpec(factory) {
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
