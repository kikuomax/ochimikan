/**
 * A scene of the game.
 *
 * An `Actor` which spawns grabbed mikans will be scheduled initially.
 *
 * # Scenarios
 *
 * ## Rendering a scene
 *
 * 1. A `Scene` is given.
 * 1. A user asks the `Scene` to render it.
 * 1. The `Scene` clears a canvas associated with it.
 * 1. The `Scene` renders its mikan box, controlled mikans and
 *    renderable actors scheduled in it.
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
									Scene.SQUARE_SIZE,
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
		 * The actor which spawns controlled mikans.
		 *
		 * `mikanSpwaner.priority = ActorPriorities.SPAWN`
		 *
		 * The mikans to be spawned have the following properties.
		 * - x: (COLUMN_COUNT / 2) * SQUARE_SIZE
		 * - y: -(SQUARE_SIZE * i), i=1,2
		 * - damage: randomly chosen
		 *
		 * @property spawner
		 * @type {Actor, Renderable}
		 * @private
		 */
		var grabbedMikans;
		var rotation;
		var spawner = new Actor(ActorPriorities.SPAWN, function (scheduler) {
			grabbedMikans = new Array(2);
			var x = Math.floor(mikanBox.columnCount / 2) * mikanBox.squareSize;
			// (0)
			// (1)
			for (var i = 0; i < 2; ++i) {
				var damage = Math.floor(3 * Math.random()) + 1;
				var y = -(mikanBox.squareSize * (2 - i));
				grabbedMikans[i] = new Mikan(damage);
				grabbedMikans[i].locate(x, y);
			}
			rotation = 0;
			self.schedule(gravity);
			self.schedule(spawner);
		});
		self.schedule(spawner);

		/**
		 * An actor which moves controlled mikans downward.
		 *
		 * `mikanController.priority = ActorPriorities.CONTROL`
		 *
		 * Also is a renderable which renders controlled mikans.
		 *
		 * @property gravity
		 * @type {Actor, Renderable}
		 * @private
		 */
		var speed = 3;
		var gravity = new Actor(ActorPriorities.CONTROL, function (scheduler) {
			if (grabbedMikans) {
				grabbedMikans.forEach(function (mikan) {
					mikan.y += speed;
				});
				// releases grabbed mikans if they reach the ground
				var bottom = Math.max(grabbedMikans[0].y, grabbedMikans[1].y);
				bottom += mikanBox.squareSize - 1;
				bottomRow = mikanBox.rowAt(bottom);
				var moved = false;
				if (bottomRow >= 0) {
					// releases grabbed mikans if they reach the fixed mikans
					var left = Math.min(grabbedMikans[0].x, grabbedMikans[1].x);
					var right = Math.max(grabbedMikans[0].x,
										 grabbedMikans[1].x);
					var leftColumn = mikanBox.columnAt(left);
					var rightColumn = mikanBox.columnAt(right);
					if (!mikanBox.mikanAt(leftColumn, bottomRow)
						&& !mikanBox.mikanAt(rightColumn, bottomRow))
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
			grabbedMikans.forEach(function (mikan) {
				mikan.render(context);
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
		 * Schedules to move grabbed mikans left.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method moveLeft
		 */
		self.moveLeft = function () {
			scheduleInput(doMoveLeft);
		};

		/**
		 * Schedules to move controlled mikans right.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method moveRight
		 */
		self.moveRight = function () {
			scheduleInput(doMoveRight);
		};

		/**
		 * Schedules to rotate grabbed mikans clockwise.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method rotateClockwise
		 */
		self.rotateClockwise = function () {
			scheduleInput(doRotateClockwise);
		};

		/**
		 * Schedules to rotate grabbed mikans counter-clockwise.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method rotateCounterClockwise
		 */
		self.rotateCounterClockwise = function () {
			scheduleInput(doRotateCounterClockwise);
		};

		/**
		 * Schedules to frees grabbed mikans.
		 *
		 * This method will be invoked from `GameCanvas`.
		 *
		 * @method releaseControl
		 */
		self.releaseControl = function () {
			scheduleInput(doReleaseControl);
		};

		// Moves grabbed mikans left.
		function doMoveLeft() {
			if (grabbedMikans) {
				// makes sure that the grabbed mikans are not on the left edge
				var left = Math.min(grabbedMikans[0].x, grabbedMikans[1].x);
				left -= mikanBox.squareSize;
				var leftColumn = mikanBox.columnAt(left);
				if (leftColumn >= 0) {
					// makes sure that no mikan is placed at the left of
					// the grabbed mikans
					var bottom = Math.max(grabbedMikans[0].y,
										  grabbedMikans[1].y);
					bottom += mikanBox.squareSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.mikanAt(leftColumn, bottomRow)) {
						grabbedMikans.forEach(function (mikan) {
							mikan.translate(-mikanBox.squareSize, 0);
						});
					}
				}
			}
		};

		// Moves grabbed mikans rights.
		function doMoveRight() {
			if (grabbedMikans) {
				// makes sure that the grabbed mikans are not on the right edge
				var right = Math.max(grabbedMikans[0].x, grabbedMikans[1].x);
				right += mikanBox.squareSize;
				var rightColumn = mikanBox.columnAt(right);
				if (rightColumn < mikanBox.columnCount) {
					// makes aure that no mikan is placed at the right of
					// the grabbed mikans
					var bottom = Math.max(grabbedMikans[0].y,
										  grabbedMikans[1].y);
					bottom += mikanBox.squareSize - 1;
					bottomRow = Math.max(0, mikanBox.rowAt(bottom));
					if (!mikanBox.mikanAt(rightColumn, bottomRow)) {
						grabbedMikans.forEach(function (mikan) {
							mikan.translate(mikanBox.squareSize, 0);
						});
					}
				}
			}
		};

		// Schedules a specified function as an input Actor.
		function scheduleInput(input) {
			self.schedule(new Actor(-1, function () {
				try {
					input();
				} catch (err) {
					console.log(err);
				}
			}));
		};

		// Rotates grabbed mikans clockwise.
		function doRotateClockwise() {
			if (grabbedMikans) {
				var newRotation = rotation + 1;
				if (newRotation == 4) {
					newRotation = 0;
				}
				updateRotation(newRotation);
			}
		};

		// Rotates grabbed mikans counter-clockwise.
		function doRotateCounterClockwise() {
			if (grabbedMikans) {
				var newRotation = rotation - 1;
				if (newRotation < 0) {
					newRotation = 3;
				}
				updateRotation(newRotation);
			}
		};

		// Updates the rotation of grabbed mikans.
		function updateRotation(newRotation) {
			var newX, newY;
			// moves grabbedMikans[0] to a new location
			switch(newRotation) {
			case 0:
				newX = grabbedMikans[1].x;
				newY = grabbedMikans[1].y - mikanBox.squareSize;
				break;
			case 1:
				newX = grabbedMikans[1].x + mikanBox.squareSize;
				newY = grabbedMikans[1].y;
				break;
			case 2:
				newX = grabbedMikans[1].x;
				newY = grabbedMikans[1].y + mikanBox.squareSize;
				break;
			case 3:
				newX = grabbedMikans[1].x - mikanBox.squareSize;
				newY = grabbedMikans[1].y;
				break;
			default:
				console.log('invalid rotation: ' + newRotation);
			}
			// makes sure that the new location is in the mikan box
			var column = mikanBox.columnAt(newX);
			var row = mikanBox.rowAt(newY + mikanBox.squareSize - 1);
			if (column >= 0 && column < mikanBox.columnCount && row >= 0) {
				// makes sure that no mikan is placed at the new location
				if (!mikanBox.mikanAt(column, row)) {
					grabbedMikans[0].x = newX;
					grabbedMikans[0].y = newY;
					rotation = newRotation;
				}
			}
		}

		// Releases control of grabbed mikans.
		function doReleaseControl() {
			if (grabbedMikans) {
				// places the mikan
				grabbedMikans.forEach(function (mikan) {
					var column = mikanBox.columnAt(mikan.x);
					var row    = mikanBox.rowAt(mikan.y);
					mikanBox.place(mikan, column, row);
				});
				grabbedMikans = null;
				// schedules to drop and erase mikans
				mikanBox.scheduleToDrop(self);
				mikanBox.scheduleToErase(self);
			}
		}
	}
	ActorScheduler.augment(Scene.prototype);

	/**
	 * The number of columns in a mikan box.
	 *
	 * Default is `8`.
	 *
	 * @property COLUMN_COUNT
	 * @type {number}
	 * @static
	 */
	Scene.COLUMN_COUNT = 8;

	/**
	 * The number of rows in a mikan box.
	 *
	 * Default is `12`.
	 *
	 * @property ROW_COUNT
	 * @type {number}
	 * @static
	 */
	Scene.ROW_COUNT = 12;

	/**
	 * The size of each square in a mikan box.
	 *
	 * Default is `32`.
	 *
	 * @property SQUARE_SIZE
	 * @type {number}
	 * @static
	 */
	Scene.SQUARE_SIZE = 32;

	return Scene;
})();
