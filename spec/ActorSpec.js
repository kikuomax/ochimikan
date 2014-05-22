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
