// ==UserScript==
// @name         Monitor_Consulta_CEIC
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/Monitor_Consulta_CEIC.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/Monitor_Consulta_CEIC.js
// @description  Módulo de Consulta Integradas do XCAD
// @author       GM 842 Calebe
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// ==/UserScript==

function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};
var a = [];
var mensagens_novas = [];
var mensagens_antigas = [];
setInterval(function () {
    /* var msg = '';
    if(document.querySelector('div[aria-label="Lista de conversas"]')) {
        var b = document.querySelector('div[aria-label="Lista de conversas"]').querySelectorAll('span[dir="ltr"]');
        var c = document.querySelector('div[aria-label="Lista de conversas"]').querySelectorAll('span[dir="auto"]');
        var m = document.querySelector('div[aria-label="Lista de conversas"]').querySelectorAll('span[aria-label="1 mensagem não lida"]');
        if(mensagens_antigas.length > -1) {
            for (let i = 0; i < b.length; i++) {
                if(!a.includes(b[i].innerHTML+'&&&&&'+b[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML)) {
                    if(b[i].innerHTML.length < 100){
                        if(b[i].innerHTML.toUpperCase().indexOf("CONSULTA") != -1 || b[i].innerHTML.toUpperCase().indexOf("ABORDAGEM") != -1 || b[i].innerHTML.toUpperCase().indexOf("CPF ") != -1 || b[i].innerHTML.toUpperCase().indexOf("RG ") != -1) {
                            var w=window.open();w.location='https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae");w.document.close();
                            //window.open('https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(b[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae"), '_blank', 'toolbar=yes,location=0,menubar=yes');
                            a.push(b[i].innerHTML+'&&&&&'+b[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML);
                            console.log(a);
                        } else {
                            msg = b[i].innerHTML.split(' ');
                            msg.forEach(function (item) {
                                if(item.replace(/\D/g, '').length >= 10 && item.replace(/\D/g, '').length <= 11) {
                                    var w=window.open();w.location='https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae");w.document.close();
                                    //window.open('https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(b[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae"), '_blank', 'toolbar=yes,location=0,menubar=yes');
                                    a.push(b[i].innerHTML+'&&&&&'+b[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML);
                                    console.log(a);
                                }
                            });
                        }
                    }

                }
            }
            for (let i = 0; i < c.length; i++) {
                if(!a.includes(c[i].innerHTML+'&&&&&'+c[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML)) {
                    if(c[i].innerHTML.length < 100){
                        if(c[i].innerHTML.toUpperCase().indexOf("CONSULTA") != -1 || b[i].innerHTML.toUpperCase().indexOf("ABORDAGEM") != -1 || c[i].innerHTML.toUpperCase().indexOf("CPF ") != -1 || c[i].innerHTML.toUpperCase().indexOf("RG ") != -1) {
                            w=window.open();w.location='https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae");w.document.close();
                            //window.open('https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae"), '_blank', 'toolbar=yes,location=0,menubar=yes');
                            a.push(c[i].innerHTML+'&&&&&'+c[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML);
                            console.log(a);
                        } else {
                            msg = c[i].innerHTML.split(' ');
                            msg.forEach(function (item) {
                                if(item.replace(/\D/g, '').length >= 10 && item.replace(/\D/g, '').length <= 11) {
                                    var w=window.open();w.location='https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae");w.document.close();
                                   // window.open                   ('https://secweb.intra.rs.gov.br/csi/index.jsp?ultima_mensagem='+extractContent(c[i].innerHTML).replace(/(\r\n|\n|\r)/gm,"aeaeae"), '_blank', 'toolbar=yes,location=0,menubar=yes');
                                    a.push(c[i].innerHTML+'&&&&&'+c[i].parentNode.parentNode.parentNode.parentNode.querySelector('div[class="_ak8i"]').innerHTML);
                                    console.log(a);
                                }
                            });
                        }
                    }

                }
            }
            for (let i = 0; i < m.length; i++) {
                m[i].click();
            }

        }
    }*/
    if(Array.from(document.querySelectorAll('li')).filter((li) => li.innerText.includes('Responder em particular')).length > 0 && !document.querySelector('div[aria-label="qap"]')) {
        let mensagem = document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.querySelector('span[class="_ao3e selectable-text copyable-text"]').innerText;
        let gus_extenso = ['CRUZEIRO','PARTENON','LESTE','RESTINGA','NORTE','BALTAZAR','PINHEIRO','SUL','CENTRO','ROMU'];
        let gus_numero = ['21','31','41','51','61','71','81','91','C1','R1','PATAM'];
        let possiveis_gus = [];
        gus_numero.forEach(function (item) {
            if(mensagem.toUpperCase().includes(item)) {
                possiveis_gus.push(item);
            }
        });
        gus_extenso.forEach(function (item) {
            if(mensagem.toUpperCase().includes(item)) {
                possiveis_gus.push(gus_numero[gus_extenso.indexOf(item)]);
            }
        });
        possiveis_gus.forEach(function (item) {
            let but_qap = '<li tabindex="0" class="_aj-r _aj-q _aj-_ false false" data-animate-dropdown-item="true" role="button" style="opacity: 1;"><div class="_aj-z _aj-t _alxo" aria-label="qap" style="">QAP '+item+'</div></li>';
            Array.from(document.querySelectorAll('li')).filter((li) => li.innerText.includes('Responder em particular'))[0].parentNode.insertAdjacentHTML("beforebegin", but_qap);
        });
    }
    if(document.querySelector('div[aria-label="qap"]:not([com_event_listener])')) {
        let but_qap = document.querySelector('div[aria-label="qap"]:not([com_event_listener])')
        but_qap.setAttribute('com_event_listener','');
        but_qap.parentNode.addEventListener('click',function(){
            let horario = document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.querySelectorAll('span[dir=auto]')[document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.querySelectorAll('span[dir=auto]').length-1].innerText.replaceAll('Editada','');
            let gu = this.innerText.split(' ')[1];
            let gus = [];
            if(sessionStorage.getItem('qap') && sessionStorage.getItem('qap') != ''){
                let d = sessionStorage.getItem('qap').split('\n');
                d.forEach(function(item){
                    gus.push(item.split('-')[1]);
                });
            }
            if(!gus.includes(gu)) {
                sessionStorage.setItem('qap', (sessionStorage.getItem('qap') || '') + horario+'-'+gu+'\n');
                if(sessionStorage.getItem('qap').split('\n').length == 12) {
                    document.querySelector('div[class="tooltip"]').innerHTML = 'Todas as áreas informaram terem ciência da OS!';
                } else {
                    let gus_numero = ['21','31','41','51','61','71','81','91','C1','R1','PATAM'];
                    let a = '';
                    gus_numero.forEach(function (item) {
                        if(!sessionStorage.getItem('qap').toUpperCase().includes('-'+item)) {
                            a+=item+', ';
                        }
                    });
                    if(a!='') {
                        document.querySelector('div[class="tooltip"]').innerHTML = 'Ainda não informou a ciência da OS: '+ a.substring(0,a.length-2);
                    }
                }
                document.querySelector('span[class="notification-badge"]').innerHTML = (sessionStorage.getItem('qap').split('\n').length-1)+'/11';
            }
            window.dispatchEvent(
                new KeyboardEvent("keydown", {
                    altKey: false,
                    code: "Escape",
                    ctrlKey: false,
                    isComposing: false,
                    key: "Escape",
                    location: 0,
                    metaKey: false,
                    repeat: false,
                    shiftKey: false,
                    which: 27,
                    charCode: 0,
                    keyCode: 27,
                })
            );
        });
        but_qap.addEventListener('mouseenter', function() {
            but_qap.style.backgroundColor = '#f5f6f6'; // Altera a cor de fundo
        });

        // Evento de mouse saindo da área do elemento
        but_qap.addEventListener('mouseleave', function() {
            but_qap.style.backgroundColor = '#ffffff'; // Volta à cor original
        });
    }

    if(document.querySelector('button[aria-label="Comunidades"]') && !document.querySelector('div[aria-label="num_qap"]')) {
        let num_qap = '<div class="notification-container" style="position:relative;display:inline-block" aria-label="num_qap"><button class="notification-button" style="font-size:26px;color:white;border:none;border-radius:5px;cursor:pointer;position:relative">🕒</button><span class="notification-badge" style="position: absolute; top: -5px; right: -5px; background-color: red; color: white; font-size: 8px; font-weight: bold; border-radius: 50%; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center">0/11</span></div>';
        document.querySelector('button[aria-label="Comunidades"]').parentNode.insertAdjacentHTML("afterend", num_qap);
        let tooltip = '<div class="tooltip" style="visibility: hidden; width:fit-content; position: absolute; top: 35px; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; z-index: 9999">Você tem novas notificações!</div>'
        document.body.insertAdjacentHTML("beforeend", tooltip);
        if(sessionStorage.getItem('qap') && sessionStorage.getItem('qap') != '') {
            document.querySelector('span[class="notification-badge"]').innerHTML = (sessionStorage.getItem('qap').split('\n').length-1)+'/11';
            if(sessionStorage.getItem('qap').split('\n').length == 12) {
                document.querySelector('div[class="tooltip"]').innerHTML = 'Todas as áreas informaram terem ciência da OS!';
            } else {
                let gus_numero = ['21','31','41','51','61','71','81','91','C1','R1','PATAM'];
                let a = '';
                gus_numero.forEach(function (item) {
                    if(!sessionStorage.getItem('qap').toUpperCase().includes('-'+item)) {
                        a+=item+', ';
                    }
                });
                if(a!='') {
                    document.querySelector('div[class="tooltip"]').innerHTML = 'Ainda não informou a ciência da OS: '+ a.substring(0,a.length-2);
                }
            }
        }
        document.querySelector('button[class="notification-button"]').addEventListener('mouseover',function(){
            const button = document.querySelector('.notification-button');
            const tooltip = document.querySelector('.tooltip');
            const buttonRect = button.getBoundingClientRect(); // Obter a posição do botão na tela
            // Calcular a posição da tooltip
            tooltip.style.visibility = 'visible';
            // Posicionar a tooltip 5px à direita do botão
            tooltip.style.top = `${buttonRect.top + window.scrollY + buttonRect.height + 5}px`; // 5px abaixo do botão
            tooltip.style.left = `${buttonRect.right + window.scrollX + 50}px`; // 5px à direita do botão

        });
        document.querySelector('button[class="notification-button"]').addEventListener('mouseout',function(){
            document.querySelector('div[class="tooltip"]').style.visibility="hidden";
        });

        document.querySelector('button[class="notification-button"]').addEventListener('click',function(){
            // Usando a API de Clipboard
            navigator.clipboard.writeText(sessionStorage.getItem('qap') || '').then(() => {
                console.log('copiado')
            }).catch(err => {
                console.log('Falha ao copiar: ' + err);
            });;
        });
    }


}, 100);


