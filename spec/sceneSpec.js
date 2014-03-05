describe('Scene without a canvas', function() {
    it('Should be associated with no canvas', function() {
	var scene = new Scene();
	expect(scene.canvas).toBeNull();
    });

    it('Should refer to no context', function() {
	var scene = new Scene();
	expect(scene.context).toBeNull();
    });

    it('Should create a mikan box of supposed size', function() {
	var scene = new Scene();
	expect(scene.width).toBe(Scene.COLUMN_COUNT * Scene.SQUARE_SIZE);
	expect(scene.height).toBe(Scene.ROW_COUNT * Scene.SQUARE_SIZE);
    });

    it('Should initially schedule a mikanSpawner', function() {
	var scene = new Scene();
	expect(scene.actorQueue).toEqual([scene.mikanSpawner]);
    });
});

describe('Scene associated with a canvas', function() {
    var canvas;
    var scene;

    beforeEach(function() {
	// creates a dummy canvas
	canvas = document.createElement('canvas');
	canvas.id = Game.CANVAS_ID;
	document.body.appendChild(canvas);
	spyOn(canvas, 'addEventListener').and.callThrough();
	spyOn(canvas, 'removeEventListener').and.callThrough();
	// associates a scene with a canvas
	scene = new Scene();
	scene.canvas = canvas;
    });

    afterEach(function() {
	document.body.removeChild(canvas);
    });

    it('Should refer to the associated canvas', function() {
	expect(scene.canvas).toBe(canvas);
    });

    it('Should listen to canvas for touch events', function() {
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

    it('Should refer to the context of the associated canvas', function() {
	expect(scene.context).toBe(canvas.getContext('2d'));
    });

    it(':canvas can be unset', function() {
	scene.canvas = null;
	expect(scene.canvas).toBeNull();
    });

    it('Should stop listening for touch events if the canvas is unset', function() {
	scene.canvas = null;
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
	expect(canvas.removeEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

    it('Should stop refering to the context if the canvas is unset', function() {
	scene.canvas = null;
	expect(scene.context).toBeNull();
    });
});
