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

    it(':mikanSpawner should have priority SPAWN', function() {
	var scene = new Scene();
	expect(scene.mikanSpawner.priority).toBe(ActorPriorities.SPAWN);
    });

    it(':mikanSpawner should schedule a mikanController and itself', function() {
	var scene = new Scene();
	scene.run();
	expect(scene.actorQueue.length).toBe(2);
	expect(scene.actorQueue).toContain(scene.mikanController);
	expect(scene.actorQueue).toContain(scene.mikanSpawner);
    });

    it(':mikanController should have priority CONTROL', function() {
	var scene = new Scene();
	expect(scene.mikanController.priority).toBe(ActorPriorities.CONTROL);
    });

    it(':mikanController should schedule itself', function() {
	var scene = new Scene();
	scene.run().run();
	expect(scene.actorQueue).toContain(scene.mikanController);
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
