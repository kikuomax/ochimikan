describe('ActorPriorities', function() {
    it('SPRAY < SPOIL < MOVE < CONTROL < SPAWN', function() {
	expect(ActorPriorities.SPRAY).toBeLessThan(ActorPriorities.SPOIL);
	expect(ActorPriorities.SPOIL).toBeLessThan(ActorPriorities.MOVE);
	expect(ActorPriorities.MOVE).toBeLessThan(ActorPriorities.CONTROL);
	expect(ActorPriorities.CONTROL).toBeLessThan(ActorPriorities.SPAWN);
    });
});
