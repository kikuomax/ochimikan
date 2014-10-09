/**
 * The interface of an item placed in a `MikanBox`.
 *
 * `damage` will be truncated so that `0 <= damage <= this.maxDamage`.
 *
 * Throws an exception,
 *  - if `typeId` is not a number
 *  - or if `x` is not a number
 *  - or if `y` is not a number
 *  - or if `damage` is not a number
 *
 * @class Item
 * @constructor
 * @extends Located
 * @param typeId {number}
 *     The type ID to set.
 * @param x {number}
 *     The x-coordinate value of the location.
 * @param y {number}
 *     The y-coordinate value of the location.
 * @param damage {number}
 *     The damage to set.
 */
Item = (function () {
	function Item(typeId, x, y, damage) {
		var self = this;

		Located.call(self, x, y);

		if (typeof typeId !== 'number') {
			throw 'typeId must be a number';
		}
		damage = truncateDamage(damage);

		/**
		 * The type ID of this `Item`.
		 *
		 * @property typeId
		 * @type {number}
		 */
		Object.defineProperty(self, 'typeId', { value: typeId });

		/**
		 * The damage of this `Item`.
		 *
		 * To increment the damage, use `spoil`.
		 *
		 * `damage` will be truncated so that `0 <= damage <= this.maxDamage`.
		 *
		 * Throws an exception,
		 *  - if `damage` is to be set unspecified
		 *  - or if `damage` is to be set to a non-number
		 *
		 * @property damage
		 * @type {number}
		 */
		Object.defineProperty(self, 'damage', {
			get: function () { return damage },
			set: function (newDamage) { damage = truncateDamage(newDamage) }
		});

		/**
		 * Truncates a specified damage.
		 *
		 * Throws an exception
		 *  - if `damage` is not specified,
		 *  - or if `damage` is not a number
		 *
		 * @method truncateDamage
		 * @private
		 * @param damage {number}
		 *     The damage to be truncated.
		 * @return {number}
		 *     A truncated damage. `[0, self.maxDamage]`.
		 */
		function truncateDamage(damage) {
			if (typeof damage != 'number') {
				throw 'damage must be a number';
			}
			if (damage < 0) {
				damage = 0;
			} else if (damage > self.maxDamage) {
				damage = self.maxDamage;
			}
			return damage;
		}
	}
	Located.augment(Item.prototype);

	/**
	 * Returns whether a specified object is an `Item`.
	 *
	 * A `Item` must satisfy all of the following conditions,
	 *  - is a `Located`
	 *  - has the following property,
	 *     - typeId:    number
	 *     - damage:    number
	 *     - maxDamage: number
	 *     - spoil:     function
	 *
	 * @method isClassOf
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` is an `Item`. `false` if `obj` is not specified.
	 */
	Item.isClassOf = function (obj) {
		return Located.isClassOf(obj)
			&& typeof obj.typeId    === 'number'
			&& typeof obj.damage    === 'number'
			&& typeof obj.maxDamage === 'number'
			&& typeof obj.spoil     === 'function';
	};

	/**
	 * Returns a specified object can be an `Item`.
	 *
	 * An object which satisfies all of the following conditions can be
	 * an `Item`,
	 *  - can be a `Located`
	 *  - has the following properties,
	 *     - typeId:    number
	 *     - damage:    number
	 *     - maxDamage: number
	 *
	 * @method canAugment
	 * @static
	 * @param obj {object}
	 *     The object to be tested.
	 * @return {boolean}
	 *     Whether `obj` can be a `Item`. `false` if `obj` is not specified.
	 */
	Item.canAugment = function (obj) {
		return Located.canAugment(obj)
			&& typeof obj.typeId    === 'number'
			&& typeof obj.damage    === 'number'
			&& typeof obj.maxDamage === 'number';
	};

	/**
	 * Augments a specified object with the features of `Item`.
	 *
	 * All of the following properties of `obj` will be overwritten,
	 *  - properties overwritten by `Located.augment`
	 *  - isMaxDamaged
	 *  - spoil
	 *
	 * If `obj` has `maxDamage`, it will be retained. Otherwise the default
	 * value will be set.
	 *
	 * Never checks if `obj` can actually be a `Item`, because this method
	 * may be applied to incomplete instances; i.e., prototypes.
	 *
	 * Throws an exception if `obj` is not specified.
	 *
	 * @method augment
	 * @static
	 * @param obj {object}
	 *     The object to be augmented.
	 * @return {object}
	 *     `obj`.
	 */
	Item.augment = function (obj) {
		Located.augment(obj);
		for (var prop in Item.prototype) {
			obj[prop] = Item.prototype[prop];
		}
		obj['maxDamage'] = obj['maxDamage'] || Item.prototype.maxDamage;
		return obj;
	}

	/**
	 * The maximum damage of this `Item`.
	 *
	 * Default value is `3`.
	 *
	 * @property maxDamage
	 * @type number
	 */
	Object.defineProperty(Item.prototype, 'maxDamage', { value: 3 });

	/**
	 * Spoils this `Item`.
	 *
	 * Increments `this.damage` unless `this.damage >= this.maxDamaged`.
	 * Default implementation evaluates `++this.damage`.
	 *
	 * @method spoil
	 */
	Item.prototype.spoil = function () {
		++this.damage;
	};

	/**
	 * Returns whether a specified item is maximally damaged.
	 *
	 * Throws an exception if `item` is not specified.
	 *
	 * @method isMaxDamaged
	 * @static
	 * @param item {Item}
	 *     The item to be tested.
	 * @return {boolean}
	 *     Whether `item` is maximally damaged.
	 *     `false` if `item` does not have either of `damage` and `maxDamage`.
	 */
	Item.isMaxDamaged = function (item) {
		return item.damage == item.maxDamage;
	};

	/**
	 * The type ID for mikans.
	 *
	 * @property TYPE_MIKAN
	 * @type {number}
	 */
	Object.defineProperty(Item, 'TYPE_MIKAN', { value: 0 });

	/**
	 * The type ID for preservatives.
	 *
	 * @property TYPE_PRESERVATIVE
	 * @type {number}
	 */
	Object.defineProperty(Item, 'TYPE_PRESERVATIVE', { value: 1 });

	return Item;
})();
