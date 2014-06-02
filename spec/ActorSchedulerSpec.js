describe('ActorScheduler', function() {
    var schedulerLike;
    var augmentable;

    beforeEach(function() {
	schedulerLike = {
	    schedule: function() {},
	    run: function() {}
	};
	augmentable = {
	    actorQueue: []
	};
    });

    it('Should have an empty actor queue', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Should be an ActorScheduler', function() {
	var scheduler = new ActorScheduler();
	expect(ActorScheduler.isClassOf(scheduler)).toBe(true);
    });

    it('Can be an ActorScheduler', function() {
	var scheduler = new ActorScheduler();
	expect(ActorScheduler.canAugment(scheduler)).toBe(true);
    });

    defineIsClassOfSpec(ActorScheduler, function() {
	return schedulerLike;
    });

    it(':isClassOf should be false for an object whose schedule is not a function', function() {
	schedulerLike.schedule = 'schedule';
	expect(ActorScheduler.isClassOf(schedulerLike)).toBe(false);
	delete schedulerLike.schedule;
	expect(ActorScheduler.isClassOf(schedulerLike)).toBe(false);
    });

    it(':isClassOf should be false for an object whose run is not a function', function() {
	schedulerLike.run = 'run';
	expect(ActorScheduler.isClassOf(schedulerLike)).toBe(false);
	delete schedulerLike.run;
	expect(ActorScheduler.isClassOf(schedulerLike)).toBe(false);
    });

    defineCanAugmentSpec(ActorScheduler, function() {
	return augmentable;
    });

    it(':canAugment should be false for an object whose actorQueue is not an Array', function() {
	augmentable.actorQueue = 'actorQueue';
	expect(ActorScheduler.canAugment(augmentable)).toBe(false);
	delete augmentable.actorQueue;
	expect(ActorScheduler.canAugment(augmentable)).toBe(false);
    });

    defineAugmentSpec(ActorScheduler, function() {
	return augmentable;
    });

    it(':augment should overwrite properties of a specified object', function() {
	augmentable.schedule = 'schedule';
	augmentable.run = 'run';
	expect(ActorScheduler.augment(augmentable)).toBe(augmentable);
	expect(ActorScheduler.isClassOf(augmentable)).toBe(true);
    });

    it('Should not schedule a non-Actor object', function() {
	var scheduler = new ActorScheduler();
	expect(function() { scheduler.schedule({}) }).toThrow();
	expect(function() { scheduler.schedule(null) }).toThrow();
	expect(function() { scheduler.schedule() }).toThrow();
    });

    it('Can run even if it is empty', function() {
	var scheduler = new ActorScheduler();
	expect(function() { scheduler.run() }).not.toThrow();
    });
});

describe('ActorScheduler running Actors:', function() {
    var act1, act2, act3;
    var scheduler;

    beforeEach(function() {
	act1 = jasmine.createSpy('act1');
	act2 = jasmine.createSpy('act2');
	act3 = jasmine.createSpy('act3');
	scheduler = new ActorScheduler();
    });

    afterEach(function() {
	act1 = undefined;
	act2 = undefined;
	act3 = undefined;
	scheduler = undefined;
    });

    it('Actor scheduler should run a scheduled actor and delete it from the queue. priority = 0', function() {
	scheduler.schedule(new Actor(0, act1));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Actor scheduler should run scheduled actors and delete them from the queue. priorities = 0, 0, 0', function() {
	scheduler.schedule(new Actor(0, act1));
	scheduler.schedule(new Actor(0, act2));
	scheduler.schedule(new Actor(0, act3));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(act2).toHaveBeenCalledWith(scheduler);
	expect(act3).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Actor scheduler should run scheduled actors and delete them from the queue. priorities = 1, 2, 1', function() {
	var leftActor;
	scheduler.schedule(new Actor(1, act1));
	scheduler.schedule(leftActor = new Actor(2, act2));
	scheduler.schedule(new Actor(1, act3));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(act3).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue).toEqual([leftActor]);
    });

    it('Actor scheduler should run scheduled actors and delete them from the queue. priorities = -1, 0, 1', function() {
	var leftActor;
	scheduler.schedule(new Actor(-1, act1));
	scheduler.schedule(new Actor(0, act2));
	scheduler.schedule(leftActor = new Actor(1, act3));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(act2).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue).toEqual([leftActor]);
    });
});
