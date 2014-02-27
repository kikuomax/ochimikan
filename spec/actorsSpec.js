describe('Actor', function() {
    it('Should have priority (0)', function() {
	var actor = new Actor(0, function(s){});
	expect(actor.priority).toBe(0);
    });

    it('Should have priority (1)', function() {
	var actor = new Actor(1, function(s){});
	expect(actor.priority).toBe(1);
    });

    it('Should have priority (-1)', function() {
	var actor = new Actor(-1, function(s){});
	expect(actor.priority).toBe(-1);
    });

    it('Should have specified action', function() {
	var act = function(s) {};
	var actor = new Actor(1, act);
	expect(actor.act).toBe(act);
    });

    it('Should throw "act must be a function" if act isn\'t a function', function() {
	expect(function() {
	    new Actor(0, {});
	}).toThrow("act must be a function");
    });

    it('isActor should return true for an actor', function() {
	var actor = new Actor(0, function(s){});
	expect(Actor.isActor(actor)).toBe(true);
    });

    it('isActor should return false for an empty object', function() {
	var actor = {};
	expect(Actor.isActor(actor)).toBe(false);
    });

    it('isActor should return false for null', function() {
	expect(Actor.isActor(null)).toBe(false);
    });

    it('isActor should return false for undefined', function() {
	expect(Actor.isActor(undefined)).toBe(false);
    });
});
