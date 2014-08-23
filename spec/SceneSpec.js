describe('Scene without a canvas', function () {
	xit('Should be associated with no canvas', function () {
		var scene = new Scene();
		expect(scene.canvas).toBeNull();
	});

	xit('Should refer to no context', function () {
		var scene = new Scene();
		expect(scene.context).toBeNull();
	});

	xit('Should create a mikan box of supposed size', function () {
		var scene = new Scene();
		expect(scene.width).toBe(Scene.COLUMN_COUNT * Scene.SQUARE_SIZE);
		expect(scene.height).toBe(Scene.ROW_COUNT * Scene.SQUARE_SIZE);
	});

	xit('Should initially schedule a mikanSpawner', function () {
		var scene = new Scene();
		expect(scene.actorQueue).toEqual([scene.mikanSpawner]);
	});

	xit(':mikanSpawner should have priority SPAWN', function () {
		var scene = new Scene();
		expect(scene.mikanSpawner.priority).toBe(ActorPriorities.SPAWN);
	});

	xit(':mikanSpawner should schedule a mikanController and itself', function () {
		var scene = new Scene();
		scene.run();
		expect(scene.actorQueue.length).toBe(2);
		expect(scene.actorQueue).toContain(scene.mikanController);
		expect(scene.actorQueue).toContain(scene.mikanSpawner);
	});

	xit(':mikanController should have priority CONTROL', function () {
		var scene = new Scene();
		expect(scene.mikanController.priority).toBe(ActorPriorities.CONTROL);
	});

	xit(':mikanController should schedule itself', function () {
		var scene = new Scene();
		scene.run();
		scene.run();
		expect(scene.actorQueue).toContain(scene.mikanController);
	});

	xit(':mikanController should stop when controlled mikans reach the ground', function () {
	});
});

describe('Scene associated with a canvas', function () {
	var canvas;
	var scene;

	beforeEach(function () {
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

	afterEach(function () {
		document.body.removeChild(canvas);
	});

	xit('Should refer to the associated canvas', function () {
		expect(scene.canvas).toBe(canvas);
	});

	xit('Should listen to canvas for touch events', function () {
		expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
		expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
		expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
	});

	xit('Should refer to the context of the associated canvas', function () {
		expect(scene.context).toBe(canvas.getContext('2d'));
	});

	xit(':canvas can be unset', function () {
		scene.canvas = null;
		expect(scene.canvas).toBeNull();
	});

	xit('Should stop listening for touch events if the canvas is unset', function () {
		scene.canvas = null;
		expect(canvas.removeEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
		expect(canvas.removeEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
		expect(canvas.removeEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
    });

	xit('Should stop refering to the context if the canvas is unset', function () {
		scene.canvas = null;
		expect(scene.context).toBeNull();
	});

	xit(':render should render a renderable actor', function () {
		var actor = new Actor(-1, function () {});
		Renderable.call(actor, jasmine.createSpy('render'));
		scene.schedule(actor);
		scene.render();
		expect(actor.render).toHaveBeenCalledWith(scene.context);
	});
});
