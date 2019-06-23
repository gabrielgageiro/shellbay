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
            {
                evidencia: 'Diabetes',
                condicoes: [
                    {condicao: 'Sim', probabilidades: [
                        []
                        ]},
                    {condicao: 'Não', probabilidades: [
                        []
                        ]}
                ]
            }
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
            $scope.probabilidadesEvidencias.push({condicoes:[{probabilidades: [[]]}]})
        };

        $scope.removerRowEvidencias = function () {
            if($scope.probabilidadesEvidencias && $scope.probabilidadesEvidencias.length){
                $scope.probabilidadesEvidencias.pop();
            }
        };


    });