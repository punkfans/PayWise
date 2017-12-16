describe('auto complete test', function () {

    var $rootScope;
    var $scope;
    var $compile;
    var $timeout;
    var dataService;
    var dom;

    beforeEach(function () {
        module('app');
        module('templates');
        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            dataService = $injector.get('dataService');
            $compile = $injector.get('$compile');
            $timeout = $injector.get('$timeout');
            $scope = $rootScope.$new();
        });

        dom = $compile('<auto-complete data="data" label="label"></auto-complete>')($scope);

        $scope.data = ['test', 'test2', 'different'];
        $scope.label = 'label';

        $scope.$digest();
    });

    describe('initial display', function () {
        it('should render 1 input', function () {
            expect(dom.find('input').length).toBe(1);
        });

        it('should render no suggestions', function () {
            expect(dom[0].querySelector('div.list-group')).toBe(null);
        });

        it('should render the right label', function () {
            expect(getElement('label').html()).toBe('label');
        });
    });

    describe('type something in the input', function () {

        describe('type something that will return no result', function () {
            beforeEach(function () {
                getElement('input').val('no such result');
                getElement('input').triggerHandler('keyup');
            });

            it('should render 1 item in the dropdown', function () {
                expect(dom.find('a').length).toBe(1);
            });

            it('should render the only items as there is no result', function () {
                expect(dom.find('a').eq(0).text().trim()).toBe('Can\'t find your card? Tell us about it');
            });
        });

        describe('type something that will return 1 result', function () {
            beforeEach(function () {
                getElement('input').val('r');
                getElement('input').triggerHandler('keyup');
            });

            it('should render 1 item in the dropdown', function () {
                expect(dom.find('a').length).toBe(1);
            });

            it('should render first items as "different"', function () {
                expect(dom.find('a').eq(0).text().trim()).toBe('different');
            });

            describe('blur with one resule and it is not selected yet', function () {
                beforeEach(function () {
                    getElement('input').triggerHandler('blur');
                    $timeout.flush();
                });

                it('should set data to the only choice in the list', function () {
                    expect(dataService.addedCard).toBe('different');
                });

                it('should close the drop down list', function () {
                    expect(dom.isolateScope().showResults).toBeFalsy();
                });

                it('should reset avtiveItemIndex', function () {
                    expect(dom.isolateScope().avtiveItemIndex).toBe(-1);
                });
            });
        });

        describe('type something that will return multiple results', function () {
            beforeEach(function () {
                getElement('input').val('s');
                getElement('input').triggerHandler('keyup');
            });

            it('should render 2 items in the dropdown', function () {
                expect(dom.find('a').length).toBe(2);
            });

            it('should render first items as test', function () {
                expect(dom.find('a').eq(0).text().trim()).toBe('test');
            });

            it('should render second items as test2', function () {
                expect(dom.find('a').eq(1).text().trim()).toBe('test2');
            });

            describe('press enter without anything selected', function () {
                beforeEach(function () {
                    getElement('input').triggerHandler({type: 'keyup', which: 13, preventDefault: function() {}});
                    $timeout.flush();
                });

                it('should not set data', function () {
                    expect(dataService.addedCard).toBeFalsy();
                });
            });

            describe('blur with multiple results no one is selected yet', function () {
                beforeEach(function () {
                    getElement('input').triggerHandler('blur');
                    $timeout.flush();
                });

                it('should not set data', function () {
                    expect(dataService.addedCard).toBeFalsy();
                });
            });

            describe('press arrow down button', function () {
                beforeEach(function () {
                    getElement('input').triggerHandler({type: 'keyup', which: 40, preventDefault: function() {}});
                    $timeout.flush();
                });

                it('should set activeItemIndex to 0', function () {
                    expect(dom.isolateScope().avtiveItemIndex).toBe(0);
                });

                describe('keep pressing arrow down button to the end of the list and press again', function () {
                    beforeEach(function () {
                        getElement('input').triggerHandler({type: 'keyup', which: 40, preventDefault: function() {}});
                        $timeout.flush();
                        getElement('input').triggerHandler({type: 'keyup', which: 40, preventDefault: function() {}});
                        $timeout.flush();
                    });

                    it('should set activeItemIndex to 0', function () {
                        expect(dom.isolateScope().avtiveItemIndex).toBe(0);
                    });
                });
            });

            describe('press arrow up button', function () {
                beforeEach(function () {
                    getElement('input').triggerHandler({type: 'keyup', which: 38, preventDefault: function() {}});
                    $timeout.flush();
                });

                it('should set activeItemIndex to 1', function () {
                    expect(dom.isolateScope().avtiveItemIndex).toBe(1);
                });

                describe('keep pressing arrow up button', function () {
                    beforeEach(function () {
                        getElement('input').triggerHandler({type: 'keyup', which: 38, preventDefault: function() {}});
                        $timeout.flush();
                    });

                    it('should set activeItemIndex to 0', function () {
                        expect(dom.isolateScope().avtiveItemIndex).toBe(0);
                    });

                    describe('press enter', function () {
                        beforeEach(function () {
                            getElement('input').triggerHandler({type: 'keyup', which: 13, preventDefault: function() {}});
                            $timeout.flush();
                        });

                        it('should set data', function () {
                            expect(dataService.addedCard).toBe('test');
                        });

                        it('should reset avtiveItemIndex', function () {
                            expect(dom.isolateScope().avtiveItemIndex).toBe(-1);
                        });
                    });
                });
            });
        });
    });

    function getElement(element) {
        return dom.find(element).eq(0);
    }
});