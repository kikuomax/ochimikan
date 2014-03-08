describe('Located', function() {
    it('Should have (x, y)', function() {
	var loc = new Located(0, 0);
	expect(loc.x).toBe(0);
	expect(loc.y).toBe(0);
	expect(loc.xy()).toEqual([0, 0]);
	loc = new Located(-1, 2);
	expect(loc.x).toBe(-1);
	expect(loc.y).toBe(2);
	expect(loc.xy()).toEqual([-1, 2]);
    });

    it(':isLocated should be true for a Located', function() {
	expect(Located.isLocated(new Located(0, 0))).toBe(true);
	expect(Located.isLocated(new Located(1, -1))).toBe(true);
    });

    it(':isLocated should be true for a Located like object', function() {
	var locatedLike = { x: 0, y: 0 };
	expect(Located.isLocated(locatedLike)).toBe(true);
    });

    it(':isLocated should be false for null', function() {
	expect(Located.isLocated(null)).toBe(false);
    });

    it(':isLocated should be false for undefined', function() {
	expect(Located.isLocated(undefined)).toBe(false);
    });

    it(':isLocated should be false for an object which lacks x', function() {
	expect(Located.isLocated({ y: 0 })).toBe(false);
    });

    it(':isLocated should be false for an object which lacks y', function() {
	expect(Located.isLocated({ x: 0 })).toBe(false);
    });

    it(':x can be changed to another value', function() {
	var loc = new Located(0, 0);
	loc.x = 1;
	expect(loc.x).toBe(1);
	expect(loc.xy()).toEqual([1, 0]);
	loc.x = -5;
	expect(loc.x).toBe(-5);
	expect(loc.xy()).toEqual([-5, 0]);
    });

    it(':y can be changed to another value', function() {
	var loc = new Located(0, 0);
	loc.y = 1;
	expect(loc.y).toBe(1);
	expect(loc.xy()).toEqual([0, 1]);
	loc.y = -5;
	expect(loc.y).toBe(-5);
	expect(loc.xy()).toEqual([0, -5]);
    });

    it('Can be located at another location', function() {
	var loc = new Located(0, 0);
	expect(loc.locate(1, 2)).toBe(loc);
	expect(loc.x).toBe(1);
	expect(loc.y).toBe(2);
	expect(loc.xy()).toEqual([1, 2]);
	expect(loc.locate(-10, -5)).toBe(loc);
	expect(loc.x).toBe(-10);
	expect(loc.y).toBe(-5);
	expect(loc.xy()).toEqual([-10, -5]);
    });

    it(':wrap should add Located functionalities to the specified object', function() {
	var obj = { x: 0, y: 0 };
	expect(Located.wrap(obj)).toBe(obj);
	expect(obj.xy).toBe(Located.prototype.xy);
	expect(obj.locate).toBe(Located.prototype.locate);
	expect(obj.xy()).toEqual([0, 0]);
	expect(obj.locate(1, 2)).toBe(obj);
	expect(obj.x).toBe(1);
	expect(obj.y).toBe(2);
	expect(obj.xy()).toEqual([1, 2]);
    });

    it(':wrap should overwrite properties of a target', function() {
	var obj = { x: 0, y: 0, xy: "xy", locate: "locate" };
	expect(Located.wrap(obj)).toBe(obj);
	expect(obj.xy).toBe(Located.prototype.xy);
	expect(obj.locate).toBe(Located.prototype.locate);
	expect(obj.xy()).toEqual([0, 0]);
	expect(obj.locate(-1, 1)).toBe(obj);
	expect(obj.x).toBe(-1);
	expect(obj.y).toBe(1);
	expect(obj.xy()).toEqual([-1, 1]);
    });
});
