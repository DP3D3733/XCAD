async function buscarConsulta(dados) { //primeiro consulta pelo CPF, caso não ache, consulta por Nome, Mãe e Nascimento
    const estaLogado = await verificarLoginConsultasIntegradas();
    if (!estaLogado) {
        abrirAbaConsultas();
        return 'deslogado';
    }

    const cpf = dados.cpf;
    let individuoHtml = await buscarListaIndividuosPorCPF(cpf);

    if (!individuoHtml) { //caso não exista indivíduo com esse CPF
        console.log('CPF não cadastrado');
        const nome = dados.nome.replaceAll(' ', '+');
        const mae = dados.mae.replaceAll(' ', '+');
        const nascimento = dados.Nascimento.replaceAll('/', '%2F');
        individuoHtml = await buscarListaIndividuosPorNome(nome, mae, nascimento);

    }

    if (!individuoHtml) {
        console.log('Nome não cadastrado');
        const bas = await buscarDadosSentry(dados);
        return bas;
    }

    const individuoObj = normalizarDadosIndividuo(individuoHtml);
    console.log(individuoObj);

    const dadosBasicosHtml = await buscarDadosBasicos(individuoObj.ig);

    const dadosBasicosObj = normalizarDadosBasicos(dadosBasicosHtml);
    dadosBasicosObj.cpf = dados.cpf;

    const ocorrenciasHtml = await buscarOcorrencias(individuoObj.ig);
    const ocorrenciasObj = extrairOcorrencias(ocorrenciasHtml);

    const imagem = await buscarImagem(individuoObj.rg);

    const bas = await buscarDadosSentry(dadosBasicosObj, imagem);


    const consultaPronta = {
        basicos: dadosBasicosObj,
        ocorrencias: ocorrenciasObj,
        foto: imagem,
        bas: bas
    }
    console.log(consultaPronta);

    return consultaPronta;
}

async function buscarDadosSentry(dadosBasicosObj, imagem) {
    const dadosSentry = ajustarDadosIndividuo(dadosBasicosObj);
    console.log(dadosSentry);
    const individuoSentry = await verificarExistenciaIndividuoBanco(dadosSentry);
    if (individuoSentry == 'deslogado') return;
    if (!individuoSentry) {
        criarIndividuo(dadosSentry, imagem);
        return
    }
    const bas = await buscarNumBAs(dadosSentry.CPF.replace(/\D/g, ""));
    const respBas = await Promise.all(
        bas.map(async numero => {
            return await buscarBO(numero, dadosSentry.CPF.replace(/\D/g, ""));
        }));
    return respBas;
}

async function verificarLoginConsultasIntegradas() {
    try {
        const resposta = await fetch(
            "https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo-Pesquisa.jsp",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            }
        );

        console.log("Status:", resposta.status);
        console.log("URL final:", resposta.url);

        if (!resposta.ok) {
            return false;
        }

        const html = await resposta.text();
        // Ajuste esses testes conforme o comportamento real do sistema
        if (
            html.includes("Individuo-Pesquisa") ||
            html.includes("Pesquisa")
        ) {
            return true;
        }

        return false;

    } catch (erro) {
        console.error("Erro ao verificar login:", erro);
        return false;
    }

}

async function buscarListaIndividuosPorCPF(cpf) {
    const response = await fetch(
        `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?TR=on&N_cpf=${cpf}&acao=cpf`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const buffer = await response.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");

    const html = decoder.decode(buffer);

    if (html.includes('value="login"')) return abrirAbaConsultas();
    if (html.includes('*CPF inv')) return false;
    if (html.includes('Não existe indivíduo com os critérios informados!</td>')) return false;

    return html;

}

async function buscarListaIndividuosPorNome(nome, mae, nascimento) {
    const response = await fetch(
        `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?TR=on&A66_nome=${nome}&A33_pai=&A33_mae=${mae}&A10_dn1=${nascimento}&A10_dn2=&acao=nome`,
        {
            method: "GET",
            credentials: "include"
        }

    );
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");

    const html = decoder.decode(buffer);

    if (html.includes('value="login"')) return abrirAbaConsultas();
    if (!html.includes("parent.oAcoes.escreveSubTitulo(' - Recuperou <b>")) return false;
    if (html.includes('Não existe indivíduo com os critérios informados!</td>')) return false;

    return html;
}

function normalizarDadosIndividuo(html) {
    const resultado = {};

    const nome = html.match(
        /<a href='\+ urlpesq \+'>([^<]+)<\/a>/
    );

    const filiacao = html.match(
        /<\/a>","([^"]+)"/
    );

    const sexo = html.match(
        /","([^"]+)","(\d{2}\/\d{2}\/\d{4})","([^"]+)"/
    );

    if (nome) {
        resultado.nome = nome[1].trim();
    }

    if (filiacao) {
        resultado.filiacao = filiacao[1]
            .replace(/<br>/gi, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/\s+/g, " ")
            .trim()
            .split(" ");
    }

    if (sexo) {
        resultado.sexo = sexo[1].trim();
        resultado.dataNascimento = sexo[2].trim();
        resultado.cpf = sexo[3]
            .replace(/\D/g, "");
    }

    // RG
    const rg = html.match(
        /N10_rg=(\d+)/
    );

    if (rg) {
        resultado.rg = rg[1];
    }

    // IG
    const ig = html.match(
        /N8_ig=(\d+)/
    );

    if (ig) {
        resultado.ig = ig[1];
    }
    return resultado;
}

function normalizarDadosBasicos(html) {

    function obterValor(rotulo) {
        const regex = new RegExp(
            rotulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '\\s*:?\\s*<span[^>]*class=["\']LabelVisSecund["\'][^>]*>(.*?)</span>',
            'is'
        );

        const match = html.match(regex);

        if (!match) return null;

        return match[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/\s+/g, ' ')
            .trim();
    }

    return {
        rg: obterValor('RG/RS') || obterValor('RG'),
        nome: obterValor('Nome'),
        nomeSocial: obterValor('Nome Social'),
        paiMae: obterValor('Pai/Mãe'),
        naturalidade: obterValor('Naturalidade'),
        dataNascimento: obterValor('Data Nascimento'),
        docOrigem: obterValor('Doc.Origem'),
        matricula: obterValor('Matrícula'),
        cpf: obterValor('CPF').replace('/', '-'),
        pisPasep: obterValor('PIS/PASEP'),
        altura: obterValor('Altura'),
        corPele: obterValor('Cor pele'),
        corOlhos: obterValor('Cor olhos'),
        tatuagens: obterValor('Tatuagens'),
        inquerito: obterValor('Inquérito'),
        tc: obterValor('TC'),
        endereco: obterValor('Endereço'),
        bairro: obterValor('Bairro'),
        municipioUf: obterValor('Município / UF'),
        nacionalidade: obterValor('Nacionalidade'),
        sexo: obterValor('Sexo'),
        estadoCivil: obterValor('Est. Civil'),
        digitais: obterValor('Digitais'),
        secao: obterValor('Seção')
    };
}

async function buscarDadosBasicos(ig) {
    const url = "https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp";

    // 1. Monta o corpo da requisição no formato form-urlencoded
    const bodyParams = new URLSearchParams({
        "N8_ig": ig,
        "N10_rg": "",
        "N_rgCpf": "",
        "N1_tp_cons_rgig": "1",
        "A1_cond": "N",
        "A1_ocor": "S",
        "A1_pp": "S",
        "N4_nropag": "1"
    });

    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "accept-language": "pt-BR,pt;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "pragma": "no-cache",
            "sec-fetch-dest": "frame",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin"
        },
        referrer: `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?N8_ig=${encodeURIComponent(ig)}`,
        body: bodyParams.toString(),
        mode: "cors",
        credentials: "include"
    });

    if (!resposta.ok) {
        throw new Error(`Erro na consulta CSI: HTTP ${resposta.status}`);
    }

    const buffer = await resposta.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");

    return decoder.decode(buffer);
}

async function buscarOcorrencias(ig) {
    const url =
        `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Ocorrencia_NEW.jsp?N8_ig=${encodeURIComponent(ig)}`;

    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const decoder = new TextDecoder("windows-1252");
    const dados = decoder.decode(buffer);
    return dados;


}

function extrairOcorrencias(html) {
    const ocorrenciasCruas = html.split(
        `parametros = '?N_orgao`);
    const ocorrencias = ocorrenciasCruas.map(item => {
        if (!item.match(/ration:none">([^<]+)<\/td>/)) return null;
        const qualificacao = item.match(/ration:none">([^<]+)<\/td>/)[1];
        const tipificacao = item.match(/<br>&nbsp;&nbsp;([^<]+)"\)\);/i)?.[1].trim();
        const data = item.match(/\b\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\b/)?.[0];
        return { qualificacao, tipificacao, data };
    }).filter(Boolean);
    return ocorrencias;
}


function limparHtml(texto) {
    return texto
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

async function buscarImagem(rg) {
    // 1. Ajuste no parâmetro chave para incluir a estrutura correta ("1P2")
    const url = `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Imagem.jsp?modulo=IND&chave=${encodeURIComponent(rg)}1P2`;

    // 2. Referrer dinâmico exigido pela validação da sessão do sistema
    const referrerUrl = `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_Imagem2_NEW.jsp?N10_rg=${encodeURIComponent(rg)}&A1_tipo=1&acao=consulta&funcao=apos2006`;

    const resposta = await fetch(url, {
        method: "GET",
        headers: {
            "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "image",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        referrer: referrerUrl,
        credentials: "include",
        cache: "no-store"
    });

    if (!resposta.ok) {
        throw new Error(`Erro ao buscar imagem: HTTP ${resposta.status}`);
    }

    // 3. Validação do tipo do conteúdo retornado
    const contentType = resposta.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
        return null;
    }

    const blob = await resposta.blob();
    return await blobParaBase64(blob);
}

function blobParaBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
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
let TABID;
let MODALID;
function abrirAbaConsultas() {// Seu fluxo principal:
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const targetTab = tabs.find(tab => tab.title && tab.title.includes('CSI - Consultas'));
        const dados = { mensagem: "Consulta realizada", horario: new Date().toLocaleTimeString() };

        if (targetTab) {
            chrome.tabs.update(targetTab.id, { active: true }, () => {
                injetarConteudo(targetTab.id, dados);
                chrome.tabs.reload(targetTab.id); // Recarrega a aba
            });
        } else {
            chrome.tabs.create({ url: "https://www.consultasintegradas.rs.gov.br/csi/index.jsp" }, (novaTab) => {
                injetarConteudo(novaTab.id, dados);
            });
        }
    });
}

function injetarConteudo(tabId) {
    const listener = (id, changeInfo) => {
        if (id === tabId && changeInfo.status === "complete") {
            // Remove o listener para não rodar novamente em navegações futuras
            chrome.tabs.onUpdated.removeListener(listener);

            // Injeta o script na página
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: () => {
                    // CÓDIGO EXECUTADO NO CONTEXTO DA PÁGINA (DOM)
                    // Exemplo: inserindo um texto ou preenchendo um campo
                    const container = document.body;
                    if (container) {
                        localStorage.setItem('retornarInfoseg', true);
                    }
                }
            });
        }
    };

    chrome.tabs.onUpdated.addListener(listener);
}

function ajustarDadosIndividuo(texto) {
    try {
        if (!texto.cpf && !texto.includes('CPF:')) return false;
        let dados;
        if (!texto.cpf) dados = Object.fromEntries(
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

        if (texto.cpf) dados = {
            ...texto,
            CPF: texto.cpf,
            Naturalidade: texto.naturalidade,
            'Cor da pele': texto.corPele,
            Sexo: texto.sexo,
            Nacionalidade: texto.nacionalidade
        }
        if (dados.CPF == '') return false;
        dados.CPF = dados.CPF.replaceAll('/', '-');
        dados.Naturalidade = dados.Naturalidade ? (`${dados.Naturalidade.substring(0, dados.Naturalidade.length - 2)} - ${dados.Naturalidade.substr(-2)}`).toUpperCase() : '';
        dados['Cor da pele'] = dados['Cor da pele'] ? (dados['Cor da pele'].substring(0, dados['Cor da pele'].length - 1) + 'O').toUpperCase() : '';
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
    const cpf = dados.CPF || dados.cpf;
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
        if (!response) {
            console.log('deslogado')
            return 'deslogado';
        }

        const resultado = await response.json();
        const individuoExiste = resultado.data.list.total == 0 ? false : true;
        if (individuoExiste) {
            chrome.tabs.create({
                url: `https://sentry.procempa.com.br/web/individual/${cpf.replace(/\D/g, "")}/edit`,
                active: false
            });
        }
        return individuoExiste;
    } catch (erro) {
        console.error("Erro ao buscar indivíduo:", erro);
        return 'deslogado';
    }


}

async function criarIndividuo(dados, img) {

    const fd = new FormData();
    const cpf = dados.CPF || dados.cpf;
    fd.append("cpf", cpf);
    fd.append("name", dados.Nome || dados.nome);

    fd.append("rg", dados.RG || dados.rg || "");
    fd.append("emitterRg", "SSP");
    fd.append("criminalRg", "");
    fd.append("cnh", "");

    fd.append("socialName", "");
    fd.append("nickname", "");

    fd.append("dtBirth", dados.Nascimento || dados.dataNascimento || "");
    fd.append("sex", dados.Sexo || dados.sexo || "");

    fd.append("color", dados['Cor da pele'] || dados.corPele || "");

    fd.append("maritalStatus", "");
    fd.append("nationality", dados.Nacionalidade || dados.nacionalidade || "");
    fd.append("cityOfBirth", dados.Naturalidade || dados.municipioUf || "");

    fd.append("mother", dados.mae || dados['Nome da mãe'] || dados.paiMae?.split('/')?.[1] || "");
    fd.append("father", dados['Nome do pai'] || dados.paiMae?.split('/')?.[0] || "");

    fd.append("height", "");
    fd.append("roleCrime", "");
    fd.append("socialNetwork", "");
    fd.append("occupation", "");
    fd.append("information", "");
    if (img) {
        const foto = base64ToFile(img, "foto.jpg");

        fd.append("face", foto, "foto.jpg");
    }


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
            url: `https://sentry.procempa.com.br/web/individual/${cpf.replace(/\D/g, "")}/edit`,
            active: false
        });
    } catch (erro) {
        console.error("Erro ao cadastrar indivíduo:", erro);
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
            'ARRESTED': 'Preso',
            'ASCERTAINED': 'Averiguado',
            'REQUESTER': 'Solicitante'
        };
        const condicao = JSON.parse(dados.data.data).individualList.find(individuo => individuo.cpf == cpf).conditions[0];
        const condicaoFormatada = dicCondicoes[condicao] || condicao;
        const resultadoObj = {
            numeroBO,
            natureza,
            dataOcorrencia,
            condicaoFormatada
        };
        return resultadoObj;
    } catch (erro) {
        console.error("Erro ao buscar BO:", erro);
        return null;
    }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "consultarIndividuo") {
        TABID = sender.tab.id;
        MODALID = message.modalId
        buscarConsulta(message.dados)
            .then((dados) => {
                if (sender.tab && sender.tab.id) {
                    if (dados == 'deslogado') return;
                    if (!dados.basicos) {
                        return chrome.tabs.sendMessage(
                            sender.tab.id, // <-- Correção aqui
                            {
                                action: "respostaConsultarIndividuo",
                                sucesso: false,
                                bas: dados.bas,
                                modalId: message.modalId
                            }
                        );
                    }
                    chrome.tabs.sendMessage(
                        sender.tab.id, // <-- Correção aqui
                        {
                            action: "respostaConsultarIndividuo",
                            sucesso: true,
                            dados: dados,
                            modalId: message.modalId
                        }
                    );
                }
            })
            .catch((erro) => {
                console.error(erro);

                chrome.tabs.sendMessage(
                    sender.tab.id, // <-- Correção aqui
                    {
                        action: "respostaConsultarIndividuo",
                        sucesso: false,
                        erro: erro.message,
                        modalId: message.modalId
                    }
                );
            });

        return true;
    }

    if (message.action === "retornarInfoseg") {
        chrome.tabs.sendMessage(
            TABID,
            {
                action: "refazerSolicitacao",
                modalId: MODALID
            }
        );
        chrome.tabs.update(TABID, { active: true });

    }

    if (message.action === "verificarIndividuoSentry") {
        buscarDadosSentry(message.data, message.foto)
            .then((dados) => {
                chrome.tabs.sendMessage(
                    sender.tab.id, // <-- Correção aqui
                    {
                        action: "respostaIndividuoSentry",
                        sucesso: true,
                        dados: dados
                    }
                );
            });
    }
});
