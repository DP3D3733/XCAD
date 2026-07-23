const url = window.location.href;

atualizarEfetivo();
async function atualizarEfetivo(modo) {
    if (sessionStorage.getItem('efetivoAtualizado') && !modo) return;
    const response = await fetch("https://sentry.procempa.com.br/web/effectives/list", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({
            filter: [
                {
                    field: "effective_status",
                    type: "like",
                    value: "true"
                }
            ],
            page: 1,
            size: 800,
            sort: [
                {
                    field: "name",
                    dir: "asc"
                }
            ]
        })
    });
    if (!response.ok) return;
    const dados = await response.json();
    const pessoas = dados.data.data.map(pessoa => {
        const nomeFuncional = pessoa.namewar;
        const nomeCompleto = pessoa.name;
        const lotacao = JSON.parse(pessoa.effective).sector;
        return { nomeFuncional: nomeFuncional, nomeCompleto: nomeCompleto, lotacao: lotacao };
    });
    if (modo == 'apenasSistema') return pessoas;
    window.postMessage({ type: "atualizar_efetivo", data: pessoas }, "*");
}

async function consultarIndividuoPorCPF(cpf, page = 1, perPage = 9) {
    const response = await fetch(
        "https://sentry.procempa.com.br/web/individual/list",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
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
                perPage: String(perPage),
                page
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    const dados = await response.json();
    if (dados.data.list.total == 0) return false;
    return true
}



window.addEventListener("message", event => {

    /* if (event.data?.type === "verificarConsulta") {
        const dadosIndividuo = event.data.data;
        //const possuiCadastro = await consultarIndividuoPorCPF(dadosIndividuo.cpf);
        if (!possuiCadastro) {
            sessionStorage.setItem('dadosIndividuo', dadosIndividuo.dados);
            sessionStorage.setItem('dadosIndividuoFoto', dadosIndividuo.foto);
            window.open(
                "https://sentry.procempa.com.br/web/individual/create",
                "_blank",
            );
        }
    } */

});





if (url.includes('despacho/attendance/')) {
    inserirBotaoEnviarChamadaRotinas();
}

gerarBotaoTurnoAtual();
async function buscarAtividadeProgramada(id) {
    ''

    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/schedule-garrison/${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    return data;
}

function gerarBotaoTurnoAtual() {
    const botaoPesquisar = document.getElementById("btn-search") || document.getElementById("search");
    const botaoLimpar = document.getElementById("btn-clear") || document.getElementById("clear");
    const inputDtStart = document.getElementById("dtStart") || document.getElementById("start");;
    const inputDtEnd = document.getElementById("dtEnd") || document.getElementById("end");

    if (!botaoPesquisar || !inputDtStart || !inputDtEnd) return;

    const botaoTurnoAtual = botaoLimpar.cloneNode(true);
    botaoTurnoAtual.id = "btn-turno-atual";
    botaoTurnoAtual.style['margin'] = "0px 5px 0px 5px";
    botaoTurnoAtual.title = 'Turno Atual';
    botaoPesquisar.parentNode.style.width = '120px';

    botaoTurnoAtual.innerHTML = `<i class="fas fa-clock"></i>`;

    botaoTurnoAtual.addEventListener("click", () => {
        const agora = new Date();

        const formatar = (d) => {
            const dia = String(d.getDate()).padStart(2, "0");
            const mes = String(d.getMonth() + 1).padStart(2, "0");
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        const minutos = agora.getHours() * 60 + agora.getMinutes();

        // 06:30 = 390 minutos
        // 18:30 = 1110 minutos

        if (minutos >= 390 && minutos < 1110) {
            // Turno diurno: 06:30 -> 18:30
            const data = formatar(agora);

            inputDtStart.value = `${data} 06:00`;
            inputDtStart.dispatchEvent(
                new Event('change', {
                    bubbles: true
                }));
            inputDtEnd.value = `${data} 18:30`;
            inputDtEnd.dispatchEvent(
                new Event('change', {
                    bubbles: true
                }));
        } else {
            const inicio = new Date(agora);
            const fim = new Date(agora);

            if (minutos < 390) {
                // Entre 00:00 e 06:29
                inicio.setDate(inicio.getDate() - 1);
            } else {
                // Entre 18:30 e 23:59
                fim.setDate(fim.getDate() + 1);
            }

            inputDtStart.value = `${formatar(inicio)} 18:30`;
            inputDtStart.dispatchEvent(
                new Event('change', {
                    bubbles: true
                }));
            inputDtEnd.value = `${formatar(fim)} 06:00`;
            inputDtEnd.dispatchEvent(
                new Event('change', {
                    bubbles: true
                }));
        }

        botaoPesquisar.click();
    });

    botaoLimpar.insertAdjacentElement("afterend", botaoTurnoAtual);
}

async function buscarOS(numOS) {
    const response = await fetch(
        "https://sentry.procempa.com.br/despacho/schedule-garrison/list",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filter: [
                    {
                        field: "name",
                        type: "like",
                        value: numOS
                    }
                ]
            })
        }
    );

    const data = await response.json();

    return data.data
}








async function enviarChamadaRotinas(atendimento) {

    return new Promise((resolve, reject) => {
        const chamadaProntaParaEnvio = {
            id: atendimento.id,
            solicitante: atendimento.contactName || '',
            numero: atendimento.contactPhone || '',
            situacao: atendimento.transcription || '',
            natureza: atendimento.nature || '',
            endereco: atendimento.factPlace || `${atendimento.factStreet || ''} ${atendimento.factNumber || ''}, ${atendimento.factNeighborhood || ''}`,
            atendente: atendimento.userCreated,
            setor: atendimento.sectors ? atendimento.sectors[0] : '',
            canal: atendimento.channel || '',
            data: atendimento.systemCreation
        };
        function listener(event) {
            if (event.data.type !== "enviarNovoAtendimentoResposta") {
                return;
            }

            window.removeEventListener("message", listener);

            if (event.data.status === "ok") {
                resolve(true);
            } else {
                reject(event.data.erro);
            }
        }

        window.addEventListener("message", listener);

        window.postMessage({
            type: "enviarNovoAtendimento",
            data: chamadaProntaParaEnvio
        }, "*");
    });
}
//cercamento: inserir os dados, resgatar o id do atendimento, inserir as fotos com a função abaixo
/* async function enviarAtendimentoComFoto() {
    try {
        // 1. Obtém o token e o blob da foto
        const token = await obterTokenValido(USUARIO, SENHA);
        const fotoBlob = await buscarFotoAutenticada("7131062965", token);

        // 2. Cria o objeto File
        const arquivoParaAnexo = new File([fotoBlob], "foto_reconhecimento.jpg", {
            type: fotoBlob.type || "image/jpeg"
        });

        // 3. Obtém o FormData padrão que o próprio sistema gera
        const formData = preparedData(false);

        // 4. Anexa o arquivo na chave EXATA que o backend Spring espera!
        formData.append("attachFiles", arquivoParaAnexo);

        // 5. Envia a requisição exatamente igual à função submit original do sistema
        const response = await axios.post(
            `${projectUtils.properties.DESPACHO}/attendance`,
            formData
        );

        console.log("Atendimento criado com foto com sucesso!", response.data);
        localStorage.setItem('success', 'Salvo com sucesso.');

    } catch (error) {
        console.error("Erro ao enviar atendimento:", error.response?.data || error.message);
    }
} */
async function buscarAtendimento(id) {

    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/attendance/${id}`,
        {
            method: "GET",
            credentials: "include"
        }
    );
    if (!response) return;
    const data = await response.json();

    return data;
}

async function buscarAtendimentos() {
    const response = await fetch(
        "https://sentry.procempa.com.br/despacho/attendance/list",
        {
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            body: JSON.stringify({ filter: [] }),
            method: "POST",
            credentials: "include"
        }
    );

    const data = await response.json();
    return data.data;
}


function inserirBotaoEnviarChamadaRotinas() {
    const buttonSalvarOriginal = document.querySelector("#save");
    if (!buttonSalvarOriginal) return;

    const novoButtonSalvar = buttonSalvarOriginal.cloneNode(true);
    novoButtonSalvar.setAttribute('id', 'novoButtonSalvar');
    buttonSalvarOriginal.insertAdjacentElement('beforebegin', novoButtonSalvar);
    buttonSalvarOriginal.style.display = 'none';
    localStorage.setItem('atendimentoNovo', document.querySelector('#start').value);
    novoButtonSalvar.addEventListener('click', () => {
        document.querySelector("#save").click();
    })
}

setInterval(async () => {
    const temAtendimentoNovo = localStorage.getItem('atendimentoNovo');
    if (!temAtendimentoNovo) return;
    const atendimentos = await buscarAtendimentos();
    const atendimentoNovoId = atendimentos.find(atendimento => atendimento.attendance_start == temAtendimentoNovo)?.attendance_id;
    if (!atendimentoNovoId) return;
    const atendimentoNovo = await buscarAtendimento(atendimentoNovoId);
    const dadosAtendimentoNovo = atendimentoNovo.attendance;
    dadosAtendimentoNovo.userCreated = atendimentoNovo.userCreated;
    const enviado = await enviarChamadaRotinas(dadosAtendimentoNovo);
    if (enviado) localStorage.removeItem('atendimentoNovo');
}, 1000);

async function registrarNovosAtendimentosCercamento() {
    const json = sessionStorage.getItem("atendimentosCercamento");
    if (!json) return;

    const atendimentos = JSON.parse(json);
    if (!atendimentos.length) return;

    try {
        await Promise.all(
            atendimentos.map(atendimento => registrarAtendimento(atendimento))
        );

        sessionStorage.removeItem("atendimentosCercamento");
    } catch (err) {
        console.error(err);
    }
}

async function registrarAtendimento(model, fotoAgoraId, fotoOriginalId) {
    try {
        const formData = new FormData();
        formData.append("myModel", JSON.stringify(model));

        if (fotoAgoraId) {
            const token = await obterTokenValido(USUARIO, SENHA);
            const fotoAgoraBlob = await buscarFotoAutenticada(fotoAgoraId, token);
            const fotoOriginalBlob = await buscarFotoAutenticada(fotoOriginalId, token);

            const fotoAgoraAnexo = new File([fotoAgoraBlob], "foto_agora.jpg", {
                type: fotoAgoraBlob?.type || "image/jpeg"
            });
            const fotoOriginalAnexo = new File([fotoOriginalBlob], "foto_original.jpg", {
                type: fotoOriginalBlob?.type || "image/jpeg"
            });

            formData.append("attachFiles", fotoAgoraAnexo);
            formData.append("attachFiles", fotoOriginalAnexo);
        }

        const response = await axios.post(
            `${projectUtils.properties.DESPACHO}/attendance`,
            formData
        );

        console.log("Atendimento criado com foto com sucesso!", response.data);

    } catch (error) {
        console.error("Erro ao enviar atendimento:", error.response?.data || error.message);
    }
}

// ================= CONFIGURAÇÃO =================
let USUARIO, SENHA;
const INTERVALO_SEGUNDOS = 30; // Tempo entre cada consulta

function baixarCredenciaisCercamento() {
    const credenciais = localStorage.getItem('credenciaisCercamento');
    if (credenciais) {
        [USUARIO, SENHA] = credenciais.split('-++-');
        return;
    }
    window.postMessage({
        type: "buscarCredenciaisCercamento"
    }, "*");
}

baixarCredenciaisCercamento();

// ================================================

let tokenSalvo = null;
let tokenExpiracao = 0;

// Função responsável por obter ou renovar o token apenas se expirado
async function obterTokenValido(usuario, senha) {
    const agora = Math.floor(Date.now() / 1000);

    if (tokenSalvo && (tokenExpiracao - agora) > 30) {
        return tokenSalvo;
    }

    const tokenUrl = "https://sso-pmpa.procempa.com.br/auth/realms/pmpa/protocol/openid-connect/token";
    const payload = new URLSearchParams({
        "client_id": "cercamento",
        "grant_type": "password",
        "username": usuario,
        "password": senha,
        "scope": "openid"
    });

    console.log("%c[Autenticação] Solicitando novo token de acesso...", "color: #ff9900;");
    const authResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
    });

    if (!authResponse.ok) {
        const erroDados = await authResponse.json().catch(() => ({}));
        throw new Error(`Falha na autenticação: ${authResponse.status} - ${erroDados.error_description || authResponse.statusText}`);
    }

    const authDados = await authResponse.json();
    tokenSalvo = authDados.access_token;
    tokenExpiracao = agora + (authDados.expires_in || 300);

    return tokenSalvo;
}
// Executa a busca de vandalismo e exibe no console
async function executarCicloDeBusca() {
    try {
        const token = await obterTokenValido(USUARIO, SENHA);

        // Endpoint de vandalismo fornecido
        const urlBusca = "https://cercamento-api.procempa.com.br/cercamento-api/service/vandalism?limit=LIMIT_ONLY_LATEST_10&onlyAlerts=Y&alertDetails=ONLY_NOT_RECOGNIZED";

        const dadosResponse = await fetch(urlBusca, {
            method: "GET",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "pragma": "no-cache"
            },
            referrer: "https://cercamento.procempa.com.br/",
            mode: "cors",
            credentials: "include"
        });

        if (!dadosResponse.ok) {
            throw new Error(`Erro na busca de dados: ${dadosResponse.status}`);
        }

        const dados = await dadosResponse.json();

        console.clear();
        console.log(
            `%c[CERCAMENTO - VANDALISMO] Monitorando... Última atualização: ${new Date().toLocaleTimeString()} (Atualiza a cada ${INTERVALO_SEGUNDOS}s)`,
            "color: #00ffff; font-weight: bold; font-size: 12px;"
        );

        if (!dados.length) {
            console.log("%cNenhum registro de vandalismo retornado.", "color: #999;");
        }
        const acionamentosId = sessionStorage.getItem('acionamentosId')?.split(',') || [];

        const resultados = await Promise.all(
            dados.map(async acionamento => {
                if (acionamentosId.includes(acionamento.id)) return;
                const reconheceuAlerta = await reconhecerAlerta(acionamento.id, 'calebe.silva', token, 'vandalism');
                if (reconheceuAlerta?.status != 'sucesso') return;
                acionamentosId.push(acionamento.id);
                const model = {
                    createJanitorial: false,
                    systemUpdate: null,
                    start: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                    attendanceLinked: {},
                    contactName: null,
                    contactPhone: null,
                    nature: "Averiguação de Disparo de Alarme",
                    channel: "Cercamento",
                    statusName: "ABERTO",
                    status: true,
                    anonymous: false,
                    transcription: `${acionamento.descricao_alerta}
                    ${acionamento.comentarios}`,
                    factDistrict: "RS",
                    sectors: [],
                    attachment: [],
                    factCity: '',
                    factNeighborhood: '',
                    factStreet: '',
                    factLatitude: '',
                    factLongitude: '',
                    factNumber: ''
                };
                window.postMessage({
                    type: "novoAlertaCercamento",
                    model: model,
                    endereco: acionamento.endereco,
                }, "*");

            })
        );

        const urlBuscaDesaparecidos = "https://cercamento-api.procempa.com.br/cercamento-api/service/analytics/person/data?limit=LIMIT_ONLY_LATEST_10&onlyAlerts=Y&alertDetails=ONLY_NOT_RECOGNIZED&confianca=75";
        const dadosResponseDesaparecidos = await fetch(urlBuscaDesaparecidos, {
            method: "GET",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `Bearer ${token}`,
                "cache-control": "no-cache",
                "pragma": "no-cache"
            },
            referrer: "https://cercamento.procempa.com.br/",
            mode: "cors",
            credentials: "include"
        });

        if (!dadosResponseDesaparecidos.ok) {
            throw new Error(`Erro na busca de dados: ${dadosResponseDesaparecidos.status}`);
        }

        const dadosDesaparecidos = await dadosResponseDesaparecidos.json();

        console.clear();
        console.log(
            `%c[CERCAMENTO - DESAPARECIDOS] Monitorando... Última atualização: ${new Date().toLocaleTimeString()} (Atualiza a cada ${INTERVALO_SEGUNDOS}s)`,
            "color: #00ffff; font-weight: bold; font-size: 12px;"
        );

        if (!dadosDesaparecidos.length) {
            console.log("%cNenhum registro de desaparecidos retornado.", "color: #999;");
        }
        const resultadosDesaparecidos = await Promise.all(
            dadosDesaparecidos.map(async acionamento => {
                if (acionamentosId.includes(acionamento.id_identificado)) return;
                const reconheceuAlerta = await reconhecerAlerta(acionamento.id_identificado, 'calebe.silva', token, 'analytics');
                if (reconheceuAlerta?.status != 'sucesso') return;
                acionamentosId.push(acionamento.id_identificado);
                const model = {
                    createJanitorial: false,
                    systemUpdate: null,
                    start: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                    attendanceLinked: {},
                    contactName: null,
                    contactPhone: null,
                    nature: "Encontro de Pessoa Desaparecida",
                    channel: "Cercamento",
                    statusName: "ABERTO",
                    status: true,
                    anonymous: false,
                    transcription: `${acionamento.descricao_alerta}
                    Nome Completo: ${acionamento.identificado}
                    Documento: ${acionamento.matricula}`,
                    factDistrict: "RS",
                    sectors: [],
                    attachment: [],
                    factCity: '',
                    factNeighborhood: '',
                    factStreet: '',
                    factLatitude: '',
                    factLongitude: '',
                    factNumber: ''
                };
                window.postMessage({
                    type: "novoAlertaCercamento",
                    model: model,
                    endereco: acionamento.cameraEndereco,
                    fotoAgoraId: `https://cercamento-api.procempa.com.br/cercamento-api/service/analytics/person/image/${acionamento.url.replace(/\D/g, '')}`,
                    fotoOriginalId: `https://cercamento-api.procempa.com.br/cercamento-api/service/analytics/image/${acionamento.matricula}`
                }, "*");
            })
        );

        sessionStorage.setItem('acionamentosId', acionamentosId);


    } catch (erro) {
        console.error("%c[Erro no Monitoramento]:", "color: #ff0000; font-weight: bold;", erro.message);
    }
}

async function buscarFotoAutenticada(urlCompleta, token) {
    if (!urlCompleta) return null;

    try {
        const response = await fetch(urlCompleta, {
            method: "GET",
            headers: {
                "authorization": `Bearer ${token}`,
                "accept": "image/*, */*"
            },
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) return null;

        // Converte o arquivo recebido em Blob
        const imageBlob = await response.blob();

        // Cria uma URL temporária em memória para usar no src da tag <img>
        return imageBlob;
    } catch (erro) {
        console.error("Erro ao carregar foto:", erro);
        return null;
    }
}



window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "registrarAtendimentoCercamento") {
        registrarAtendimento(event.data.atendimento, event.data.fotoAgoraId, event.data.fotoOriginalId);
    }

});



// Inicializa o processo
(function iniciarMonitoramento() {
    if (USUARIO === "SEU_USUARIO_AQUI") {
        console.error("%c[Erro] Altere as variáveis USUARIO e SENHA no topo do script antes de rodar!", "color: red; font-size: 14px;");
        return;
    }

    console.log("%c[Iniciando] Autenticando e configurando monitoramento de vandalismo...", "color: #0088ff; font-weight: bold;");

    executarCicloDeBusca();
    setInterval(executarCicloDeBusca, INTERVALO_SEGUNDOS * 1000);
})();

async function reconhecerAlerta(idAlerta, operador, tokenBearer, secao) {
    const url = `https://cercamento-api.procempa.com.br/cercamento-api/service/${secao}/alerts?id=${idAlerta}&operation=RECOGNIZE_ALERT&resolutionDescription=&operador=${operador}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "accept": "application/json, text/plain, */* ",
                "accept-language": "pt-BR,pt;q=0.9",
                "authorization": `Bearer ${tokenBearer}`,
                "cache-control": "no-cache",
                "pragma": "no-cache"
            },
            body: null
        });

        if (!response.ok) {
            throw new Error(`Erro na API Cercamento: ${response.status} -${response.statusText}`);
        }

        const dados = await response.json().catch(() => null); // Trata caso a resposta seja texto puro ou vazia
        console.log(`Alerta ${idAlerta} reconhecido com sucesso por${operador}`, dados);
        return { status: "sucesso", dados };

    } catch (erro) {
        console.error(`Falha ao reconhecer alerta ${idAlerta}:`, erro.message);
        return { status: "erro", erro: erro.message };
    }
}


