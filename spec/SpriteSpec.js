describe('Sprite', function () {
	it('Should have a URL of its image', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		expect(sprite.url).toBe('./imgs/sprite.png');
		sprite = new Sprite('gazo/supuraito.jpg', 0, 0, 32, 32);
		expect(sprite.url).toBe('gazo/supuraito.jpg');
	});

	it('Should have a part of its image to be rendered', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		expect(sprite.x).toBe(0);
		expect(sprite.y).toBe(0);
		expect(sprite.width).toBe(32);
		expect(sprite.height).toBe(32);
		var sprite = new Sprite('./imgs/sprite.png', 10, 15, 48, 16);
		expect(sprite.x).toBe(10);
		expect(sprite.y).toBe(15);
		expect(sprite.width).toBe(48);
		expect(sprite.height).toBe(16);
		var sprite = new Sprite('./imags/sprite.png', -1, -1, 0, 0);
		expect(sprite.x).toBe(-1);
		expect(sprite.y).toBe(-1);
		expect(sprite.width).toBe(0);
		expect(sprite.height).toBe(0);
	});

	it('Should not have its URL unspecified', function () {
		expect(function () { new Sprite(null, 0, 0, 32, 32) }).toThrow();
		expect(function () { new Sprite(undefined, 0, 0, 32, 32) }).toThrow();
	});

	it('Should not have a non-string URL', function () {
		expect(function () { new Sprite(123, 0, 0, 32, 32) }).toThrow();
		expect(function () {
			new Sprite(function () { return './imgs/sprite.png' },
					   0, 0, 32, 32);
		}).toThrow();
	});

	it('Should not have its x unspecified', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', null, 0, 32, 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', undefined, 0, 32, 32);
		}).toThrow();
	});

	it('Should not have a non-number x', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', '0', 0, 32, 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', false, 0, 32, 32);
		}).toThrow();
	});

	it('Should not have its y unspecified', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, null, 32, 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, undefined, 32, 32);
		}).toThrow();
	});

	it('Should not have a non-number y', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, '0', 32, 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, false, 32, 32);
		}).toThrow();
	});

	it('Should not have its width unspecified', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, null, 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, undefined, 32);
		}).toThrow();
	});

	it('Should not have a non-number width', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, '32', 32);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, false, 32);
		}).toThrow();
	});

	it('Should not have its width < 0', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, -1, 32);
		}).toThrow();
	});

	it('Should not have its height unspecified', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, 32, null);
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, 32);
		}).toThrow();
	});

	it('Should not have a non-number height', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, 32, '32');
		}).toThrow();
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, 32, false);
		}).toThrow();
	});

	it('Should not have its height < 0', function () {
		expect(function () {
			new Sprite('./imgs/sprite.png', 0, 0, 32, -1);
		}).toThrow();
	});

	it('Should not initially load the image', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		expect(sprite.image).not.toBeDefined();
	});

	it('Should render nothing if it is not loaded', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		var context = { drawImage: jasmine.createSpy('drawImage') };
		sprite.render(context);
		expect(context.drawImage).not.toHaveBeenCalled();
	});

	it(':load should throw an exception if no ResourceManager is specified', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		expect(function () { sprite.load(null) }).toThrow();
		expect(function () { sprite.load() }).toThrow();
	});

	it(':load should throw an exception if a non-ResourceManager object is specified', function () {
		var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		expect(function () { sprite.load({}) }).toThrow();
		expect(function () { sprite.load('ResourceManager') }).toThrow();
	});
});

describe('Sprite working with its image', function () {
	var sprite;
	var image;
	var rm;

	beforeEach(function () {
		sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
		rm = new ResourceManager();
		image = new Image();
		spyOn(rm, 'loadImage').and.callFake(function () {
			return image;
		});
	});

	it(':load should resolve a specified URL by a specified ResourceManager', function () {
		sprite.load(rm);
		expect(rm.loadImage).toHaveBeenCalledWith('./imgs/sprite.png');
	});

	it(':load should not resolve a specified URL twice', function () {
		sprite.load(rm);
		rm.loadImage.calls.reset();
		sprite.load(rm);
		expect(rm.loadImage).not.toHaveBeenCalled();
	});

	it(':load should throw an exception if no ResourceManager is specified', function () {
		expect(function () { sprite.load(null) }).toThrow();
		expect(function () { sprite.load() }).toThrow();
	});

	it(':load should throw an exception if a non-ResourceManager object is specified', function () {
		expect(function () { sprite.load({}) }).toThrow();
		expect(function () { sprite.load('ResourceManager') }).toThrow();
	});

	it(':render should render a loaded image in a specified context', function () {
		sprite.load(rm);
		var context = { drawImage: jasmine.createSpy('drawImage') };
		sprite.render(context, 1, -5);
		expect(context.drawImage).toHaveBeenCalledWith(image,
													   0, 0, 32, 32,
													   1, -5, 32, 32);
	});
});
