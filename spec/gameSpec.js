describe('Game', function() {
    var canvas;

    beforeEach(function() {
	// creates a dummy canvas
	canvas = document.createElement("canvas");
	canvas.id = Game.CANVAS_ID;
	document.body.appendChild(canvas);
	// spies setInterval
	spyOn(window, 'setInterval');
    });

    afterEach(function() {
	// removes the dummy canvas
	document.body.removeChild(canvas);
    });

    it('should start game', function() {
	Game.start();
	expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), Game.FRAME_INTERVAL);
    });
});
