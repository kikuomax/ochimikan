describe('Renderable', function () {
	var renderableLike;
	var augmentable;

	beforeEach(function () {
		renderableLike = {
			render: function () {}
		};
		augmentable = {
			render: function () {}
		};
	});

	it('Should be a Renderable', function () {
		var renderable = new Renderable(function () {});
		expect(Renderable.isClassOf(renderable)).toBe(true);
	});

	it('Should have a specified render', function () {
		var render = function () {};
		var renderable = new Renderable(render);
		expect(renderable.render).toBe(render);
	});

	it('Should not have a render unspecified', function () {
		expect(function () { new Renderable(null) }).toThrow();
		expect(function () { new Renderable() }).toThrow();
	});

	it('Should not have a non-function render', function () {
		expect(function () { new Renderable({}) }).toThrow();
		expect(function () { new Renderable('render') }).toThrow();
	});

	defineIsClassOfSpec(Renderable, function () {
		return renderableLike;
	});

	it(':isClassOf should be false for an object whose render is not a function', function () {
		renderableLike.render = 'render';
		expect(Renderable.isClassOf(renderableLike)).toBe(false);
		delete renderableLike.render;
		expect(Renderable.isClassOf(renderableLike)).toBe(false);
	});

	defineCanAugmentSpec(Renderable, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose render is not a function', function () {
		augmentable.render = 'render';
		expect(Renderable.canAugment(augmentable)).toBe(false);
		delete augmentable.render;
		expect(Renderable.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Renderable, function () {
		return augmentable;
	});
});
