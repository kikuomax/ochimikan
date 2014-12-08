/**
 * The main scene of the game.
 *
 * `canvas` will be resized so that it fits the `MainScene`.
 *
 * An `Actor` which spawns grabbed items will be scheduled initially.
 *
 * Throws an exception
 *  - if `canvas` is not an `Element`,
 *  - or if `canvas` is not a `GamePad`,
 *  - or if `statistics` is not a `Statistics`,
 *  - or if `difficulty` is not a `Difficulty`
 *
 * Events
 * ------
 *
 * A `MainScene` will notify events to its observers. Observers will receive
 * at least the following arguments,
 *  1. Event ID: A string which tells the event type
 *  2. The instance of `MainScene`
 *
 * An event ID will be one of the following,
 *  - "gameEnded":
 *    Notified when the game has ended.
 *    Observers will receive no additional arguments.
 *
 * @class MainScene
 * @contructor
 * @extends ActorScheduler
 * @uses DirectionListener
 * @uses Observable
 * @param canvas {Element, GamePad}
 *     The canvas element on which the `MainScene` is to be rendered.
 *     This must be a `GamePad` at the same time.
 * @param statistics {Statistics}
 *     The `Statistics` of the game.
 * @param difficulty {Difficulty}
 *     The `Difficulty` of the game.
 */
MainScene = (function () {
	function MainScene(canvas, statistics, difficulty) {
		var self = this;

		ActorScheduler.call(self);
		Observable.call(self);

		// verifies the arguments
		if (!(canvas instanceof Element)) {
			throw 'canvas must be an Element';
		}
		if (!GamePad.isClassOf(canvas)) {
			throw 'canvas must be a GamePad';
		}
		if (!Statistics.isClassOf(statistics)) {
			throw 'statistics must be a Statistics';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		/**
		 * The mikan box.
		 *
		 * @property mikanBox
		 * @type {MikanBox}
		 * @private
		 */
		var mikanBox;

		/**
		 * The actor which spawns grabbed items.
		 *
		 * The priority is `ActorPriorities.SPAWN`.
		 *
		 * Items will be determined by `difficulty.nextItem`.
		 * They will be centered and start falling from just above this mikan
		 * box.
		 *
		 * @property spawner
		 * @type {Actor, Renderable}
		 * @private
		 */
		var grabbedItems;
		var rotation;  // please refer to `updateRotation`
		var spawner = new Actor(ActorPriorities.SPAWN, function (scheduler) {
			// makes sure that the center of the mikan box vacant
			var center = Math.floor(mikanBox.columnCount / 2);
			if (!mikanBox.itemIn(center, mikanBox.rowCount - 1)) {
				grabbedItems = new Array(2);
				var x = center * mikanBox.cellSize;
				for (var i = 0; i < 2; ++i) {
					var item = difficulty.nextItem();
					var y = -(mikanBox.cellSize * (i + 1));
					item.locate(x, y);
					grabbedItems[i] = item;
				}
				rotation = 0;
				self.schedule(gravity);
				self.schedule(spawner);
			} else {
				// game over
				self.notifyObservers('gameEnded', self);
			}
		});

		/**
		 * An actor which moves grabbed items downward.
		 *
		 * The priority is `ActorPriorities.CONTROL`.
		 *
		 * Also is a renderable which renders grabbed items.
		 *
		 * @property gravity
		 * @type {Actor, Renderable}
		 * @private
		 */
		var gravity = new Actor(ActorPriorities.CONTROL, function (scheduler) {
			if (grabbedItems) {
				grabbedItems.forEach(function (item) {
					item.y += difficulty.speed;
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
					doReleaseControl(true);
				}
			}
		});
		Renderable.call(gravity, function (context) {
			grabbedItems.forEach(function (item) {
				item.render(context);
			});
		});

		/**
		 * Resets this `MainScene`.
		 *
		 * @method reset
		 */
		self.reset = function () {
			mikanBox = new MikanBox(MainScene.COLUMN_COUNT,
									MainScene.ROW_COUNT,
									MainScene.ROW_MARGIN,
									MainScene.CELL_SIZE,
									statistics);
			grabbedItems = null;
			self.actorQueue = [spawner];
		};
		self.reset();

		// resizes `canvas`
		canvas.width  = mikanBox.width;
		canvas.height = mikanBox.height;

		/**
		 * Renders this scene.
		 *
		 * Renders `Renderable` actors scheduled in this `ActorScheduler`.
		 *
		 * @method render
		 */
		self.render = function () {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
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
		 * This method will be invoked from `GamePad`.
		 *
		 * @method moveLeft
		 */
		self.moveLeft = function () {
			scheduleInput(doMoveLeft);
		};

		/**
		 * Schedules to move grabbed items right.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method moveRight
		 */
		self.moveRight = function () {
			scheduleInput(doMoveRight);
		};

		/**
		 * Schedules to rotate grabbed items clockwise.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method rotateClockwise
		 */
		self.rotateClockwise = function () {
			scheduleInput(doRotateClockwise);
		};

		/**
		 * Schedules to rotate grabbed items counter-clockwise.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method rotateCounterClockwise
		 */
		self.rotateCounterClockwise = function () {
			scheduleInput(doRotateCounterClockwise);
		};

		/**
		 * Schedules to frees grabbed items.
		 *
		 * This method will be invoked from `GamePad`.
		 *
		 * @method releaseControl
		 */
		self.releaseControl = function () {
			scheduleInput(doReleaseControl);  // align=false
		};

		// receives directions from `canvas`
		canvas.addDirectionListener(self);

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
			var newX0, newY0, newX1, newY1;
			// rotates only grabbedItems[1]
			newX0 = grabbedItems[0].x;
			newY0 = grabbedItems[0].y;
			switch(newRotation) {
			case 0:
				// 1
				// 0
				newX1 = newX0;
				newY1 = newY0 - mikanBox.cellSize;
				break;
			case 1:
				// 0 1
				newX1 = newX0 + mikanBox.cellSize;
				newY1 = newY0;
				break;
			case 2:
				// 0
				// 1
				newX1 = newX0;
				newY1 = newY0 + mikanBox.cellSize;
				break;
			case 3:
				// 1 0
				newX1 = newX0 - mikanBox.cellSize;
				newY1 = newY0;
				break;
			default:
				console.error('invalid rotation: ' + newRotation);
			}
			// adjusts the location so that
			// items are in the box and do not collide with other items
			var left    = mikanBox.columnAt(Math.min(newX0, newX1));
			var right   = mikanBox.columnAt(Math.max(newX0, newX1));
			var bottomY = Math.max(newY0, newY1) + mikanBox.cellSize - 1;
			var row     = mikanBox.rowAt(bottomY);
			if (newRotation == 2) {
				if (row < 0) {
					var dY = mikanBox.height - bottomY;
					newY0 += dY;
					newY1 += dY;
					row = 0;
				} else if (mikanBox.itemIn(left, row)) {
					var dY = mikanBox.topYOf(row) - bottomY;
					newY0 += dY;
					newY1 += dY;
					++row;
				}
			} else {
				if (left < 0 || mikanBox.itemIn(left, row)) {
					newX0 += mikanBox.cellSize;
					newX1 += mikanBox.cellSize;
					++left;
					++right;
				}
				if (right >= mikanBox.columnCount
					|| mikanBox.itemIn(right, row))
				{
					newX0 -= mikanBox.cellSize;
					newX1 -= mikanBox.cellSize;
					--left;
					--right;
				}
			}
			// makes sure that the new location
			// is in the mikan box and do not collide with other items
			if (row >= 0
				&& row < mikanBox.rowCount
				&& left >= 0
				&& right < mikanBox.columnCount
				&& !mikanBox.itemIn(left, row)
				&& !mikanBox.itemIn(right, row))
			{
				// makes sure that no item is placed at the new location
				grabbedItems[0].x = newX0;
				grabbedItems[0].y = newY0;
				grabbedItems[1].x = newX1;
				grabbedItems[1].y = newY1;
				rotation = newRotation;
			}
		}

		/**
		 * Releases control of grabbed items.
		 *
		 * @method doReleaseControl
		 * @private
		 * @param align {boolean}
		 *     Whether items are aligned to cells.
		 */
		function doReleaseControl(align) {
			if (grabbedItems) {
				// places the items
				grabbedItems.forEach(function (item) {
					var column = mikanBox.columnAt(item.x);
					var row    = mikanBox.rowAt(item.y);
					try {
						mikanBox.place(item, column, row, align);
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
	ActorScheduler.augment(MainScene.prototype);
	Observable.augment(MainScene.prototype);

	/**
	 * The number of columns in a mikan box.
	 *
	 *     MainScene.COLUMN_COUNT = 8
	 *
	 * @property COLUMN_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'COLUMN_COUNT', { value: 8 });

	/**
	 * The number of rows in a mikan box.
	 *
	 *     MainScene.ROW_COUNT = 12
	 *
	 * @property ROW_COUNT
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'ROW_COUNT', { value: 12 });

	/**
	 * The number of extra rows.
	 *
	 *     MainScene.ROW_MARGIN = 8
	 *
	 * @property ROW_MARGIN
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'ROW_MARGIN', { value: 8 });

	/**
	 * The size of each cell in a mikan box.
	 *
	 *     MainScene.CELL_SIZE = 32
	 *
	 * @property CELL_SIZE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(MainScene, 'CELL_SIZE', { value: 32 });

	return MainScene;
})();
