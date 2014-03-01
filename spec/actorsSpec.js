describe('Actor', function() {
    it('Should have priority', function() {
	var actor = new Actor(0, function(s){});
	expect(actor.priority).toBe(0);
	actor = new Actor(1, function(s){});
	expect(actor.priority).toBe(1);
	actor = new Actor(-1, function(s){});
	expect(actor.priority).toBe(-1);
    });

    it('Should have specified action', function() {
	var act = function(s) {};
	var actor = new Actor(1, act);
	expect(actor.act).toBe(act);
    });

    it('Should throw exception if act is not a function', function() {
	expect(function() {
	    new Actor(0, {});
	}).toThrow("act must be a function");
    });

    it('isActor should be true for an actor', function() {
	var actor = new Actor(0, function(s){});
	expect(Actor.isActor(actor)).toBe(true);
    });

    it('isActor should be false for an empty object', function() {
	var actor = {};
	expect(Actor.isActor(actor)).toBe(false);
    });

    it('isActor should be false for null', function() {
	expect(Actor.isActor(null)).toBe(false);
    });

    it('isActor should be false for undefined', function() {
	expect(Actor.isActor(undefined)).toBe(false);
    });

    it('makeActor should make object actor', function() {
	var obj = {};
	var act = function(s) {};
	expect(Actor.makeActor(obj, 0, act)).toBe(obj);
	expect(Actor.isActor(obj)).toBe(true);
	expect(obj.priority).toBe(0);
	expect(obj.act).toBe(act);
    });

    it('makeActor should overwrite properties of the target', function() {
	var obj = {
	    priority: 0,
	    act: function(s) {}
	};
	var act = function(s) { return 0; };
	expect(Actor.makeActor(obj, 1, act)).toBe(obj);
	expect(obj.priority).toBe(1);
	expect(obj.act).toBe(act);
    });

    it('makeActor should throw an exception if act is not a function', function() {
	expect(function() {
	    Actor.makeActor({}, 0, {});
	}).toThrow();
    });

    it('comparePriorities should return 0 if lhs.priority == rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(0, nop))).toBe(0);
	expect(Actor.comparePriorities(new Actor(1, nop),
				       new Actor(1, nop))).toBe(0);
    });

    it('comparePriorities should return negative number if lhs.priority < rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(1, nop))).toBeLessThan(0);
	expect(Actor.comparePriorities(new Actor(-1, nop),
				       new Actor(0, nop))).toBeLessThan(0);
    });

    it('comparePriorities should return positive number if lhs.priority > rhs.priority', function() {
	expect(Actor.comparePriorities(new Actor(0, nop),
				       new Actor(-1, nop))).toBeGreaterThan(0);
	expect(Actor.comparePriorities(new Actor(1, nop),
				       new Actor(0, nop))).toBeGreaterThan(0);
    });

    // does nothing
    function nop(scheduler) { }
});

describe('ActorScheduler', function() {
    it('Should have empty actor queue', function() {
	var scheduler = new ActorScheduler();
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('Can schedule actor', function() {
	var scheduler = new ActorScheduler();
	var actor = new Actor(0, function(s) {});
	scheduler.schedule(actor);
	expect(scheduler.actorQueue.length).toBe(1);
	expect(scheduler.actorQueue).toContain(actor);
    });

    it('isActorScheduler should be true for actor scheduler', function() {
	var scheduler = new ActorScheduler();
	expect(ActorScheduler.isActorScheduler(scheduler)).toBe(true);
    });

    it('isActorScheduler should be false for an object which lacks actorQueue', function() {
	var scheduler = new ActorScheduler();
	scheduler.actorQueue = undefined;
	expect(ActorScheduler.isActorScheduler(scheduler)).toBe(false);
    });

    it('isActorScheduler should be false for an object which lacks schedule', function() {
	var scheduler = new ActorScheduler();
	scheduler.schedule = undefined;
	expect(ActorScheduler.isActorScheduler(scheduler)).toBe(false);
    });

    it('isActorScheduler should be false for an object which lacks run', function() {
	var scheduler = new ActorScheduler();
	scheduler.run = undefined;
	expect(ActorScheduler.isActorScheduler(scheduler)).toBe(false);
    });

    it('isActorScheduler should be false for null', function() {
	expect(ActorScheduler.isActorScheduler(null)).toBe(false);
    });

    it('isActorScheduler should be false for undefined', function() {
	expect(ActorScheduler.isActorScheduler(undefined)).toBe(false);
    });

    it('makeActorScheduler should make an object an actor scheduler', function() {
	var obj = {};
	expect(ActorScheduler.makeActorScheduler(obj)).toBe(obj);
	expect(ActorScheduler.isActorScheduler(obj)).toBe(true);
    });

    it('makeActorScheduler should replace properties of object', function() {
	var obj = {
	    actorQueue: [{}]
	};
	expect(ActorScheduler.makeActorScheduler(obj)).toBe(obj);
	expect(obj.actorQueue.length).toBe(0);
    });
});

describe('run scheduled actors', function() {
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

    it('actor scheduler should run scheduled actor and delete it from queue. priority = 0', function() {
	scheduler.schedule(new Actor(0, act1));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('actor scheduler should run scheduled actors and delete them from queue. priorities = 0, 0, 0', function() {
	scheduler.schedule(new Actor(0, act1));
	scheduler.schedule(new Actor(0, act2));
	scheduler.schedule(new Actor(0, act3));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(act2).toHaveBeenCalledWith(scheduler);
	expect(act3).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue.length).toBe(0);
    });

    it('actor scheduler should run scheduled actors and delete them from queue. priorities = 1, 2, 1', function() {
	var leftActor;
	scheduler.schedule(new Actor(1, act1));
	scheduler.schedule(leftActor = new Actor(2, act2));
	scheduler.schedule(new Actor(1, act3));
	scheduler.run();
	expect(act1).toHaveBeenCalledWith(scheduler);
	expect(act3).toHaveBeenCalledWith(scheduler);
	expect(scheduler.actorQueue).toEqual([leftActor]);
    });

    it('actor scheduler should run scheduled actors and delete them from queue. priorities = -1, 0, 1', function() {
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
