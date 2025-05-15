// ==UserScript==
// @name         Consultas_Integradas_Peganome
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Peganome.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Consultas_Integradas_Peganome.js
// @description  Módulo de Consultas Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?*
// @match        https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==
var a = 'a';
setInterval(function() {
    if(document.getElementById('tabOcorrparentDadosoLista') && document.getElementById("tabOcorrparentDadosoLista").rows.length == 1 && a=='a') {
        document.querySelectorAll('a')[1].click();
        a='b';
    }
},100);
