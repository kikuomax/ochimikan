describe('Item', function () {
	var itemLike;
	var augmentable;

	beforeEach(function () {
		itemLike = {
			typeId:       0,
			x:            0,
			y:            0,
			locate:       function () {},
			translate:    function () {},
			damage:       0,
			maxDamage:    0,
			spoil:        function () {}
		};
		augmentable = {
			typeId:    0,
			x:         0,
			y:         0,
			damage:    0,
			maxDamage: 0
		};
	});

	it('Should be an Item', function () {
		var item = new Item(Item.TYPE_MIKAN, 0, 0, 0);
		expect(Item.isClassOf(item)).toBe(true);
	});

	it('Should be Located', function () {
		var item = new Item(Item.TYPE_MIKAN, 0, 0, 0);
		expect(Located.isClassOf(item)).toBe(true);
	});

	it('Should have typeId', function () {
		var item = new Item(Item.TYPE_MIKAN, 0, 0, 0);
		expect(item.typeId).toBe(Item.TYPE_MIKAN);
		item = new Item(Item.TYPE_PRESERVATIVE, 0, 0, 0);
		expect(item.typeId).toBe(Item.TYPE_PRESERVATIVE);
	});

	defineItemConstructorDamageExpectations(function (damage) {
		return new Item(Item.TYPE_MIKAN, 0, 0, damage);
	}, 3);

	it('Should not have typeId unspecified', function () {
		expect(function () { new Item(null, 0, 0, 0) }).toThrow();
		expect(function () { new Item(undefined, 0, 0, 0) }).toThrow();
	});

	it('Should not have a non-number typeId', function () {
		expect(function () { new Item('0', 0, 0, 0) }).toThrow();
		expect(function () { new Item(true, 0, 0, 0) }).toThrow();
	});

	defineLocatedConstructorExpectations(function (x, y) {
		return new Item(Item.TYPE_MIKAN, x, y, 0);
	});

	defineIsClassOfSpec(Item, function () {
		return itemLike;
	});

	defineLocatedIsClassOfExpectations(Item, function () {
		return itemLike;
	});

	it(':isClassOf should be false if typeId is not a number', function () {
		delete itemLike.typeId;
		expect(Item.isClassOf(itemLike)).toBe(false);
		itemLike.typeId = '0';
		expect(Item.isClassOf(itemLike)).toBe(false);
	});

	it(':isClassOf should be false if damage is not a number', function () {
		delete itemLike.damage;
		expect(Item.isClassOf(itemLike)).toBe(false);
		itemLike.damage = '0';
		expect(Item.isClassOf(itemLike)).toBe(false);
	});

	it(':isClassOf should be false if maxDamage is not a number', function () {
		delete itemLike.maxDamage;
		expect(Item.isClassOf(itemLike)).toBe(false);
		itemLike.maxDamage = '0';
		expect(Item.isClassOf(itemLike)).toBe(false);
	});

	it(':isClassOf should be false if spoil is not a function', function () {
		delete itemLike.spoil;
		expect(Item.isClassOf(itemLike)).toBe(false);
		itemLike.spoil = 'spoil';
		expect(Item.isClassOf(itemLike)).toBe(false);
	});

	defineCanAugmentSpec(Item, function () {
		return augmentable;
	});

	defineLocatedCanAugmentExpectations(Item, function () {
		return augmentable;
	});

	it(':canAugment should be false if typeId is not a number', function () {
		delete augmentable.typeId;
		expect(Item.canAugment(augmentable)).toBe(false);
		augmentable.typeId = '0';
		expect(Item.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false if damage is not a number', function () {
		delete augmentable.damage;
		expect(Item.canAugment(augmentable)).toBe(false);
		augmentable.damage = '0';
		expect(Item.canAugment(augmentable)).toBe(false);
	});

	it(':canAugment should be false if maxDamage is not a number', function () {
		delete augmentable.maxDamage;
		expect(Item.canAugment(augmentable)).toBe(false);
		augmentable.maxDamage = '0';
		expect(Item.canAugment(augmentable)).toBe(false);
	});

	defineAugmentSpec(Item, function () {
		return augmentable;
	});

	defineLocatedLocationExpectations(function () {
		return new Item(Item.TYPE_MIKAN, 0, 0, 0);
	});

	defineItemDamageExpectations(function () {
		return new Item(Item.TYPE_MIKAN, 0, 0, 0);
	});

	it(':isMaxDamaged should be true if an item is maximally damaged', function () {
		var item = new Item(Item.TYPE_MIKAN, 0, 0, 3);
		expect(Item.isMaxDamaged(item)).toBe(true);
	});

	it(':isMaxDamaged should be false if an item is not maximally damaged', function () {
		var item = new Item(Item.TYPE_MIKAN, 0, 0, 0);
		expect(Item.isMaxDamaged(item)).toBe(false);
		item = new Item(Item.TYPE_MIKAN, 0, 0, 2);
		expect(Item.isMaxDamaged(item)).toBe(false);
	});
});

describe('Augmented Item', function () {
	var item1, item2;

	beforeEach(function () {
		item1 = Item.augment({
			typeId:    Item.TYPE_MIKAN,
			x:         0,
			y:         0,
			damage:    0,
			maxDamage: 3
		});
		item2 = Item.augment({
			typeId:    Item.TYPE_PRESERVATIVE,
			x:         2,
			y:         -1,
			damage:    5,
			maxDamage: 5
		});
	});

	it('Should retain typeId', function () {
		expect(item1.typeId).toBe(Item.TYPE_MIKAN);
		expect(item2.typeId).toBe(Item.TYPE_PRESERVATIVE);
	});

	it('Should retain x', function () {
		expect(item1.x).toBe(0);
		expect(item2.x).toBe(2);
	});

	it('Should retain y', function () {
		expect(item1.y).toBe(0);
		expect(item2.y).toBe(-1);
	});

	it('Should retain damage', function () {
		expect(item1.damage).toBe(0);
		expect(item2.damage).toBe(5);
	});

	it('Should retain maxDamage', function () {
		expect(item1.maxDamage).toBe(3);
		expect(item2.maxDamage).toBe(5);
	});

	defineLocatedLocationExpectations(function () {
		return item1;
	});

	it('Can be spoiled', function () {
		item1.spoil();
		expect(item1.damage).toBe(1);
	});

	// other damage related expectations are not defined
	// because there is no use case of augmenting an arbitrary object

	it(':isMaxDamage should be true if an item is maximally damaged', function () {
		expect(Item.isMaxDamaged(item2)).toBe(true);
	});
});
