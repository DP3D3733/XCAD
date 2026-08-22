inserirBotaoCopiarParaCad();

function inserirBotaoCopiarParaCad() {
    const botaoCopiarParaCad = document.createElement('button');
    botaoCopiarParaCad.setAttribute('class', 'btn btn-default btn-new float-end ms-1');
    botaoCopiarParaCad.innerHTML = `<i class="fa fa-copy"></i><span>  Copiar Para Cad</span>`;
    botaoCopiarParaCad.addEventListener('click', () => copiarParaCad(botaoCopiarParaCad));

    const linhaCabecalho = document.querySelector('#page-wrapper div.row');
    const botaoImprimir = linhaCabecalho.querySelector('button');
    botaoImprimir.insertAdjacentElement('beforebegin', botaoCopiarParaCad);
}

async function copiarParaCad(botaoCopiarParaCad) {
    const pontoReferencia = document.querySelector("#factPlace").value;
    const tipoLocal = document.querySelector("#factType").value == '' ? 'Via urbana' : document.querySelector("#factType").value;
    const narrativa = document.querySelector("#myModel\\.transcription") ? document.querySelector("#myModel\\.transcription").value : '';
    const endereco = Array.from(document.querySelectorAll('#factStreet, #factNumber, #factNeighborhood, #factCity')).map(input => input.value).join(' ');
    const natureza = document.querySelector("#myModel\\.nature").value == 'Abordagem a Pessoa em Fundada Suspeita' ? 'Abordagem a Pessoa em Atitude Suspeita' : document.querySelector("#myModel\\.nature").value;
    const guarnicaoId = document.querySelector("#myModel\\.garrison").value;
    const guarnicao = await buscarGuarnicao(guarnicaoId);
    const horaInicial = document.querySelector("#myModel\\.start").value;
    const horaFinal = document.querySelector("#myModel\\.end").value;
    const telefone = document.querySelector("#contactPhone").value;
    const solicitante = document.querySelector("#contactName").value;

    const dados = `${pontoReferencia}-()-${tipoLocal}-()-${narrativa}-()-${endereco}-()-${natureza}-()-${guarnicao}-()-${horaInicial}-()-40-()-${horaFinal}-()-${telefone}-()-${solicitante}-++-`;

    try {
        await navigator.clipboard.writeText(dados);

        botaoCopiarParaCad.querySelector('i').setAttribute('class', 'fa fa-check');
        setTimeout(() => {
            botaoCopiarParaCad.querySelector('i').setAttribute('class', 'fa fa-copy');
        }, 1000);
    } catch (erro) {
        console.error("Erro ao copiar:", erro);
        return;
    }
}

async function buscarGuarnicao(guarnicaoId) {
    const response = await fetch(
        `https://sentry.procempa.com.br/web/reports/garrison_info?id=${guarnicaoId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response) return false;

    const data = await response.text();
    const parser = new DOMParser();

    const doc = parser.parseFromString(data, 'text/html');
    if (!doc) return false;

    const cabecalhoGuarnicaoTd = Array.from(doc.querySelectorAll('th')).find(th => th.innerText == 'Equipe');
    if (!cabecalhoGuarnicaoTd) return false;

    const guarnicaoTd = cabecalhoGuarnicaoTd.parentNode.nextElementSibling.querySelectorAll('td')[Array.from(cabecalhoGuarnicaoTd.parentNode.querySelectorAll('th')).indexOf(cabecalhoGuarnicaoTd)];
    if (!guarnicaoTd) return false;
    return guarnicaoTd.innerText;
}



/*1001 PARQUE FARROUPILHA-()-Praça / Parque-()-PARQUES E PRAÇAS
Efetuar atividade de policiamento preventivo com a finalidade de garantir a segurança dos munícipes e usuários do parque. Inspecionar locais e instalações com intuito de verificar se há indícios de depredação, furto de fios e cabos, invasão ou ocupação irregular dos próprios municipais.-()-AV OSVALDO ARANHA - FARROUPILHA-()-Patrulhamento Preventivo-()-C2 - Dia-()-20/08/2026 06:33-()-40-()-20/08/2026 08:48-()--()--++-

808 VIVEIRO MUNICIPAL-()-Repartição pública-()-Invasão no Viveiro Municipal.-()-Rua Victorino Luiz De Fraga, 1378-()-Invasão de Propriedade-()-81 - Dia-()-22/08/2026 08:26-()-72-()--()--()-Comando-geral-++-
*/





let inserindoHorario = false;
setInterval(() => {
    if (inserindoHorario) return;
    const horarioDados = localStorage.getItem('inserirHorariosDespacho'); //inicio, 13/07/2026 08:20
    if (!horarioDados) return;
    inserindoHorario = true;

    const [qualHorario, horario] = horarioDados.split(',');
    const qualCampo = {
        início: '[name="myModel.start"],[name="myModel.goingDate"]',
        chegada: '[name="myModel.arrivalDate"]',
        término: '[name="myModel.end"]'
    }

    document.querySelectorAll(qualCampo[qualHorario]).forEach(input => {
        input.value = horario;
        input.dispatchEvent(
            new Event('change', {
                bubbles: true
            }));
    });
    document.querySelector('#btnSubmitAndNewHome').click();
    localStorage.removeItem('inserirHorariosDespacho');
    inserindoHorario = false;
}, 100);

