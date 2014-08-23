describe('ResourceManager', function () {
	var rmLike;

	beforeEach(function () {
		rmLike = {
			loadImage: function () {}
		};
	});

	it('Should be a ResourceManager', function () {
		var rm = new ResourceManager();
		expect(ResourceManager.isClassOf(rm)).toBe(true);
	});

	defineIsClassOfSpec(ResourceManager, function () {
		return rmLike;
	});

	it(':isClassOf should be false for an object whose loadImage is not a function', function () {
		delete rmLike.loadImage;
		expect(ResourceManager.isClassOf(rmLike)).toBe(false);
		rmLike.loadImage = 'loadImage';
		expect(ResourceManager.isClassOf(rmLike)).toBe(false);
	});

	defineCanAugmentSpec(ResourceManager, function () {
		return {};
	});

	defineAugmentSpec(ResourceManager, function () {
		return {};
	});

	it(':loadImage should return an Image associated with a specified URL', function () {
		var rm = new ResourceManager();
		var image = rm.loadImage('./imgs/sprite.png');
		expect(image.src).toMatch('.*/imgs/sprite\.png');
		image = rm.loadImage('gazo/supuraito.jpg');
		expect(image.src).toMatch('.*gazo/supuraito\.jpg');
	});

	it(':loadImage should return the same instance for the same URL', function () {
		var rm = new ResourceManager();
		var image = rm.loadImage('./imgs/sprite.png');
		expect(rm.loadImage('./imgs/sprite.png')).toBe(image);
	});

	it(':loadImage should throw an exception if no URL is specified', function () {
		var rm = new ResourceManager();
		expect(function () { rm.loadImage(null) }).toThrow();
		expect(function () { rm.loadImage() }).toThrow();
	});
});
