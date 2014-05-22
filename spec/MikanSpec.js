describe('Mikan', function() {
    var mikanLike;

    beforeEach(function() {
	mikanLike = {
	    x: 0,
	    y: 0,
	    damage: 0,
	    xy: function() {},
	    locate: function() {}
	};
    });

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

    it('Should initially be located at (0, 0)', function() {
	var mikan = new Mikan(0);
	expect(mikan.x).toBe(0);
	expect(mikan.y).toBe(0);
	expect(mikan.xy()).toEqual([0, 0]);
    });

    it('Should be renderable', function() {
	expect(Renderable.isClassOf(new Mikan(0))).toBe(true);
    });

    it('Can be located at another location', function() {
	var mikan = new Mikan(0);
	expect(mikan.locate(-1, 1)).toBe(mikan);
	expect(mikan.x).toBe(-1);
	expect(mikan.y).toBe(1);
	expect(mikan.xy()).toEqual([-1, 1]);
    });

    it(':isMikan should be true for a mikan', function() {
	expect(Mikan.isMikan(new Mikan(0))).toBe(true);
	expect(Mikan.isMikan(new Mikan(Mikan.MAX_DAMAGE))).toBe(true);
    });

    it(':isMikan should be true for a mikan like object', function() {
	expect(Mikan.isMikan(mikanLike)).toBe(true);
    });

    it(':isMikan should be false for null', function() {
	expect(Mikan.isMikan(null)).toBe(false);
    });

    it(':isMikan should be false for undefined', function() {
	expect(Mikan.isMikan(undefined)).toBe(false);
    });

    it(':isMikan should be false for an object which lacks location', function() {
	var obj = { damage: 0 };
	expect(Mikan.isMikan(obj)).toBe(false);
    });

    it(':isMikan should be false for an object which lacks damage', function() {
	var obj = new Located(0, 0);
	expect(Mikan.isMikan(obj)).toBe(false);
    });

    it(':damage can be set to another value', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1;
	expect(mikan.damage).toBe(1);
	mikan.damage = Mikan.MAX_DAMAGE;
	expect(mikan.damage).toBe(Mikan.MAX_DAMAGE);
    });

    it(':damage can be set to a float value but it should be floored', function() {
	var mikan = new Mikan(0);
	mikan.damage = 1.1;
	expect(mikan.damage).toBe(1);
    });

    it(':damage can be set to another value but it should not be < 0', function() {
	var mikan = new Mikan(0);
	expect(function() { mikan.damage = -1 }).toThrow();
    });

    it(':damage can be set to another value but it should not be > MAX_DAMAGE', function() {
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

describe('Spray', function() {
    it('Should be located', function() {
	var spray = new Spray(0, 0, 2, 2, 15);
	expect(Located.isClassOf(spray)).toBe(true);
	expect(spray.x).toBe(0);
	expect(spray.y).toBe(0);
	expect(spray.xy()).toEqual([0, 0]);
	// another spray
	spray = new Spray(-10, 8, 2, 2, 15);
	expect(Located.isClassOf(spray)).toBe(true);
	expect(spray.x).toBe(-10);
	expect(spray.y).toBe(8);
	expect(spray.xy()).toEqual([-10, 8]);
    });

    it('Should have a speed', function() {
	var spray = new Spray(0, 0, 0, 0, 15);
	expect(spray.dX).toBe(0);
	expect(spray.dY).toBe(0);
	// another spray
	spray = new Spray(0, 0, 1, 0, 15);
	expect(spray.dX).toBe(1);
	expect(spray.dY).toBe(0);
	// one more spray
	spray = new Spray(0, 0, 0, 1, 15);
	expect(spray.dX).toBe(0);
	expect(spray.dY).toBe(1);
	// yet another spray
	spray = new Spray(0, 0, 0.7, -1.2, 15);
	expect(spray.dX).toBe(0.7);
	expect(spray.dY).toBe(-1.2);
    });

    it('Should have a time to live', function() {
	var spray = new Spray(0, 0, 1, 1, 0);
	expect(spray.ttl).toBe(0);
	// another spray
	spray = new Spray(0, 0, 1, 1, 15);
	expect(spray.ttl).toBe(15);
    });

    it('Should be an actor of priority=SPRAY', function() {
	var spray = new Spray(0, 0, 2, 2, 15);
	expect(Actor.isClassOf(spray)).toBe(true);
	expect(spray.priority).toBe(ActorPriorities.SPRAY);
    });

    it('Should be renderable', function() {
	var spray = new Spray(0, 0, 2, 2, 15);
	expect(Renderable.isClassOf(spray)).toBe(true);
    });

    it('Should have a frame index', function() {
	var spray = new Spray(0, 0, 2, 2, 15);
	expect(spray.frameIndex).toBe(0);
    });

    it(':act should move and reschedule itself unless ttl <= 0', function() {
	var scheduler = new ActorScheduler();
	var spray = new Spray(0, 0, 2, 2, 15);
	spray.act(scheduler);
	expect(scheduler.actorQueue).toEqual([spray]);
	expect(spray.xy()).toEqual([2, 2]);
	expect(spray.ttl).toBe(14);
	expect(spray.frameIndex).toBe(1);
	// acts one more time
	scheduler = new ActorScheduler();
	spray.act(scheduler);
	expect(scheduler.actorQueue).toEqual([spray]);
	expect(spray.xy()).toEqual([4, 4]);
	expect(spray.ttl).toBe(13);
	expect(spray.frameIndex).toBe(2);
    });

    it(':act should reset a frame index to 0 if it is FRAME_COUNT', function() {
	var scheduler = new ActorScheduler();
	var spray = new Spray(0, 0, 2, 2, 15);
	// frameIndex -> FRAME_COUNT-1
	for (var i = 1; i < Spray.FRAME_COUNT; ++i) {
	    spray.act(scheduler);
	}
	expect(spray.frameIndex).toBe(Spray.FRAME_COUNT - 1);
	spray.act(scheduler);
	expect(spray.frameIndex).toBe(0);
    });

    it(':act should stop moving and rescheduling itself if ttl <= 0', function() {
	var scheduler = new ActorScheduler();
	var spray = new Spray(0, 0, 2, 2, 0);
	spray.act(scheduler);
	expect(scheduler.actorQueue).toEqual([]);
	expect(spray.xy()).toEqual([0, 0]);
	expect(spray.frameIndex).toBe(0);
	// another spray
	spray = new Spray(0, 0, 2, 2, -1);
	spray.act(scheduler);
	expect(scheduler.actorQueue).toEqual([]);
	expect(spray.xy()).toEqual([0, 0]);
	expect(spray.frameIndex).toBe(0);
    });
});

describe('Rendering a mikan:', function() {
    var spiedSprites;

    // fakes the sprite resources
    beforeEach(function() {
	spiedSprites = Resources.SPRITES['mikan'];
	spiedSprites.forEach(function(sprite) {
	    spyOn(sprite, 'render');
	});
    });

    it('Mikan can be rendered', function() {
	var mikan = new Mikan(0);
	var context = {};
	mikan.render(context);
	expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	expect(spiedSprites[1].render).not.toHaveBeenCalled();
	expect(spiedSprites[2].render).not.toHaveBeenCalled();
	expect(spiedSprites[3].render).not.toHaveBeenCalled();
    });

    it('Damaged mikan can be rendered', function() {
	var mikan = new Mikan(Mikan.MAX_DAMAGE);
	var context = {};
	mikan.render(context);
	expect(spiedSprites[0].render).not.toHaveBeenCalled();
	expect(spiedSprites[1].render).not.toHaveBeenCalled();
	expect(spiedSprites[2].render).not.toHaveBeenCalled();
	expect(spiedSprites[3].render).toHaveBeenCalledWith(context, 0, 0);
    });

    it('Mikan can be rendered at a specified location', function() {
	var mikan = new Mikan(0).locate(10, -5);
	var context = {};
	mikan.render(context);
	expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 10, -5);
	expect(spiedSprites[1].render).not.toHaveBeenCalled();
	expect(spiedSprites[2].render).not.toHaveBeenCalled();
	expect(spiedSprites[3].render).not.toHaveBeenCalled();
    });
});

describe('Rendering a spray:', function() {
    var spiedSprites;

    // spies on the sprite resources
    beforeEach(function() {
	spiedSprites = Resources.SPRITES['spray'];
	spiedSprites.forEach(function(sprite) {
	    spyOn(sprite, 'render');
	});
    });

    it('Spray can be rendered', function() {
	var context = {};
	var spray = new Spray(0, 0, 2, 2, 15);
	spray.render(context);
	expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
    });

    it('Spray should be rendered at a specified location', function() {
	var context = {};
	var spray = new Spray(-10, 9, 2, 2, 15);
	spray.render(context);
	expect(spiedSprites[0].render).toHaveBeenCalledWith(context, -10, 9);
    });

    it('A sprite corresponding to a frame index of a spray should be rendered', function() {
	var scheduler = new ActorScheduler();
	var context = {};
	var spray = new Spray(0, 0, 0, 0, 15);
	spray.act(scheduler);
	expect(spiedSprites[1].render).not.toHaveBeenCalled();
	spray.render(context);
	expect(spiedSprites[1].render).toHaveBeenCalledWith(context, 0, 0);
	spray.act(scheduler);
	expect(spiedSprites[2].render).not.toHaveBeenCalled();
	spray.render(context);
	expect(spiedSprites[2].render).toHaveBeenCalledWith(context, 0, 0);
	// makes the frame index wraps around
	for (var i = 2; i < Spray.FRAME_COUNT; ++i) {
	    spray.act(scheduler);
	}
	expect(spray.frameIndex).toBe(0);
	expect(spiedSprites[0].render).not.toHaveBeenCalled();
	spray.render(context);
	expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
    });
});
