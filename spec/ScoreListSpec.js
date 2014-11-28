describe('ScoreList', function () {
	var scoreListLike;
	var augmentable;

	beforeEach(function () {
		scoreListLike = {
			scoreCount: function () {},
			scoreAt:    function () {}
		};
		augmentable = {
			scores: [
				{
					value:  10000,
					level:  5,
					player: 'Player',
					date:   1416794464
				},
				{
					value:  215000,
					level:  23,
					player: 'プレイヤー',
					date:   1416799890
				},
				{
					value:  100,
					level:  0,
					player: 'Beginner',
					date:   1417122189
				}
			]
		};
	});

	it('Should be a ScoreList', function () {
		var scores = new ScoreList();
		expect(ScoreList.isClassOf(scores)).toBe(true);
	});

	defineIsClassOfSpec(ScoreList, function () {
		return scoreListLike;
	});

	it(':isClassOf should be false for an object whose scoreCount is not a function', function () {
		scoreListLike.scoreCount = 'scoreCount';
		expect(ScoreList.isClassOf(scoreListLike)).toBe(false);
		delete scoreListLike.scoreCount;
		expect(ScoreList.isClassOf(scoreListLike)).toBe(false);
	});

	it(':isClassOf should be false for an object whose scoreAt is not a function', function () {
		scoreListLike.scoreAt = 'scoreAt';
		expect(ScoreList.isClassOf(scoreListLike)).toBe(false);
		delete scoreListLike.scoreAt;
		expect(ScoreList.isClassOf(scoreListLike)).toBe(false);
	});

	defineCanAugmentSpec(ScoreList, function () {
		return augmentable;
	});

	it(':canAugment should be false for an object whose scores is not an array', function () {
		augmentable.scores = {};
		expect(ScoreList.canAugment(augmentable)).toBe(false);
		delete augmentable.scores;
		expect(ScoreList.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be true for an object whose scores is empty', function () {
		var obj = { scores: [] };
		expect(ScoreList.canAugment(augmentable)).toBe(true);
	});

	it(':canAugment should be false for an object whose scores contains a non-Score object', function () {
		var obj = {
			scores: [
				new Score(10000, 5, 'Player'),
				{},
				new Score(215000, 23, 'プレイヤー')
			]
		};
		expect(ScoreList.canAugment(obj)).toBe(false);
	});

	defineAugmentSpec(ScoreList, function () {
		return augmentable;
	});

	it(':augment should augment elements in scores', function () {
		var scores = ScoreList.augment(augmentable);
		for (var i = 0; i < scores.scores.length; ++i) {
			expect(Score.isClassOf(scores.scores[i])).toBe(true);
		}
	});

	it(':augment should throw an exception if scores contains null', function () {
		augmentable.scores[1] = null;
		expect(function () { ScoreList.augment(augmentable) }).toThrow();
	});

	it(':augment should be safe for an empty object', function () {
		expect(function () { ScoreList.augment({}) }).not.toThrow();
	});

	it(':augment should be safe for an object whose scores is not an array', function () {
		expect(function () {
			ScoreList.augment({ scores: 'scores' });
		}).not.toThrow();
	});

	it(':scoreCount shouold initially be 0', function () {
		var scores = new ScoreList();
		expect(scores.scoreCount()).toBe(0);
	});

	it(':scoreAt should initially return undefined', function () {
		var scores = new ScoreList();
		expect(scores.scoreAt(0)).toBeUndefined();
	});
});

describe('Augmented ScoreList', function () {
	var scores1, scores2;
	var contents;

	beforeEach(function () {
		scores1 = ScoreList.augment({
			scores: []
		});
		contents = [
			{
				value:  10000,
				level:  5,
				player: 'Player',
				date:   1416794464
			},
			{
				value:  215000,
				level:  23,
				player: 'プレイヤー',
				date:   1416799890
			},
			{
				value:  100,
				level:  0,
				player: 'Beginner',
				date:   1417122189
			}
		]
		scores2 = ScoreList.augment({
			scores: contents
		});
	});

	it(':scoreCount should return the number of scores', function () {
		expect(scores1.scoreCount()).toBe(0);
		expect(scores2.scoreCount()).toBe(3);
	});

	it(':scoreAt should return a score at a specified index', function () {
		expect(scores2.scoreAt(0)).toBe(contents[0]);
		expect(scores2.scoreAt(1)).toBe(contents[1]);
		expect(scores2.scoreAt(2)).toBe(contents[2]);
	});

	it(':scoreAt should return undefined for an invalid index', function () {
		expect(scores1.scoreAt(0)).toBeUndefined();
		expect(scores1.scoreAt(-1)).toBeUndefined();
		expect(scores2.scoreAt(3)).toBeUndefined();
		expect(scores2.scoreAt(-1)).toBeUndefined();
	});
});
