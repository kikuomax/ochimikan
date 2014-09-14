describe('Resources', function () {
	var savedSPRITES;
	var sprite1, sprite2, sprite3, sprite4;
	var rm;

	beforeEach(function () {
		// replaces SPRITES with a dummy one
		savedSPRITES = Resources.SPRITES;
		sprite1 = { load: jasmine.createSpy('sprite1') };
		sprite2 = { load: jasmine.createSpy('sprite2') };
		sprite3 = { load: jasmine.createSpy('sprite3') };
		sprite4 = { load: jasmine.createSpy('sprite4') };
		Resources.SPRITES = {
			mikan:        [sprite1],
			spray:        [sprite2, sprite3],
			preservative: [sprite4]
		};
		rm = new ResourceManager();
	});

	// restores SPRITES
	afterEach(function () {
		Resources.SPRITES = savedSPRITES;
	});

	it(':loadSprites should load every sprite defined in Resources.SPRITES', function () {
		Resources.loadSprites(rm);
		expect(sprite1.load).toHaveBeenCalledWith(rm);
		expect(sprite2.load).toHaveBeenCalledWith(rm);
		expect(sprite3.load).toHaveBeenCalledWith(rm);
		expect(sprite4.load).toHaveBeenCalledWith(rm);
	});

	it(':loadSprites should throw an exception if no ResourceManager is specified', function () {
		expect(function () { Resources.loadSprites(null) }).toThrow();
		expect(function () { Resources.loadSprites() }).toThrow();
	});

	it(':loadSprites should throw an exception if a non-ResourceManager object is specified', function () {
		expect(function () { Resources.loadSprites({}) }).toThrow();
		expect(function () {
			Resources.loadSprites('ResourceManager');
		}).toThrow();
	});
});
