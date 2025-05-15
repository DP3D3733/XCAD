// ==UserScript==
// @name         Consultas_Integradas_Veiculos
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Veiculos.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Veiculos.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/mod-veiculo/*
// @match        https://www.consultasintegradas.rs.gov.br/csi/mod-veiculo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==
localStorage.removeItem('veiculos_dados_basicos');
localStorage.removeItem('veiculos_dados_proprietario');
localStorage.removeItem('veiculos_dados_restricoes');
localStorage.removeItem('veiculos_dados_ocorrencias');
setInterval(function() {
    if(document.querySelector('table[role="grid"]') && document.getElementById('form:lista_data') && document.getElementById('form:lista_data').querySelectorAll('tr').length ==1) {
        document.getElementById('form:lista_data').querySelector('a').click();
    }
    if(document.querySelector('a[href="#form:tabs:abaDadosBasicos"]') && document.querySelector('a[href="#form:tabs:abaDadosBasicos"]').parentNode.getAttribute('aria-selected')=="false" && !localStorage.getItem('veiculos_dados_basicos') && !n_muda) {
        document.querySelector('a[href="#form:tabs:abaDadosBasicos"]').click();
    }
    if(document.querySelector('a[href="#form:tabs:abaDadosBasicos"]') && document.querySelector('a[href="#form:tabs:abaDadosBasicos"]').parentNode.getAttribute('aria-selected')=="true" && !localStorage.getItem('veiculos_dados_basicos') && !n_muda) {
        var dados_basicos = '';
        document.getElementById('form:tabs:abaDadosBasicos').querySelectorAll('label').forEach(function(item){
            if(item.innerHTML == 'Placa:') {
                dados_basicos += '*Placa*: '+item.parentNode.parentNode.querySelector('span').innerHTML+'\n';
            } else if(item.innerHTML == 'Chassi:') {
                dados_basicos += '*Chassi*: '+item.parentNode.parentNode.querySelectorAll('td')[1].innerHTML+'\n';
            } else if(item.innerHTML == 'Marca:') {
                dados_basicos += '*Marca*: '+item.parentNode.parentNode.querySelectorAll('td')[3].innerHTML+'\n';
            } else if(item.innerHTML == 'Cor:') {
                dados_basicos += '*Cor*: '+item.parentNode.parentNode.querySelectorAll('td')[3].innerHTML+'\n';
            }
        });
        localStorage.setItem('veiculos_dados_basicos',dados_basicos);
        document.querySelector('a[href="#form:tabs:abaProprietario"]').click();
        localStorage.removeItem('veiculos_dados_ocorrencias');
    }
    if(document.querySelector('a[href="#form:tabs:abaProprietario"]') && document.querySelector('a[href="#form:tabs:abaProprietario"]').parentNode.getAttribute('aria-selected')=="true" && localStorage.getItem('veiculos_dados_basicos') && !localStorage.getItem('veiculos_dados_proprietario') && !n_muda) {
        var veiculos_dados_proprietario = '';
        document.getElementById('form:tabs:abaProprietario').querySelectorAll('label').forEach(function(item){
            if(item.innerHTML == 'Nome:') {
                veiculos_dados_proprietario += '*Nome*: '+item.parentNode.parentNode.querySelectorAll('td')[1].innerHTML+'\n';
            } else if(item.innerHTML == 'CPF:') {
                veiculos_dados_proprietario += '*CPF*: '+item.parentNode.parentNode.querySelectorAll('td')[1].innerHTML+'\n';
            }
        });
        localStorage.setItem('veiculos_dados_proprietario',veiculos_dados_proprietario);
        document.querySelector('a[href="#form:tabs:abaRestricoes"]').click();
        localStorage.removeItem('veiculos_dados_ocorrencias');
    }
    if(document.querySelector('a[href="#form:tabs:abaRestricoes"]') && document.querySelector('a[href="#form:tabs:abaRestricoes"]').parentNode.getAttribute('aria-selected')=="true" && localStorage.getItem('veiculos_dados_basicos') && localStorage.getItem('veiculos_dados_proprietario') && !localStorage.getItem('veiculos_dados_restricoes') && !n_muda) {
        var veiculos_dados_restricoes = '';
        if(document.getElementById('form:tabs:abaRestricoes').innerHTML.includes('Furto') || document.getElementById('form:tabs:abaRestricoes').innerHTML.includes('Roubo')) {
            veiculos_dados_restricoes = '*ATENÇÃO! VEÍCULO EM SITUAÇÃO DE FURTO/ROUBO*';
        } else {
            veiculos_dados_restricoes = '*SEM NOVIDADES!*';
        }
        localStorage.setItem('veiculos_dados_restricoes',veiculos_dados_restricoes);
        document.querySelector('a[href="#form:tabs:abaOcorrencias"]').click();
        localStorage.removeItem('veiculos_dados_ocorrencias');
    }
    if(document.querySelector('a[href="#form:tabs:abaOcorrencias"]') && document.querySelector('a[href="#form:tabs:abaOcorrencias"]').parentNode.getAttribute('aria-selected')=="true" && localStorage.getItem('veiculos_dados_basicos') && localStorage.getItem('veiculos_dados_proprietario') && localStorage.getItem('veiculos_dados_restricoes') && !localStorage.getItem('veiculos_dados_ocorrencias') && !n_muda) {
        var veiculos_dados_ocorrencias = '';
        if(document.querySelector("#form\\:tabs\\:abaOcorrencias").innerHTML.includes('Nenhuma ocorrência encontrada.')) {
            localStorage.setItem('veiculos_dados_ocorrencias','Não há.');
        } else {

            if(document.querySelector("#form\\:tabs\\:listaOcor_data").querySelectorAll('tr').length > 0) {
                document.querySelector("#form\\:tabs\\:listaOcor_data").querySelectorAll('tr').forEach(function(item){
                    if(!veiculos_dados_ocorrencias.includes(item.querySelectorAll('td')[5].innerHTML.split('\n')[1].split(' - ')[1] + ' - '+item.querySelectorAll('td')[5].innerHTML.split('\n')[0].split('&nbsp;')[0].trim()+'\n')) {
                        veiculos_dados_ocorrencias += item.querySelectorAll('td')[5].innerHTML.split('\n')[1].split(' - ')[1] + ' - '+item.querySelectorAll('td')[5].innerHTML.split('\n')[0].split('&nbsp;')[0].trim()+'\n';
                    }
                });
            }
            localStorage.setItem('veiculos_dados_ocorrencias',veiculos_dados_ocorrencias);
        }
        var a = document.createElement('div');
        document.querySelector("#form\\:tabs\\:abaOcorrencias").append(a);
        a.innerHTML = '<table id="resultados"><tbody><tr><td><div class="ui-button" id=copia_resultados>Copiar Resultados</div></td></tr><tr><td id=rst>'+localStorage.getItem('veiculos_dados_restricoes')+'\n\n*DADOS BÁSICOS:*\n'+localStorage.getItem('veiculos_dados_basicos')+'\n*PROPRIETÁRIO:*\n'+localStorage.getItem('veiculos_dados_proprietario')+'\n*OCORRÊNCIAS:*\n'+localStorage.getItem('veiculos_dados_ocorrencias')+'</td></tr></tbody></table>';
        var n_muda = 'a';
        var Tabela = {
            selecionarTabela: function(el) {
                var body = document.body, range, sel;
                if (document.createRange && window.getSelection) {
                    range = document.createRange();
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    try {
                        range.selectNodeContents(el);
                        sel.addRange(range);
                    } catch (e) {
                        range.selectNode(el);
                        sel.addRange(range);
                    }
                } else if (body.createTextRange) {
                    range = body.createTextRange();
                    range.moveToElementText(el);
                    document.getElementById('txt_resultados').value.select();
                }
                try {
                    navigator.clipboard.writeText(range);
                    range.blur();
                } catch(error){
                    // Exceção aqui
                }
            }
        }
        document.querySelector('#copia_resultados').addEventListener('click',function(item){
            var tabelaDeDados = document.getElementById("rst");
            Tabela.selecionarTabela(tabelaDeDados);
        });
    }
},100);
