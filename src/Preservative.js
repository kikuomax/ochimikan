/**
 * The class of a preservative.
 *
 * Initially placed at (0, 0) and not damaged (= 0).
 *
 * `typeId` is `Placed.TYPE_PRESERVATIVE`.
 *
 * @class Preservative
 * @constructor
 * @extends Item
 * @uses Renderable
 */
Preservative = (function () {
	function Preservative() {
		var self = this;

		Item.call(self, Item.TYPE_PRESERVATIVE, 0, 0, 0);

		/**
		 * Renders this `Preservative`.
		 *
		 * Renders a preservative sprite at the location of this `Preservative`,
		 * which reflects the damage of it.
		 *
		 * @method render
		 * @param context {Canvas context}
		 *     The canvas context in which this `Preservative` is to be
		 *     rendered.
		 */
		Renderable.call(self, function (context) {
			var sprite = Resources.SPRITES['preservative'][self.damage];
			sprite.render(context, self.x, self.y);
		});
	}
	Item.augment(Preservative.prototype);
	Renderable.augment(Preservative.prototype);

	/**
	 * The maximum damage of a `Preservative`.
	 *
	 *     Preservative.MAX_DAMAGE = 4
	 *
	 * @property MAX_DAMAGE
	 * @type {number}
	 * @static
	 */
	Object.defineProperty(Preservative, 'MAX_DAMAGE', { value: 4 });

	/**
	 * The maximum damage of a `Preservative`.
	 *
	 *     Preservative.prototype.maxDamage = Preservative.MAX_DAMAGE
	 *
	 * @property maxDamage
	 * @type {number}
	 */
	Preservative.prototype.maxDamage = Preservative.MAX_DAMAGE;

	return Preservative;
})();
