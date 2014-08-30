/**
 * Defines common expectations for `Observable::isClassOf`.
 *
 * *Example*
 *
 *     describe('Observable', function () {
 *         defineObservableIsClassOfSpec(Obserable, function () {
 *             return {
 *                 addObserver:     function () {},
 *                 removeObserver:  function () {},
 *                 notifyObservers: function () {}
 *             };
 *         });
 *     });
 *
 * @method defineObservableIsClassOfSpec
 * @param clazz {function}
 *     The class to be tested; i.e., its constructor.
 * @param factory {function}
 *     The function which creates an instance to be tested.
 *     Must return an instance supposed to be an `Observable`.
 */
function defineObservableIsClassOfSpec(clazz, factory) {
	it(':isClassOf should be false for an object whose addObserver is not a function', function () {
		var observableLike = factory();
		delete observableLike.addObserver;
		expect(clazz.isClassOf(observableLike)).toBe(false);
		observableLike.addObserver = 'addObserver';
		expect(clazz.isClassOf(observableLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose removeObserver is not a function', function () {
		var observableLike = factory();
		delete observableLike.removeObserver;
		expect(clazz.isClassOf(observableLike)).toBe(false);
		observableLike.removeObserver = 'removeObserver';
		expect(clazz.isClassOf(observableLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose notifyObservers is not a function', function () {
		var observableLike = factory();
		delete observableLike.notifyObservers;
		expect(clazz.isClassOf(observableLike)).toBe(false);
		observableLike.notifyObservers = 'notifyObservers';
		expect(clazz.isClassOf(observableLike)).toBe(false);
	});
}

/**
 * Describes common specification for `Observable` working with observers.
 *
 * *Example*
 *
 *     describeObservableWorkingWithObserversSpec('Observable', function () {
 *         return new Observable();
 *     })
 *
 * @method describeObservableWorkingWithObserversSpec
 * @param name {string}
 *     The name of the implementation class.
 * @param factory {function}
 *     The factory function which creates an instance to be tested.
 *     Must return an instance which contains no observers.
 */
function describeObservableWorkingWithObserversSpec(name, factory) {
	describe(name + ' working with observers', function () {
		var observable;
		var observer1, observer2;

		beforeEach(function () {
			observable = factory();
			observer1 = jasmine.createSpy('observer1');
			observer2 = jasmine.createSpy('observer2');
			observable.addObserver(observer1);
			observable.addObserver(observer2);
		});

		it(':addObserver should throw an exception if observer is not specified', function () {
			expect(function () { observable.addObserver(null) }).toThrow();
			expect(function () { observable.addObserver() }).toThrow();
		});

		it(':addObserver should throw an exception if observer is not a function', function () {
			expect(function () { observable.addObserver('observer') }).toThrow();
			expect(function () { observable.addObserver({}) }).toThrow();
		});

		it(':notifyObservers should notify added observers', function () {
			observable.notifyObservers();
			expect(observer1).toHaveBeenCalled();
			expect(observer2).toHaveBeenCalled();
		});

		it(':notifyObservers should forward arguments to observers', function () {
			observable.notifyObservers(1);
			expect(observer1).toHaveBeenCalledWith(1);
			expect(observer2).toHaveBeenCalledWith(1);
			observer1.calls.reset();
			observer2.calls.reset();
			observable.notifyObservers(true, 'notify', null);
			expect(observer1).toHaveBeenCalledWith(true, 'notify', null);
			expect(observer2).toHaveBeenCalledWith(true, 'notify', null);
			observer1.calls.reset();
			observer2.calls.reset();
			observable.notifyObservers();
			expect(observer1).toHaveBeenCalledWith();
			expect(observer2).toHaveBeenCalledWith();
		});

		it(':notifyObservers should invoke observers in the global context', function () {
			var global = Function('return this')();
			var lastThis;
			observable.addObserver(function () {
				lastThis = this;
			});
			observable.notifyObservers();
			expect(lastThis).toBe(global);
		});

		it(':notifyObservers should not notify removed observers', function () {
			observable.removeObserver(observer1);
			observable.notifyObservers();
			expect(observer1).not.toHaveBeenCalled();
			expect(observer2).toHaveBeenCalled();
			observer2.calls.reset();
			observable.removeObserver(observer2);
			observable.notifyObservers();
			expect(observer1).not.toHaveBeenCalled();
			expect(observer2).not.toHaveBeenCalled();
		});

		it(':removeObserver should have no effect if observer is not added', function () {
			expect(function () {
				observable.removeObserver(function () {});
			}).not.toThrow();
			observable.notifyObservers();
			expect(observer1).toHaveBeenCalled();
			expect(observer2).toHaveBeenCalled();
		});

		it(':removeObserver should have no effect if observer is not specified', function () {
			expect(function () {
				observable.removeObserver(null);
			}).not.toThrow();
			expect(function () { observable.removeObserver() }).not.toThrow();
			observable.notifyObservers();
			expect(observer1).toHaveBeenCalled();
			expect(observer2).toHaveBeenCalled();
		});

		it(':removeObserver should have no effect if observer is not a function', function () {
			expect(function () {
				observable.removeObserver('observer');
			}).not.toThrow();
			expect(function () { observable.removeObserver({}) }).not.toThrow();
			observable.notifyObservers();
			expect(observer1).toHaveBeenCalled();
			expect(observer2).toHaveBeenCalled();
		});
	});
}
