// ==UserScript==
// @name         Consultas_Integradas_Img
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Img.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Img.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg*
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

localStorage.setItem("dados_prontos", "nada");
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

if(!sessionStorage.getItem('img_n_repete')){
    document.querySelectorAll('a')[3].click();
    sessionStorage.setItem('img_n_repete','1');
}
if(sessionStorage.getItem('img_n_repete') && sessionStorage.getItem('img_n_repete') == '1' && document.body.innerText.includes('Imagens não encontradas !')){
    document.querySelectorAll('a')[0].click();
    sessionStorage.setItem('img_n_repete','2');
}

if(sessionStorage.getItem('img_n_repete')) {
    var tb = localStorage.getItem('dados_completos');
    let textarea = document.createElement("span");
    textarea.setAttribute('id', 'txt_resultados');
    textarea.innerHTML = tb;
    document.querySelector('#frmImg').insertAdjacentElement('afterend', textarea);
    let botao_buscar_mandado = document.createElement("button");
    botao_buscar_mandado.setAttribute('id', 'botao_buscar_mandado');
    botao_buscar_mandado.innerHTML = 'Buscar Mandado';
    textarea.insertAdjacentElement('beforebegin', botao_buscar_mandado);
    document.querySelector('#botao_buscar_mandado').addEventListener('click',function(item){
        navigator.clipboard.writeText(tb);
        window.open("https://portalbnmp.cnj.jus.br/", "_blank");
    });
} else {
    document.querySelectorAll('a')[3].click();
    sessionStorage.setItem('img_n_repete','1');
}


