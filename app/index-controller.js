var ShellBayApp = angular.module('ShellBayApp', ['ngMaterial', 'ngMessages', 'md.data.table'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('blue-grey');
    })
    .controller('IndexCtrl', function ($scope, $mdToast) {
        $scope.executando = false;
        $scope.ordemEvidencias = [];
        $scope.cacheEvidenciasCondicoes = new Map(); //Indice da evidencia / indice da condicao

       $scope.probabilidadesHipoteses = [];

        $scope.probabilidadesEvidencias = [];

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
            var somaProbabilidadeHipotese = 0 ;

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

                hipotese.valorOriginal = hipotese.probabilidade;
                somaProbabilidadeHipotese += hipotese.probabilidade;
            }

            if(somaProbabilidadeHipotese > 1){
                throw 'A soma probabilidade das hipóteses não pode ser maior que 1';
            }
        };

        $scope.validarEvidencias = function(){
            if(!$scope.probabilidadesEvidencias.length){
                throw 'Informe pelo menos uma envidência!';
            }

            for(var i=0; i<$scope.probabilidadesEvidencias.length; i++){ //linha
                var evidencia = $scope.probabilidadesEvidencias[i];

                if(!evidencia.evidencia || !evidencia.evidencia.trim()){
                    throw 'Informe o nome da evidência na linha ' + (i+1);
                }

                if(!evidencia.condicoes || !evidencia.condicoes.length){
                    throw 'Informe pelo menos uma condição para a evidência \'' + evidencia.evidencia + '\'';
                }

                for(var j=0; j<evidencia.condicoes.length; j++){ //linha
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

                var somaProbabilidadeCondicao = 0;

                for (var l = 0; l < $scope.probabilidadesHipoteses.length; l++, somaProbabilidadeCondicao = 0){
                    for(var m = 0; m < evidencia.condicoes.length; m++) { //linha
                        var condicao = evidencia.condicoes[m];
                        somaProbabilidadeCondicao += condicao.probabilidades[l];
                    }

                    if(somaProbabilidadeCondicao > 1){
                        throw 'A soma das probabilidades das condições não podem ser maior que 1 na hipótese \'' + $scope.probabilidadesHipoteses[l].hipotese + '\'';
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
                    $scope.calcularProbabilidadeTodasEvidencias();
                }catch (e) {
                    $scope.showToast(e);
                    $scope.executando = !$scope.executando; //Em caso de erro para a execução
                }
            }else{
                //Ao parar a execução retornar os estados aos valores originais
                $scope.ordemEvidencias = [];
                $scope.cacheEvidenciasCondicoes.clear();
                $scope.resetProbabilidadeHipoteses();

                for(var i=0; i<$scope.probabilidadesEvidencias.length; i++) { //linha
                    var evidencia = $scope.probabilidadesEvidencias[i];

                    for (var j = 0; j < evidencia.condicoes.length; j++) { //linha
                        evidencia.condicoes[j].cemPorCento = false;
                    }
                }
            }
        };

        $scope.resetProbabilidadeHipoteses = function(){
            for(var i=0; i<$scope.probabilidadesHipoteses.length; i++){
                var hipotese = $scope.probabilidadesHipoteses[i];

                hipotese.probabilidade = hipotese.valorOriginal;
            }
        };

        $scope.calcularProbabilidadeTodasEvidencias = function () {
            for(var i=0; i<$scope.probabilidadesEvidencias.length; i++){
                $scope.calcularProbabilidadeEvidencia($scope.probabilidadesEvidencias[i]);
            }
        };

        $scope.calcularProbabilidadeEvidencia = function(evidencia){
            for(var j=0; j<evidencia.condicoes.length; j++){
                var condicao = evidencia.condicoes[j];
                var probabilidadeCondicao = 0;
                for(var k=0; k<condicao.probabilidades.length; k++){
                    probabilidade = condicao.probabilidades[k];
                    probabilidadeCondicao += probabilidade * $scope.probabilidadesHipoteses[k].probabilidade;
                }
                condicao.porcentoCondicao = probabilidadeCondicao;
            }
        };

        $scope.calcularProbabilidadeHipoteses = function(){
            if($scope.ordemEvidencias.length){
                for(var i=0; i<$scope.ordemEvidencias.length; i++){
                    var indice = $scope.ordemEvidencias[i];
                    var condicao = $scope.probabilidadesEvidencias[indice].condicoes[$scope.cacheEvidenciasCondicoes.get(indice)];

                    for(var j=0; j<$scope.probabilidadesHipoteses.length; j++){
                        var hipotese = $scope.probabilidadesHipoteses[j];

                        hipotese.probabilidade = hipotese.probabilidade * condicao.probabilidades[j] / (condicao.porcentoCondicao);
                    }

                    $scope.calcularProbabilidadeTodasEvidencias();
                }
            }
        };

        $scope.calcularTodasProbabilidades = function(){
            $scope.resetProbabilidadeHipoteses();
            $scope.calcularProbabilidadeTodasEvidencias();
            $scope.calcularProbabilidadeHipoteses();
        };

        $scope.checkCondicao = function (evidencia, indiceEvidencia, indiceCondicao) {

            for(var i=0; i<$scope.ordemEvidencias.length; i++){
                if($scope.ordemEvidencias[i] == indiceEvidencia){
                    $scope.ordemEvidencias.splice(i, 1);
                    break;
                }
            }

            $scope.cacheEvidenciasCondicoes.delete(indiceEvidencia);

            if(evidencia.condicoes[indiceCondicao].cemPorCento){ //Marcou
                $scope.ordemEvidencias.push(indiceEvidencia);
                $scope.cacheEvidenciasCondicoes.set(indiceEvidencia, indiceCondicao);
            }

            $scope.calcularTodasProbabilidades();

            for(var j=0; j<$scope.ordemEvidencias.length; j++){
                var indiceEvidencia = $scope.ordemEvidencias[i];
                var e = $scope.probabilidadesEvidencias[indiceEvidencia];
                var indiceCondicaoSelecionada = $scope.cacheEvidenciasCondicoes.get(indiceEvidencia);

                for(var k=0; k<e.condicoes.length; k++){
                    var condicao = e.condicoes[k];
                    if(k != indiceCondicaoSelecionada){
                        condicao.porcentoCondicao = 0;
                        condicao.cemPorCento = false;
                    }else{
                        condicao.porcentoCondicao = 1;
                    }
                }
            }
        };

        $scope.setExemplo1 = function () {
            $scope.probabilidadesHipoteses = [
              {hipotese: 'Forte', probabilidade: 0.01},
              {hipotese: 'Média', probabilidade: 0.033},
              {hipotese: 'Fraca', probabilidade: 0.09},
              {hipotese: 'Nenhuma', probabilidade: 0.867}
            ];

            $scope.probabilidadesEvidencias = [
                {
                    evidencia: 'Alimentação',
                    condicoes: [
                        {condicao: 'Correta', probabilidades: [0.1, 0.4, 0.5, 0.95]},
                        {condicao: 'Incorreta', probabilidades: [0.9, 0.6, 0.5, 0.05]}
                    ]
                },
                {
                    evidencia: 'Álcool',
                    condicoes: [
                        {condicao: 'Sim', probabilidades: [0.9, 0.7, 0.55, 0.05]},
                        {condicao: 'Não', probabilidades: [0.1, 0.3, 0.45, 0.95]}
                    ]
                },
                {
                    evidencia: 'Estresse',
                    condicoes: [
                        {condicao: 'Sim', probabilidades: [0.2, 0.7, 0.8, 0.5]},
                        {condicao: 'Não', probabilidades: [0.8, 0.3, 0.2, 0.5]}
                    ]
                },
                {
                    evidencia: 'Mudança Climática',
                    condicoes: [
                        {condicao: 'Sim', probabilidades: [0.7, 0.8, 0.6, 0.02]},
                        {condicao: 'Não', probabilidades: [0.3, 0.2, 0.4, 0.98]}
                    ]
                }
            ];
        };

        $scope.setExemplo2 = function () {
            $scope.probabilidadesHipoteses = [
                {hipotese: "Cárie", probabilidade: 0.8},
                {hipotese: "Gengivite", probabilidade: 0.2}
            ];

            $scope.probabilidadesEvidencias = [
                {
                    evidencia:"Diabetes",
                    condicoes:[
                        {condicao:"Sim", probabilidades:[0.63,0.65]},
                        {condicao:"Não", probabilidades:[0.37,0.35]}
                    ]
                },
                {
                    evidencia:"Posição do dente",
                    condicoes:[
                        {condicao:"Correta", probabilidades:[0.4,0.35]},
                        {condicao:"Incorreta", probabilidades:[0.6,0.65]}
                    ]
                },
                {
                    evidencia:"Hereditariedade",
                    condicoes:[
                        {condicao:"Sim", probabilidades:[0.57,0.8]},
                        {condicao:"Não", probabilidades:[0.43,0.2]}
                    ]
                },
                {
                    evidencia:"Fluoretação da água",
                    condicoes:[
                        {condicao:"Sim", probabilidades:[0.35,0.95]},
                        {condicao:"Não", probabilidades:[0.65,0.05]}
                    ]
                },
                {
                    evidencia:"Higienização",
                    condicoes:[
                        {condicao:"Adequada", probabilidades:[0.2,0.4]},
                        {condicao:"Inadequada", probabilidades:[0.8,0.6]}
                    ]
                }
            ];
        };

        $scope.setExemplo3 = function () {
            $scope.probabilidadesHipoteses = [
                {hipotese:"Abaixo de 417 focos", probabilidade: 0.88},
                {hipotese: "Entre 417 e 834 focos", probabilidade: 0.12}
            ];

            $scope.probabilidadesEvidencias = [
                {
                    evidencia:"Umidade relativa do ar (%)",
                    condicoes:[
                        {condicao: "Abaixo de 54%", probabilidades:[0.5,0.8]},
                        {condicao:"Acima de 54%", probabilidades: [0.5,0.2]}
                    ]
                },
                {
                    evidencia: "Temperatura média (°C)",
                    condicoes:[
                        {condicao:"Abaixo de 27 °C", probabilidades: [0.6,0.3]},
                        {condicao:"Acima de 27 °C", probabilidades: [0.4,0.7]}
                    ]
                },
                {
                    evidencia:"Velocidade do vento (m/s)",
                    condicoes:[
                        {condicao: "Abaixo de 2m/s", probabilidades: [0.51,0.1]},
                        {condicao: "Acima de 2m/s", probabilidades: [0.49,0.9]}
                    ]
                }
            ];
        };
    });