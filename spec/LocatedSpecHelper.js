/**
 * Defines common test cases 
 *
 * @method defineLocatedSpec
 * @static
 * @param factory {function}
 *     The factory of an object to be tested.
 *     Takes no arguments.
 */
function defineLocatedSpec(factory) {
    it(':x can be changed to another value', function() {
	var loc = factory();
	loc.x = 1;
	expect(loc.x).toBe(1);
	loc.x = -5;
	expect(loc.x).toBe(-5);
    });

    it(':y can be changed to another value', function() {
	var loc = factory();
	loc.y = 1;
	expect(loc.y).toBe(1);
	loc.y = -5;
	expect(loc.y).toBe(-5);
    });

    it('Can be located at another location', function() {
	var loc = factory();
	expect(loc.locate(1, 2)).toBe(loc);
	expect(loc.x).toBe(1);
	expect(loc.y).toBe(2);
	expect(loc.locate(-10, -5)).toBe(loc);
	expect(loc.x).toBe(-10);
	expect(loc.y).toBe(-5);
    });
}
