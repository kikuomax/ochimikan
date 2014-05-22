describe('Renderable', function() {
    it('Should have render', function() {
	var render = function(c) {};
	var renderable = new Renderable(render);
	expect(renderable.render).toBe(render);
    });

    it('Should be a Renderable (isClassOf)', function() {
	var renderable = new Renderable(function(c) {});
	expect(Renderable.isClassOf(renderable)).toBe(true);
    });

    it('Should throw an exception if render is not a function', function() {
	expect(function() { new Renderable({}) }).toThrow();
	expect(function() { new Renderable() }).toThrow();
    });

    it(':isClassOf should be false if no object is specified', function() {
	expect(Renderable.isClassOf(null)).toBe(false);
	expect(Renderable.isClassOf()).toBe(false);
    });

    it(':isClassOf should be false for an object whose render is not a function', function() {
	var obj = { render: 'render' };
	expect(Renderable.isClassOf(obj)).toBe(false);
	delete obj.render;
	expect(Renderable.isClassOf(obj)).toBe(false);
    });
});
