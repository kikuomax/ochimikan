/**
 * Defines priorities of actors.
 *
 * `SPRAY` < `SPOIL` < `MOVE` < `CONTROL` < `SPAWN`
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
     * A priority of actors which spoil mikans.
     *
     * @property SPOIL
     * @type number
     * @final
     */
    SPOIL: 1,
    /**
     * A priority of actors which drop mikans.
     *
     * @property MOVE
     * @type number
     * @final
     */
    MOVE: 2,
    /**
     * A priority of an actor which controls mikans.
     *
     * @property CONTROL
     * @type number
     * @final
     */
    CONTROL: 3,
    /**
     * A priority of an actor which spawns mikans.
     *
     * @property SPAWN
     * @type number
     * @final
     */
    SPAWN: 4
};
