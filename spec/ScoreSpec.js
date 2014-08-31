describe('Score', function () {
	var scoreLike;

	beforeEach(function () {
		scoreLike = {
			score:            0,
			erasedMikanCount: 0,
			comboCount:       0,
			reset:            function () {},
			addErasedMikans:  function () {},
			addCombo:         function () {},
			resetCombo:       function () {},
			addObserver:      function () {},
			removeObserver:   function () {},
			notifyObservers:  function () {}
		};
	});

	it('Should be a Score', function () {
		var score = new Score();
		expect(Score.isClassOf(score)).toBe(true);
	});

	it('Should be an Observable', function () {
		var score = new Score();
		expect(Observable.isClassOf(score)).toBe(true);
	});

	it('Should initially have score 0', function () {
		var score = new Score();
		expect(score.score).toBe(0);
	});
	
	it('Should initially have 0 erased mikans', function () {
		var score = new Score();
		expect(score.erasedMikanCount).toBe(0);
	});

	it('Should initially have 0 combos', function () {
		var score = new Score();
		expect(score.comboCount).toBe(0);
	});

	defineIsClassOfSpec(Score, function () {
		return scoreLike;
	});

	defineObservableIsClassOfSpec(Score, function () {
		return scoreLike;
	});

	it(':isClassOf should be false for an object whose score is not a number', function () {
		delete scoreLike.score;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.score = '0';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose erasedMikanCount is not a number', function () {
		delete scoreLike.erasedMikanCount;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.erasedMikanCount = '0';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose comboCount is not a number', function () {
		delete scoreLike.comboCount;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.comboCount = '0';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose reset is not a function', function () {
		delete scoreLike.reset;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.reset = 'reset';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose addErasedMikans is not a function', function () {
		delete scoreLike.addErasedMikans;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.addErasedMikans = 'addErasedMikans';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose addCombo is not a function', function () {
		delete scoreLike.addCombo;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.addCombo = 'addCombo';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose resetCombo is not a function', function () {
		delete scoreLike.resetCombo;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.resetCombo = 'resetCombo';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':addErasedMikans should add a specified number to erased mikan count', function () {
		var score = new Score();
		score.addErasedMikans(4);
		expect(score.erasedMikanCount).toBe(4);
		score.addErasedMikans(10);
		expect(score.erasedMikanCount).toBe(14);
	});

	it(':addErasedMikans should increase the score', function () {
		var score = new Score();
		score.addErasedMikans(1);
		expect(score.score).toBeGreaterThan(0);
	});

	it(':addCombo should increment the number of combos', function () {
		var score = new Score();
		score.addCombo();
		expect(score.comboCount).toBe(1);
		score.addCombo();
		expect(score.comboCount).toBe(2);
	});

	it(':reset should reset score, erased mikan count and combo count to 0', function () {
		var score = new Score();
		score.addErasedMikans(4);
		score.addCombo();
		score.reset();
		expect(score.score).toBe(0);
		expect(score.erasedMikanCount).toBe(0);
		expect(score.comboCount).toBe(0);
		score.reset();
		expect(score.score).toBe(0);
		expect(score.erasedMikanCount).toBe(0);
		expect(score.comboCount).toBe(0);
	});

	it(':resetCombo should reset combo count to 0', function () {
		var score = new Score();
		score.addErasedMikans(4);
		score.addCombo();
		score.resetCombo();
		expect(score.comboCount).toBe(0);
		expect(score.score).not.toBe(0);
		expect(score.erasedMikanCount).toBe(4);
		score.resetCombo();
		expect(score.comboCount).toBe(0);
	});
});

describeObservableWorkingWithObserversSpec('Score', function () {
	return new Score();
});

describe('Score working with events', function () {
	var score;
	var observer;

	beforeEach(function () {
		score = new Score();
		observer = jasmine.createSpy('observer');
		score.addObserver(observer);
	});

	it(':reset should notify "scoreReset"', function () {
		score.reset();
		expect(observer).toHaveBeenCalledWith('scoreReset', score);
	});

	it(':addErasedMikans should notify "scoreUpdated"', function () {
		var oldScore = 0;
		score.addErasedMikans(1);
		expect(observer).toHaveBeenCalledWith('scoreUpdated', score,
											  oldScore, jasmine.any(Number));
		expect(observer.calls.argsFor(0)[3]).toBe(score.score);
		oldScore = score.score;
		score.addErasedMikans(10);
		expect(observer).toHaveBeenCalledWith('scoreUpdated', score,
											  oldScore, jasmine.any(Number));
	});

	it(':addErasedMikans should not notify "scoreUpdated" if count is 0', function () {
		score.addErasedMikans(0);
		expect(observer).not.toHaveBeenCalled();
	});
});
