describe('percentage filter test', function () {
    var filter;

    beforeEach(function () {
        module('app');

        inject(function($injector) {
            filter = $injector.get('$filter');
        })
    });

    it('should have a percentage filter', function () {
        expect(filter('percentage')).toBeDefined();
    });

    describe('input is empty', function () {
        it('should return 0%', function () {
            expect(filter('percentage')('')).toBe('0%');
        });
    });

    describe('input is 0', function () {
        it('should return 0%', function () {
            expect(filter('percentage')(0)).toBe('0%');
        });
    });

    describe('input is a valid number', function () {
        it('should return the right percentage', function () {
            expect(filter('percentage')(15)).toBe('15%');
        });
    });
});