describe('Search.compare', function () {
	it('Should return a negative number if lhs < rhs', function () {
		expect(Search.compare(0, 1)).toBeLessThan(0);
		expect(Search.compare(-1, 0)).toBeLessThan(0);
		expect(Search.compare('a', 'b')).toBeLessThan(0);
		expect(Search.compare('hanage', 'hige')).toBeLessThan(0);
	});

	it('Should return a positive number if lhs > rhs', function () {
		expect(Search.compare(1, 0)).toBeGreaterThan(0);
		expect(Search.compare(0, -1)).toBeGreaterThan(0);
		expect(Search.compare('b', 'a')).toBeGreaterThan(0);
		expect(Search.compare('hige', 'hanage')).toBeGreaterThan(0);
	});

	it('Should return 0 if lhs == rhs', function () {
		expect(Search.compare(0, 0)).toBe(0);
		expect(Search.compare(1, 1)).toBe(0);
		expect(Search.compare(-1, -1)).toBe(0);
		expect(Search.compare('a', 'a')).toBe(0);
		expect(Search.compare('b', 'b')).toBe(0);
		expect(Search.compare('hige', 'hige')).toBe(0);
	});
});

describe('Search.lowerBound', function () {
	it('Can locate a lower bound of 0 in [0, 1, 2]', function () {
		expect(Search.lowerBound([0, 1, 2], 0, Search.compare)).toBe(0);
	});

	it('Can locate a lower bound of 1 in [0, 1, 2]', function () {
		expect(Search.lowerBound([0, 1, 2], 1, Search.compare)).toBe(1);
	});

	it('Can locate a lower bound of 2 in [0, 1, 2]', function () {
		expect(Search.lowerBound([0, 1, 2], 2, Search.compare)).toBe(2);
	});

	it('Can locate a lower bound of -1 in [0, 1, 2]', function () {
		expect(Search.lowerBound([0, 1, 2], -1, Search.compare)).toBe(0);
	});

	it('Can locate a lower bound of 3 in [0, 1, 2]', function () {
		expect(Search.lowerBound([0, 1, 2], 3, Search.compare)).toBe(3);
	});

	it('Can locate a lower bound of 2 in [0, 2, 2]', function () {
		expect(Search.lowerBound([0, 2, 2], 2, Search.compare)).toBe(1);
	});

	it('Can locate a lower bound of 2 in [2, 2, 2]', function () {
		expect(Search.lowerBound([2, 2, 2], 2, Search.compare)).toBe(0);
	});

	it('Can locate a lower bound of 2 in []', function () {
		expect(Search.lowerBound([], 2, Search.compare)).toBe(0);
	});

	it('Should use a specified comparator for comparison', function () {
		expect(Search.lowerBound([2, 1, 0], 0, invCompare)).toBe(2);
		expect(Search.lowerBound([2, 1, 0], 1, invCompare)).toBe(1);
		expect(Search.lowerBound([2, 1, 0], 2, invCompare)).toBe(0);
		expect(Search.lowerBound([2, 1, 0], 3, invCompare)).toBe(0);
		expect(Search.lowerBound([2, 1, 0], -1, invCompare)).toBe(3);

		function invCompare(lhs, rhs) {
			return Search.compare(rhs, lhs);
		}
	});
});

describe('Search.upperBound', function () {
	it('Can locate an upper bound of 0 in [0, 1, 2]', function () {
		expect(Search.upperBound([0, 1, 2], 0, Search.compare)).toBe(1);
	});

	it('Can locate an upper bound of 1 in [0, 1, 2]', function () {
		expect(Search.upperBound([0, 1, 2], 1, Search.compare)).toBe(2);
	});

	it('Can locate an upper bound of 2 in [0, 1, 2]', function () {
		expect(Search.upperBound([0, 1, 2], 2, Search.compare)).toBe(3);
	});

	it('Can locate an upper bound of -1 in [0, 1, 2]', function () {
		expect(Search.upperBound([0, 1, 2], -1, Search.compare)).toBe(0);
	});

	it('Can locate an upper bound of 3 in [0, 1, 2]', function () {
		expect(Search.upperBound([0, 1, 2], 3, Search.compare)).toBe(3);
	});

	it('Can locate an upper bound of 0 in [0, 0, 1]', function () {
		expect(Search.upperBound([0, 0, 1], 0, Search.compare)).toBe(2);
	});

	it('Can locate an upper bound of 0 in [0, 0, 0]', function () {
		expect(Search.upperBound([0, 0, 0 ], 0, Search.compare)).toBe(3);
	});

	it('Can locatel an upper bound of 0 in []', function () {
		expect(Search.upperBound([], 0, Search.compare)).toBe(0);
	});

	it('Should use a specified comparator for comparison', function () {
		expect(Search.upperBound([2, 1, 0], 0, invCompare)).toBe(3);
		expect(Search.upperBound([2, 1, 0], 1, invCompare)).toBe(2);
		expect(Search.upperBound([2, 1, 0], 2, invCompare)).toBe(1);
		expect(Search.upperBound([2, 1, 0], 3, invCompare)).toBe(0);
		expect(Search.upperBound([2, 1, 0], -1, invCompare)).toBe(3);

		function invCompare(lhs, rhs) {
			return Search.compare(rhs, lhs);
		}
	});
});

