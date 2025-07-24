chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.frameId !== 0) {
        // É um iframe
        const url = details.url;
        let scriptToInject = null;

        if (url.includes('https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html') || url.includes('https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html')) {
            scriptToInject = 'consultas_integradas_tjrs_abas_acoes.js';
        } else if (url.includes('https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp') || url.includes('https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp')) {
            scriptToInject = 'consultas_integradas_tjrs_pesquisanome.js';
        } else if (url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?") || url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?")) {
            scriptToInject = "consultas_integradas_tjrs_copiar_dados_basicos.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?")) {
            scriptToInject = "consultas_integradas_tjrs_copiar_resultados_ocorrencias.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg")) {
            scriptToInject = "consultas_integradas_tjrs_img.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?")) {
            scriptToInject = "consultas_integradas_tjrs_inicio.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp")) {
            scriptToInject = "consultas_integradas_tjrs_menu_lateral.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/mod-veiculo/") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/mod-veiculo/")) {
            scriptToInject = "consultas_integradas_tjrs_veiculos.js";
        }

        if (scriptToInject) {
            await chrome.scripting.executeScript({
                target: { tabId: details.tabId, frameIds: [details.frameId] },
                func: (file) => {
                    const script = document.createElement('script');
                    script.src = chrome.runtime.getURL(file);
                    document.head.appendChild(script);
                },
                args: [scriptToInject]
            });
        }
    }
}, { url: [{ urlMatches: '.*' }] });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "dados") {
        chrome.storage.local.set({ dados_consulta: message.data }, () => {
            sendResponse({ status: "ok" });
        });
        return true;
    }
    if (message.action === "imagem") {
        chrome.storage.local.set({ imagem_consulta: message.data }, () => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const targetTab = tabs.find(tab => tab.title.includes('Portal BNMP'));
                if (targetTab) {
                    chrome.tabs.update(targetTab.id, { active: true }, () => {
                        chrome.tabs.reload(targetTab.id); // Recarrega a aba após ativá-la
                    });
                } else {
                    chrome.tabs.create({ url: "https://portalbnmp.cnj.jus.br/" });
                }
            });
        });
        return true;
    }
    if (message.action === "consulta") {
        const keyword = "Consultas Integradas";
        chrome.storage.local.set({ pedido_consulta: message.data }, () => {
            sendResponse({ status: "ok" });
        });
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            const targetTab = tabs.find(tab => tab.title.includes(keyword));
            if (targetTab) {
                chrome.tabs.update(targetTab.id, { active: true }, () => {
                    chrome.tabs.reload(targetTab.id); // Recarrega a aba após ativá-la
                });
            } else {
                chrome.tabs.create({ url: "https://www.consultasintegradas.rs.gov.br/csi/index.jsp" });
            }
        });
        return true;
    }
    if (message.action === "retorna_consulta") {
        chrome.storage.local.set({ status_consulta: 'pronto' }, () => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const targetTab = tabs.find(tab => tab.title.includes('WhatsApp'));
                if (targetTab) {
                    chrome.tabs.update(targetTab.id, { active: true });
                }
            });
        });
    }
    if (message.action === "status_consulta") {
        chrome.storage.local.get('status_consulta', (data) => {
            sendResponse(data['status_consulta']);
            chrome.storage.local.remove('status_consulta');
        });
        return true; // necessário para resposta assíncrona
    }
    if (message.action === "imagem_consulta") {
        chrome.storage.local.get('imagem_consulta', (data) => {
            sendResponse(data['imagem_consulta']);
            chrome.storage.local.remove('imagem_consulta', (data) => {
        });
        });
        return true; // necessário para resposta assíncrona
    }
    if (message.action === "dados_consulta") {
        chrome.storage.local.get('dados_consulta', (data) => {
            sendResponse(data['dados_consulta']);
            chrome.storage.local.remove('dados_consulta', (data) => {
            });
        });
        return true; // necessário para resposta assíncrona
    }
    if (message.action === "remover_imagem_consulta") {
        chrome.storage.local.remove('imagem_consulta', (data) => {
            chrome.storage.local.remove('dados_consulta', (data) => {
            });
        });
        return true; // necessário para resposta assíncrona
    }

});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["monitor_consulta_ceic.js"],
    });
});


