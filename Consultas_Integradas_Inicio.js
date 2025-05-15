// ==UserScript==
// @name         Consultas_Integradas_Inicio
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Inicio.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Inicio.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?*
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
if(document.body.innerHTML.includes('Atenção: sua consulta será auditada!')) {
    localStorage.setItem('pula_tela_inicial', 'pula');
}
