if (location.href.includes("web.whatsapp.com")) {

    chrome.storage.local.get("ativa", (data) => {
        if (data.ativa === false) return;
        chrome.storage.local.get("WhatsApp", (d) => {
            if (d['WhatsApp'] == 'desativado') return;
            function extractContent(s) {
                var span = document.createElement('span');
                span.innerHTML = s;
                return span.textContent || span.innerText;
            };
            var a = [];
            var mensagens_novas = [];
            var mensagens_antigas = [];
            /* const texto_rapido_interval = setInterval(() => {
                 const input = document.querySelector('div[aria-placeholder="Digite uma mensagem"]');
                 if (input && !input.getAttribute('texto_rapido')) {
                     input.setAttribute('texto_rapido', 'sim');
 
                     input.addEventListener('input', function () {
                         setTimeout(() => { // aguarda o Lexical atualizar o texto
                             const texto = input.innerText.trim();
                             const sugestao = 'Positivo';
 
                             for (let index = 0; index < sugestao.length; index++) {
                                 if (texto.endsWith(sugestao.substring(0, index + 1))) {
                                     const restante = sugestao.substring(index + 1);
                                     if (restante.length > 0) {
                                         document.execCommand('insertText', false, restante);
 
                                         // Seleciona o texto sugerido
                                         setTimeout(() => {
                                             const span = input.querySelector('span');
                                             if (!span) return;
                                             const textNode = span.firstChild;
                                             if (!textNode) return;
 
                                             const range = document.createRange();
                                             const selection = window.getSelection();
 
                                             range.setStart(textNode, index + 1);
                                             range.setEnd(textNode, textNode.length);
 
                                             selection.removeAllRanges();
                                             selection.addRange(range);
                                         }, 10);
                                     }
                                     break;
                                 }
                             }
                         }, 100); // ← atraso mínimo (0 ms já basta)
                     });
                 }
             }, 1000);*/

            setInterval(() => {
                if (document.querySelector('button[aria-label="Menos zoom"]') && !document.querySelector('#girarDireita')) {
                    const button = document.createElement('button');
                    button.setAttribute('id', 'girarDireita');
                    button.setAttribute('angulo', 0);
                    button.addEventListener('click', function () {
                        const angulo = parseInt(this.getAttribute('angulo')) + 90;
                        this.setAttribute('angulo', angulo);
                        const img = document.querySelector('[draggable="true"]').parentNode.parentNode.parentNode.parentNode;
                        img.style.transform = `rotate(${angulo}deg)`;
                        img.style.transition = "transform 0.3s ease";
                    })
                    const fundo = document.body.classList.contains('dark') ? '#ffffffff' : '#000000';
                    button.innerHTML = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="22.000000pt" height="22.000000pt" viewBox="0 0 512.000000 512.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
fill="${fundo}" stroke="">
<path d="M821 4674 c-182 -49 -343 -217 -380 -396 -8 -37 -11 -434 -9 -1318
l3 -1265 22 -60 c64 -169 211 -299 384 -340 95 -22 1213 -22 1308 0 93 22 177
71 251 145 74 74 123 158 145 251 22 96 22 2492 0 2588 -45 190 -197 346 -385
396 -81 22 -1259 21 -1339 -1z m1337 -223 c68 -31 144 -113 169 -183 17 -50
18 -116 18 -1288 l0 -1235 -26 -55 c-37 -80 -81 -125 -157 -162 l-67 -33 -595
0 c-551 0 -599 1 -648 18 -70 25 -152 101 -183 169 l-24 53 0 1255 0 1255 25
50 c43 86 125 154 215 176 17 4 298 7 625 6 l595 -2 53 -24z"/>
<path d="M3245 4671 c-49 -31 -453 -444 -465 -475 -23 -60 -9 -79 224 -314
121 -123 233 -230 248 -238 73 -38 158 6 158 81 0 20 -5 46 -11 58 -6 12 -66
77 -132 145 l-122 122 322 0 c273 0 328 -2 373 -17 65 -21 142 -89 178 -157
l27 -51 3 -340 3 -340 -123 121 c-68 67 -133 127 -145 133 -12 6 -38 11 -58
11 -75 0 -119 -85 -81 -158 8 -15 115 -127 238 -248 235 -233 254 -247 314
-224 33 13 458 430 480 472 38 72 -6 158 -81 158 -20 0 -46 -5 -58 -11 -12 -6
-77 -65 -144 -132 l-121 -120 -4 339 c-4 290 -7 347 -22 394 -58 180 -186 308
-366 366 -47 15 -104 18 -394 22 l-339 4 120 121 c67 67 126 132 132 144 35
69 -12 153 -86 153 -21 0 -51 -9 -68 -19z"/>
<path d="M2824 2541 c-44 -27 -60 -77 -41 -124 26 -61 45 -67 199 -67 80 0
147 5 162 11 60 28 71 122 20 170 -24 23 -33 24 -167 27 -127 2 -145 1 -173
-17z"/>
<path d="M3464 2541 c-44 -27 -60 -77 -41 -124 26 -61 45 -67 199 -67 80 0
147 5 162 11 60 28 71 122 20 170 -24 23 -33 24 -167 27 -127 2 -145 1 -173
-17z"/>
<path d="M4104 2541 c-43 -26 -60 -78 -41 -123 20 -49 38 -59 129 -75 168 -29
263 -127 287 -298 11 -78 36 -111 89 -121 45 -9 96 18 113 57 16 40 7 150 -20
224 -70 196 -253 336 -460 351 -54 4 -72 2 -97 -15z"/>
<path d="M4543 1695 c-55 -24 -65 -58 -61 -215 3 -130 4 -140 27 -164 48 -51
142 -40 170 20 6 15 11 82 11 162 0 154 -6 173 -66 198 -40 17 -41 17 -81 -1z"/>
<path d="M1343 1055 c-61 -26 -76 -94 -48 -211 47 -199 192 -348 390 -400 61
-17 146 -18 179 -3 36 17 60 68 52 111 -10 53 -43 78 -121 89 -171 24 -269
119 -298 287 -16 91 -27 109 -74 129 -39 16 -40 16 -80 -2z"/>
<path d="M4543 1055 c-40 -17 -58 -53 -67 -129 -8 -69 -55 -165 -99 -202 -49
-41 -122 -73 -184 -80 -77 -9 -111 -28 -129 -71 -12 -27 -13 -42 -4 -69 18
-52 53 -74 119 -74 266 0 511 244 511 510 0 65 -17 96 -66 116 -40 17 -41 17
-81 -1z"/>
<path d="M2184 621 c-44 -27 -60 -77 -41 -124 26 -61 45 -67 199 -67 80 0 147
5 162 11 60 28 71 122 20 170 -24 23 -33 24 -167 27 -127 2 -145 1 -173 -17z"/>
<path d="M2824 621 c-44 -27 -60 -77 -41 -124 26 -61 45 -67 199 -67 80 0 147
5 162 11 60 28 71 122 20 170 -24 23 -33 24 -167 27 -127 2 -145 1 -173 -17z"/>
<path d="M3464 621 c-44 -27 -60 -77 -41 -124 26 -61 45 -67 199 -67 80 0 147
5 162 11 60 28 71 122 20 170 -24 23 -33 24 -167 27 -127 2 -145 1 -173 -17z"/>
</g>
</svg>`;
                    document.querySelector('button[aria-label="Menos zoom"]').parentNode.parentNode.insertAdjacentElement('beforeBegin', button);

                }
            }, 1000);

            const whats_interval = setInterval(function () {
                if (Array.from(document.querySelectorAll('li')).filter((li) => li.innerText.includes('Responder em particular')).length > 0 && !document.querySelector('div[aria-label="qap"]') && document.querySelector('div[aria-label="Menu de contexto"]')) {
                    let mensagem = document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.parentNode.innerText;
                    let gus_extenso = ['CRUZEIRO', 'PARTENON', 'LESTE', 'RESTINGA', 'NORTE', 'BALTAZAR', 'PINHEIRO', 'SUL', 'CENTRO', 'ROMU'];
                    let gus_numero = ['21', '31', '41', '51', '61', '71', '81', '91', 'C1', 'R1', 'PATAM'];
                    let possiveis_gus = [];
                    if (mensagem) {
                        gus_numero.forEach(function (item) {
                            if (mensagem.toUpperCase().includes(item)) {
                                possiveis_gus.push(item);
                            }
                        });
                        gus_extenso.forEach(function (item) {
                            if (mensagem.toUpperCase().includes(item)) {
                                possiveis_gus.push(gus_numero[gus_extenso.indexOf(item)]);
                            }
                        });
                        possiveis_gus.push('Definir Gu');
                        possiveis_gus.forEach(function (item) {
                            let but_qap = '<li tabindex="0" class="_aj-r _aj-q _aj-_ false false" data-animate-dropdown-item="true" role="button" style="opacity: 1;"><div class="_aj-z _aj-t _alxo" aria-label="qap" style="">QAP ' + item + '</div></li>';
                            Array.from(document.querySelectorAll('li')).filter((li) => li.innerText.includes('Responder em particular'))[0].parentNode.insertAdjacentHTML("beforebegin", but_qap);
                        });
                    }

                }
                if (document.querySelector('div[aria-label="qap"]:not([com_event_listener])')) {
                    let but_qap = document.querySelector('div[aria-label="qap"]:not([com_event_listener])')
                    but_qap.setAttribute('com_event_listener', '');
                    but_qap.parentNode.addEventListener('click', function () {
                        let horario = document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.querySelectorAll('span[dir=auto]')[document.querySelector('div[aria-label="Menu de contexto"]').parentNode.parentNode.parentNode.querySelectorAll('span[dir=auto]').length - 1].innerText.replaceAll('Editada', '');
                        let gu;
                        if (this.innerText.includes('Definir')) {
                            gu = prompt('Defina a Gu escrevendo: 21, 31, 41, 51, 61, 71, 81, 91, C1, R1 ou P1');
                        } else {
                            gu = this.innerText.split(' ')[1];
                        }
                        let gus = [];
                        if (sessionStorage.getItem('qap') && sessionStorage.getItem('qap') != '') {
                            let d = sessionStorage.getItem('qap').split('\n');
                            d.forEach(function (item) {
                                gus.push(item.split('-')[1]);
                            });
                        }
                        if (!gus.includes(gu)) {
                            sessionStorage.setItem('qap', (sessionStorage.getItem('qap') || '') + horario + '-' + gu + '\n');
                            if (sessionStorage.getItem('qap').split('\n').length == 12) {
                                document.querySelector('div[class="tooltip"]').innerHTML = 'Todas as áreas informaram terem ciência da OS!';
                            } else {
                                let gus_numero = ['21', '31', '41', '51', '61', '71', '81', '91', 'C1', 'R1', 'PATAM'];
                                let a = '';
                                gus_numero.forEach(function (item) {
                                    if (!sessionStorage.getItem('qap').toUpperCase().includes('-' + item)) {
                                        a += item + ', ';
                                    }
                                });
                                if (a != '') {
                                    document.querySelector('div[class="tooltip"]').innerHTML = 'Ainda não informou a ciência da OS: ' + a.substring(0, a.length - 2);
                                }
                            }
                            document.querySelector('span[class="notification-badge"]').innerHTML = (sessionStorage.getItem('qap').split('\n').length - 1) + '/11';
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


                    but_qap.addEventListener('mouseenter', function () {
                        but_qap.style.backgroundColor = '#f5f6f6';
                        but_qap.style.color = 'black' // Altera a cor de fundo
                    });

                    // Evento de mouse saindo da área do elemento
                    but_qap.addEventListener('mouseleave', function () {
                        but_qap.style.backgroundColor = ''; // Volta à cor original
                        but_qap.style.color = '';
                    });
                }

                if (document.querySelector('button[aria-label="Comunidades"]') && !document.querySelector('div[aria-label="num_qap"]')) {
                    let num_qap = '<div class="notification-container" style="position:relative;display:inline-block" aria-label="num_qap"><button class="notification-button" style="font-size:26px;color:white;border:none;border-radius:5px;cursor:pointer;position:relative">🕒</button><span class="notification-badge" style="position: absolute; top: -5px; right: -5px; background-color: red; color: white; font-size: 8px; font-weight: bold; border-radius: 50%; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center">0/11</span></div>';
                    document.querySelector('button[aria-label="Comunidades"]').parentNode.parentNode.parentNode.insertAdjacentHTML("afterend", num_qap);
                    let tooltip = '<div class="tooltip" style="visibility: hidden; width:fit-content; position: absolute; top: 35px; background-color: rgba(0, 0, 0, 0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; z-index: 9999">Você tem novas notificações!</div>'
                    document.body.insertAdjacentHTML("beforeend", tooltip);
                    if (sessionStorage.getItem('qap') && sessionStorage.getItem('qap') != '') {
                        document.querySelector('span[class="notification-badge"]').innerHTML = (sessionStorage.getItem('qap').split('\n').length - 1) + '/11';
                        if (sessionStorage.getItem('qap').split('\n').length == 12) {
                            document.querySelector('div[class="tooltip"]').innerHTML = 'Todas as áreas informaram terem ciência da OS!';
                        } else {
                            let gus_numero = ['21', '31', '41', '51', '61', '71', '81', '91', 'C1', 'R1', 'PATAM'];
                            let a = '';
                            gus_numero.forEach(function (item) {
                                if (!sessionStorage.getItem('qap').toUpperCase().includes('-' + item)) {
                                    a += item + ', ';
                                }
                            });
                            if (a != '') {
                                document.querySelector('div[class="tooltip"]').innerHTML = 'Ainda não informou a ciência da OS: ' + a.substring(0, a.length - 2);
                            }
                        }
                    }
                    const button = document.querySelector('.notification-button');
                    tooltip = document.querySelector('.tooltip');

                    button.addEventListener('mouseover', function () {
                        const buttonRect = button.getBoundingClientRect();

                        tooltip.style.visibility = 'visible';
                        tooltip.style.position = 'absolute'; // Garante posicionamento independente

                        // Define posição relativa ao botão:
                        tooltip.style.top = `${buttonRect.top + window.scrollY + buttonRect.height + 8}px`; // um pouco abaixo
                        tooltip.style.left = `${buttonRect.left + window.scrollX + buttonRect.width + 8}px`; // um pouco à direita
                    });

                    button.addEventListener('mouseout', function () {
                        tooltip.style.visibility = 'hidden';
                    });

                    document.querySelector('button[class="notification-button"]').addEventListener('click', function () {
                        // Usando a API de Clipboard
                        navigator.clipboard.writeText(sessionStorage.getItem('qap') || '').then(() => {
                            console.log('copiado')
                        }).catch(err => {
                            console.log('Falha ao copiar: ' + err);
                        });;
                    });
                }
                try {
                    chrome.runtime.sendMessage({ action: "status_consulta" }, (response_status_consulta) => {
                        if (response_status_consulta == 'pronto') {
                            chrome.runtime.sendMessage({ action: "imagem_consulta" }, (response_imagem_consulta) => {
                                if (response_imagem_consulta != '' && response_imagem_consulta != 'SEM IMAGENS') {
                                    chrome.runtime.sendMessage({ action: "dados_consulta" }, (response_dados_consulta) => {
                                        if (response_dados_consulta && (response_dados_consulta.includes('SEM NOVIDADES') || response_dados_consulta.includes('CONDUZIR'))) {
                                            // 1. Sua imagem em base64 (exemplo PNG)
                                            const base64Image = response_imagem_consulta;
                                            // 2. Converter para File
                                            const file = base64ToFile(base64Image, "imagem.png", "image/png");

                                            // 3. Criar um DataTransfer com esse arquivo
                                            const dt = new DataTransfer();
                                            dt.items.add(file);
                                            document.querySelector('[aria-label="Anexar"]')?.click();
                                            // 4. Encontrar o input de arquivo e simular upload
                                            const interval = setInterval(() => {
                                                const input = document.querySelector('input[type="file"][accept="image/*,video/mp4,video/3gpp,video/quicktime"]');

                                                if (input && !document.querySelector('#trava_foto')) {
                                                    a = document.createElement("div");
                                                    a.setAttribute("id", "trava_foto");
                                                    input.insertAdjacentElement('beforebegin', a);
                                                    clearInterval(interval);
                                                    input.files = dt.files;

                                                    // Disparar o evento de mudança
                                                    const event = new Event('change', { bubbles: true });
                                                    input.dispatchEvent(event);
                                                } else if (document.querySelector('#trava_foto')) {
                                                    clearInterval(interval);
                                                }
                                            }, 500);
                                            const interval_legenda = setInterval(() => {
                                                let input = document.querySelector('div[aria-placeholder="Digite uma mensagem"]');
                                                if (input && !document.querySelector('#trava_texto')) {
                                                    a = document.createElement("div");
                                                    a.setAttribute("id", "trava_texto");
                                                    input.insertAdjacentElement('beforebegin', a);
                                                    clearInterval(interval_legenda);
                                                    input.focus();

                                                    // Seleciona todo o conteúdo atual
                                                    const range = document.createRange();
                                                    range.selectNodeContents(input);
                                                    const sel = window.getSelection();
                                                    sel.removeAllRanges();
                                                    sel.addRange(range);

                                                    // Remove o conteúdo anterior
                                                    document.execCommand("delete");


                                                    const texto = response_dados_consulta
                                                        .replace(/&nbsp;/g, ' ')
                                                        .replace(/\r\n|\r/g, '\n');  // normaliza quebras para '\n'


                                                    const linhas = texto.split('\n');

                                                    linhas.forEach((linha, idx) => {
                                                        document.execCommand("insertText", false, linha.trim());
                                                        if (idx < linhas.length - 1) {
                                                            // simula Shift+Enter apenas entre as linhas
                                                            const event = new KeyboardEvent('keydown', {
                                                                key: 'Enter',
                                                                code: 'Enter',
                                                                keyCode: 13,
                                                                which: 13,
                                                                shiftKey: true,
                                                                bubbles: true,
                                                                cancelable: true,
                                                            });
                                                            input.dispatchEvent(event);
                                                        }
                                                    });


                                                } else if (document.querySelector('#trava_texto')) {
                                                    clearInterval(interval_legenda);
                                                    document.querySelector('#trava_texto').remove();
                                                }
                                            }, 500);
                                            chrome.runtime.sendMessage({ action: "remover_imagem_consulta" }, () => { });

                                        }
                                    });
                                } else if (response_imagem_consulta == 'SEM IMAGENS') {
                                    chrome.runtime.sendMessage({ action: "dados_consulta" }, (response_dados_consulta) => {
                                        if (response_dados_consulta.includes('SEM NOVIDADES') || response_dados_consulta.includes('CONDUZIR')) {
                                            const interval_legenda = setInterval(() => {
                                                let input = document.querySelector('div[aria-label="Digite uma mensagem"]');

                                                if (input) {
                                                    clearInterval(interval_legenda);
                                                    input.focus();

                                                    // Seleciona todo o conteúdo atual
                                                    const range = document.createRange();
                                                    range.selectNodeContents(input);
                                                    const sel = window.getSelection();
                                                    sel.removeAllRanges();
                                                    sel.addRange(range);

                                                    // Remove o conteúdo anterior
                                                    document.execCommand("delete");


                                                    const texto = response_dados_consulta
                                                        .replace(/&nbsp;/g, ' ')
                                                        .replace(/\r\n|\r/g, '\n');  // normaliza quebras para '\n'


                                                    const linhas = texto.split('\n');

                                                    linhas.forEach((linha, idx) => {
                                                        document.execCommand("insertText", false, linha.trim());
                                                        if (idx < linhas.length - 1) {
                                                            // simula Shift+Enter apenas entre as linhas
                                                            const event = new KeyboardEvent('keydown', {
                                                                key: 'Enter',
                                                                code: 'Enter',
                                                                keyCode: 13,
                                                                which: 13,
                                                                shiftKey: true,
                                                                bubbles: true,
                                                                cancelable: true,
                                                            });
                                                            input.dispatchEvent(event);
                                                        }
                                                    });


                                                }
                                            }, 500);
                                            chrome.runtime.sendMessage({ action: "remover_imagem_consulta" }, () => { });
                                        }
                                    });
                                }
                            });

                        }
                    });
                } catch (error) {
                    clearInterval(whats_interval);
                    console.error("Caught exception:", error);
                    window.location.reload();

                }
            }, 100);


        });
    });
    let isHoveringMenu = false;
    function createFloatingMenu(x, y, text) {
        removeFloatingMenu();

        const menu = document.createElement("div");
        menu.id = "floating-menu";
        menu.style.position = "absolute";
        menu.style.top = `${y + 30}px`;
        menu.style.left = `${x}px`;
        menu.style.background = "#fff";
        menu.style.border = "1px solid #ccc";
        menu.style.borderRadius = "8px";
        menu.style.padding = "6px 10px";
        menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        menu.style.zIndex = "9999";
        menu.style.fontSize = "14px";
        menu.innerText = `Consultar: "${text.slice(0, 30)}..."`;

        // Controla se o mouse está sobre o menu
        menu.addEventListener("mouseenter", () => isHoveringMenu = true);
        menu.addEventListener("mouseleave", () => isHoveringMenu = false);

        // Clique
        menu.addEventListener("mousedown", (e) => {
            console.log('Clicado');
            chrome.runtime.sendMessage({ action: "consulta", data: text }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Erro ao enviar mensagem:", chrome.runtime.lastError.message);
                } else {
                    console.log("Resposta recebida:", response);
                }
            });

        });

        document.body.appendChild(menu);
    }


    function removeFloatingMenu() {
        const existing = document.getElementById("floating-menu");
        if (existing) existing.remove();
    }

    document.addEventListener("selectionchange", () => {
        setTimeout(() => {
            if (isHoveringMenu) return;
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                const x = rect.left + window.scrollX;
                const y = rect.bottom + window.scrollY;

                createFloatingMenu(x, y, selectedText);
            } else {
                removeFloatingMenu();
            }
        }, 50); // Espera a seleção "assentar"
    });

    function base64ToFile(base64, filename, mimeType) {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new File([ab], filename, { type: mimeType });
    }

}


