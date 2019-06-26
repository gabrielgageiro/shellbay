var ShellBayApp = angular.module('ShellBayApp', ['ngMaterial', 'ngMessages', 'md.data.table'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('blue-grey');
    })
    .controller('IndexCtrl', function ($scope, $mdToast) {
        $scope.executando = false;

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

        $scope.showToast = function(texto){
            $mdToast.show(
                $mdToast.simple()
                    .textContent(texto)
                    .position('top right')
                    .hideDelay(3000))
                .then(function() {}).catch(function() {});
        };

        $scope.validarHipoteses = function(){

            if(!$scope.probabilidadesHipoteses.length){
                throw 'Informe pelo menos uma hipótese!';
            }

            console.log($scope.probabilidadesHipoteses);

            for(var i=0; i<$scope.probabilidadesHipoteses.length; i++){
                var hipotese = $scope.probabilidadesHipoteses[i];

                if(!hipotese.hipotese || !hipotese.hipotese.trim()){
                    throw 'Informe o nome da hipótese na linha ' + (i+1);
                }

                if(hipotese.probabilidade == null){ //Null ou undef
                    throw 'Informe a probabilidade da hipótese \'' + hipotese.hipotese + '\'';
                }

                if(hipotese.probabilidade < 0){
                    throw 'A probabilidade da hipótese \'' + hipotese.hipotese + '\' não pode ser menor que 0';
                }

                if(hipotese.probabilidade > 1){
                    throw 'A probabilidade da hipótese \'' + hipotese.hipotese + '\' não pode ser maior que 1';
                }
            }
        };

        $scope.invertExecutando = function () {
            $scope.executando = !$scope.executando;

            if($scope.executando){
                try {
                    $scope.validarHipoteses();
                }catch (e) {
                    $scope.showToast(e);
                    $scope.executando = !$scope.executando; //Em caso de erro para a execução
                }
            }

        };
    });