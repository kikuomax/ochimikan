describe('Located', function() {
    it('Should have (x, y)', function() {
	var loc = new Located(0, 0);
	expect(loc.x).toBe(0);
	expect(loc.y).toBe(0);
	loc = new Located(-1, 2);
	expect(loc.x).toBe(-1);
	expect(loc.y).toBe(2);
    });

    it('x can be changed to another value', function() {
	var loc = new Located(0, 0);
	loc.x = 1;
	expect(loc.x).toBe(1);
	loc.x = -5;
	expect(loc.x).toBe(-5);
    });

    it('y can be changed to another value', function() {
	var loc = new Located(0, 0);
	loc.y = 1;
	expect(loc.y).toBe(1);
	loc.y = -5;
	expect(loc.y).toBe(-5);
    });

    it('makeLocated make object located', function() {
	var obj = { };
	expect(Located.makeLocated(obj, 0, 0)).toBe(obj);
	expect(obj.x).toBe(0);
	expect(obj.y).toBe(0);
	expect(Located.makeLocated(obj, -10, 99)).toBe(obj);
	expect(obj.x).toBe(-10);
	expect(obj.y).toBe(99);
    });

    it('Can be located at another location', function() {
	var loc = new Located(0, 0);
	expect(loc.locate(1, 2)).toBe(loc);
	expect(loc.x).toBe(1);
	expect(loc.y).toBe(2);
	expect(loc.locate(-10, -5)).toBe(loc);
	expect(loc.x).toBe(-10);
	expect(loc.y).toBe(-5);
    });
});
