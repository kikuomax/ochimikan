describe('Score', function () {
	var statistics;
	var scoreLike;

	beforeEach(function () {
		statistics = new Statistics();
	});

	it('Should be an Observable', function () {
		var score = new Score(statistics);
		expect(Observable.isClassOf(score)).toBe(true);
	});

	it('Should initially have score 0', function () {
		var score = new Score(statistics);
		expect(score.score).toBe(0);
	});

	it('Should not have statistics unspecified', function () {
		expect(function () { new Score(null) }).toThrow();
		expect(function () { new Score() }).toThrow();
	});

	it('Should not have statistics a non-Statistics', function () {
		expect(function () { new Score({}) }).toThrow();
		expect(function () { new Score(new Observable()) }).toThrow();
	});
});

describeObservableWorkingWithObserversSpec('Score', function () {
	return new Score(new Statistics());
});

describe('Score working with Statistics and events', function () {
	var statistics;
	var score;
	var observer;

	beforeEach(function () {
		statistics = new Statistics();
		score = new Score(statistics);
		observer = jasmine.createSpy('observer');
		score.addObserver(observer);
	});

	it('Should notify "scoreUpdated" if mikans are erased', function () {
		statistics.addErasedMikans(4);
		expect(observer).toHaveBeenCalledWith('scoreUpdated', score);
	});

	it('Should notify "scoreReset" if statistics is reset', function () {
		statistics.reset();
		expect(observer).toHaveBeenCalledWith('scoreReset', score);
	});
});
