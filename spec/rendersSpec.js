describe('Renderable', function() {
    it('should have render', function() {
	var render = function(c) {};
	var renderable = new Renderable(render);
	expect(renderable.render).toBe(render);
    });

    it('should throw an exception if render is not a function', function() {
	expect(function() {
	    new Renderable({});
	}).toThrow("render must be a function");
    });

    it(':isRenderable should be true for a Renderable', function() {
	var renderable = new Renderable(function(c) {});
	expect(Renderable.isRenderable(renderable)).toBe(true);
    });

    it(':isRenderable should be false for an object which lacks render', function() {
	var obj = {};
	expect(Renderable.isRenderable(obj)).toBe(false);
    });

    it(':isRenderable should be false for null', function() {
	expect(Renderable.isRenderable(null)).toBe(false);
    });

    it(':isRenderable should be false for undefined', function() {
	expect(Renderable.isRenderable(undefined)).toBe(false);
    });

    it(':makeRenderable should make an object renderable', function() {
	var obj = {};
	var render = function(c) {};
	expect(Renderable.makeRenderable(obj, render)).toBe(obj);
	expect(Renderable.isRenderable(obj)).toBe(true);
	expect(obj.render).toBe(render);
    });

    it(':makeRenderable should overwrite properties of the target', function() {
	var obj = { render: function(c) {} };
	var render = function(c) {};
	expect(Renderable.makeRenderable(obj, render)).toBe(obj);
	expect(obj.render).toBe(render);
    });

    it(':makeRenderable should throw an exception if render is not a function', function() {
	expect(function() {
	    Renderable.makeRenderable({}, {});
	}).toThrow();
    });
});
