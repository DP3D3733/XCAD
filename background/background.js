chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.frameId !== 0) {
        // É um iframe
        const url = details.url;
        let scriptToInject = null;

        if (url.includes('https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html') || url.includes('https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/Acoes.html')) {
            scriptToInject = 'content/consultas/abas_acoes.js';
        } else if (url.includes('https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp') || url.includes('https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp')) {
            scriptToInject = 'content/consultas/pesquisa_nome.js';
        } else if (url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?") || url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?")) {
            scriptToInject = "content/consultas/dados_basicos.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?")) {
            scriptToInject = "content/consultas/ocorrencias.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg")) {
            scriptToInject = "content/consultas/img.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Dados.jsp?")) {
            scriptToInject = "content/consultas/inicio.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/Html/MenuNovo.jsp")) {
            scriptToInject = "content/consultas/menu_lateral.js";
        }
        else if (url.includes("https://secweb.intra.rs.gov.br/csi/mod-veiculo/") || url.includes("https://www.consultasintegradas.rs.gov.br/csi/mod-veiculo/")) {
            scriptToInject = "content/consultas/veiculos.js";
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
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "dados") {
        chrome.storage.local.set({ dados_consulta: message.data }, () => {
            sendResponse({ status: "ok" });
        });
        return true;
    }
    if (message.action === "imagem") {
        chrome.storage.local.set({ imagem_consulta: message.data });
        return true;
    }
    if (message.action === "banco") {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {

            const targetTab = tabs.find(tab => tab.title.includes(message.data));
            if (targetTab) {
                const url = new URL(targetTab.url);
                const rootUrl = url.origin; // pega só a raiz (https://site.com)

                chrome.tabs.update(targetTab.id, {
                    active: true,
                    url: rootUrl // vai direto pra raiz
                });
            } else {
                const bancos = { 'Sinesp Infoseg': "https://infoseg.sinesp.gov.br/infoseg2/", 'Portal BNMP': 'https://portalbnmp.pdpj.jus.br/#/pesquisa-peca' }
                chrome.tabs.create({ url: bancos[message.data] });
            }
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
    if (message.action === "verificarIndividuoSentry") {
        const dados = await ajustarDadosIndividuo(message.data);
        const individuoSentry = await verificarExistenciaIndividuoBanco(dados);
        if (individuoSentry == 'deslogado') return;
        if (!individuoSentry) return criarIndividuo(dados, message.foto);
        const bas = await buscarNumBAs(dados.CPF.replace(/\D/g, ""));
        const r = await Promise.all(
            bas.map(async numero => {
                return await buscarBO(numero, dados.CPF.replace(/\D/g, ""));
            }));
        return r;
    }

});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["content/whatsapp/whatsapp.js"],
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBag5uPzTK0sXx3nBzjGhmlmSCySO3u3_U",
    authDomain: "rotinas-8498d.firebaseapp.com",
    projectId: "rotinas-8498d",
    storageBucket: "rotinas-8498d.firebasestorage.app",
    messagingSenderId: "1053551077085",
    appId: "1:1053551077085:web:4b2dcbbeb60f9f7fee1d34"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        if (message.action === "atualizar_equipes" || message.action === "atualizar_equipamentos") {
            try {
                const [docId, valor] = message.payload.split('|');
                const registro = {};
                registro[docId] = valor;
                const data_registro = new Date();
                data_registro.setHours(0, 0, 0, 0)
                await setDoc(doc(db, "equipes", data_registro.toISOString()), registro, { merge: true });

                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ status: "erro", error: e.message });
            }
        }
        if (message.action == 'atualizar_efetivo') {
            try {
                const data_registro = new Date();
                data_registro.setHours(0, 0, 0, 0);

                await setDoc(doc(db, "efetivo", "efetivo"), {
                    "atualização": data_registro,
                    "dados": message.data
                });

                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ dados: message.data, status: "erro", error: e.message });
            }
        }
        if (message.action == 'atualizar_banco_local_efetivo') {
            try {
                const data_registro = new Date();
                data_registro.setHours(0, 0, 0, 0);


                const response = await getDoc(doc(db, "efetivo", "efetivo"));
                const dados = response.data();
                if (data_registro.getDate() != dados["atualização"].toDate().getDate()) {
                    chrome.tabs.query(
                        {},
                        tabs => {

                            let targetTab = tabs.find(tab =>
                                tab.url?.includes(
                                    "sentry.procempa.com.br"
                                )
                            );

                            if (targetTab) {

                                enviarMensagem(targetTab.id);

                                chrome.tabs.update(
                                    targetTab.id,
                                    { active: true }
                                );

                                return;
                            }

                            chrome.tabs.create(
                                {
                                    url:
                                        "https://sentry.procempa.com.br/web/",
                                    active: true
                                },
                                novaTab => {

                                    const listener = (
                                        tabId,
                                        info
                                    ) => {

                                        if (
                                            tabId === novaTab.id &&
                                            info.status === "complete"
                                        ) {

                                            chrome.tabs.onUpdated
                                                .removeListener(listener);

                                            enviarMensagem(
                                                novaTab.id
                                            );

                                        }

                                    };

                                    chrome.tabs.onUpdated
                                        .addListener(listener);

                                }
                            );

                        }
                    );

                    function enviarMensagem(tabId) {

                        chrome.tabs.sendMessage(
                            tabId,
                            {
                                action:
                                    "enviarNovaAtualizacaoEfetivo"
                            }
                        );

                    }
                }

                sendResponse({ dados: dados.dados });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ dados: message.data, status: "erro", error: e.message });
            }
        }
        if (message.action == 'enviarOSRotinas') {
            try {
                console.log(message.demanda);
                const demandas = message.demanda;
                await Promise.all(
                    Object.entries(demandas).map(([id, demanda]) =>
                        setDoc(doc(db, "os", id), demanda)
                    )
                );

                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ dados: message.data, status: "erro", error: e.message });
            }
        }
        if (message.action == 'excluirDemandaOSRotinas') {
            try {
                await deleteDoc(doc(db, "os", message.id));
                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ dados: message.data, status: "erro", error: e.message });
            }
        }
        if (message.action == 'enviarNovoAtendimento') {
            try {
                console.log(message.atendimento.id);
                await setDoc(doc(db, "chamadas", String(message.atendimento.id)), message.atendimento);

                sendResponse({ status: "ok" });
            } catch (e) {
                console.error("Erro Firebase:", e);
                sendResponse({ dados: message.data, status: "erro", error: e.message });
            }
        }

        if (message.action == 'novoAlertaCercamento') {
            const endereco = await buscarEndereco(message.endereco);
            message.atendimento.factCity = endereco.cidade;
            message.atendimento.factNeighborhood = endereco.bairro;
            message.atendimento.factStreet = endereco.rua;
            message.atendimento.factLatitude = endereco.latitude;
            message.atendimento.factLongitude = endereco.longitude;
            message.atendimento.factNumber = endereco.numero;

            const [tab] = await chrome.tabs.query({
                url: "*://cercamento.procempa.com.br/*"
            });

            if (tab) {
                await chrome.windows.update(tab.windowId, {
                    state: "normal",
                    focused: true
                });

                await chrome.tabs.update(tab.id, {
                    active: true
                });
            }
        }
    })();
    return true; // <- IMPORTANTE: garante que o canal fica aberto até o sendResponse
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "atualizar_qths") {

        const docRef = doc(db, "dados_fixos", "qth");

        getDoc(docRef)
            .then(docSnap => {
                if (docSnap.exists()) {
                    sendResponse({ dados: docSnap.data() });
                } else {
                    sendResponse({ dados: "Não há tabela de QTH!" });
                }
            })
            .catch(error => {
                sendResponse({ status: "erro", error: error.message });
            });

        return true;
    }
});

async function buscarEndereco(endereco) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(endereco)}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const item = data[0];
        const addr = item.address ?? {};

        return {
            rua: addr.road ?? null,
            numero: addr.house_number ?? null,
            bairro: addr.suburb ?? addr.neighbourhood ?? null,
            cidade: addr.city ?? addr.town ?? addr.village ?? null,
            estado: addr.state ?? null,
            cep: addr.postcode ?? null,
            latitude: item.lat,
            longitude: item.lon
        };
    } catch (err) {
        console.error("Erro ao consultar endereço:", err);

        return {
            erro: true,
            mensagem: err.message
        };
    }
}

chrome.commands.onCommand.addListener(async (command) => {
    if (command !== "pesquisarEfetivo" && command !== "pesquisarQTH") return;

    const urls = { "pesquisarEfetivo": "https://sentry.procempa.com.br/web/effectives", "pesquisarQTH": "https://www.google.com/maps/d/u/0/edit?mid=1bfLD9QS9_oIRo5AXkl9IaIpvcfDkiAw&ll=-30.00223405574897%2C-51.2272405&z=12" };

    console.log(urls[command]);

    const [targetTab] = await chrome.tabs.query({
        url: urls[command]
    });

    if (targetTab) {
        // Traz a janela para frente e ativa a aba
        await chrome.windows.update(targetTab.windowId, {
            focused: true
        });

        await chrome.tabs.update(targetTab.id, {
            active: true
        });

        if (targetTab.status === "complete") {
            enviarMensagem(targetTab.id);
        } else {
            const listener = (tabId, info) => {
                if (tabId === targetTab.id && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    enviarMensagem(targetTab.id);
                }
            };

            chrome.tabs.onUpdated.addListener(listener);
        }

        return;
    }

    // Não existe aba aberta, cria uma nova
    chrome.tabs.create(
        {
            url: urls[command],
            active: true
        },
        (novaTab) => {

            const listener = (tabId, info) => {

                if (
                    tabId === novaTab.id &&
                    info.status === "complete"
                ) {

                    chrome.tabs.onUpdated.removeListener(listener);

                    enviarMensagem(novaTab.id);

                }

            };

            chrome.tabs.onUpdated.addListener(listener);

        }
    );

    function enviarMensagem(tabId) {

        chrome.tabs.sendMessage(
            tabId,
            {
                action: "focarEfetivo"
            },
            () => {
                // Evita erro caso o content script ainda não esteja disponível
                if (chrome.runtime.lastError) {
                    console.warn(chrome.runtime.lastError.message);
                }
            }
        );

    }

});

async function ajustarDadosIndividuo(texto) {
    try {
        if (!texto.includes('CPF:')) return false;
        const dados = Object.fromEntries(
            (texto
                .replaceAll('&nbsp;', '')
                .split('BÁSICOS:*<br>')[1] || texto)
                .split('<br><br>')[0]
                .split('<br>')
                .map(linha => {
                    if (!linha.includes(':')) return ['', ''];
                    const [key, value] = linha.split(':');
                    return [
                        key.trim(),
                        value.trim().replace('   ', ' ') || ''
                    ];
                })
        );
        if (dados.CPF == '') return false;
        dados.CPF = dados.CPF.replaceAll('/', '-');
        dados.Naturalidade = (`${dados.Naturalidade.substring(0, dados.Naturalidade.length - 2)} - ${dados.Naturalidade.substr(-2)}`).toUpperCase();
        dados['Cor da pele'] = (dados['Cor da pele'].substring(0, dados['Cor da pele'].length - 1) + 'O').toUpperCase();
        if (dados['Cor da pele'] == 'PRETO') dados['Cor da pele'] = 'NEGRO';
        if (dados['Cor da pele'] == 'MULATO') dados['Cor da pele'] = 'NEGRO';
        dados.Sexo = dados.Sexo.toUpperCase();
        dados.Nacionalidade = cidadeEhDoBrasil(dados.Naturalidade) ? 'BRASIL' : '';

        return dados;
    } catch (erro) {
        console.error("Erro ao acessar área de transferência:", erro);
        return false;
    }
}

function cidadeEhDoBrasil(texto) {

    const ufs = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
        'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
        'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
        'SP', 'SE', 'TO'
    ];

    const match = texto.match(/\s-\s([A-Z]{2})$/);

    if (!match) return false;

    return ufs.includes(match[1]);
}

async function verificarExistenciaIndividuoBanco(dados) {
    if (!dados) return false;

    const cpf = dados.CPF;
    try {
        const response = await fetch(
            "https://sentry.procempa.com.br/web/individual/list",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    filters: [
                        {
                            schema: "reference.individuals",
                            id: 8,
                            name: "cpf",
                            json: "data",
                            text: "CPF",
                            checked: true,
                            defaultChecked: true,
                            inputCls: "cpf",
                            value: cpf
                        }
                    ],
                    imageMode: false,
                    photoFace: false,
                    phoneticSearch: false,
                    perPage: "9",
                    page: 1
                })
            }
        );
        console.log(response);
        if (!response) {
            console.log('deslogado')
            return 'deslogado';
        }

        const resultado = await response.json();
        const individuoExiste = resultado.data.list.total == 0 ? false : true;
        if (individuoExiste) {
            chrome.tabs.create({
                url: `https://sentry.procempa.com.br/web/individual/${dados.CPF.replace(/\D/g, "")}/edit`,
                active: false
            });
        }
        return individuoExiste;
    } catch (erro) {
        console.error("Erro ao buscar indivíduo:", erro);
        return 'deslogado';
    }


}

function base64ToFile(base64, fileName) {
    const [meta, data] = base64.split(",");
    const mime = meta.match(/:(.*?);/)[1];

    const bytes = atob(data);
    const array = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes.charCodeAt(i);
    }

    return new File([array], fileName, { type: mime });
}

async function criarIndividuo(dados, img) {

    const fd = new FormData();

    fd.append("cpf", dados.CPF);
    fd.append("name", dados.Nome);

    fd.append("rg", dados.RG || "");
    fd.append("emitterRg", "SSP");
    fd.append("criminalRg", "");
    fd.append("cnh", "");

    fd.append("socialName", "");
    fd.append("nickname", "");

    fd.append("dtBirth", dados.Nascimento || "");
    fd.append("sex", dados.Sexo || "");

    fd.append("color", dados['Cor da pele'] || "");

    fd.append("maritalStatus", "");
    fd.append("nationality", dados.Nacionalidade || "");
    fd.append("cityOfBirth", dados.Naturalidade || "");

    fd.append("mother", dados['Nome da mãe'] || "");
    fd.append("father", dados['Nome do pai'] || "");

    fd.append("height", "");
    fd.append("roleCrime", "");
    fd.append("socialNetwork", "");
    fd.append("occupation", "");
    fd.append("information", "");

    const foto = base64ToFile(img, "foto.jpg");

    fd.append("face", foto, "foto.jpg");

    fd.append("irw", "[]");
    fd.append("addresses", "[]");
    fd.append("articles", "[]");
    fd.append("phones", "[]");

    fd.append("removeImage", "false");

    try {
        const response = await fetch(
            "https://sentry.procempa.com.br/web/individual",
            {
                method: "POST",
                credentials: "include",
                body: fd
            }
        );
        const texto = await response.text();

        console.log(response.status);
        console.log(texto);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${texto}`);
        }
        chrome.tabs.create({
            url: `https://sentry.procempa.com.br/web/individual/${dados.CPF.replace(/\D/g, "")}/edit`
        });
    } catch (erro) {
        console.error("Erro ao cadastrar indivíduo:", erro);
    }
}

async function buscarEnvolvido(cpf) {
    try {
        const response = await fetch(
            `https://sentry.procempa.com.br/web/individual/get/individual/${cpf}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (response.status === 400) {
            return {
                encontrado: false,
                mensagem: "CPF não há no banco"
            };
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }

        const resultado = await response.json();
        const dados = JSON.parse(resultado.data.data);
        dados.encontrado = true;
        return dados;

    } catch (erro) {
        console.error("Erro ao buscar indivíduo:", erro);

        return {
            encontrado: false,
            mensagem: "Erro ao consultar CPF"
        };
    }
}

async function buscarNumBAs(cpf) {
    const response = await fetch(`https://sentry.procempa.com.br/web/individual/${cpf}/edit`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache"
        }
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
    }

    const html = await response.text();

    const bos = [];

    const regex = /\/web\/bos\/([\d-]+)\/edit/g;

    let match;

    while ((match = regex.exec(html)) !== null) {
        bos.push(match[1]);
    }
    console.log(bos);
    return bos;
}
async function buscarBO(numeroBO, cpf) {
    try {
        const response = await fetch(
            `https://sentry.procempa.com.br/web/bos/getBo/${numeroBO}`,
            {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "no-cache",
                    "pragma": "no-cache"
                },
                referrer: `https://sentry.procempa.com.br/web/bos/${numeroBO}/edit`
            }
        );

        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }
        const dados = await response.json();
        const natureza = JSON.parse(dados.data.reason)[0].name;
        const dataOcorrencia = JSON.parse(dados.data.data).occurrenceData.dtFact;
        const dicCondicoes = {
            'VICTIM': 'Vítima',
            'AUTHOR': 'Autor',
            'APPROACHED': 'Abordado',
            'JUVENILE_OFFENDER': 'Menor infrator',
            'ARRESTED': 'Preso'
        };
        const condicao = JSON.parse(dados.data.data).individualList.find(individuo => individuo.cpf == cpf).conditions[0];
        const condicaoFormatada = dicCondicoes[condicao] || condicao;
        const resultadoObj = {
            numeroBO,
            natureza,
            dataOcorrencia,
            condicaoFormatada
        };
        console.log(resultadoObj);
        return resultadoObj;
    } catch (erro) {
        console.error("Erro ao buscar BO:", erro);
        return null;
    }
}


