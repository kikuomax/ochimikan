describe('Actor', function () {
	var actorLike;
	var augmentable;

	beforeEach(function () {
		actorLike = {
			priority: 0,
			act: function () {}
		};
		augmentable = {
			priority: 0,
			act: function () {}
		};
	});

	it('Should be an Actor', function () {
		var actor = new Actor(0, function (){});
		expect(Actor.isClassOf(actor)).toBe(true);
	});

	it('Should have a priority', function () {
		var actor = new Actor(0, function (){});
		expect(actor.priority).toBe(0);
		actor = new Actor(1, function (){});
		expect(actor.priority).toBe(1);
		actor = new Actor(-1, function (){});
		expect(actor.priority).toBe(-1);
	});

	it('Should have a specified action', function () {
		var act = function () {};
		var actor = new Actor(1, act);
		expect(actor.act).toBe(act);
	});

	it('Should not have a priority unspecified', function () {
		expect(function () { new Actor(null, function () {}) }).toThrow();
		expect(function () { new Actor(undefined, function () {}) }).toThrow();
	});

	it('Should not have a non-number priority', function () {
		expect(function () { new Actor('123', function () {}) }).toThrow();
		expect(function () { new Actor(true, function () {}) }).toThrow();
	});

	it('Should not have an act unspecified', function () {
		expect(function () { new Actor(0, null) }).toThrow();
		expect(function () { new Actor(0) }).toThrow();
	});

	it('Should not have a non-function act', function () {
		expect(function () { new Actor(0, {}) }).toThrow();
		expect(function () { new Actor(0, 'act') }).toThrow();
	});

	defineIsClassOfSpec(Actor, function () {
		return actorLike;
	});

	it(':isClassOf should be false for an object whose priority is not a number', function () {
		delete actorLike.priority;
		expect(Actor.isClassOf(actorLike)).toBe(false);
		actorLike.priority = 'priority';
		expect(Actor.isClassOf(actorLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose act is not a function', function () {
		delete actorLike.act;
		expect(Actor.isClassOf(actorLike)).toBe(false);
		actorLike.act = 'act';
		expect(Actor.isClassOf(actorLike)).toBe(false);
	});

	defineCanAugmentSpec(Actor, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose priority is not a number', function () {
		delete augmentable.priority;
		expect(Actor.canAugment(augmentable)).toBe(false);
		augmentable.priority = 'priority';
		expect(Actor.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose act is not a function', function () {
		delete augmentable.act;
		expect(Actor.canAugment(augmentable)).toBe(false);
		augmentable.act = 'act';
		expect(Actor.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Actor, function () {
		return augmentable;
	});

	it(':comparePriorities should return 0 if lhs.priority == rhs.priority', function () {
		expect(Actor.comparePriorities(new Actor(0, function () {}),
									   new Actor(0, function () {}))).toBe(0);
		expect(Actor.comparePriorities(new Actor(1, function () {}),
									   new Actor(1, function () {}))).toBe(0);
	});

	it(':comparePriorities should return a negative number if lhs.priority < rhs.priority', function () {
		var actor1 = new Actor(-1, function () {});
		var actor2 = new Actor(0, function () {});
		var actor3 = new Actor(1, function () {});
		expect(Actor.comparePriorities(actor1, actor2)).toBeLessThan(0);
		expect(Actor.comparePriorities(actor2, actor3)).toBeLessThan(0);
	});

	it(':comparePriorities should return a positive number if lhs.priority > rhs.priority', function() {
		var actor1 = new Actor(-1, function () {});
		var actor2 = new Actor(0, function () {});
		var actor3 = new Actor(1, function () {});
		expect(Actor.comparePriorities(actor3, actor2)).toBeGreaterThan(0);
		expect(Actor.comparePriorities(actor2, actor1)).toBeGreaterThan(0);
	});
});
