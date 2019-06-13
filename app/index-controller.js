var ShellBayApp = angular.module('ShellBayApp', ['ngMaterial', 'ngMessages'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('blue-grey');
    })
    .controller('IndexCtrl', function ($scope) {
        $scope.oi = 'AAAAAAAAAAAAAAAAAAAAAAa'
    });