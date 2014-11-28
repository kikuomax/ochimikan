describe('Score', function () {
	var scoreLike;
	var augmentable;

	beforeEach(function () {
		scoreLike = {
			value:      10000,
			level:      5,
			player:     'Player',
			date:       1416794464,
			dateObject: function () {}
		};
		augmentable = {
			value:  10000,
			level:  5,
			player: 'Player',
			date:   1416794464
		};
	});

	it('Should be a Score', function () {
		var score = new Score(10000, 5, 'Player');
		expect(Score.isClassOf(score)).toBe(true);
	});

	it('Should have a value', function () {
		var score = new Score(10000, 5, 'Player');
		expect(score.value).toBe(10000);
		score = new Score(0, 5, 'Player');
		expect(score.value).toBe(0);
	});

	it('Should have a level', function () {
		var score = new Score(10000, 5, 'Player');
		expect(score.level).toBe(5);
		score = new Score(10000, 0, 'Player');
		expect(score.level).toBe(0);
	});

	it('Should have a player', function () {
		var score = new Score(10000, 5, 'Player');
		expect(score.player).toBe('Player');
		score = new Score(10000, 5, 'プレイヤー');
		expect(score.player).toBe('プレイヤー');
	});

	defineIsClassOfSpec(Score, function () {
		return scoreLike;
	});

	it('Should not have a value unspecified', function () {
		expect(function () { new Score(null, 5, 'Player') }).toThrow();
		expect(function () { new Score(undefined, 5, 'Player') }).toThrow();
	});

	it('Should not have a non-number value', function () {
		expect(function () { new Score('10000', 5, 'Player') }).toThrow();
		expect(function () { new Score(true, 5, 'Player') }).toThrow();
	});

	it('Should not have a negative value', function () {
		expect(function () { new Score(-1, 5, 'Player') }).toThrow();
	});

	it('Should not have a level unspecified', function () {
		expect(function () { new Score(10000, null, 'Player') }).toThrow();
		expect(function () { new Score(10000, undefined, 'Player') }).toThrow();
	});

	it('Should not have a non-number level', function () {
		expect(function () { new Score(10000, '5', 'Player') }).toThrow();
		expect(function () { new Score(10000, true, 'Player') }).toThrow();
	});

	it('Should not have a negative level', function () {
		expect(function () { new Score(10000, -1, 'Player') }).toThrow();
	});

	it('Should not have a player unspecified', function () {
		expect(function () { new Score(10000, 5, null) }).toThrow();
		expect(function () { new Score(10000, 5) }).toThrow();
	});

	it('Should not have a non-string player', function () {
		expect(function () { new Score(10000, 5, 4649) }).toThrow();
		expect(function () { new Score(10000, 5, ['Player']) }).toThrow();
	});

	it(':isClassOf should be false for an object whose value is not a number', function () {
		scoreLike.value = '10000';
		expect(Score.isClassOf(scoreLike)).toBe(false);
		delete scoreLike.value;
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose level is not a number', function () {
		scoreLike.level = '5';
		expect(Score.isClassOf(scoreLike)).toBe(false);
		delete scoreLike.level;
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose player is not a string', function () {
		scoreLike.player = ['Player']
		expect(Score.isClassOf(scoreLike)).toBe(false);
		delete scoreLike.player;
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose date is not a number', function () {
		scoreLike.date = '1416794464';
		expect(Score.isClassOf(scoreLike)).toBe(false);
		delete scoreLike.date;
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose dateObject is not a function', function () {
		scoreLike.dateObject = new Date();
		expect(Score.isClassOf(scoreLike)).toBe(false);
		delete scoreLike.dateObject;
		expect(Score.isClassOf(scoreLike)).toBe(false);
	});

	defineCanAugmentSpec(Score, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose value is not a number', function () {
		augmentable.value = '10000';
		expect(Score.canAugment(augmentable)).toBe(false);
		delete augmentable.value;
		expect(Score.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose level is not a number', function () {
		augmentable.level = '5';
		expect(Score.canAugment(augmentable)).toBe(false);
		delete augmentable.level;
		expect(Score.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose player is not a string', function () {
		augmentable.player = function () { return 'Player' };
		expect(Score.canAugment(augmentable)).toBe(false);
		delete augmentable.player;
		expect(Score.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false for an object whose date is not a number', function () {
		augmentable.date = '1416794464';
		expect(Score.canAugment(augmentable)).toBe(false);
		delete augmentable.date;
		expect(Score.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Score, function () {
		return augmentable;
	});
});

describe('Augmented Score', function () {
	var score1, score2;

	beforeEach(function () {
		score1 = Score.augment({
			value:  10000,
			level:  5,
			player: 'Player',
			date:   1416794464
		});
		score2 = Score.augment({
			value:  215000,
			level:  23,
			player: 'プレイヤー',
			date:   1416799890
		});
	});

	it('Should retain the value', function () {
		expect(score1.value).toBe(10000);
		expect(score2.value).toBe(215000);
	});

	it('Should retain the level', function () {
		expect(score1.level).toBe(5);
		expect(score2.level).toBe(23);
	});

	it('Should retain the player', function () {
		expect(score1.player).toBe('Player');
		expect(score2.player).toBe('プレイヤー');
	});

	it('Should retain the date', function () {
		expect(score1.date).toBe(1416794464);
		expect(score2.date).toBe(1416799890);
	});

	it(':dateObject should return a Date equivalent to its date', function () {
		expect(score1.dateObject()).toEqual(new Date(1416794464000));
		expect(score2.dateObject()).toEqual(new Date(1416799890000));
	});
});
