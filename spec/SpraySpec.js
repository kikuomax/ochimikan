describe('Spray', function () {
	it('Should be a Located', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		expect(Located.isClassOf(spray)).toBe(true);
	});

	it('Should be a Renderable', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		expect(Renderable.isClassOf(spray)).toBe(true);
	});

	it('Should be an Actor of priority=SPRAY', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		expect(Actor.isClassOf(spray)).toBe(true);
		expect(spray.priority).toBe(ActorPriorities.SPRAY);
	});

	it('Should have location', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		expect(Located.isClassOf(spray)).toBe(true);
		expect(spray.x).toBe(0);
		expect(spray.y).toBe(0);
		// another spray
		spray = new Spray(-10, 8, 2, 2, 15);
		expect(Located.isClassOf(spray)).toBe(true);
		expect(spray.x).toBe(-10);
		expect(spray.y).toBe(8);
	});

	it('Should have speed', function () {
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

	it('Should have ttl', function () {
		var spray = new Spray(0, 0, 1, 1, 0);
		expect(spray.ttl).toBe(0);
		// another spray
		spray = new Spray(0, 0, 1, 1, 15);
		expect(spray.ttl).toBe(15);
	});

	defineLocatedSpec(function () {
		return new Spray(0, 0, 2, 2, 15);
	});

	it(':frameIndex should initially be 0', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		expect(spray.frameIndex).toBe(0);
	});
});

describe('Spray working with ActorScheduler', function () {
	var scheduler;

	beforeEach(function () {
		scheduler = new ActorScheduler();
		spyOn(scheduler, 'schedule').and.callThrough();
	});

	it(':act should move and reschedule itself unless ttl <= 0', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		spray.act(scheduler);
		expect(spray.x).toBe(2);
		expect(spray.y).toBe(2);
		expect(spray.ttl).toBe(14);
		expect(spray.frameIndex).toBe(1);
		expect(scheduler.schedule).toHaveBeenCalledWith(spray);
		scheduler.schedule.calls.reset();
		// acts one more time
		spray.act(scheduler);
		expect(spray.x).toEqual(4);
		expect(spray.y).toEqual(4);
		expect(spray.ttl).toBe(13);
		expect(spray.frameIndex).toBe(2);
		expect(scheduler.schedule).toHaveBeenCalledWith(spray);
	});

	it(':act should reset frameIndex to 0 if it is FRAME_COUNT', function () {
		var spray = new Spray(0, 0, 2, 2, 15);
		// frameIndex -> FRAME_COUNT-1
		for (var i = 1; i < Spray.FRAME_COUNT; ++i) {
			spray.act(scheduler);
		}
		expect(spray.frameIndex).toBe(Spray.FRAME_COUNT - 1);
		spray.act(scheduler);
		expect(spray.frameIndex).toBe(0);
	});

	it(':act should stop moving and rescheduling itself if ttl <= 0', function () {
		var spray = new Spray(0, 0, 2, 2, 0);
		spray.act(scheduler);
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(spray.x).toEqual(0);
		expect(spray.y).toEqual(0);
		expect(spray.frameIndex).toBe(0);
		// another spray
		spray = new Spray(0, 0, 2, 2, -1);
		spray.act(scheduler);
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(spray.x).toEqual(0);
		expect(spray.y).toEqual(0);
		expect(spray.frameIndex).toBe(0);
	});
});

describe('Spray as a Renderable:', function () {
	var spiedSprites;

	// spies on the sprite resources
	beforeEach(function () {
		spiedSprites = Resources.SPRITES['spray'];
		spiedSprites.forEach(function (sprite) {
			spyOn(sprite, 'render');
		});
	});

	it('Should render a spray sprite', function () {
		var context = {};
		var spray = new Spray(0, 0, 2, 2, 15);
		spray.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	});

	it('Should render a spray sprite at its location', function () {
		var context = {};
		var spray = new Spray(-10, 9, 2, 2, 15);
		spray.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, -10, 9);
	});

	it('Should render a sprite corresponding to frameIndex', function () {
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
		expect(spiedSprites[0].render).not.toHaveBeenCalled();
		spray.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	});
});
