describe('Scene', function() {
    var canvas;
    var scene;

    beforeEach(function() {
	// creates a dummy canvas
	canvas = document.createElement('canvas');
	canvas.id = Game.CANVAS_ID;
	document.body.appendChild(canvas);
	spyOn(canvas, 'addEventListener').and.callThrough();
	spyOn(canvas, 'removeEventListener').and.callThrough();
	// creates a scene
	scene = new Scene();
    });

    afterEach(function() {
	document.body.removeChild(canvas);
    });

    it('Should initially be associated with no canvas', function() {
	expect(scene.canvas).toBeNull();
    });

    it('Should initially refer to no context', function() {
	expect(scene.context).toBeNull();
    });

    it('Should refer to the associated canvas', function() {
	scene.canvas = canvas;
	expect(scene.canvas).toBe(canvas);
    });

    it('Should listen to canvas for touch events', function() {
	scene.canvas = canvas;
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

    it('Should refer to the context of the associated canvas', function() {
	scene.canvas = canvas;
	expect(scene.context).toBe(canvas.getContext('2d'));
    });

    it(':canvas can be unset', function() {
	scene.canvas = canvas;
	scene.canvas = null;
	expect(scene.canvas).toBeNull();
    });

    it('Should stop listening for touch events if the canvas is unset', function() {
	scene.canvas = canvas;
	scene.canvas = null;
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

    it('Should stop refering to the context if the canvas is unset', function() {
	scene.canvas = canvas;
	scene.canvas = null;
	expect(scene.context).toBeNull();
    });
});
