describe('Sprite', function() {
    it('Should have a URL of its image', function() {
	var sprite = new Sprite("./imgs/sprite.png", 0, 0, 32, 32);
	expect(sprite.url).toBe("./imgs/sprite.png");
    });
});
