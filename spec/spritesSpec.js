describe('Sprite', function() {
    it('should have a URL of its image', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	expect(sprite.url).toBe('./imgs/sprite.png');
    });

    it('should have a part of its image to be rendered', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 10, 32, 48);
	expect(sprite.x).toBe(0);
	expect(sprite.y).toBe(10);
	expect(sprite.width).toBe(32);
	expect(sprite.height).toBe(48);
    });

    it('should initially not load the image', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	expect(sprite.image).not.toBeDefined();
    });

    it('should render nothing if it is not loaded', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	// mocks out Context
	var context = {
	    drawImage: jasmine.createSpy('drawImage')
	};
	sprite.render(context);
	expect(context.drawImage).not.toHaveBeenCalled();
    });
});

describe('loading and rendering Sprite:', function() {
    var sprite;

    beforeEach(function() {
	sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	sprite.load();
    });

    it('sprite should create an Image associated with the specified URL', function() {
	expect(sprite.image).toBeDefined();
	var src = sprite.image.src;
	expect(src.slice(src.length - 15)).toBe('imgs/sprite.png');
    });

    it('sprite should not create any Image again', function() {
	var image = sprite.image;
	sprite.load();
	expect(sprite.image).toBe(image);
    });

    it('sprite should render the loaded Image in a specified context', function() {
	// mocks out Context
	var context = {
	    drawImage: jasmine.createSpy('drawImage')
	};
	sprite.render(context, 1, -5);
	expect(context.drawImage).toHaveBeenCalledWith(sprite.image,
						       0, 0, 32, 32,
						       1, -5, 32, 32);
    });
});
