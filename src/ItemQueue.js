/**
 * A canvas which renders queued items.
 *
 * `canvas` will be resized so that it fits the `ItemQueue`.
 *
 * `difficulty.nextItem` will be overridden so that `ItemQueue` can look ahead
 * items.
 *
 * Throws an exception
 *  - if `canvas` is not an `Element`,
 *  - or if `rowCount` is not a number,
 *  - or if `difficulty` is not a `Difficulty`
 *
 * @class ItemQueue
 * @constructor
 * @extends ActorScheduler
 * @param canvas {Element}
 *     The canvas to be associated with the `ItemQueue`.
 * @param rowCount {number}
 *     The number of visible items.
 * @param difficulty {Difficulty}
 *     The `Difficulty` which determines items to fall.
 */
ItemQueue = (function () {
	// the falling speed of mikans
	var FALLING_SPEED = 15;

	function ItemQueue(canvas, rowCount, difficulty) {
		var self = this;

		ActorScheduler.call(self);

		if (!(canvas instanceof Element)) {
			throw 'canvas must be an Element';
		}
		if (typeof rowCount !== 'number') {
			throw 'rowCount must be a number';
		}
		if (!Difficulty.isClassOf(difficulty)) {
			throw 'difficulty must be a Difficulty';
		}

		// resizes `canvas`
		canvas.width  = ItemQueue.CELL_SIZE;
		canvas.height = rowCount * ItemQueue.CELL_SIZE;

		// looks ahead items
		var queue = [];
		for (var i = 0; i < rowCount; ++i) {
			pushItem(difficulty.nextItem());
		}

		// overrides `difficulty.nextItem` so that it returns the first item in
		// `queue`
		Properties.override(difficulty, 'nextItem', function () {
			var item = popItem();
			pushItem(this.nextItem._super());
			return item;
		});

		/**
		 * Pushes a specified item into `queue`.
		 *
		 * `item` will be placed above the last item in `queue` unless `queue`
		 * is empty. Otherwise `item` will be placed just above this
		 * `ItemQueue`.
		 *
		 * `item` will become an actor which falls toward the ground and
		 * be scheduled in this `ActorScheduler`.
		 *
		 * @method pushItem
		 * @private
		 * @param item {Item}
		 *     The item to be pushed into `queue`.
		 */
		function pushItem(item) {
			if (queue.length > 0) {
				var lastItem = queue[queue.length - 1];
				item.x = 0;
				item.y = lastItem.y - ItemQueue.CELL_SIZE;
				item.dstY = lastItem.dstY - ItemQueue.CELL_SIZE;
			} else {
				item.x = 0;
				item.y = -ItemQueue.CELL_SIZE;
				item.dstY = (rowCount - 1) * ItemQueue.CELL_SIZE;
			}
			queue.push(item);
			Actor.call(item, 0, function (scheduler) {
				var newY = this.y + FALLING_SPEED;
				if (newY > this.dstY) {
					newY = this.dstY;
				}
				this.y = newY;
				scheduler.schedule(this);
			});
			self.schedule(item);
		}

		/**
		 * Pops the first item in `queue`.
		 *
		 * The popped item will also be removed from this `ActorScheduler`.
		 *
		 * @method popItem
		 * @private
		 * @return {Item}
		 *     The first item in `queue`.
		 */
		function popItem() {
			var item = queue.shift();
			queue.forEach(function (i) {
				i.dstY += ItemQueue.CELL_SIZE;
			});
			var idx = self.actorQueue.indexOf(item);
			self.actorQueue.splice(idx, 1);
			return item;
		}

		/**
		 * Renders this `ItemQueue`.
		 *
		 * Renders `Renderable` actors in this `ActorScheduler`.
		 *
		 * @method render
		 */
		self.render = function () {
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			self.actorQueue.forEach(function (actor) {
				if (Renderable.isClassOf(actor)) {
					actor.render(context);
				}
			});
		};
	}
	ActorScheduler.augment(ItemQueue.prototype);

	/**
	 * The size (in pixels) of each cell.
	 *
	 *     ItemQueue.CELL_SIZE = 32
	 *
	 * @property CELL_SIZE
	 * @type {number}
	 */
	ItemQueue.CELL_SIZE = 32;

	return ItemQueue;
})();
