describe('Score', function () {
	var scoreLike;

	beforeEach(function () {
		scoreLike = {
			score:           0,
			reset:           function () {},
			addScore:        function () {},
			addObserver:     function () {},
			removeObserver:  function () {},
			notifyObservers: function () {}
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

	it(':isClassOf should be false for an object whose reset is not a function', function () {
		delete scoreLike.reset;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.reset = 'reset';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose addScore is not a function', function () {
		delete scoreLike.addScore;
		expect(Score.isClassOf(scoreLike)).toBe(false);
		scoreLike.addScore = 'addScore';
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':addScore should add a specified number to score', function () {
		var score = new Score();
		score.addScore(100);
		expect(score.score).toBe(100);
		score.addScore(1);
		expect(score.score).toBe(101);
	});

	it(':reset should reset score to 0', function () {
		var score = new Score();
		score.addScore(10);
		score.reset();
		expect(score.score).toBe(0);
		score.reset();
		expect(score.score).toBe(0);
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

	it(':addScore should notify "scoreUpdated"', function () {
		score.addScore(100);
		expect(observer).toHaveBeenCalledWith('scoreUpdated', score, 0, 100);
		score.addScore(1);
		expect(observer).toHaveBeenCalledWith('scoreUpdated', score, 100, 101);
	});

	it(':addScore should not notify "scoreUpdated" if amount is 0', function () {
		score.addScore(0);
		expect(observer).not.toHaveBeenCalled();
	});
});
