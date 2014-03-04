describe('Initializing the game:', function() {
    var canvas;

    beforeEach(function() {
	// creates a dummy canvas
	canvas = document.createElement('canvas');
	canvas.id = Game.CANVAS_ID;
	document.body.appendChild(canvas);
	spyOn(canvas, 'getContext');
	spyOn(canvas, 'addEventListener');
	// spies the resource loader
	spyOn(Resources, 'loadSprites');
	// spies the window
	spyOn(window, 'setInterval');
    });

    afterEach(function() {
	// removes the dummy canvas
	document.body.removeChild(canvas);
    });

    it('Game should initialize the game if a canvas exists', function() {
	Game.start();
	expect(canvas.getContext).toHaveBeenCalledWith('2d');
	expect(canvas.width).toBe(Scene.COLUMN_COUNT * Scene.SQUARE_SIZE);
	expect(canvas.height).toBe(Scene.ROW_COUNT * Scene.SQUARE_SIZE);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
	expect(canvas.addEventListener).toHaveBeenCalledWith('touchend', jasmine.any(Function), false);
	expect(Resources.loadSprites).toHaveBeenCalled();
	expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), Game.FRAME_INTERVAL);
    });
});

describe('Failing to initialize the game', function() {
    it('Game should throw an exception if canvas does not exist', function() {
	expect(Game.start).toThrow('Document must have a canvas');
    });
});
