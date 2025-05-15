// ==UserScript==
// @name         Consultas_Integradas_Dadosbasicos
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Dadosbasicos.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Dadosbasicos.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?*
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==

setInterval(() => {
    if(document.querySelector('table[name="tab-dados"]') && localStorage.getItem("dados_prontos") != "basicos") {
        var procurado = '';
        var mae = '';
        var nascimento = '';
        var cpf = '';
        var pai = '';
        var rg = '';
        var sexo = '';
        var cor_pele = '';
        var naturalidade = '';
        var d = document.querySelectorAll('span[class="LabelVisSecund"]');
        for (let i = 0; i < d.length - 1; i++) {
            if (d[i].parentNode.innerHTML.includes('Nome:') && procurado == '') {
                procurado = d[i].innerHTML;
            } else if (d[i].parentNode.innerHTML.includes('Pai/Mãe: ') && mae == '') {
                mae = d[i].innerHTML.split('/')[1].trim();
                pai = d[i].innerHTML.split('/')[0].trim();
                console.log(mae+' '+pai);
            } else if (d[i].parentNode.innerHTML.includes('Sexo:') && sexo == '') {
                sexo = d[i].innerHTML;
            } else if (d[i].parentNode.innerHTML.includes('Cor pele:')) {
                if (d[i].innerHTML.includes('Branca') || d[i].innerHTML.includes('Preta') || d[i].innerHTML.includes('Parda') || d[i].innerHTML.includes('Amarela') || d[i].innerHTML.includes('Indígena') || d[i].innerHTML.includes('Mulato')) {
                    cor_pele = d[i].innerHTML;
                }
            } else if (d[i].parentNode.innerHTML.includes('Naturalidade:') && naturalidade == '') {
                naturalidade = d[i].innerHTML;
            } else if (d[i].parentNode.innerHTML.includes('RG:') && rg == '') {
                rg = d[i].innerHTML;
            } else if (d[i].parentNode.innerHTML.includes('Data Nascimento:') && nascimento == '') {
                nascimento = d[i].innerHTML;
            } else if (d[i].parentNode.innerHTML.includes('CPF') && cpf == '') {
                cpf = d[i].innerHTML;
            }
        }
        localStorage.setItem("procurado_cpf", cpf.replace(/[^0-9]/g,''));
        localStorage.setItem("procurado", procurado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        localStorage.setItem("mae", mae.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        localStorage.setItem("dados_basicos", '\nNome: '+procurado+'\nSexo: '+sexo+'\nCor da pele: '+cor_pele+'\nNaturalidade: '+naturalidade+'\nNascimento: '+nascimento+'\nNome da mãe: '+mae+'\nNome do pai: '+pai+'\nCPF: '+cpf+'\nRG: '+rg);
        localStorage.setItem("dados_prontos", "basicos");
        if(localStorage.getItem('tem_ocorrencia') && localStorage.getItem('tem_ocorrencia') == 'não' && !document.querySelector('#botao_buscar_mandado')) {
            var tb = localStorage.getItem('dados_completos');
            if(localStorage.getItem('tem_imagem') == 'nao'){
                tb += '\nIndivíduo sem imagem.';
            }
            let textarea = document.createElement("span");
            textarea.setAttribute('id', 'txt_resultados');
            textarea.innerHTML = tb;
            document.querySelector('table').insertAdjacentElement('afterend', textarea);
            let botao_buscar_mandado = document.createElement("button");
            botao_buscar_mandado.setAttribute('id', 'botao_buscar_mandado');
            botao_buscar_mandado.innerHTML = 'Buscar Mandado';
            textarea.insertAdjacentElement('beforebegin', botao_buscar_mandado);
            document.querySelector('#botao_buscar_mandado').addEventListener('click',function(item){
                navigator.clipboard.writeText(tb);
                window.open("https://portalbnmp.cnj.jus.br/", "_blank");
            });
        }

    }
}, "100");
