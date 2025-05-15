// ==UserScript==
// @name         Consultas_Integradas_Ocorrencias
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Ocorrencias.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Ocorrencias.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?*
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==

setInterval(() => {
    if(document.body.innerHTML.includes('Não há Ocorrências para este indivíduo !')) {
        localStorage.setItem("dados_completos", '*DADOS BÁSICOS:*'+localStorage.getItem('dados_basicos')+'\n\n*OCORRÊNCIAS:*\nNão há.');
        localStorage.setItem("dados_prontos", "ocorrencias");
    } else if(document.querySelector("#Ocorrencias")) {
        if(localStorage.getItem('dados_prontos') == 'basicos') {
            var ocorrencias = document.querySelector('#tabOcorrparentDadosoLista').querySelectorAll('tr');
            var autor = '';
            var indiciado = '';
            var suspeito = '';
            var acusado = '';
            ocorrencias.forEach(function(item){
                if(item.innerHTML.includes('Autor') && item.querySelectorAll('td').length>3 && autor.indexOf(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0]+'\n')==-1 && !autor.includes(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0]+'\n')) {
                    autor += item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[1]+'/'+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[2]+'\n';
                } else if(item.innerHTML.includes('Indiciado') && item.querySelectorAll('td').length>3 && indiciado.indexOf(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0]+'\n')==-1 && !indiciado.includes(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0]+'\n')) {
                    indiciado += item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[1]+'/'+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[2]+'\n';
                } else if(item.innerHTML.includes('Suspeito') && item.querySelectorAll('td').length>3 && suspeito.indexOf(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0]+'\n')==-1 && !suspeito.includes(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0]+'\n')) {
                    suspeito += item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[1]+'/'+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[2]+'\n';
                } else if(item.innerHTML.includes('Acusado') && item.querySelectorAll('td').length>3 && acusado.indexOf(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0]+'\n')==-1 && !acusado.includes(item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0]+'\n')) {
                    acusado += item.querySelectorAll('td')[4].innerHTML.split('<br>')[1]+' em '+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[1]+'/'+item.querySelectorAll('td')[4].innerHTML.split('<br>')[0].split(' ')[0].split('/')[2]+'\n';
                }
            });
            var a = '';
            if(autor != '') {
                a += 'Autor de:\n'+autor+'\n';
            }
            if(indiciado != '') {
                a += 'Indiciado por:\n'+indiciado+'\n';
            }
            if(suspeito != '') {
                a += 'Suspeito de:\n'+suspeito+'\n';
            }
            if(acusado != '') {
                a += 'Acusado de:\n'+acusado+'\n';
            }
            if(a == '') {
                a= 'Não há.';
            }
            localStorage.setItem("dados_completos", '*DADOS BÁSICOS:*'+localStorage.getItem('dados_basicos')+'\n\n*OCORRÊNCIAS:*\n'+a);
            localStorage.setItem("dados_prontos", "ocorrencias");
        }
    }
    if(localStorage.getItem('tem_imagem') && localStorage.getItem('tem_imagem') == 'não' && !document.querySelector('#botao_buscar_mandado')) {
        var tb = localStorage.getItem('dados_completos');
        let textarea = document.createElement("span");
        textarea.setAttribute('id', 'txt_resultados');
        textarea.innerHTML = tb;
        document.querySelector('table').insertAdjacentElement('beforebegin', textarea);
        let botao_buscar_mandado = document.createElement("button");
        botao_buscar_mandado.setAttribute('id', 'botao_buscar_mandado');
        botao_buscar_mandado.innerHTML = 'Buscar Mandado';
        textarea.insertAdjacentElement('beforebegin', botao_buscar_mandado);
        document.querySelector('#botao_buscar_mandado').addEventListener('click',function(item){
            navigator.clipboard.writeText(tb);
            window.open("https://portalbnmp.cnj.jus.br/", "_blank");
        });
    }
}, 100);
