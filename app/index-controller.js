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

        $scope.probabilidadesEvidencias = [
            {evidencia: 'Teste', probabilidade:0.1},
            {evidencia: 'Teste 2', probabilidade:0.2}
        ];


        $scope.addRowHipoteses = function () {
            $scope.probabilidadesHipoteses.push({})
        };

        $scope.removerRowHipoteses = function () {
            if($scope.probabilidadesHipoteses && $scope.probabilidadesHipoteses.length){
                $scope.probabilidadesHipoteses.pop();
            }
        };

        $scope.addRowEvidencias = function () {
            $scope.probabilidadesEvidencias.push({})
        };

        $scope.removerRowEvidencias = function () {
            if($scope.probabilidadesEvidencias && $scope.probabilidadesEvidencias.length){
                $scope.probabilidadesEvidencias.pop();
            }
        };


    });