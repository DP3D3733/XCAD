const urls = ['discover', 'cad-equipe-web', 'cad-ocorrencia-web', 'portalbnmp', 'consultasintegradas', 'secweb.intra', 'docs.google.com/forms', 'infoseg2', 'whatsapp'];
const scripts = ['CAD Discover', 'CAD Equipes', 'CAD Ocorrências', 'CNJ', 'Consultas Integradas', 'Consultas Integradas', 'Balanço de Fiscalização', 'InfoSeg', 'WhatsApp'];

for (let index = 0; index < scripts.length; index++) {
    chrome.storage.local.get([scripts[index]], (data) => {
        console.log(data[scripts[index]]);
        if (data[scripts[index]] != 'desativado') {
            chrome.storage.local.set({ [scripts[index]]:'ativado' });
        }
    })
}

const botao_ativa_extensao = document.getElementById("botao_ativa_extensao");
chrome.storage.local.get("ativa", (data) => {
    let extensao_ativa = data.ativa !== undefined ? data.ativa : false;
    if (extensao_ativa) {
        botao_ativa_extensao.style.backgroundColor = "#4CAF50";  // Cor de "ativado"
        slider.style.transform = "translateX(16px)";  // Move o slider para a direita
    } else {
        // Muda para "desativado"
        botao_ativa_extensao.style.backgroundColor = "#ccc";
        slider.style.transform = "translateX(0px)";
    }
});

// Evento de clique no botão
botao_ativa_extensao.addEventListener("click", () => {
    const isActive = botao_ativa_extensao.style.backgroundColor === "rgb(76, 175, 80)"; // Verifica a cor (ativado)

    if (isActive) {
        // Muda para "desativado"
        botao_ativa_extensao.style.backgroundColor = "#ccc";
        slider.style.transform = "translateX(0px)";
    } else {
        // Muda para "ativado"
        botao_ativa_extensao.style.backgroundColor = "#4CAF50";
        slider.style.transform = "translateX(16px)";
    }

    // Salva o estado da mudança no armazenamento local
    chrome.storage.local.set({ ativa: !isActive }, () => {
        console.log(`Extensão ${!isActive ? 'Ativada' : 'Desativada'}`);
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
    });
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const aba = tabs[0];
    const url = aba?.url || "Sem url";
    for (let index = 0; index < urls.length; index++) {
        if (url.includes(urls[index])) {
            document.querySelector('#script_atual').innerHTML = '<div style="display: flex; align-items: center; gap: 12px;"><span>' + scripts[index] + '</span><div style="width:60px"><button id="toggleBtn_script_atual" style="position: relative; width: 40px; height: 24px; background-color: rgb(76, 175, 80); border: none; border-radius: 34px; cursor: pointer; padding: 0px;"><span id="slider_script_atual" style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background-color: white; border-radius: 50%; transition: transform 0.4s; transform: translateX(16px);"></span></button></div></div>';

            const toggleBtn = document.getElementById("toggleBtn_script_atual");
            const slider = document.getElementById("slider_script_atual");

            // Verifica o estado salvo
            chrome.storage.local.get(scripts[index], (data) => {
                const isActive = data[scripts[index]];
                if (isActive == 'ativado') {
                    toggleBtn.style.backgroundColor = "#4CAF50";  // Cor de "ativado"
                    slider.style.transform = "translateX(16px)";  // Move o slider para a direita
                } else {
                    toggleBtn.style.backgroundColor = "#ccc";
                    slider.style.transform = "translateX(0px)";
                }
            });

            // Evento de clique no botão
            toggleBtn.addEventListener("click", () => {
                let isActive = '';
                if (toggleBtn.style.backgroundColor === "rgb(76, 175, 80)") {
                    isActive = 'desativado';
                } else {
                    isActive = 'ativado';
                }

                if (isActive == 'desativado') {
                    // Muda para "desativado"
                    toggleBtn.style.backgroundColor = "#ccc";
                    slider.style.transform = "translateX(0px)";
                } else {
                    // Muda para "ativado"
                    toggleBtn.style.backgroundColor = "#4CAF50";
                    slider.style.transform = "translateX(16px)";
                }

                // Salva o estado da mudança no armazenamento local
                chrome.storage.local.set({ [scripts[index]]:isActive });
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
                });
            });
            break;
        }
    }
});
