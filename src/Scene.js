/**
 * A scene of the game.
 *
 * An `Actor` which spawns grabbed items will be scheduled initially.
 *
 * # Scenarios
 *
 * ## Rendering a scene
 *
 *  1. A `Scene` is given.
 *  2. A user asks the `Scene` to render it.
 *  3. The `Scene` clears a canvas associated with it.
 *  4. The `Scene` renders its mikan box, grabbed items and renderable actors
 *     scheduled in it.
 *
 * @class Scene
 * @contructor
 * @extends ActorScheduler
 * @uses DirectionListener
 * @param canvas {GameCanvas}
 *     The `GameCanvas` to be associated with the `Scene`.
 * @param score {Score}
 *     The `Score`.
 */
Scene = (function () {
	function Scene(canvas, score) {
		var self = this;

		ActorScheduler.call(self);

		var mikanBox = new MikanBox(Scene.COLUMN_COUNT,
									Scene.ROW_COUNT,
									Scene.CELL_SIZE,
									0,
									score);

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
		 * The actor which spawns grabbed items.
		 *
		 * The priority of the actor is `ActorPriorities.SPAWN`.
		 *
		 * The items to be spawned have the following properties.
		 *  - x: (COLUMN_COUNT / 2) * CELL_SIZE
		 *  - y: -(CELL_SIZE * i), i=1,2
		 *  - damage: randomly chosen
		 *
		 * @property spawner
		 * @type {Actor, Renderable}
		 * @private
		 */
		var grabbedItems;
		var rotation;
		var spawner = new Actor(ActorPriorities.SPAWN, function (scheduler) {
			grabbedItems = new Array(2);
			var x = Math.floor(mikanBox.columnCount / 2) * mikanBox.cellSize;
			// (0)
			// (1)
			for (var i = 0; i < 2; ++i) {
				var damage = Math.floor(4 * Math.random());
				var y = -(mikanBox.cellSize * (2 - i));
				grabbedItems[i] = new Mikan(damage);
				grabbedItems[i].locate(x, y);
			}
			rotation = 0;
			self.schedule(gravity);
			self.schedule(spawner);
		});
		self.schedule(spawner);

		/**
		 * An actor which moves grabbed items downward.
		 *
		 * The priority of the actor is `ActorPriorities.CONTROL`.
		 *
		 * Also is a renderable which renders grabbed items.
		 *
		 * @property gravity
		 * @type {Actor, Renderable}
		 * @private
		 */
		var speed = 3;
		var gravity = new Actor(ActorPriorities.CONTROL, function (scheduler) {
			if (grabbedItems) {
				grabbedItems.forEach(function (item) {
					item.y += speed;
				});
				// releases grabbed items if they reach the ground
				var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
				bottom += mikanBox.cellSize - 1;
				bottomRow = mikanBox.rowAt(bottom);
				var moved = false;
				if (bottomRow >= 0) {
					// releases grabbed items if they reach the fixed items
					var left  = Math.min(grabbedItems[0].x, grabbedItems[1].x);
					var right = Math.max(grabbedItems[0].x, grabbedItems[1].x);
					var leftColumn  = mikanBox.columnAt(left);
					var rightColumn = mikanBox.columnAt(right);
					if (!mikanBox.itemIn(leftColumn, bottomRow)
						&& !mikanBox.itemIn(rightColumn, bottomRow))
					{
						moved = true;
					}
				}
				if (moved) {
					self.schedule(this);
				} else {
					doReleaseControl();
				}
			}
		});
		Renderable.call(gravity, function (context) {
			grabbedItems.forEach(function (item) {
				item.render(context);
			});
		});

		/**
		 * Renders this scene.
		 *
		 * @method render
		 */
		self.render = function () {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, self.width, self.height);
			mikanBox.render(context);
			// renders renderable actors
			self.actorQueue.forEach(function (actor) {
				if (Renderable.isClassOf(actor)) {
					actor.render(context);
				}
			});
		};

		/**
		 * Schedules to move grabbed items left.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method moveLeft
		 */
		self.moveLeft = function () {
			scheduleInput(doMoveLeft);
		};

		/**
		 * Schedules to move grabbed items right.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method moveRight
		 */
		self.moveRight = function () {
			scheduleInput(doMoveRight);
		};

		/**
		 * Schedules to rotate grabbed items clockwise.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method rotateClockwise
		 */
		self.rotateClockwise = function () {
			scheduleInput(doRotateClockwise);
		};

		/**
		 * Schedules to rotate grabbed items counter-clockwise.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method rotateCounterClockwise
		 */
		self.rotateCounterClockwise = function () {
			scheduleInput(doRotateCounterClockwise);
		};

		/**
		 * Schedules to frees grabbed items.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method releaseControl
		 */
		self.releaseControl = function () {
			scheduleInput(doReleaseControl);
		};

		// Schedules a specified function as an input Actor.
		function scheduleInput(input) {
			self.schedule(new Actor(-1, function () {
				try {
					input();
				} catch (err) {
					console.error(err);
				}
			}));
		};

		// Moves grabbed items left.
		function doMoveLeft() {
			if (grabbedItems) {
				// makes sure that the grabbed items are not on the left edge
				var left = Math.min(grabbedItems[0].x, grabbedItems[1].x);
				left -= mikanBox.cellSize;
				var leftColumn = mikanBox.columnAt(left);
				if (leftColumn >= 0) {
					// makes sure that no item is placed at the left of
					// the grabbed items
					var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
					bottom += mikanBox.cellSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.itemIn(leftColumn, bottomRow)) {
						grabbedItems.forEach(function (item) {
							item.translate(-mikanBox.cellSize, 0);
						});
					}
				}
			}
		};

		// Moves grabbed items rights.
		function doMoveRight() {
			if (grabbedItems) {
				// makes sure that the grabbed items are not on the right edge
				var right = Math.max(grabbedItems[0].x, grabbedItems[1].x);
				right += mikanBox.cellSize;
				var rightColumn = mikanBox.columnAt(right);
				if (rightColumn < mikanBox.columnCount) {
					// makes sure that no item is placed at the right of
					// the grabbed items
					var bottom = Math.max(grabbedItems[0].y, grabbedItems[1].y);
					bottom += mikanBox.cellSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.itemIn(rightColumn, bottomRow)) {
						grabbedItems.forEach(function (item) {
							item.translate(mikanBox.cellSize, 0);
						});
					}
				}
			}
		};

		// Rotates grabbed items clockwise.
		function doRotateClockwise() {
			if (grabbedItems) {
				var newRotation = rotation + 1;
				if (newRotation == 4) {
					newRotation = 0;
				}
				updateRotation(newRotation);
			}
		};

		// Rotates grabbed items counter-clockwise.
		function doRotateCounterClockwise() {
			if (grabbedItems) {
				var newRotation = rotation - 1;
				if (newRotation < 0) {
					newRotation = 3;
				}
				updateRotation(newRotation);
			}
		};

		// Updates the rotation of grabbed items.
		function updateRotation(newRotation) {
			var newX, newY;
			// moves grabbedItems[0] to a new location
			switch(newRotation) {
			case 0:
				newX = grabbedItems[1].x;
				newY = grabbedItems[1].y - mikanBox.cellSize;
				break;
			case 1:
				newX = grabbedItems[1].x + mikanBox.cellSize;
				newY = grabbedItems[1].y;
				break;
			case 2:
				newX = grabbedItems[1].x;
				newY = grabbedItems[1].y + mikanBox.cellSize;
				break;
			case 3:
				newX = grabbedItems[1].x - mikanBox.cellSize;
				newY = grabbedItems[1].y;
				break;
			default:
				console.error('invalid rotation: ' + newRotation);
			}
			// makes sure that the new location is in the mikan box
			var column = mikanBox.columnAt(newX);
			var row = mikanBox.rowAt(newY + mikanBox.cellSize - 1);
			if (column >= 0 && column < mikanBox.columnCount && row >= 0) {
				// makes sure that no item is placed at the new location
				if (!mikanBox.itemIn(column, row)) {
					grabbedItems[0].x = newX;
					grabbedItems[0].y = newY;
					rotation = newRotation;
				}
			}
		}

		// Releases control of grabbed items.
		function doReleaseControl() {
			if (grabbedItems) {
				// places the items
				grabbedItems.forEach(function (item) {
					var column = mikanBox.columnAt(item.x);
					var row    = mikanBox.rowAt(item.y);
					try {
						mikanBox.place(item, column, row);
					} catch (err) {
						console.error(err);
					}
				});
				grabbedItems = null;
				// schedules to drop items and erase mikans
				mikanBox.scheduleToDrop(self);
				mikanBox.scheduleToErase(self);
			}
		}
	}
	ActorScheduler.augment(Scene.prototype);

	/**
	 * The number of columns in a mikan box.
	 *
	 *     Scene.COLUMN_COUNT = 8
	 *
	 * @property COLUMN_COUNT
	 * @type {number}
	 * @static
	 */
	Scene.COLUMN_COUNT = 8;

	/**
	 * The number of rows in a mikan box.
	 *
	 *     Scene.ROW_COUNT = 12
	 *
	 * @property ROW_COUNT
	 * @type {number}
	 * @static
	 */
	Scene.ROW_COUNT = 12;

	/**
	 * The size of each cell in a mikan box.
	 *
	 *     Scene.CELL_SIZE = 32
	 *
	 * @property CELL_SIZE
	 * @type {number}
	 * @static
	 */
	Scene.CELL_SIZE = 32;

	return Scene;
})();
