describe('Actor', function() {
    var actorLike;

    beforeEach(function() {
	actorLike = {
	    priority: 0,
	    act: function() {}
	};
    });

    it('Should have a priority', function() {
	var actor = new Actor(0, function(s){});
	expect(actor.priority).toBe(0);
	actor = new Actor(1, function(s){});
	expect(actor.priority).toBe(1);
	actor = new Actor(-1, function(s){});
	expect(actor.priority).toBe(-1);
    });

    it('Should have a specified action', function() {
	var act = function(s) {};
	var actor = new Actor(1, act);
	expect(actor.act).toBe(act);
    });

    it('Should be an Actor (isClassOf)', function() {
	var actor = new Actor(0, function(s){});
	expect(Actor.isClassOf(actor)).toBe(true);
    });

    it('Should throw an exception if priority is not specified', function() {
	expect(function(){
	    new Actor(undefined, function(s) {});
	}).toThrow();
    });

    it('Should throw an exception if act is not a function', function() {
	expect(function() { new Actor(0, {}) }).toThrow();
	expect(function() { new Actor(0) }).toThrow();
    });

    it(':isClassOf should be true for an object like an actor', function() {
	expect(Actor.isClassOf(actorLike)).toBe(true);
    });

    it(':isClassOf should be false if no object is specified', function() {
	expect(Actor.isClassOf(null)).toBe(false);
	expect(Actor.isClassOf()).toBe(false);
    });

    it(':isClassOf should be false for an object which lacks priority', function() {
	actorLike.priority = null;
	expect(Actor.isClassOf(actorLike)).toBe(false);
	delete actorLike.priority;
	expect(Actor.isClassOf(actorLike)).toBe(false);
    });

    it(':isClassOf should be false for an object whose act is not a function', function() {
	actorLike.act = 'act';
	expect(Actor.isClassOf(actorLike)).toBe(false);
	delete actorLike.act;
	expect(Actor.isClassOf(actorLike)).toBe(false);
    });

    it(':comparePriorities should return 0 if lhs.priority == rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(0, nop))).toBe(0);
	expect(Actor.comparePriorities(new Actor(1, nop),
				       new Actor(1, nop))).toBe(0);
    });

    it(':comparePriorities should return a negative number if lhs.priority < rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(1, nop))).toBeLessThan(0);
	expect(Actor.comparePriorities(new Actor(-1, nop),
				       new Actor(0, nop))).toBeLessThan(0);
    });

    it(':comparePriorities should return a positive number if lhs.priority > rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(-1, nop))).toBeGreaterThan(0);
	expect(Actor.comparePriorities(new Actor(1, nop),
				       new Actor(0, nop))).toBeGreaterThan(0);
    });

    // does nothing
    function nop(scheduler) { }
});

describe('ActorScheduler', function() {
    it('Should have an empty actor queue', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Can schedule an actor', function() {
	var scheduler = new ActorScheduler();
	var actor = new Actor(0, function(s) {});
	expect(scheduler.schedule(actor)).toBe(scheduler);
	expect(scheduler.actorQueue.length).toBe(1);
	expect(scheduler.actorQueue).toContain(actor);
    });

    it(':isActorScheduler should be true for an actor scheduler', function() {
	var scheduler = new ActorScheduler();
	expect(ActorScheduler.isActorScheduler(scheduler)).toBe(true);
    });

    it(':isActorScheduler should be true for an object like an actor scheduler', function() {
	var schedulerLike = { actorQueue: [] };
	expect(ActorScheduler.isActorScheduler(schedulerLike)).toBe(true);
    });

    it(':isActorScheduler should be false for null', function() {
	expect(ActorScheduler.isActorScheduler(null)).toBe(false);
    });

    it(':isActorScheduler should be false for undefined', function() {
	expect(ActorScheduler.isActorScheduler(undefined)).toBe(false);
    });

    it(':isActorScheduler should be false for an object which lacks actorQueue', function() {
	var obj = {};
	expect(ActorScheduler.isActorScheduler(obj)).toBe(false);
    });

    it(':run should be chainable', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.run()).toBe(scheduler);
    });

    it(':wrap should add ActorScheduler functionalities to a specified object', function() {
	var obj = { actorQueue: [] };
	expect(ActorScheduler.wrap(obj)).toBe(obj);
	expect(obj.schedule).toBe(ActorScheduler.prototype.schedule);
	expect(obj.run).toBe(ActorScheduler.prototype.run);
    });

    it(':wrap should overwrite properties of a tagert', function() {
	var obj = { actorQueue: [], schedule: "schedule", run: "run" };
	expect(ActorScheduler.wrap(obj)).toBe(obj);
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
