describe('Spray', function () {
	it('Should be a Located', function () {
		var spray = new Spray(0, 0, 15, function () {});
		expect(Located.isClassOf(spray)).toBe(true);
	});

	it('Should be a Renderable', function () {
		var spray = new Spray(0, 0, 15, function () {});
		expect(Renderable.isClassOf(spray)).toBe(true);
	});

	it('Should be an Actor of priority=SPRAY', function () {
		var spray = new Spray(0, 0, 15, function () {});
		expect(Actor.isClassOf(spray)).toBe(true);
		expect(spray.priority).toBe(ActorPriorities.SPRAY);
	});

	it('Should have location', function () {
		var spray = new Spray(0, 0, 15, function () {});
		expect(Located.isClassOf(spray)).toBe(true);
		expect(spray.x).toBe(0);
		expect(spray.y).toBe(0);
		// another spray
		spray = new Spray(-10, 8, 15, function () {});
		expect(Located.isClassOf(spray)).toBe(true);
		expect(spray.x).toBe(-10);
		expect(spray.y).toBe(8);
	});

	it('Should have ttl', function () {
		var spray = new Spray(0, 0, 0, function () {});
		expect(spray.ttl).toBe(0);
		// another spray
		spray = new Spray(0, 0, 15, function () {});
		expect(spray.ttl).toBe(15);
	});

	it('Should have move', function () {
		var move = function () {};
		var spray = new Spray(0, 0, 15, move);
		expect(spray.move).toBe(move);
	});

	defineLocatedConstructorExpectations(function (x, y) {
		return new Spray(x, y, 15, function () {});
	});

	it('Should not have ttl unspecified', function () {
		expect(function () {
			new Spray(0, 0, null, function () {});
		}).toThrow();
		expect(function () {
			new Spray(0, 0, undefined, function () {});
		}).toThrow();
	});

	it('Should not have a non-number ttl', function () {
		expect(function () {
			new Spray(0, 0, '15', function () {});
		}).toThrow();
		expect(function () {
			new Spray(0, 0, true, function () {});
		}).toThrow();
	});

	it('Should not have move unspecified', function () {
		expect(function () { new Spray(0, 0, 15, null) }).toThrow();
		expect(function () { new Spray(0, 0, 15) }).toThrow();
	});

	it('Should not have a non-function move', function () {
		expect(function () { new Spray(0, 0, 15, 'move') }).toThrow();
		expect(function () { new Spray(0, 0, 15, {}) }).toThrow();
	});

	defineLocatedLocationExpectations(function () {
		return new Spray(0, 0, 15, function () {});
	});

	it(':frameIndex should initially be 0', function () {
		var spray = new Spray(0, 0, 15, function () {});
		expect(spray.frameIndex).toBe(0);
	});
});

describe('Spray working with ActorScheduler', function () {
	var scheduler;
	var move;

	beforeEach(function () {
		scheduler = new ActorScheduler();
		spyOn(scheduler, 'schedule').and.callThrough();
		move = jasmine.createSpy('move');
	});

	it(':act should move and reschedule itself unless ttl <= 0', function () {
		var spray = new Spray(0, 0, 15, move);
		spray.act(scheduler);
		expect(spray.x).toBe(0);
		expect(spray.y).toBe(0);
		expect(spray.ttl).toBe(14);
		expect(spray.frameIndex).toBe(1);
		expect(move).toHaveBeenCalledWith();
		move.calls.reset();
		expect(scheduler.schedule).toHaveBeenCalledWith(spray);
		scheduler.schedule.calls.reset();
		// acts one more time
		spray.act(scheduler);
		expect(spray.x).toEqual(0);
		expect(spray.y).toEqual(0);
		expect(spray.ttl).toBe(13);
		expect(spray.frameIndex).toBe(2);
		expect(move).toHaveBeenCalledWith();
		expect(scheduler.schedule).toHaveBeenCalledWith(spray);
	});

	it(':act should call move in the context of the spray', function () {
		var lastThis;
		var spray = new Spray(0, 0, 15, function () {
			lastThis = this;
		});
		spray.act(scheduler);
		expect(lastThis).toBe(spray);
	});

	it(':act should reset frameIndex to 0 if it is FRAME_COUNT', function () {
		var spray = new Spray(0, 0, 15, move);
		// frameIndex -> FRAME_COUNT-1
		for (var i = 1; i < Spray.FRAME_COUNT; ++i) {
			spray.act(scheduler);
		}
		expect(spray.frameIndex).toBe(Spray.FRAME_COUNT - 1);
		spray.act(scheduler);
		expect(spray.frameIndex).toBe(0);
	});

	it(':act should stop moving and rescheduling itself if ttl <= 0', function () {
		var spray = new Spray(0, 0, 0, move);
		spray.act(scheduler);
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(spray.x).toEqual(0);
		expect(spray.y).toEqual(0);
		expect(move).not.toHaveBeenCalled();
		expect(spray.frameIndex).toBe(0);
		// ttl < 0
		spray = new Spray(0, 0, -1, move);
		spray.act(scheduler);
		expect(scheduler.schedule).not.toHaveBeenCalled();
		expect(spray.x).toEqual(0);
		expect(spray.y).toEqual(0);
		expect(move).not.toHaveBeenCalled();
		expect(spray.frameIndex).toBe(0);
	});
});

describe('Spray.moveLinear', function () {
	var scheduler;

	beforeEach(function () {
		scheduler = new ActorScheduler();
	});

	it('Should move spray with speed (dX=1, dY=2)', function () {
		var spray = new Spray(0, 0, 15, Spray.moveLinear(1, 2));
		spray.act(scheduler);
		expect(spray.x).toBe(1);
		expect(spray.y).toBe(2);
		spray.act(scheduler);
		expect(spray.x).toBe(2);
		expect(spray.y).toBe(4);
	});

	it('Should move spray with speed (dX=0, dY=-3)', function () {
		var spray = new Spray(9, 100, 15, Spray.moveLinear(0, -3));
		spray.act(scheduler);
		expect(spray.x).toBe(9);
		expect(spray.y).toBe(97);
		spray.act(scheduler);
		expect(spray.x).toBe(9);
		expect(spray.y).toBe(94);
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
		var spray = new Spray(0, 0, 15, function () {});
		spray.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, 0, 0);
	});

	it('Should render a spray sprite at its location', function () {
		var context = {};
		var spray = new Spray(-10, 9, 15, function () {});
		spray.render(context);
		expect(spiedSprites[0].render).toHaveBeenCalledWith(context, -10, 9);
	});

	it('Should render a sprite corresponding to frameIndex', function () {
		var scheduler = new ActorScheduler();
		var context = {};
		var spray = new Spray(0, 0, 15, function () {});
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
