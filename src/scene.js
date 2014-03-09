/**
 * Defines a scene of the game.
 *
 * # Use Cases
 *
 * ## Starting a scene
 *
 * 1. A user creates a `Scene` and associates it with the canvas.
 * 1. The user sees a `MikanBox` in the `Scene`.
 *
 * ## Resizing a canvas
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` for its size (width and height).
 * 1. The user resizes a canvas so that it can render the entire `Scene`.
 *
 * ## Running a single step
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` to run a single step.
 *
 * ## Horizontally moving a mikan pair
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user horizontally swipes the `Scene`.
 * 1. The mikan pair moves in the same direction as the user has swiped.
 *
 * ## Rotating a mikan pair clockwise
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user swipes the `Scene` upward.
 * 1. The mikan pair rotates clockwise.
 *
 * ## Rotating a mikan pair counterclockwise
 *
 * 1. A `Scene` is given.
 * 1. A pair of `Mikan`s is given.
 * 1. A user swipes the `Scene` downward.
 * 1. The mikan pair rotates counterclockwise.
 *
 * @module scene
 */

/**
 * A scene of the game.
 *
 * # Scenarios
 *
 * ## Creating a scene
 *
 * 1. A user creates a `Scene`.
 * 1. The `Scene` creates an empty `MikanBox` which has
 *    the following properties.
 *    - number of columns is `COLUMN_COUNT`
 *    - number of rows is `ROW_COUNT`
 *    - size of each square is `SQUARE_SIZE`
 * 1. The `Scene` sets its width and height to the same as the `MikanBox`.
 * 1. The `Scene` schedules an actor which spawns controlled mikans
 *    (`mikanSpawner`).
 *
 * ## Associating a scene with a canvas
 *
 * 1. A canvas (`Element`) is given.
 * 1. A `Scene` is given.
 * 1. A user associates the `Scene` with the canvas.
 * 1. The `Scene` listens to the canvas for the following events,
 *    - touchstart
 *    - touchmove
 *    - touchend
 * 1. The `Scene` will perform rendering on the 2D context of the canvas.
 *
 * ## Running a single step
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` to run a single step.
 * 1. The `Scene` runs scheduled actors (ActorScheduler's behavior).
 *
 * ## Rendering a scene
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` to render it.
 * 1. The `Scene` clears a canvas associated with it.
 * 1. The `Scene` renders its mikan box, controlled mikans and
 *    renderable actors scheduled in it.
 *
 * ## Spawning controlled mikans
 *
 * 1. A `Scene` runs its `mikanSpawner`.
 * 1. The `mikanSpawner` creates two mikans and makes them controlled
 *    in the `Scene`.
 * 1. The `mikanSpawner` schedules an actor which moves the controlled mikans
 *    downward (`mikanController`).
 * 1. The `mikanSpawner` reschedules itself in the `Scene`.
 *
 * ## Moving controlled mikans downward
 *
 * 1. A `Scene` runs its `mikanController`.
 * 1. The `mikanController` moves controlled mikans downward.
 * 1. The `mikanController` reschedules itself in the `Scene`.
 *
 * ### Derivatives
 *
 * - 2 Either or both of the controlled mikans have reached the ground.
 *   1. The `mikanController` asks its `MikanBox` to place each controlled
 *      mikan in it.
 *   1. The `mikanController` asks its `MikanBox` to drop all mikans.
 *   1. The `mikanController` schedules an actor which erases chained mikans
 *      ('mikanChainer').
 *   1. The `mikanController` stops.
 *
 * ## Erasing chained mikans
 *
 * 1. A `Scene` runs its `mikanChainer`.
 * 1. The `mikanChainer` asks its `MikanBox` to erases chained mikans.
 * 1. The `mikanChainer` reschedules itself in the `Scene`.
 *
 * ### Derivatives
 *
 * - 2 No mikans have been erased.
 *   1. The `mikanChainer` stops.
 *
 * @class Scene
 * @contructor
 * @extends ActorScheduler
 */
function Scene() {
    var self = this;

    // makes this scene an actor scheduler
    ActorScheduler.call(self);

    var mikanBox = new MikanBox(Scene.COLUMN_COUNT, Scene.ROW_COUNT, Scene.SQUARE_SIZE);

    /**
     * The actor which spawns controlled mikans.
     *
     * `mikanSpwaner.priority = ActorPriorities.SPAWN`
     *
     * The mikans to be spawned have the following properties.
     * - x: (COLUMN_COUNT / 2) * SQUARE_SIZE
     * - y: -(SQUARE_SIZE * i), i=1,2
     * - damage: randomly chosen
     *
     * @property mikanSpawner
     * @type {Actor, Renderable}
     * @final
     */
    var _controlledMikans;
        // NOTE: _controlledMikans[0].x <= _controlledMikans[1].x
        //       _controlledMikans[0].y <= _controlledMikans[1].y
    var _mikanSpawner = new Actor(ActorPriorities.SPAWN, function(scheduler) {
	_controlledMikans = new Array(2);
	var x = (Scene.COLUMN_COUNT / 2) * Scene.SQUARE_SIZE;
	for (var i = 0; i < 2; ++i) {
	    _controlledMikans[i] = new Mikan(0);
	    _controlledMikans[i].locate(x, -(Scene.SQUARE_SIZE * (2 - i)));
	}
	self.schedule(_mikanController);
	self.schedule(_mikanSpawner);
    });
    Object.defineProperty(self, 'mikanSpawner', { value: _mikanSpawner });
    self.schedule(_mikanSpawner);

    /**
     * An actor which moves controlled mikans downward.
     *
     * `mikanController.priority = ActorPriorities.CONTROL`
     *
     * Also is a renderable which renders controlled mikans.
     *
     * @property mikanController
     * @type {Actor, Renderable}
     * @final
     */
    var speed = 1;
    var _mikanController = new Actor(ActorPriorities.CONTROL, function(scheduler) {
	_controlledMikans.forEach(function(mikan) {
	    mikan.y += speed;
	});
	self.schedule(this);
    });
    Renderable.call(_mikanController, function(context) {
	_controlledMikans.forEach(function(mikan) {
	    mikan.render(context);
	});
    });
    Object.defineProperty(self, 'mikanController', { value: _mikanController });

    /**
     * The width of this scene.
     *
     * @property width
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'width', { value: mikanBox.width });

    /**
     * The height of this scene.
     *
     * @preoperty height
     * @type {Number}
     * @final
     */
    Object.defineProperty(self, 'height', { value: mikanBox.height });

    /**
     * The canvas associated with this scene.
     *
     * `null` if no canvas is associated with this scene.
     *
     * When a canvas is assigned, touch event listeners will be added to it.
     * These touch event listener will be removed from it, when the canvas
     * is unset.
     *
     * @property canvas
     * @type {Element}
     */
    var _canvas = null;
    Object.defineProperty(self, 'canvas', {
	get: function() { return _canvas; },
	set: function(canvas) {
	    if (_canvas != null) {
		_context = null;
		// removes the touch event listeners from the old canvas
		removeListeners(_canvas);
	    }
	    _canvas = canvas;
	    if (_canvas != null) {
		_context = _canvas.getContext('2d');
		// adds the touch event listeners to the new canvas
		addListeners(_canvas);
	    }
	}
    });

    /**
     * The context of the canvas.
     *
     * `null` if no canvas is associated with this scene.
     *
     * @property context
     * @type {Context}
     */
    var _context = null;
    Object.defineProperty(self, 'context', {
	get: function() { return _context; }
    });

    /**
     * Renders this scene.
     *
     * @method render
     */
    self.render = function() {
	_context.clearRect(0, 0, self.width, self.height);
	mikanBox.render(_context);
	// renders renderable actors
	self.actorQueue.forEach(function(actor) {
	    if (Renderable.isRenderable(actor)) {
		actor.render(_context);
	    }
	});
    };

    /**
     * Handles a 'touchstart' event.
     *
     * @method touchStarted
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchStarted = function(event) {
    };

    /**
     * Handles a 'touchmove' event.
     *
     * @method touchMoved
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchMoved = function(event) {
    };

    /**
     * Handles a 'touchend' event.
     *
     * @method touchEnded
     * @param event {TouchEvent}
     *     The details of the event.
     */
    self.touchEnded = function(event) {
    };

    /**
     * Adds listeners to the specified canvas.
     *
     * @method addListeners
     * @private
     * @param canvas {Element}
     *     The canvas to which listeners are to be added.
     */
    function addListeners(canvas) {
	canvas.addEventListener('touchstart', self.touchStarted, false);
	canvas.addEventListener('touchmove', self.touchMoved, false);
	canvas.addEventListener('touchend', self.touchEnded, false);
    }

    /**
     * Removes listeners from the specified canvas.
     *
     * @method removeListeners
     * @private
     * @param canvas {Element}
     *     The canvas from which listeners are to be removed.
     */
    function removeListeners(canvas) {
	canvas.removeEventListener('touchstart', self.touchStarted, false);
	canvas.removeEventListener('touchmove', self.touchMoved, false);
	canvas.removeEventListener('touchend', self.touchEnded, false);
    }
}
// extends ActorScheduler
ActorScheduler.wrap(Scene.prototype);

/**
 * The number of columns in a mikan box.
 *
 * `COLUMN_COUNT = 8`
 *
 * @property COLUMN_COUNT
 * @type {Number}
 * @static
 * @final
 */
Object.defineProperty(Scene, 'COLUMN_COUNT', { value: 8 });

/**
 * The number of rows in a mikan box.
 *
 * `ROW_COLUMN = 12`
 *
 * @property ROW_COUNT
 * @type {Number}
 * @static
 * @final
 */
Object.defineProperty(Scene, 'ROW_COUNT', { value: 12 });

/**
 * The size of each square in a mikan box.
 *
 * `SQUARE_SIZE = 32`
 *
 * @property SQUARE_SIZE
 * @type {Number}
 * @static
 * @final
 */
Object.defineProperty(Scene, 'SQUARE_SIZE', { value: 32 });
