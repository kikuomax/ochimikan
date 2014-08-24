/**
 * Defines priorities of actors.
 *
 * `SPRAY` < `SPOIL` < `DROP` < `FALL` < `ERASE` < `CONTROL` < `SPAWN`
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
	 * @property DROP
	 * @type number
	 * @final
	 */
	DROP: 2,
    /**
     * A priority of falling mikans.
     *
     * @property FALL
     * @type number
     * @final
     */
    FALL: 3,
	/**
	 * A priority of actors which erase mikans.
	 *
	 * @property ERASE
	 * @type number
	 * @final
	 */
	ERASE: 4,
    /**
     * A priority of an actor which controls mikans.
     *
     * @property CONTROL
     * @type number
     * @final
     */
    CONTROL: 5,
    /**
     * A priority of an actor which spawns mikans.
     *
     * @property SPAWN
     * @type number
     * @final
     */
    SPAWN: 6
};
