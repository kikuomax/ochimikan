describe('Sprite', function() {
    it('Should have a URL of its image', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	expect(sprite.url).toBe('./imgs/sprite.png');
    });

    it('Should have a part of its image to be rendered', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 10, 32, 48);
	expect(sprite.x).toBe(0);
	expect(sprite.y).toBe(10);
	expect(sprite.width).toBe(32);
	expect(sprite.height).toBe(48);
    });

    it('Should initially not load the image', function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	expect(sprite.image).not.toBeDefined();
    });

    it("Should not render image if it's not loaded", function() {
	var sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	// mocks out Context
	var context = {
	    drawImage: jasmine.createSpy('drawImage')
	};
	sprite.render(context);
	expect(context.drawImage).not.toHaveBeenCalled();
    });
});

describe('load and render Sprite', function() {
    var sprite;

    beforeEach(function() {
	sprite = new Sprite('./imgs/sprite.png', 0, 0, 32, 32);
	sprite.load();
    });

    it('Sprite should create Image associated with the specified URL', function() {
	expect(sprite.image).toBeDefined();
	var src = sprite.image.src;
	expect(src.slice(src.length - 15)).toBe('imgs/sprite.png');
    });

    it('Sprite should render loaded Image in Context', function() {
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
