/**
 * A mikan.
 *
 * The initial location of the mikan is (0, 0).
 *
 * `typeId` is `Item.TYPE_MIKAN`.
 *
 * Throws an exception if `damage` is not a number.
 *
 * @class Mikan
 * @constructor
 * @extends Item
 * @uses Renderable
 * @param damage {number}
 *     The degree of damage to set.
 */
Mikan = (function () {
	function Mikan(damage) {
		var self = this;

		Item.call(self, Item.TYPE_MIKAN, 0, 0, damage);

		/**
		 * Renders this mikan.
		 *
		 * Renders a mikan sprite corresponding to the degree of damage.
		 *
		 * @method render
		 * @param context {canvas context}
		 *     The context in which this mikan is rendered.
		 */
		Renderable.call(self, function (context) {
			Resources.SPRITES['mikan'][self.damage].render(context,
														   self.x, self.y);
		});
	}
	Item.augment(Mikan.prototype);
	Renderable.augment(Mikan.prototype);

	/**
	 * The maximum damage of a mikan.
	 *
	 *     Mikan.MAX_DAMAGE = 3
	 *
	 * @property MAX_DAMAGE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Mikan, 'MAX_DAMAGE', { value: 3 });

	/**
	 * Returns the maximum damage of `Mikan`.
	 *
	 *     Mikan.prototype.maxDamage = Mikan.MAX_DAMAGE
	 *
	 * @property maxDamage
	 * @type {number}
	 * @static
	 */
	Mikan.prototype.maxDamage = Mikan.MAX_DAMAGE;

	return Mikan;
})();
