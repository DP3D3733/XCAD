main();

async function main() {
    const scriptAtivo = await conferirAtivacaoScript();

    if (!scriptAtivo) return;

    inserirBotaoGirarImagem();
    iniciarEscutaFloatingMenu();
    iniciarEscutaMensagensBackground();
}

async function conferirAtivacaoScript() {
    if (!location.href.includes("web.whatsapp.com")) return false;

    // Retorna uma Promise para aguardar a leitura assíncrona do chrome.storage
    return new Promise((resolve) => {
        chrome.storage.local.get(["ativa", "WhatsApp"], (data) => {
            // Verifica 'ativa'
            if (data.ativa === false) {
                return resolve(false);
            }

            // Verifica 'WhatsApp'
            if (data.WhatsApp === 'desativado') {
                return resolve(false);
            }

            // Se passou em todas as checagens, o script está ativo
            resolve(true);
        });
    });
}

function extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
};

function inserirBotaoGirarImagem() {
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
}



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

function iniciarEscutaFloatingMenu() {
    let isHoveringMenu = false;
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
}



function base64ToFile(base64, filename, mimeType) {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], filename, { type: mimeType });
}

async function colarImagemWhatsWeb(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "imagem.png", { type: blob.type || "image/png" });

    const chatInput = document.querySelector('div[contenteditable="true"][data-tab="10"]');

    if (!chatInput) {
        console.error("Caixa de conversa não encontrada. Abra um chat primeiro.");
        return false;
    }

    chatInput.focus();

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
    });

    chatInput.dispatchEvent(pasteEvent);
    return true;
}

async function confirmarEnvioImagem() {
    // Aguarda o botão de envio dentro do modal de pré-visualização de imagem
    await new Promise(resolve => setTimeout(resolve, 600));

    // Seletor do botão verde de enviar mídia no WhatsApp Web
    const botaoEnviarMidia = document.querySelector('span[data-icon="send"]') ||
        document.querySelector('div[aria-label="Enviar"]');

    if (botaoEnviarMidia) {
        botaoEnviarMidia.click();
        return true;
    }
    return false;
}

async function enviarTextoCaixaPrincipal(texto) {
    const caixaTexto = document.querySelector('div[contenteditable="true"][data-tab="10"]');

    if (!caixaTexto) {
        console.error("Caixa de texto principal não encontrada.");
        return;
    }

    caixaTexto.focus();

    // 1. Limpa entidades HTML (&nbsp;) e normaliza quebras de linha
    const textoLimpo = texto
        .replace(/&nbsp;/g, ' ')
        .trim();

    // 2. Converte quebras de linha (\n) em HTML para o editor do WhatsApp reconhecer
    const htmlFormatado = textoLimpo
        .split('\n')
        .map(linha => linha ? `<div>${linha}</div>` : `<div><br></div>`)
        .join('');

    // 3. Injeta no clipboard como HTML e dispara o evento de cola
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/html', htmlFormatado);
    dataTransfer.setData('text/plain', textoLimpo);

    const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dataTransfer
    });

    caixaTexto.dispatchEvent(pasteEvent);

    // 4. Notifica o React do WhatsApp
    caixaTexto.dispatchEvent(new Event('input', { bubbles: true }));

    await new Promise(resolve => setTimeout(resolve, 500));

    // 5. Clica no botão de enviar
    const botaoEnviar = document.querySelector('span[data-icon="send"]');
    if (botaoEnviar) {
        botaoEnviar.click();
    }
}

function iniciarEscutaMensagensBackground() {
    // Adicionada a palavra-chave async aqui
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.action === "consultaDados") {
            try {
                // 1. Cola a imagem no chat
                const colou = await colarImagemWhatsWeb(message.imagem);

                if (colou) {
                    // 2. Clica no botão de enviar do modal de mídia
                    await confirmarEnvioImagem();

                    // 3. Aguarda o modal fechar e a imagem ser enviada (ajuste o tempo se necessário)
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // 4. Envia o texto completo na caixa principal
                    if (message.dadosConsulta) {
                        await enviarTextoCaixaPrincipal(message.dadosConsulta);
                    }
                }
            } catch (error) {
                console.error("Erro ao enviar mensagem:", error);
            }
        }
    });
}


