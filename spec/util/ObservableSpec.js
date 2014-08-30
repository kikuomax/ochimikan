describe('Observable', function () {
	var observableLike;
	var augmentable;

	beforeEach(function () {
		observableLike = {
			addObserver:     function () {},
			removeObserver:  function () {},
			notifyObservers: function () {}
		};
		augmentable = {
			observers: []
		};
	});

	it('Should be an Observable', function () {
		var observable = new Observable();
		expect(Observable.isClassOf(observable)).toBe(true);
	});

	defineIsClassOfSpec(Observable, function () {
		return observableLike;
	});

	defineObservableIsClassOfSpec(Observable, function () {
		return observableLike;
	});

	it(':isClassOf should be false for an object whose notifyObservers is not a function', function () {
		delete observableLike.notifyObservers;
		expect(Observable.isClassOf(observableLike)).toBe(false);
		observableLike.notifyObservers = 'notifyObservers';
		expect(Observable.isClassOf(observableLike)).toBe(false);
	});

	defineCanAugmentSpec(Observable, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose observers is not an Array', function () {
		delete augmentable.observers;
		expect(Observable.canAugment(augmentable)).toBe(false);
		augmentable.observers = '';
		expect(Observable.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Observable, function () {
		return augmentable;
	});
});

describeObservableWorkingWithObserversSpec('Observable', function () {
	return new Observable();
});

describeObservableWorkingWithObserversSpec('Augmented Observable', function () {
	return Observable.augment({
		observers: []
	});
});
