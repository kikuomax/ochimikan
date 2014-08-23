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
 * @uses DirectionListener
 * @param canvas {GameCanvas}
 *     The `GameCanvas` to be associated with the `Scene`.
 */
Scene = (function () {
	function Scene(canvas) {
		var self = this;

		ActorScheduler.call(self);

		var mikanBox = new MikanBox(Scene.COLUMN_COUNT,
									Scene.ROW_COUNT,
									Scene.SQUARE_SIZE);

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
		var _rotation;
		Object.defineProperty(self, 'mikanSpawner', {
			value: new Actor(ActorPriorities.SPAWN, function (scheduler) {
				_controlledMikans = new Array(2);
				var x = Math.floor(mikanBox.columnCount / 2)
					* mikanBox.squareSize;
				// (0)
				// (1)
				for (var i = 0; i < 2; ++i) {
					var damage = Math.floor(3 * Math.random()) + 1;
					_controlledMikans[i] = new Mikan(damage);
					_controlledMikans[i]
						.locate(x, -(mikanBox.squareSize * (2 - i)));
				}
				_rotation = 0;
				self.schedule(_mikanController);
				self.schedule(self.mikanSpawner);
			})
		});
		self.schedule(self.mikanSpawner);

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
		var speed = 3;
		var _mikanController = new Actor(ActorPriorities.CONTROL, function (scheduler) {
			// makes sure that the controlled mikan is reaching the bottom
			var bottom = Math.max(_controlledMikans[0].y,
								  _controlledMikans[1].y);
			bottom += speed + mikanBox.squareSize - 1;
			bottomRow = mikanBox.rowAt(bottom);
			var moved = false;
			if (bottomRow >= 0) {
				// makse sure that no mikan is placed under the controlled
				// mikans
				var left = Math.min(_controlledMikans[0].x,
									_controlledMikans[1].x);
				var right = Math.max(_controlledMikans[0].x,
									 _controlledMikans[1].x);
				var leftColumn = mikanBox.columnAt(left);
				var rightColumn = mikanBox.columnAt(right);
				if (!mikanBox.mikanAt(leftColumn, bottomRow)
					&& !mikanBox.mikanAt(rightColumn, bottomRow))
				{
					_controlledMikans.forEach(function (mikan) {
						mikan.y += speed;
					});
					moved = true;
				}
			}
			if (moved) {
				self.schedule(this);
			} else {
				// places the mikan
				_controlledMikans.forEach(function (mikan) {
					var column = mikanBox.columnAt(mikan.x);
					var row = mikanBox.rowAt(mikan.y + speed);
					mikanBox.place(mikan, column, row);
				});
				_controlledMikans = null;
				// schedules to drop and erase mikans
				mikanBox.scheduleToDrop(self);
				mikanBox.scheduleToErase(self);
			}
		});
		Renderable.call(_mikanController, function (context) {
			_controlledMikans.forEach(function (mikan) {
				mikan.render(context);
			});
		});
		Object.defineProperty(self, 'mikanController',
							  { value: _mikanController });

		/**
		 * The width of this scene.
		 *
		 * @property width
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'width', { value: mikanBox.width });

		/**
		 * The height of this scene.
		 *
		 * @preoperty height
		 * @type {number}
		 * @final
		 */
		Object.defineProperty(self, 'height', { value: mikanBox.height });

		/**
		 * The canvas associated with this scene.
		 *
		 * @property canvas
		 * @type {GameCanvas}
		 */
		Object.defineProperty(self, 'canvas', { value: canvas });
		canvas.addDirectionListener(self);

		/**
		 * The context of the canvas.
		 *
		 * `null` if no canvas is associated with this scene.
		 *
		 * @property context
		 * @type {Context}
		 */
		var _context = canvas.getContext('2d');
		Object.defineProperty(self, 'context', { value: _context });

		/**
		 * Renders this scene.
		 *
		 * @method render
		 */
		self.render = function () {
			_context.clearRect(0, 0, self.width, self.height);
			mikanBox.render(_context);
			// renders renderable actors
			self.actorQueue.forEach(function (actor) {
				if (Renderable.isClassOf(actor)) {
					actor.render(_context);
				}
			});
		};

		/**
		 * Moves controlled mikans left.
		 *
		 * @method moveLeft
		 */
		self.moveLeft = function () {
			if (_controlledMikans) {
				// makes sure that the controlled mikans are not on
				// the left edge
				var left = Math.min(_controlledMikans[0].x,
									_controlledMikans[1].x);
				left -= mikanBox.squareSize;
				var leftColumn = mikanBox.columnAt(left);
				if (leftColumn >= 0) {
					// makes sure that no mikan is placed at the left of
					// the controlled mikans
					var bottom = Math.max(_controlledMikans[0].y,
										  _controlledMikans[1].y);
					bottom += mikanBox.squareSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.mikanAt(leftColumn, bottomRow)) {
						_controlledMikans.forEach(function (mikan) {
							mikan.translate(-mikanBox.squareSize, 0);
						});
					}
				}
			}
		};

		/**
		 * Moves controlled mikans right.
		 *
		 * @method moveRight
		 */
		self.moveRight = function () {
			if (_controlledMikans) {
				// makes sure that the controlled mikans are not on
				// the right edge
				var right = Math.max(_controlledMikans[0].x,
									 _controlledMikans[1].x);
				right += mikanBox.squareSize;
				var rightColumn = mikanBox.columnAt(right);
				if (rightColumn < mikanBox.columnCount) {
					// makes aure that no mikan is placed at the right of
					// the controlled mikans
					var bottom = Math.max(_controlledMikans[0].y,
										  _controlledMikans[1].y);
					bottom += mikanBox.squareSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.mikanAt(rightColumn, bottomRow)) {
						_controlledMikans.forEach(function (mikan) {
							mikan.translate(mikanBox.squareSize, 0);
						});
					}
				}
			}
		};

		/**
		 * Rotate mikans clockwise.
		 *
		 * @method rotateClockwise
		 */
		self.rotateClockwise = function () {
			if (_controlledMikans) {
				var rotation = _rotation + 1;
				if (rotation == 4) {
					rotation = 0;
				}
				updateRotation(rotation);
			}
		};

		/**
		 * Rotate mikans counter-clockwise.
		 *
		 * @method rotateCounterClockwise
		 */
		self.rotateCounterClockwise = function () {
			if (_controlledMikans) {
				var rotation = _rotation - 1;
				if (rotation < 0) {
					rotation = 3;
				}
				updateRotation(rotation);
			}
		};

		/**
		 * Updates the rotation of controlled mikans.
		 *
		 * @method updateRotation
		 * @private
		 */
		function updateRotation(rotation) {
			var newX, newY;
			// moves _controlledMikans[0] to a new location
			switch(rotation) {
			case 0:
				newX = _controlledMikans[1].x;
				newY = _controlledMikans[1].y - mikanBox.squareSize;
				break;
			case 1:
				newX = _controlledMikans[1].x + mikanBox.squareSize;
				newY = _controlledMikans[1].y;
				break;
			case 2:
				newX = _controlledMikans[1].x;
				newY = _controlledMikans[1].y + mikanBox.squareSize;
				break;
			case 3:
				newX = _controlledMikans[1].x - mikanBox.squareSize;
				newY = _controlledMikans[1].y;
				break;
			default:
				console.log('invalid rotation: ' + _rotation);
			}
			// makes sure that the new location is in the mikan box
			var column = mikanBox.columnAt(newX);
			var row = mikanBox.rowAt(newY + mikanBox.squareSize - 1);
			if (column >= 0 && column < mikanBox.columnCount && row >= 0) {
				// makes sure that no mikan is placed at the new location
				if (!mikanBox.mikanAt(column, row)) {
					_controlledMikans[0].x = newX;
					_controlledMikans[0].y = newY;
					_rotation = rotation;
				}
			}
		}
	}
	// extends ActorScheduler
	ActorScheduler.augment(Scene.prototype);

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

	return Scene;
})();
