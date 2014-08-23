describe('Properties.override', function () {
	it('Should override a function of an object with another function', function () {
		var obj = { f: function () {} };
		var impl = function () {};
		expect(Properties.override(obj, 'f', impl)).toBe(impl);
		expect(obj.f).toBe(impl);
		obj = { g: function (x) { return 1 } };
		impl = function (x) { return 2 };
		expect(Properties.override(obj, 'g', impl)).toBe(impl);
		expect(obj.g).toBe(impl);
	});

	it('Should make _super invoke an overridden function', function () {
		var overridden = jasmine.createSpy('overridden');
		var obj = { f: overridden };
		Properties.override(obj, 'f', function () {});
		expect(obj.f._super()).toBeUndefined();
		expect(overridden).toHaveBeenCalledWith();
		expect(obj.f._super(1, 'xyz')).toBeUndefined();
		expect(overridden).toHaveBeenCalledWith(1, 'xyz');
		obj = { g: function () { return 1 } };
		Properties.override(obj, 'g', function () { return 10 });
		expect(obj.g._super()).toBe(1);
	});

	it('Should make _super invoke an overridden function in the context of a specified object', function () {
		var lastThis;
		var obj = { f: function () { lastThis = this } };
		Properties.override(obj, 'f', function () {});
		obj.f._super();
		expect(lastThis).toBe(obj);
	});

	it('Should throw an exception if `obj` is not specified', function () {
		expect(function () {
			Properties.override(null, 'f', function () {});
		}).toThrow();
		expect(function () {
			Properties.override(undefined, 'f', function () {});
		}).toThrow();
	});

	it('Should throw an exception if `name` is not specified', function () {
		var obj = { f: function () {} };
		expect(function () {
			Properties.override(obj, null, function () {});
		}).toThrow();
		expect(function () {
			Properties.override(obj, undefined, function () {});
		}).toThrow();
	});

	it('Should throw an exception if `impl` is not specified', function () {
		var obj = { f: function () {} };
		expect(function () {
			Properties.override(obj, 'f', null);
		}).toThrow();
		expect(function () {
			Properties.override(obj, 'f');
		}).toThrow();
	});

	it('Should throw an exception if `impl` is not a function', function () {
		var obj = { f: function () {} };
		expect(function () {
			Properties.override(obj, 'f', 'function');
		}).toThrow();
		expect(function () {
			Properties.override(obj, 'f', {});
		}).toThrow();
	});

	it('Should throw an exception if a specified object has no specified property', function () {
		var obj = { f: function () {} };
		expect(function () {
			Properties.override(obj, 'g', function () {});
		}).toThrow();
	});

	it('Should throw an exception if a specified property of a specified object is not a function', function () {
		expect(function () {
			Properties.override({ f: 'function' }, 'f', function () {});
		}).toThrow();
		expect(function () {
			Properties.override({ f: true }, 'f', function () {});
		}).toThrow();
	});
});
