describe('Mikan', function() {
    it('Should have damage', function() {
	expect(new Mikan(0).damage).toBe(0);
	expect(new Mikan(Mikan.MAX_DAMAGE).damage).toBe(Mikan.MAX_DAMAGE);
    });

    it('Should floor damage', function() {
	var mikan = new Mikan(0.1);
	expect(mikan.damage).toBe(0);
    });

    it('Should not have damage < 0', function() {
	expect(function() { new Mikan(-1); }).toThrow();
    });

    it('Should not have damage > Mikan.MAX_DAMAGE', function() {
	expect(function() { new Mikan(Mikan.MAX_DAMAGE + 1)}).toThrow();
    });

    it('Should be located at (0, 0)', function() {
	var mikan = new Mikan(0);
	expect(mikan.x).toBe(0);
	expect(mikan.y).toBe(0);
    });

    it('damage can be set to another value', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1;
	expect(mikan.damage).toBe(1);
	mikan.damage = Mikan.MAX_DAMAGE;
	expect(mikan.damage).toBe(Mikan.MAX_DAMAGE);
    });

    it('damage can be set to float but it should be floored', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1.1;
	expect(mikan.damage).toBe(1);
    });

    it('damage can be set to another value but it should not be < 0', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = -1 }).toThrow();
    });

    it('damage can be set to another value but it should not be > MAX_DAMAGE', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = Mikan.MAX_DAMAGE + 1 }).toThrow();
    });

    it('Can be spoiled', function() {
	var mikan = new Mikan(0);
	expect(mikan.spoil().damage).toBe(1);
	expect(mikan.spoil().damage).toBe(2);
    });

    it('Can not be spoiled more than MAX_DAMAGE', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	expect(mikan.spoil().damage).toBe(Mikan.MAX_DAMAGE);
    });
});

describe('rendering mikan', function() {
    it('Mikan can be rendered', function() {
	expect(true).toBe(false);
    });
});
