/**
 * Defines priorities of actors.
 *
 * `SPRAY` < `MOVE` < `CONTROL` < `SPAWN`
 *
 * @class ActorPriorities
 * @static
 */
const ActorPriorities = {
    /**
     * A priority of actors which spread sprays.
     *
     * @property SPRAY
     * @type number
     * @final
     */
    SPRAY: 0,
    /**
     * A priority of actors which drop mikans.
     *
     * @property MOVE
     * @type number
     * @final
     */
    MOVE: 1,
    /**
     * A priority of an actor which controls mikans.
     *
     * @property CONTROL
     * @type number
     * @final
     */
    CONTROL: 2,
    /**
     * A priority of an actor which spawns mikans.
     *
     * @property SPAWN
     * @type number
     * @final
     */
    SPAWN: 3
};
