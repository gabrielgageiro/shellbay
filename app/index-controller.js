var ShellBayApp = angular.module('ShellBayApp', ['ngMaterial', 'ngMessages', 'md.data.table'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('blue-grey');
    })
    .controller('IndexCtrl', function ($scope) {
        $scope.probabilidadesHipoteses = [
            {hipotese: 'Carie', probabilidade: 0.8},
            {hipotese: 'Gengivite', probabilidade: 0.2}
        ];
    });