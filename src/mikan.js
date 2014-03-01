/** The priority of actors. */
const ACTOR_PRIORITIES = {
    'MOVE':    0,  // moving mikans
    'SPRAY':   1,  // moving sprays
    'COMBO':   2,  // combo chaining
    'CONTROL': 3   // controls mikan
}

/** The time to live of a spray. */
const SPRAY_TTL = 15;

/** The pattern of spreading sprays. */
const SPRAY_SPREADING_PATTERN = [
    [-1.4, -1.4], [0.0, -2.0], [1.4, -1.4],
    [-2.0,  0.0],              [2.0,  0.0],
    [-1.4,  1.4], [0.0,  2.0], [1.4,  1.4]
];

/** The constructor of a Spray. */
function Spray(x, y, dX, dY) {
    var self = this;
    self.state = Math.floor(Math.random() * 4);
    self.x = x;
    self.y = y;
    self.dX = dX;
    self.dY = dY;
    self.ttl = SPRAY_TTL;  // time to live

    /** Renders this spray. */
    rs.makeRenderable(self, function(context) {
	SPRITES.spray[self.state].render(context, self.x, self.y);
    });

    /** Moves this spray. */
    as.makeActor(self, ACTOR_PRIORITIES.SPRAY, function(scheduler) {
	// updates this spray if ttl is enough
	--self.ttl;
	if (self.ttl > 0) {
	    self.x += self.dX;
	    self.y += self.dY;
	    ++self.state;
	    if (self.state >= 4) {
		self.state = 0;
	    }
	    scheduler.schedule(self);
	}
    });
}

/** The constructor of a Grid. */
function Grid(column, row) {
    var self = this;
    self.column = column;
    self.row = row;
}

/** GridChain is an alias to Array. */
function GridChain() {}
GridChain.prototype = new Array();

/**
 * The constructor of a MikanBox.
 * @param columnCount  The number of horizontal grids.
 * @param rowCount     The number of vertical grids.
 * @param gridSize     The size of each grid.
 */
function MikanBox(columnCount, rowCount, gridSize) {
    var self = this;
    self.columnCount = columnCount;
    self.rowCount = rowCount;
    self.gridSize = gridSize;
    self.width = columnCount * gridSize;
    self.height = rowCount * gridSize;
    // initializes the grids
    self.grids = new Array(columnCount * rowCount);
    for (var i = 0; i < self.grids.length; ++i) {
	self.grids[i] = null;
    }
    // the pattern of spreading sprays
    self.spreadingPattern = [
	new Grid(-1, -1), new Grid(0, -1), new Grid(1, -1),
	new Grid(-1,  0),                  new Grid(1,  0),
	new Grid(-1,  1), new Grid(0,  1), new Grid(1,  1)
    ];

    /** Renders mikans in this mikan box. */
    rs.makeRenderable(self, function(context) {
	forEachMikan(function(m) {
	    m.render(context);
	});
    });

    /** Returns whehter a mikan can be placed in the specified grid. */
    self.canPlace = function(column, row) {
	var result = false;
	if (((column >= 0) && (column < self.columnCount))
	    && ((row >= 0) && (row < self.rowCount)))
	{
	    result = (self.grids[gridIndex(column, row)] === null);
	}
	return result;
    };

    /** Places the specified mikan in the specified grid. */
    self.place = function(mikan, column, row) {
	self.grids[gridIndex(column, row)] = mikan;
	mikan.x = column * self.gridSize;
	mikan.y = (self.rowCount - row - 1) * self.gridSize;
    };

    /** Returns the column at the specified location. */
    self.columnAt = function(x) {
	return Math.floor(x / self.gridSize);
    };

    /** Returns the row at the specified location. */
    self.rowAt = function(y) {
	return Math.floor((self.height - y) / self.gridSize);
    };

    /** Returns the grid `{ column, row }` of the specified location. */
    self.gridAt = function(x, y) {
	return new Grid(self.columnAt(x), self.rowAt(y));
    };

    /**
     * Chains dead mikans in this mikan box.
     * @return  An array of GridChains.
     */
    self.chainMikans = function() {
	var chains = [];
	var chainGrids = new Array(self.columnCount * self.rowCount);
	for (var r = 0; r < self.rowCount; ++r) {
	    for (var c = 0; c < self.columnCount; ++c) {
		// starts chaining from a dead mikan which isn't in any chain
		var gridIdx = gridIndex(c, r);
		if ((chainGrids[gridIdx] === undefined) &&
		    isDeadMikan(self.grids[gridIdx]))
		{
		    var chain = new GridChain();
		    chains.push(chain);
		    // propagates from the (c, r)
		    function propagate(dstC, dstR) {
			var gridIdx = gridIndex(dstC, dstR);
			if ((gridIdx >= 0) &&
			    (gridIdx < chainGrids.length) &&
			    (chainGrids[gridIdx] === undefined) &&
			    isDeadMikan(self.grids[gridIdx]))
			{
			    chain.push(new Grid(dstC, dstR));
			    chainGrids[gridIdx] = chain;
			    // propagates to surrounding mikans
			    propagate(dstC - 1, dstR);
			    propagate(dstC + 1, dstR);
			    propagate(dstC, dstR - 1);
			    propagate(dstC, dstR + 1);
			}
		    }
		    propagate(c, r);
		}
	    }
	}
	return chains;
    };

    /** Erases the mikans. */
    self.eraseMikans = function(scheduler) {
	// chains dead mikans
	var chains = self.chainMikans();
	// checks if there's any chain
	if (chains.length > 0) {
	    var damageGrids = new Array(self.columnCount * self.rowCount);
	    chains.forEach(function(chain) {
		if (chain.length >= 4) {
		    // marks mikans around dead mikans to be damaged
		    chain.forEach(function(grid) {
			self.spreadingPattern.forEach(function(delta) {
			    var gridIdx = gridIndex(grid.column + delta.column,
						    grid.row + delta.row);
			    if ((gridIdx >= 0) &&
				(gridIdx < damageGrids.length))
			    {
				damageGrids[gridIdx] = 1;
			    }
			});
			// smashes and erases the mikan
			var gridIdx = gridIndex(grid.column, grid.row);
			var mikan = self.grids[gridIdx];
			self.grids[gridIdx] = null;
			SPRAY_SPREADING_PATTERN.forEach(function(dXdY) {
			    scheduler.schedule(new Spray(mikan.x, mikan.y, dXdY[0], dXdY[1]));
			});
		    });
		}
	    });
	    // damages mikans
	    for (var i = 0; i < damageGrids.length; ++i) {
		if (damageGrids[i] !== undefined) {
		    var mikan = self.grids[i];
		    if (mikan !== null) {
			if (mikan.state < 3) {
			    ++mikan.state;
			}
		    }
		}
	    }
	    // drops mikans
	    var mayCombo = false;  // whether there may be combos
	    for (var c = 0; c < self.columnCount; ++c) {
		var dstRow = 0;
		for (var r = 0; r < self.rowCount; ++r) {
		    var gridIdx = gridIndex(c, r);
		    var mikan = self.grids[gridIdx];
		    if (mikan !== null) {
			if (dstRow < r) {
			    self.grids[gridIdx] = null;
			    makeFall(mikan, dstRow);
			    scheduler.schedule(mikan);
			    mayCombo = true;
			}
			++dstRow;
		    }
		}
	    }
	    // queues combo checker if it's necessary
	    if (mayCombo) {
		var comboChecker = as.makeActor({}, ACTOR_PRIORITIES.COMBO, function(scheduler) {
		    self.eraseMikans(scheduler);
		});
		scheduler.schedule(comboChecker);
	    }
	}
    };

    // local functions

    /** Returns the index of the specified grid. */
    function gridIndex(column, row) {
	return row + (column * self.rowCount);
    }

    /** The constructor of a token. */
    function Token() {
	this.grids = [];
    }

    /**
     * Returns whether the specified mikan is dead.
     * @param mikan  The mikan to be tested. May be `null`.
     */
    function isDeadMikan(mikan) {
	return (mikan !== null) && (mikan.state == 3);
    }

    /** Makes the specified mikan fall. */
    function makeFall(mikan, dstRow) {
	var column = self.columnAt(mikan.x);
	var dY = 6;
	as.makeActor(mikan, ACTOR_PRIORITIES.MOVE, function(scheduler) {
	    var row = self.rowAt(mikan.y + dY + self.gridSize);
	    if (row >= dstRow) {
		// continues to move this mikan
		mikan.y += dY;
		scheduler.schedule(this);
	    } else {
		// places this mikan
		mikan.act = function () { };
		self.place(mikan, column, dstRow);
	    }
	});
    }

    /**
     * Applies the specified function for each mikan in this mikan box.
     * NOTE: `null` mikans are skipped.
     */
    function forEachMikan(f) {
	self.grids.forEach(function(mikan) {
	    mikan ? f(mikan) : 0;
	});
    }
}

/** The constructor of a scene. */
function Scene() {
    var self = this;
    self.mikanBox = new MikanBox(8, 12, 32);
    as.makeActorScheduler(self);

    // the mikan controller
    self.controlledMikan = null;
    var mikanController = as.makeActor({}, ACTOR_PRIORITIES.CONTROL, function(scheduler) {
	if (self.controlledMikan === null) {
	    self.controlledMikan = new Mikan();
	}
	var newY = self.controlledMikan.y + 6;
	var bottom = newY + self.mikanBox.gridSize;
	var centerX = self.controlledMikan.x + (self.mikanBox.gridSize / 2);
	var grid = self.mikanBox.gridAt(centerX, bottom);
	if (self.mikanBox.canPlace(grid.column, grid.row)) {
	    // continues to move the mikan
	    self.controlledMikan.y = newY;
	} else {
	    // places the mikan
	    var mikan = self.controlledMikan;
	    self.controlledMikan = null;
	    var centerY = mikan.y + (self.mikanBox.gridSize / 2);
	    row = self.mikanBox.rowAt(centerY);
	    self.mikanBox.place(mikan, grid.column, row);
	    // erases chained mikans
	    self.mikanBox.eraseMikans(self);
	}
	// reschedules this actor
	scheduler.schedule(this);
    });
    rs.makeRenderable(mikanController, function(context) {
	if (self.controlledMikan !== null) {
	    self.controlledMikan.render(context);
	}
    });
    self.schedule(mikanController);

    /** Render this scene. */
    self.render = function(context) {
	context.clearRect(0, 0, self.mikanBox.width, self.mikanBox.height);
	self.mikanBox.render(context);
	// renders renderable actors
	self.actorQueue.forEach(function(a) {
	    if (a.render !== undefined) {
		a.render(context);
	    }
	});
    };
    
    /** Handles the specified mouse move event. */
    self.onMouseMove = function(event) {
	if (self.controlledMikan !== null) {
	    // moves the controlled mikan toward the mouse location
	    var centerX = self.controlledMikan.x + (self.mikanBox.gridSize / 2);
	    var column = self.mikanBox.columnAt(centerX);
	    var dstColumn = self.mikanBox.columnAt(event.layerX);
	    if (column != dstColumn) {
		var top = self.controlledMikan.y;
		var bottom = top + self.mikanBox.gridSize;
		var topRow = self.mikanBox.rowAt(top);
		var bottomRow = self.mikanBox.rowAt(bottom);
		var dColumn = (column < dstColumn) ? 1 : -1;
		while ((column != dstColumn) &&
		       self.mikanBox.canPlace(column + dColumn, topRow) &&
		       self.mikanBox.canPlace(column + dColumn, bottomRow))
		{
		    column += dColumn;
		}
		// moves the mikan to the new location
		self.controlledMikan.x = column * self.mikanBox.gridSize;
	    }
	}
    };
}

/** Starts the application. */
function start() {
    var scene = new Scene();
    var mikanBox = scene.mikanBox;
    var canvas = document.getElementById("canvas");
    canvas.width = mikanBox.width;
    canvas.height = mikanBox.height;
    var context = canvas.getContext("2d");
    // loads sprites
    for (prop in SPRITES) {
	SPRITES[prop].forEach(function(sprite) {
	    sprite.load();
	});
    }
    canvas.addEventListener("mousemove", scene.onMouseMove, false);
    // starts the game
    window.setInterval(function() {
	scene.run();
	scene.render(context);
    }, 50);
}
