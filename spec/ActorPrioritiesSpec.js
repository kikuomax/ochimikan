describe('ActorPriorities', function () {
	it('SPRAY < SPOIL < DROP < MOVE < ERASE < CONTROL < SPAWN', function () {
		expect(ActorPriorities.SPRAY).toBeLessThan(ActorPriorities.SPOIL);
		expect(ActorPriorities.SPOIL).toBeLessThan(ActorPriorities.DROP);
		expect(ActorPriorities.DROP).toBeLessThan(ActorPriorities.MOVE);
		expect(ActorPriorities.MOVE).toBeLessThan(ActorPriorities.ERASE);
		expect(ActorPriorities.ERASE).toBeLessThan(ActorPriorities.CONTROL);
		expect(ActorPriorities.CONTROL).toBeLessThan(ActorPriorities.SPAWN);
	});
});
