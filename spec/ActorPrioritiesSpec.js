describe('ActorPriorities', function() {
    it('SPRAY < MOVE < CONTROL < SPAWN', function() {
	expect(ActorPriorities.SPRAY).toBeLessThan(ActorPriorities.MOVE);
	expect(ActorPriorities.MOVE).toBeLessThan(ActorPriorities.CONTROL);
	expect(ActorPriorities.CONTROL).toBeLessThan(ActorPriorities.SPAWN);
    });
});
