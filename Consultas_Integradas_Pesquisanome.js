// ==UserScript==
// @name         Consultas_Integradas_Pesquisanome
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Pesquisanome.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Pesquisanome.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==

setTimeout(() => {

    localStorage.setItem("dados_completos", "nada");

    async function wait(){
        var pesquisa = await window.navigator.clipboard.readText();
        pesquisa = pesquisa.trim();
        if (/[\n|\n\r]/.test(pesquisa)) {
            pesquisa = pesquisa.replaceAll(/[\n|\n\r]/g,'&&**&&');
            var dados = pesquisa.split('&&**&&');
            if (dados.length >= 2 && dados.length <= 3) {
                for (let i = 0; i < dados.length; i++) {
                    var d = dados[i];
                    if (d.includes('/')) {
                        d = d.replaceAll('/', '');
                        if(d.length < 8) {
                            if(d.substring(4, 5) == '0' || d.substring(4, 5) == '1' || d.substring(4, 5) == '2') {
                                d = d.substring(0, 2) +'/'+d.substring(2, 4)+'/20' + d.substring(4);
                            } else {
                                d = d.substring(0, 2) +'/'+d.substring(2, 4)+'/19' + d.substring(4);
                            }

                        }
                        document.querySelector('input[name=A10_dn1]').value = d;
                    } else if (d.toUpperCase().includes('MÃE ') || d.toUpperCase().includes('MÂE ') || d.toUpperCase().includes('MAE ')) {
                        document.querySelector('input[name=A33_mae]').value = d.substring(4);
                    } else {
                        document.querySelector('input[name=A66_nome]').value = d;
                    }
                }
            }
            document.frmNome.submit();
        } else {
            var pesquisan = pesquisa.replace(/\D/g,'');
            if(!isNaN(parseFloat(pesquisan)) && isFinite(pesquisan)) {
                if(pesquisan.length == 10) {
                    clickrg();
                    document.querySelector('input[name=N10_rg]').value = pesquisan;
                    document.frmRg.submit();
                } else if(pesquisan.length == 11) {
                    clickcpf();
                    document.querySelector('input[name=N_cpf]').value = pesquisan;
                    document.frmCpf.submit();
                }
            } else {
                document.querySelector('input[name=A66_nome]').value = pesquisa;
                document.frmNome.submit();
            }
        }
        document.removeEventListener("click",wait);
    }
    var but_cola_e_pesquisa = document.createElement("div");
    but_cola_e_pesquisa.setAttribute("id", "but_cola_e_pesquisa");
    but_cola_e_pesquisa.innerHTML = 'Copiar da área de transferência e pesquisar';
    but_cola_e_pesquisa.setAttribute("style", "vertical-align: middle; background:#c8c5c2; width:80%; height: 40%");
    document.querySelector('#CriteriosGerais').parentNode.insertBefore(but_cola_e_pesquisa, document.querySelector('#CriteriosGerais'));

    but_cola_e_pesquisa.addEventListener("click",wait);
}, "100");



