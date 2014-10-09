/**
 * Provides utilities to manipulate properties.
 *
 * @class Properties
 * @static
 */
Properties = (function () {
	function Properties() {}

	/**
	 * Overrides a specified function of a specified object.
	 *
	 * The function specified by `name` of `obj` will be replaced with `impl`.
	 * You can still invoke the overridden function through `impl._super` like,
	 *
	 *     impl._super(arguments ...)
	 *     i.e.
	 *     obj[name]._super(arguments ...)
	 *
	 * NOTE: `_super` always invokes the overridden function in the context
	 *       of `obj`.
	 *
	 * Throws an exception
	 *  - if `obj` is not specified
	 *  - or if `name` is not specified
	 *  - or if `impl` is not a function
	 *  - or if the property of `obj` specified by `name` is not a function
	 * 
	 * @method override
	 * @param obj {object}
	 *     The object whose function is to be overridden.
	 * @param name {string}
	 *     The name of the function to be overridden.
	 * @param impl {function}
	 *     The new implementation of the function.
	 * @return {object}
	 *     `impl`.
	 */
	Properties.override = function (obj, name, impl) {
		if (name == null) {
			throw 'name must be specified';
		}
		if (typeof impl !== 'function') {
			throw 'impl must be a function';
		}
		if (typeof obj[name] !== 'function') {
			throw 'obj must have a function specified by ' + name;
		}
		var superFunction = obj[name];
		obj[name] = impl;
		impl._super = function () {
			return superFunction.apply(obj, arguments);
		};
		return impl;
	};

	return Properties;
})();
