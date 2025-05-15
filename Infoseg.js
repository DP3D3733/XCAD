// ==UserScript==
// @name         Infoseg
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Infoseg.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Infoseg.js
// @description  Módulo de automações para o Infoseg
// @author       GM 842 Calebe
// @match        https://infoseg.sinesp.gov.br/infoseg2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==

var a = 'a';
setInterval(function() {
    if(document.body.innerHTML.includes('</span>CNJ - BNMP<span id="cnt-tabs-todos" class="label_v">1</span>') && !document.querySelector('#tab-p0-ADVANCED_SEARCH-0-detalhesMandado')) {
        document.querySelector("#p0-ADVANCED_SEARCH-0 > div.row > div:nth-child(1) > div > p").click();
    }
    if(new URLSearchParams(new URL(window.location.href).search).has('nome')) {
        if(document.querySelector('#tab-p0-ADVANCED_SEARCH-0-detalhesMandado') && a=='a') {
            a = 'b';
            alert('ATENÇÃO!! PESSOA COM MANDADO EM ABERTO! COPIE ESSE NÚMERO E COLE NO NO ESPAÇO AO LADO DO BOTÃO DE COPIAR RESULTADO: '+document.querySelector("#tab-p0-ADVANCED_SEARCH-0-detalhesMandado > div:nth-child(2) > div:nth-child(3) > div > p").innerHTML);
        }
        document.querySelector('#menu_sinesp').style.display = 'none';
        document.querySelector('#sinesp-header').style.display = 'none';
        document.querySelector('#menu_sinesp_pad').style.display = 'none';
        document.querySelector('#footer').style.display = 'none';
        document.querySelector('#searchContainer').querySelector('div[class="row"]').style.display = 'none';
        if(document.querySelector('#frm-advanced-search-mandados')) {
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[1].style.display = 'none';
            /*document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[3].style.display = 'none';
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[4].style.display = 'none';
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[5].style.display = 'none';
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[6].style.display = 'none';
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[7].style.display = 'none';
            document.querySelector('#frm-advanced-search-mandados').querySelectorAll('div[class="row"]')[8].style.display = 'none';*/
        }
        document.querySelector('#menu_sinesp').style.display = 'none';
        document.querySelector('#sinesp-header').style.display = 'none';
        if(document.querySelector('#advanced-search') && document.querySelector('option[label="CNJ-BNMP"]') && document.querySelector('option[label="CNJ-BNMP"]').selected == false) {
            document.querySelector('#advanced-search').click();
            document.querySelector('#slct-base-individuos').click();
            document.querySelector('option[label="CNJ-BNMP"]').selected = true;
            document.querySelector('#slct-base-individuos').dispatchEvent(new Event('change', { bubbles: true }));
        }
        if(document.querySelector('#mandados-nome') && document.querySelector('#mandados-nome').value == '' && document.querySelector("#mandados-numeroDocumento") && document.querySelector("#mandados-numeroDocumento").value == '') {
            const url = new URL(window.location.href);
            const searchParams = url.searchParams;
            const nome = searchParams.get("nome");
            const mae = searchParams.get("nomeMae");
            const cpf = searchParams.get("cpf").replace(/[^0-9]/g,'');
            if(cpf != '') {
                if (document.querySelector("#slct-tipo-documento").options[document.querySelector("#slct-tipo-documento").selectedIndex].text != 'CPF') {
                    var sel_tipo_doc_options = document.querySelector("#slct-tipo-documento").querySelectorAll('option');
                    sel_tipo_doc_options.forEach(function(opt){
                        if(opt.innerText.includes('CPF')) {
                            opt.selected = true;
                        }
                    });
                    document.querySelector("#slct-tipo-documento").dispatchEvent(new Event('change', { bubbles: true }));
                } else if (document.querySelector("#mandados-numeroDocumento") && document.querySelector("#mandados-numeroDocumento").value == '') {
                    document.querySelector("#mandados-numeroDocumento").value = cpf;
                    document.querySelector('#btn-pesquisar-mandados').click();
                }
            } else {
                document.querySelector('#mandados-nome').value = nome;
                document.querySelector('#mandados-nomeMae').value = mae;
                document.querySelector('#btn-pesquisar-mandados').click();
            }
        }
    }

}, 100);

