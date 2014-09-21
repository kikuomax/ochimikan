describe('ActorPriorities', function () {
	it('SPRAY < ABSORB < SPOIL < DROP < FALL < ERASE < CONTROL < SPAWN', function () {
		expect(ActorPriorities.SPRAY).toBeLessThan(ActorPriorities.ABSORB);
		expect(ActorPriorities.ABSORB).toBeLessThan(ActorPriorities.SPOIL);
		expect(ActorPriorities.SPOIL).toBeLessThan(ActorPriorities.DROP);
		expect(ActorPriorities.DROP).toBeLessThan(ActorPriorities.FALL);
		expect(ActorPriorities.FALL).toBeLessThan(ActorPriorities.ERASE);
		expect(ActorPriorities.ERASE).toBeLessThan(ActorPriorities.CONTROL);
		expect(ActorPriorities.CONTROL).toBeLessThan(ActorPriorities.SPAWN);
	});
});
