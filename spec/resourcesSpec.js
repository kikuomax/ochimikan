describe('loading sprites in Resources', function(){
    var savedSPRITES;
    var sprite1, sprite2, sprite3;

    // mocks out SPRITES
    beforeEach(function() {
	savedSPRITES = Resources.SPRITES;
	sprite1 = { load: jasmine.createSpy("sprite1") };
	sprite2 = { load: jasmine.createSpy("sprite2") };
	sprite3 = { load: jasmine.createSpy("sprite3") };
	Resources.SPRITES = {
	    set1: [sprite1],
	    set2: [sprite2, sprite3]
	};
    });

    // restores SPRITES
    afterEach(function() {
	Resources.SPRITES = savedSPRITES;
    });

    it('Should load every sprite defined in Resources.SPRITES', function() {
	Resources.loadSprites();
	expect(sprite1.load).toHaveBeenCalled();
	expect(sprite2.load).toHaveBeenCalled();
	expect(sprite3.load).toHaveBeenCalled();
    });
});
