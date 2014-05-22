describe('ActorScheduler', function() {
    var schedulerLike;

    beforeEach(function() {
	schedulerLike = {
	    schedule: function() {},
	    run: function() {}
	};
    });

    it('Should have an empty actor queue', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Should be an ActorScheduler (isClassOf)', function() {
	var scheduler = new ActorScheduler();
	expect(ActorScheduler.isClassOf(scheduler)).toBe(true);
    });

    it('Can schedule an actor', function() {
	var scheduler = new ActorScheduler();
	var actor = new Actor(0, function(s) {});
	expect(scheduler.schedule(actor)).toBe(scheduler);
	expect(scheduler.actorQueue.length).toBe(1);
	expect(scheduler.actorQueue).toContain(actor);
    });

    it(':isClassOf should be true for an object like an actor scheduler', function() {
	expect(ActorScheduler.isClassOf(schedulerLike)).toBe(true);
    });

    it(':isClassOf should be false if no object is specified', function() {
	expect(ActorScheduler.isClassOf(null)).toBe(false);
	expect(ActorScheduler.isClassOf()).toBe(false);
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

    it(':run should be chainable', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.run()).toBe(scheduler);
    });

    it(':augment should add ActorScheduler functionalities to a specified object', function() {
	var obj = { actorQueue: [] };
	expect(ActorScheduler.augment(obj)).toBe(obj);
	expect(obj.schedule).toBe(ActorScheduler.prototype.schedule);
	expect(obj.run).toBe(ActorScheduler.prototype.run);
    });

    it(':augment should overwrite properties of a tagert', function() {
	var obj = { actorQueue: [], schedule: "schedule", run: "run" };
	expect(ActorScheduler.augment(obj)).toBe(obj);
	expect(obj.schedule).toBe(ActorScheduler.prototype.schedule);
	expect(obj.run).toBe(ActorScheduler.prototype.run);
    });
});

describe('Running scheduled actors:', function() {
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
