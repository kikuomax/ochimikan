describe('Statistics', function () {
	var statisticsLike;

	beforeEach(function () {
		statisticsLike = {
			level:            0,
			score:            0,
			erasedMikanCount: 0,
			comboLength:      0,
			addErasedMikans:  function () {},
			addCombo:         function () {},
			resetCombo:       function () {},
			reset:            function () {},
			addObserver:      function () {},
			removeObserver:   function () {},
			notifyObservers:  function () {}
		};
	});

	it('Should be a Statistics', function () {
		var stat = new Statistics();
		expect(Statistics.isClassOf(stat)).toBe(true);
	});

	it('Should be an Observable', function () {
		var stat = new Statistics();
		expect(Observable.isClassOf(stat)).toBe(true);
	});

	it('Should initially have level 0', function () {
		var stat = new Statistics();
		expect(stat.level).toBe(0);
	});

	it('Should initially have score 0', function () {
		var stat = new Statistics();
		expect(stat.score).toBe(0);
	});

	it('Should initially have 0 erased mikans', function () {
		var stat = new Statistics();
		expect(stat.erasedMikanCount).toBe(0);
	});

	it('Should initially have combo length 0', function () {
		var stat = new Statistics();
		expect(stat.comboLength).toBe(0);
	});

	defineIsClassOfSpec(Statistics, function () {
		return statisticsLike;
	});

	defineObservableIsClassOfSpec(Statistics, function () {
		return statisticsLike;
	});

	it(':isClassOf should be false for an object whose level is not a number', function () {
		delete statisticsLike.level;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.level = '0';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose score is not a number', function () {
		delete statisticsLike.score;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.score = '0';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose erasedMikanCount is not a number', function () {
		delete statisticsLike.erasedMikanCount;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.erasedMikanCount = '0';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose comboLength is not a number', function () {
		delete statisticsLike.comboLength;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.comboLength = '0';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose addErasedMikans is not a function', function () {
		delete statisticsLike.addErasedMikans;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.addErasedMikans = 'addErasedMikans';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose addCombo is not a function', function () {
		delete statisticsLike.addCombo;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.addCombo = 'addCombo';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose resetCombo is not a function', function () {
		delete statisticsLike.resetCombo;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.resetCombo = 'addCombo';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':isClassOf should be false for an objct whose reset is not a function', function () {
		delete statisticsLike.reset;
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
		statisticsLike.reset = 'reset';
		expect(Statistics.isClassOf(statisticsLike)).toBe(false);
	});

	it(':level can be set to another number', function () {
		var stat = new Statistics();
		stat.level = 0;
		expect(stat.level).toBe(0);
		stat.level = 1;
		expect(stat.level).toBe(1);
		stat.level = 10;
		expect(stat.level).toBe(10);
	});

	it(':level cannot be set unspecified', function () {
		var stat = new Statistics();
		expect(function () { stat.level = null }).toThrow();
		expect(function () { stat.level = undefined }).toThrow();
		expect(stat.level).toBe(0);
	});

	it(':level cannot be set to a non-number value', function () {
		var stat = new Statistics();
		expect(function () { stat.level = '0' }).toThrow();
		expect(function () { stat.level = true }).toThrow();
		expect(stat.level).toBe(0);
	});

	it(':level cannot be set to a negative number', function () {
		var stat = new Statistics();
		expect(function () { stat.level = -1 }).toThrow();
		expect(stat.level).toBe(0);
	});

	it(':score can be set to another number', function () {
		var stat = new Statistics();
		stat.score = 0;
		expect(stat.score).toBe(0);
		stat.score = 1;
		expect(stat.score).toBe(1);
		stat.score = 100;
		expect(stat.score).toBe(100);
	});

	it(':score cannot be set unspecified', function () {
		var stat = new Statistics();
		expect(function () { stat.score = null }).toThrow();
		expect(function () { stat.score = undefined }).toThrow();
		expect(stat.score).toBe(0);
	});

	it(':score cannot be a non-number value', function () {
		var stat = new Statistics();
		expect(function () { stat.score = '0' }).toThrow();
		expect(function () { stat.score = true }).toThrow();
		expect(stat.score).toBe(0);
	});

	it(':score cannot be a negative number', function () {
		var stat = new Statistics();
		expect(function () { stat.score = -1 }).toThrow();
	});

	it(':addErasedMikans should increase the number of erased mikans', function () {
		var stat = new Statistics();
		stat.addErasedMikans(1);
		expect(stat.erasedMikanCount).toBe(1);
		stat.addErasedMikans(100);
		expect(stat.erasedMikanCount).toBe(101);
		stat.addErasedMikans(0);
		expect(stat.erasedMikanCount).toBe(101);
	});

	it(':addErasedMikans should throw an exception if count is not specified', function () {
		var stat = new Statistics();
		expect(function () { stat.addErasedMikans(null) }).toThrow();
		expect(function () { stat.addErasedMikans() }).toThrow();
		expect(stat.erasedMikanCount).toBe(0);
	});

	it(':addErasedMikans should throw an exception if count is not a number', function () {
		var stat = new Statistics();
		expect(function () { stat.addErasedMikans('1') }).toThrow();
		expect(function () { stat.addErasedMikans(true) }).toThrow();
		expect(stat.erasedMikanCount).toBe(0);
	});

	it(':addCombo should increment the length of combo', function () {
		var stat = new Statistics();
		stat.addCombo();
		expect(stat.comboLength).toBe(1);
		stat.addCombo();
		expect(stat.comboLength).toBe(2);
	});

	it(':resetCombo should reset comboLength to 0', function () {
		var stat = new Statistics();
		stat.addCombo();
		stat.resetCombo();
		expect(stat.comboLength).toBe(0);
	});

	it(':reset should reset level to 0', function () {
		var stat = new Statistics();
		stat.level = 1;
		stat.reset();
		expect(stat.level).toBe(0);
	});

	it(':reset should reset score to 0', function () {
		var stat = new Statistics();
		stat.score = 100;
		stat.reset();
		expect(stat.score).toBe(0);
	});

	it(':reset should reset erasedMikanCount to 0', function () {
		var stat = new Statistics();
		stat.addErasedMikans(1);
		stat.reset();
		expect(stat.erasedMikanCount).toBe(0);
	});

	it(':reset should reset comboLength to 0', function () {
		var stat = new Statistics();
		stat.addCombo();
		stat.reset();
		expect(stat.comboLength).toBe(0);
	});
});

describeObservableWorkingWithObserversSpec('Statistics', function () {
	return new Statistics();
});

describe('Statistics working with events', function () {
	var stat;
	var observer;

	beforeEach(function () {
		stat = new Statistics();
		observer = jasmine.createSpy('observer');
		stat.addObserver(observer);
	});

	it('Changing level should notify "levelUpdated" to its observer', function () {
		stat.level = 1;
		expect(observer).toHaveBeenCalledWith('levelUpdated', stat);
	});

	it('Setting level to the same value should not notify its observer', function () {
		stat.level = 0;
		expect(observer).not.toHaveBeenCalled();
		stat.level = 1;
		observer.calls.reset();
		stat.level = 1;
		expect(observer).not.toHaveBeenCalled();
	});

	it('Changing score should notify "scoreUpdated" to its observer', function () {
		stat.score = 100;
		expect(observer).toHaveBeenCalledWith('scoreUpdated', stat);
	});

	it('Setting score to the same value should not notify its observer', function () {
		stat.score = 0;
		expect(observer).not.toHaveBeenCalled();
		stat.score = 100;
		observer.calls.reset();
		stat.score = 100;
		expect(observer).not.toHaveBeenCalled();
	});

	it(':addErasedMikans should notify "mikanErased" to its observer', function () {
		stat.addErasedMikans(1);
		expect(observer).toHaveBeenCalledWith('mikanErased', stat, 1);
		stat.addErasedMikans(100);
		expect(observer).toHaveBeenCalledWith('mikanErased', stat, 100);
	});

	it(':addErasedMikans should not notify its observer if count is 0', function () {
		stat.addErasedMikans(0);
		expect(observer).not.toHaveBeenCalled();
	});

	it(':addCombo should notify "comboUpdated" to its observer', function () {
		stat.addCombo();
		expect(observer).toHaveBeenCalledWith('comboUpdated', stat);
	});

	it(':resetCombo should notify "comboUpdated" to its observer', function () {
		stat.resetCombo();
		expect(observer).toHaveBeenCalledWith('comboUpdated', stat);
	});

	it(':reset should notify "statisticsReset" to its observer', function () {
		stat.reset();
		expect(observer).toHaveBeenCalledWith('statisticsReset', stat);
	});
});
