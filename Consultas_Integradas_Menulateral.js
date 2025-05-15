// ==UserScript==
// @name         Consultas_Integradas_Menulateral
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Menulateral.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Menulateral.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

setInterval(function () {
        if(localStorage.getItem('pula_tela_inicial') == 'pula'){
            localStorage.setItem('pula_tela_inicial', 'n_pula');
            oMenuUm.selMenu('Indivíduo');
        }
}, 1000);
