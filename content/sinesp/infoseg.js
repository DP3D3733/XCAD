inserirBotaoConsultar();

function inserirBotaoConsultar() {
    setInterval(() => {

        const modais = document.querySelectorAll(
            'div[title="Detalhes da Pessoa Física"]:not(:has(.botao-consultar-ocorrencias))'
        );

        modais.forEach((modal) => {

            const button = document.createElement('button');

            button.className =
                'btn btn-sm btn-primary botao-consultar-ocorrencias';

            button.innerText = 'Consultar Ocorrências';

            button.addEventListener('click', (event) => consultarOcorrencias(event.currentTarget));

            modal.insertAdjacentElement('afterbegin', button);
        });

    }, 500);
}

function inserirBotaoCopiar(botaoConsultar) {
    if (botaoConsultar.parentNode.querySelector('button.botao-copiar-ocorrencias')) return;
    const button = document.createElement('button');

    button.innerText = 'Copiar';

    button.className =
        'btn btn-sm btn-primary botao-copiar-ocorrencias';

    button.addEventListener('click', (event) => copiarOcorrencias(event.currentTarget));

    botaoConsultar.insertAdjacentElement('afterend', button);
}

function consultarOcorrencias(botao) {
    const nome = document.querySelector("#modalD p").innerText;
    const campos = Array.from(botao.parentNode.querySelectorAll('div.form-group'))
        .map(campo => {
            return {
                nome: campo.querySelector('label').innerText,
                valor: campo.querySelector('p').innerText
            }
        });
    const cpf = campos.find(campo => campo.nome == 'CPF')?.valor;
    const mae = campos.find(campo => campo.nome == 'Filiação 1')?.valor;
    const Nascimento = campos.find(campo => campo.nome == 'D. N.')?.valor;
    const naturalidade = campos.find(campo => campo.nome == 'Município - UF')?.valor;
    const sexo = campos.find(campo => campo.nome == 'Sexo')?.valor;

    const dados = {
        nome, cpf, mae, Nascimento, naturalidade, sexo
    }
    const modalId = botao.parentNode.getAttribute('id');
    chrome.runtime.sendMessage({ action: "consultarIndividuo", dados: dados, modalId: modalId });

}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "respostaConsultarIndividuo") {
        mostrarResultadoConsulta(message);
    }
    if (message.action === "refazerSolicitacao") {
        document.getElementById(message.modalId).querySelector('button').click();
    }
});

async function mostrarResultadoConsulta(message) {
    const modal = document.getElementById(message.modalId);
    if (!modal) return;
    const dados = message.dados;
    const divDados = document.createElement('div');
    divDados.classList.add('dados_consulta');
    modal.querySelector('button').insertAdjacentElement('afterend', divDados);
    if (!message.sucesso) {
        const dadosInfoseg = buscarDadosInfoseg(modal);
        await verificarMandado(dadosInfoseg.cpf, divDados);
        mostrarFoto('', divDados);
        mostrarDadosBasicos(dadosInfoseg, divDados);
        inserirBotaoCopiar(modal.querySelector('button'));
        return
    }
    await verificarMandado(dados.basicos.cpf, divDados);
    mostrarFoto(dados.foto, divDados);
    mostrarDadosBasicos(dados.basicos, divDados);
    if (dados.bas) mostrarBAs(dados.bas, divDados);
    mostrarOcorrencias(dados.ocorrencias, divDados);
    inserirBotaoCopiar(modal.querySelector('button'));
}

function mostrarFoto(foto, divDados) {
    if (foto == '' || !foto) return divDados.innerText += `*SEM IMAGENS NO SISTEMA*
    `;
    const imgElement = document.createElement('img');
    imgElement.src = foto;
    const divImg = document.createElement('div');
    divImg.classList.add('sinesp-photo-container');
    divImg.insertAdjacentElement('afterBegin', imgElement);
    divDados.insertAdjacentElement('beforeBegin', divImg);
}

function mostrarDadosBasicos(dados, divDados) {
    if (!dados) return divDados.innerText += `
    SEM DADOS BÁSICOS
    `;

    divDados.innerText +=
        `
            *DADOS BÁSICOS:*
            Nome: ${dados.nome || ''}
            Nome social: ${dados.nomeSocial || ''}
            Sexo: ${dados.sexo || ''}
            Cor da pele: ${dados.corPele || ''}
            Naturalidade: ${dados.naturalidade || ''}    
            Nascimento: ${dados.dataNascimento || ''}
            Nome da mãe: ${dados.paiMae.includes('/') ? dados.paiMae.split('/')[1] : dados.paiMae}
            Nome do pai: ${dados.paiMae.includes('/') ? dados.paiMae.split('/')[0] : '-'}
            CPF: ${dados.cpf || ''}            
            RG: ${dados.rg || ''}`;
}

function buscarDadosInfoseg(modal) {
    const dadosExtraidos = {};

    modal.querySelectorAll('.form-group').forEach(group => {
        const label = group.querySelector('label')?.innerText.trim();
        const valor = group.querySelector('.form-control-static')?.innerText.trim();

        if (label) {
            dadosExtraidos[label] = valor || null;
        }
    });
    return {
        nome: document.querySelector('#modalD').innerText,
        sexo: dadosExtraidos.Sexo,
        naturalidade: dadosExtraidos['Município - UF'],
        dataNascimento: dadosExtraidos['D. N.'],
        paiMae: dadosExtraidos['Filiação 1'] == 'N/I' ? '' : dadosExtraidos['Filiação 1'],
        cpf: dadosExtraidos.CPF
    }
}

function mostrarOcorrencias(ocorrencias, divDados) {
    if (!ocorrencias || !ocorrencias.length) return divDados.innerText += `

    *SEM OCORRÊNCIAS ENCONTRADAS*
    `;
    divDados.innerText += `

    *OCORRÊNCIAS:*`;
    const ocorrenciasDesfavor = {
        'Indiciado por': null,
        'Suspeito de': null,
        'Acusado de': null,
        'Autor de': null,
        'Foragido(a)': null
    }
    ocorrenciasDesfavor['Indiciado por'] = ocorrencias.filter(ocorrencia => ocorrencia.qualificacao == 'Indiciado(a)');
    ocorrenciasDesfavor['Suspeito de'] = ocorrencias.filter(ocorrencia => ocorrencia.qualificacao == 'Suspeito(a)');
    ocorrenciasDesfavor['Acusado de'] = ocorrencias.filter(ocorrencia => ocorrencia.qualificacao == 'Acusado(a)');
    ocorrenciasDesfavor['Autor de'] = ocorrencias.filter(ocorrencia => ocorrencia.qualificacao == 'Autor(a)');
    ocorrenciasDesfavor['Foragido(a)'] = ocorrencias.filter(ocorrencia => ocorrencia.qualificacao == 'Foragido(a)');

    const semOcorrencias = Object.values(ocorrenciasDesfavor).every(lista => lista.length === 0);

    if (semOcorrencias) {
        divDados.innerText += `\nSem ocorrências em desfavor encontradas\n`;
        return;
    }

    for (const qualificacao in ocorrenciasDesfavor) {
        if (!Object.hasOwn(ocorrenciasDesfavor, qualificacao)) continue;

        const ocorrencias = ocorrenciasDesfavor[qualificacao];
        if (!ocorrencias || !ocorrencias.length) continue;

        divDados.innerText += `
        ${qualificacao}:
    `
        ocorrencias.forEach(ocorrencia => {
            divDados.innerText += ` ${ocorrencia.tipificacao} em ${ocorrencia.data}
    `
        })
    }

}

async function buscarMandadosInfoseg(cpf) {
    // 1. Limpa a pontuação do CPF deixando apenas os dígitos
    const cpfLimpo = cpf.replace(/\D/g, "");

    const url = "https://infoseg.sinesp.gov.br/infoseg2/api/mandados";

    const payload = {
        registroInicial: 1,
        registroFinal: 10,
        idTipoDocumentoIdentificacao: 357,
        numeroDocumentoIdentificacao: cpfLimpo
    };

    const resposta = await fetch(url, {
        method: "POST",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "pt-BR,pt;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        referrer: `https://infoseg.sinesp.gov.br/infoseg2/?q=${encodeURIComponent(cpf)}`,
        body: JSON.stringify(payload),
        mode: "cors",
        credentials: "include"
    });

    if (!resposta.ok) {
        throw new Error(`Erro na consulta Infoseg: HTTP ${resposta.status}`);
    }

    const dados = await resposta.json();
    return dados;
}

async function verificarMandado(cpf, divDados) {
    const mandado = await buscarMandadosInfoseg(cpf);
    if (!mandado || mandado.totalRegistros == 0) return divDados.innerText += `
    *MANDADO NÃO ENCONTRADO*
    `;

    divDados.innerText += `
    *ATENÇÃO! CONDUZIR! ENVIAR IMAGENS DA CONDUÇÃO.*

    *MANDADO:*
        ${mandado.payload[0]?.numeroPeca}
    `;
}

function mostrarBAs(bas, divDados) {
    if (!bas || !bas.length) return;
    divDados.innerText += `

    *OCORRÊNCIAS GCM:*`;
    const ocorrenciasDesfavor = {}
    bas.forEach(ba => {
        ocorrenciasDesfavor[ba.condicaoFormatada] ?
            ocorrenciasDesfavor[ba.condicaoFormatada].push(`${ba.natureza.toUpperCase()} em ${ba.dataOcorrencia} (${ba.numeroBO})`) :
            ocorrenciasDesfavor[ba.condicaoFormatada] = [`${ba.natureza.toUpperCase()} em ${ba.dataOcorrencia} (${ba.numeroBO})`]
    });
    for (const qualificacao in ocorrenciasDesfavor) {
        if (!Object.hasOwn(ocorrenciasDesfavor, qualificacao)) continue;

        const ocorrencias = ocorrenciasDesfavor[qualificacao];
        if (!ocorrencias || !ocorrencias.length) continue;

        divDados.innerText += `
        ${qualificacao}:
        `
        ocorrencias.forEach(ocorrencia => {
            divDados.innerText += `${ocorrencia}`
        })
    }
}

async function copiarOcorrencias(botao) {
    const dadosDiv = botao.parentNode.querySelector('div.dados_consulta');
    const dados = dadosDiv.innerText;
    try {
        await navigator.clipboard.writeText(dados);
    } catch (erro) {
        console.error("Erro ao copiar:", erro);
        return;
    }
}


