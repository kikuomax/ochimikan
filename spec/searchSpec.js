describe('Search', function() {
    it('lowerBound can locate a lower bound of 0 in [0, 1, 2]', function() {
	expect(Search.lowerBound([0, 1, 2], 0, cmp)).toBe(0);
    });

    it('lowerBound can locate a lower bound of 1 in [0, 1, 2]', function() {
	expect(Search.lowerBound([0, 1, 2], 1, cmp)).toBe(1);
    });

    it('lowerBound can locate a lower bound of 2 in [0, 1, 2]', function() {
	expect(Search.lowerBound([0, 1, 2], 2, cmp)).toBe(2);
    });

    it('lowerBound can locate a lower bound of -1 in [0, 1, 2]', function() {
	expect(Search.lowerBound([0, 1, 2], -1, cmp)).toBe(0);
    });

    it('lowerBound can locate a lower bound of 3 in [0, 1, 2]', function() {
	expect(Search.lowerBound([0, 1, 2], 3, cmp)).toBe(3);
    });

    it('lowerBound can locate a lower bound of 2 in [0, 2, 2]', function() {
	expect(Search.lowerBound([0, 2, 2], 2, cmp)).toBe(1);
    });

    it('lowerBound can locate a lower bound of 2 in [2, 2, 2]', function() {
	expect(Search.lowerBound([2, 2, 2], 2, cmp)).toBe(0);
    });

    it('lowerBound can locate a lower bound of 2 in []', function() {
	expect(Search.lowerBound([], 2, cmp)).toBe(0);
    });

    it('upperBound can locate an upper bound of 0 in [0, 1, 2]', function() {
	expect(Search.upperBound([0, 1, 2], 0, cmp)).toBe(1);
    });

    it('upperBound can locate an upper bound of 1 in [0, 1, 2]', function() {
	expect(Search.upperBound([0, 1, 2], 1, cmp)).toBe(2);
    });

    it('upperBound can locate an upper bound of 2 in [0, 1, 2]', function() {
	expect(Search.upperBound([0, 1, 2], 2, cmp)).toBe(3);
    });

    it('upperBound can locate an upper bound of -1 in [0, 1, 2]', function() {
	expect(Search.upperBound([0, 1, 2], -1, cmp)).toBe(0);
    });

    it('upperBound can locate an upper bound of 3 in [0, 1, 2]', function() {
	expect(Search.upperBound([0, 1, 2], 3, cmp)).toBe(3);
    });

    it('upperBound can locate an upper bound of 0 in [0, 0, 1]', function() {
	expect(Search.upperBound([0, 0, 1], 0, cmp)).toBe(2);
    });

    it('upperBound can locate an upper bound of 0 in [0, 0, 0]', function() {
	expect(Search.upperBound([0, 0, 0 ], 0, cmp)).toBe(3);
    });

    it('upperBound can locatel an upper bound of 0 in []', function() {
	expect(Search.upperBound([], 0, cmp)).toBe(0);
    });

    // compares two numbers for order
    function cmp(lhs, rhs) {
	var order;
	if (lhs < rhs) {
	    order = -1;
	} else if (lhs > rhs) {
	    order = 1;
	} else {
	    order = 0;
	}
	return order;
    }
});
