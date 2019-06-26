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
                        ]},
                    {condicao: 'Não', probabilidades: [
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
            $scope.probabilidadesEvidencias.push({condicoes:[{probabilidades: []}]})
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

        $scope.validarEvidencias = function(){
            if(!$scope.probabilidadesEvidencias.length){
                throw 'Informe pelo menos uma envidência!';
            }

            for(var i=0; i<$scope.probabilidadesEvidencias.length; i++){
                var evidencia = $scope.probabilidadesEvidencias[i];

                if(!evidencia.evidencia || !evidencia.evidencia.trim()){
                    throw 'Informe o nome da evidência na linha ' + (i+1);
                }

                if(!evidencia.condicoes || !evidencia.condicoes.length){
                    throw 'Informe pelo menos uma condição para a evidência \'' + evidencia.evidencia + '\'';
                }

                for(var j=0; j<evidencia.condicoes.length; j++){
                    var condicao = evidencia.condicoes[j];

                    if(!condicao.condicao || !condicao.condicao.trim()){
                        throw 'Informe o nome da condição na linha ' + (j+1) + ' na evidência \'' + evidencia.evidencia + '\'';
                    }

                    if(!condicao.probabilidades || !condicao.probabilidades.length){
                        throw 'Informe as probabilidades da condição \'' + condicao.condicao + '\' na evidência \'' + evidencia.evidencia + '\'';
                    }

                    for(var k=0; k<condicao.probabilidades.length; k++){
                        probabilidade = condicao.probabilidades[k];

                        if(probabilidade == null){ //Null ou undef
                            throw 'Informe a probabilidade da condição \'' + condicao.condicao+ '\'' + ' na evidência \'' + evidencia.evidencia + '\'';
                        }

                        if(probabilidade < 0){
                            throw '\'A probabilidade da condição \'' + condicao.condicao+ '\'' + ' na evidência \'' + evidencia.evidencia + '\' não pode ser menor que 0';
                        }

                        if(probabilidade > 1){
                            throw '\'A probabilidade da condição \'' + condicao.condicao+ '\'' + ' na evidência \'' + evidencia.evidencia + '\' não pode ser maior que 1';
                        }
                    }
                }
            }
        };

        $scope.invertExecutando = function () {
            $scope.executando = !$scope.executando;

            if($scope.executando){
                try {
                    $scope.validarHipoteses();
                    $scope.validarEvidencias();
                    $scope.calcularProbabilidadeEvidencias();
                }catch (e) {
                    $scope.showToast(e);
                    $scope.executando = !$scope.executando; //Em caso de erro para a execução
                }
            }

        };
        $scope.calcularProbabilidadeEvidencias = function () {
            for(var i=0; i<$scope.probabilidadesEvidencias.length; i++){
                var evidencia = $scope.probabilidadesEvidencias[i];

                for(var j=0; j<evidencia.condicoes.length; j++){
                    var condicao = evidencia.condicoes[j];
                    var probabilidadeCondicao = 0;
                    for(var k=0; k<condicao.probabilidades.length; k++){
                        probabilidade = condicao.probabilidades[k];
                        probabilidadeCondicao += probabilidade * $scope.probabilidadesHipoteses[k].probabilidade;
                    }
                    console.log(probabilidadeCondicao);
                }
            }
        }
    });