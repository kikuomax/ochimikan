describe('Located', function() {
    var locatedLike;
    var augmentable;

    beforeEach(function() {
	locatedLike = {
	    x: 0,
	    y: 0,
	    xy: function() {},
	    locate: function() {}
	};
	augmentable = {
	    x: 0,
	    y: 0
	};
    });

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

    it('Should be a Located (isClassOf)', function() {
	expect(Located.isClassOf(new Located(0, 0))).toBe(true);
	expect(Located.isClassOf(new Located(1, -1))).toBe(true);
    });

    it('Can be a Located (canAugment)', function() {
	expect(Located.canAugment(new Located(0, 0))).toBe(true);
	expect(Located.canAugment(new Located(1, -1))).toBe(true);
    });

    it(':isClassOf should be true for an object like a Located', function() {
	expect(Located.isClassOf(locatedLike)).toBe(true);
    });

    it(':isClassOf should be false if no object is specified', function() {
	expect(Located.isClassOf(null)).toBe(false);
	expect(Located.isClassOf()).toBe(false);
    });

    it(':isClassOf should be false for an object which lacks x', function() {
	locatedLike.x = null;
	expect(Located.isClassOf(locatedLike)).toBe(false);
	delete locatedLike.x;
	expect(Located.isClassOf(locatedLike)).toBe(false);
    });

    it(':isClassOf should be false for an object which lacks y', function() {
	locatedLike.y = null;
	expect(Located.isClassOf(locatedLike)).toBe(false);
	delete locatedLike.y;
	expect(Located.isClassOf(locatedLike)).toBe(false);
    });

    it(':isClassOf should be false for an object whose xy is not a function', function() {
	locatedLike.xy = 'xy';
	expect(Located.isClassOf(locatedLike)).toBe(false);
	delete locatedLike.xy;
	expect(Located.isClassOf(locatedLike)).toBe(false);
    });

    it(':isClassOf should be false for an object whose xy is not a function', function() {
	locatedLike.locate = 'locate';
	expect(Located.isClassOf(locatedLike)).toBe(false);
	delete locatedLike.locate;
	expect(Located.isClassOf(locatedLike)).toBe(false);
    });

    it(':canAugment should be false if no object is specified', function() {
	expect(Located.canAugment(null)).toBe(false);
	expect(Located.canAugment()).toBe(false);
    });

    it(':canAugment should be false for an object which lacks x', function() {
	var obj = augmentable;
	obj.x = null;
	expect(Located.canAugment(obj)).toBe(false);
	delete obj.x;
	expect(Located.canAugment(obj)).toBe(false);
    });

    it(':canAugment should be false for an object which lacks y', function() {
	var obj = augmentable;
	obj.y = null;
	expect(Located.canAugment(obj)).toBe(false);
	delete obj.y;
	expect(Located.canAugment(obj)).toBe(false);
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

    it(':augment should make an object a Located', function() {
	var obj = { x: 0, y: 0 };
	expect(Located.augment(obj)).toBe(obj);
	expect(obj.xy).toBe(Located.prototype.xy);
	expect(obj.locate).toBe(Located.prototype.locate);
	expect(obj.xy()).toEqual([0, 0]);
	expect(obj.locate(1, 2)).toBe(obj);
	expect(obj.x).toBe(1);
	expect(obj.y).toBe(2);
	expect(obj.xy()).toEqual([1, 2]);
    });

    it(':augment should overwrite properties of a target', function() {
	var obj = { x: 0, y: 0, xy: "xy", locate: "locate" };
	expect(Located.augment(obj)).toBe(obj);
	expect(obj.xy).toBe(Located.prototype.xy);
	expect(obj.locate).toBe(Located.prototype.locate);
	expect(obj.xy()).toEqual([0, 0]);
	expect(obj.locate(-1, 1)).toBe(obj);
	expect(obj.x).toBe(-1);
	expect(obj.y).toBe(1);
	expect(obj.xy()).toEqual([-1, 1]);
    });
});
