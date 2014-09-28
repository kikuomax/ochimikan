describe('Statistics', function () {
	var statisticsLike;

	beforeEach(function () {
		statisticsLike = {
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

	it('Should have 0 erased mikans', function () {
		var stat = new Statistics();
		expect(stat.erasedMikanCount).toBe(0);
	});

	it('Should have 0 combo length', function () {
		var stat = new Statistics();
		expect(stat.comboLength).toBe(0);
	});

	defineIsClassOfSpec(Statistics, function () {
		return statisticsLike;
	});

	defineObservableIsClassOfSpec(Statistics, function () {
		return statisticsLike;
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

	it(':reset should reset erasedMikanCount and comboLength to 0', function () {
		var stat = new Statistics();
		stat.addErasedMikans(1);
		stat.addCombo();
		stat.reset();
		expect(stat.erasedMikanCount).toBe(0);
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

	it(':addErasedMikans should notify "mikanErased" to its observer', function () {
		stat.addErasedMikans(1);
		expect(observer).toHaveBeenCalledWith('mikanErased', stat, 1);
		stat.addErasedMikans(100);
		expect(observer).toHaveBeenCalledWith('mikanErased', stat, 100);
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

	it(':addErasedMikans should not notify its observer if count is 0', function () {
		stat.addErasedMikans(0);
		expect(observer).not.toHaveBeenCalled();
	});
});
