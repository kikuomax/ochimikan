describe('Actor', function() {
    var actorLike;
    var augmentable;

    beforeEach(function() {
	actorLike = {
	    priority: 0,
	    act: function() {}
	};
	augmentable = {
	    priority: 0,
	    act: function() {}
	};
    });

    it('Should be an Actor', function() {
	var actor = new Actor(0, function(s){});
	expect(Actor.isClassOf(actor)).toBe(true);
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

    defineIsClassOfSpec(Actor, function() {
	return actorLike;
    });

    it(':isClassOf should be false for an object whose priority is not a number', function() {
	actorLike.priority = 'priority';
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

    defineCanAugmentSpec(Actor, function() {
	return augmentable;
    });

    it(':canAugment should be false for an object whose priority is not a number', function() {
	augmentable.priority = 'priority';
	expect(Actor.canAugment(augmentable)).toBe(false);
	delete augmentable.priority;
	expect(Actor.canAugment(augmentable)).toBe(false);
    });

    it(':canAugment should be false for an object whose act is not a function', function() {
	augmentable.act = 'act';
	expect(Actor.canAugment(augmentable)).toBe(false);
	delete augmentable.act;
	expect(Actor.canAugment(augmentable)).toBe(false);
    });

    defineAugmentSpec(Actor, function() {
	return augmentable;
    });

    it('Should not have a non-number priority', function() {
	expect(function() { new Actor(null, nop) }).toThrow();
	expect(function() { new Actor(undefined, nop) }).toThrow();
	expect(function() { new Actor('priority', nop) }).toThrow();
    });

    it('Should not have a non-function act', function() {
	expect(function() { new Actor(0, {}) }).toThrow();
	expect(function() { new Actor(0, null) }).toThrow();
	expect(function() { new Actor(0) }).toThrow();
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
