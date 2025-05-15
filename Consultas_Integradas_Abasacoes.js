// ==UserScript==
// @name         Consultas_Integradas_Abasacoes
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Abasacoes.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Pesquisanome.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==
setInterval(function () {
    //verifica se o indivíduo tem a aba de ocorrências
    if(document.getElementById('aoAbasElem5[class="ABASDes"]')){
        localStorage.setItem('tem_ocorrencia','não');
    } else {
        localStorage.setItem('tem_ocorrencia','sim');
    }
    //verifica se o indivíduo tem a aba de imagem
    if(document.getElementById('aoAbasElem2') && document.getElementById('aoAbasElem2').getAttribute('class') == 'ABASDes'){
        localStorage.setItem('tem_imagem','não');
    } else {
        localStorage.setItem('tem_imagem','sim');
    }
    if(document.getElementById('doAbasElem5')) {
        if(localStorage.getItem('dados_prontos') == 'basicos' && document.getElementById('aoAbasElem0').getAttribute("class") == 'ABASOn'){
            if(document.getElementById('aoAbasElem5').getAttribute("class") == 'ABASOff') {
                document.getElementById('aoAbasElem5').click();
            } else {
                localStorage.setItem("dados_completos", '*DADOS BÁSICOS:*'+localStorage.getItem('dados_basicos')+'\n\n*OCORRÊNCIAS:*\nNão há.');
                localStorage.setItem("dados_prontos", "ocorrencias");
            }

        }
        if(localStorage.getItem('dados_prontos') == 'ocorrencias' && document.getElementById('aoAbasElem2').getAttribute("class") == 'ABASOff'){
            document.getElementById('aoAbasElem2').click();
            localStorage.removeItem('dados_prontos');
        }

    }

}, 100);
