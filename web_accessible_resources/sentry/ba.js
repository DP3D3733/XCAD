async function gerarBotaoInserirOutraNatureza() {
    const style = document.createElement("style");

    style.textContent = `
        .select2-container {
            width: 300px !important;
        }

        .select2-container--open .select2-dropdown {
            width: 300px !important;
        }

        .select2-results {
            max-width: 300px !important;
        }
        
        .remover {
            text-decoration: line-through
        }
    `;

    document.head.appendChild(style);
    const tabelaNaturezasLinhaTitulo = Array.from(document.querySelectorAll('strong')).find(elemento => elemento.innerText == 'NATUREZAS').closest('tr');
    tabelaNaturezasLinhaTitulo.insertAdjacentHTML('beforeEnd', '<td class="text-center" colspan="3"><select id="selectNaturezas" multiple></select></td>');
    const naturezasDoBA = Array.from(tabelaNaturezasLinhaTitulo.parentNode.querySelectorAll('td')).filter(td => td.innerText.includes('Natureza')).map(natureza => natureza.querySelector('span').innerText);
    const selectNaturezas = document.getElementById('selectNaturezas');
    const naturezas = await baixarNaturezas();
    const naturezasOptions = naturezas.map(natureza => {
        return naturezasDoBA.includes(natureza) ?
            `<option selected>${natureza}</option>` :
            `<option>${natureza}</option>`;
    }).join('');
    selectNaturezas.innerHTML = naturezasOptions;
    $('#selectNaturezas').select2();
    $("#selectNaturezas").on("change", function () {
        alterarNaturezas($(this).val());
    });
    return true;
}

async function baixarNaturezas() {
    const response = await fetch(
        "https://sentry.procempa.com.br/web/nature/list",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify({
                filter: [],
                page: 1,
                size: 500,
                sort: [
                    {
                        field: "name",
                        dir: "asc"
                    }
                ]
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    const naturezas = data.data.data.map(naturezaObj => naturezaObj.alias || naturezaObj.name).sort();

    return naturezas;
}

function alterarNaturezas(naturezasSelecionadas) {
    const naturezasDoBA = Array.from(document.querySelectorAll('td.bo-key')).filter(td => td.innerText.includes('Natureza')).map(natureza => natureza.parentNode);
    naturezasDoBA.forEach(natureza => {
        natureza.classList.remove('remover');
        if (naturezasSelecionadas.includes(natureza.querySelector('span').innerText)) return;
        if (!natureza.classList.contains('adicionada')) {
            natureza.classList.add('remover');
            return;
        };
        natureza.remove();
    });
    naturezasSelecionadas.forEach(natureza => {
        if (naturezasDoBA.map(natureza => natureza.querySelector('span').innerText).includes(natureza)) return;
        naturezasDoBA[0].closest('tbody').insertAdjacentHTML('beforeend',
            `<tr class="adicionada">
                <td style="width: 66%;" colspan="2" class="bo-key">Natureza: <span class="bo-value">${natureza}</span></td>
                <td style="width: 33%;" class="bo-key">Grupo: <span class="bo-value uninformed"></span></td>
            </tr>`)
    })
}

async function buscarDespacho(somenteHorarios) {
    const idDespacho = document.querySelector('h2.actual-title a').href.replaceAll(/\D/g, "");
    gerarIframeDespacho(idDespacho);

    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/dispatch/${idDespacho}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
    }

    const dados = await response.json();
    if (!somenteHorarios) return dados;
    const inicio = dados.dispatch?.start || '-';
    const partida = dados.dispatch.displacement[0]?.goingDate || '-';
    const chegada = dados.dispatch.displacement[0]?.arrivalDate || '-';
    const fim = dados.dispatch?.end || '-';

    return [
        formatarDataHora(inicio),
        formatarDataHora(partida),
        formatarDataHora(chegada),
        formatarDataHora(fim)
    ]
}

function formatarDataHora(iso) {
    const data = new Date(iso);

    if (isNaN(data.getTime())) {
        return "-";
    }

    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).replaceAll(',', '');
}

function reverterDataHora(dataHora) {
    if (!dataHora || dataHora === "-") {
        return null;
    }

    const [data, hora] = dataHora.trim().split(" ");

    if (!data || !hora) {
        return null;
    }

    const [dia, mes, ano] = data.split("/").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);

    if (
        isNaN(dia) ||
        isNaN(mes) ||
        isNaN(ano) ||
        isNaN(horas) ||
        isNaN(minutos)
    ) {
        return null;
    }

    // Cria no fuso local do navegador (ex.: UTC-3)
    const dataLocal = new Date(
        ano,
        mes - 1,
        dia,
        horas,
        minutos,
        0,
        0
    );

    // Converte para UTC no mesmo padrão da API
    return dataLocal.toISOString();
}

async function inserirHorariosDespacho() {
    const linhaHorariosBA = Array.from(document.querySelectorAll('td.bo-key')).find(td => td.innerText.includes('D/H do fato'))?.parentNode;
    const horariosDespacho = await buscarDespacho(true);
    const botaoSubstituirHorarioDespacho = '<button onclick="substituirHorarioDespacho(this)">⬆️</button>';
    const botaoSubstituirHorarioBA = '<button onclick="substituirHorarioBA(this)">⬇️</button>';

    const linhaHorariosDespacho = `
        <tr id="horariosDespacho">
            <td>Despacho: Início: ${horariosDespacho[0]}</td>
            <td>Chegada: ${horariosDespacho[2]}</td>
            <td>Término: ${horariosDespacho[3]}</td>
        </tr>`;
    const linhaBotoes = `
        <tr id="linhasBotoesAjusteHorarios">
            <td horario="inicio">${botaoSubstituirHorarioDespacho}  ${botaoSubstituirHorarioBA}</td>
            <td horario="chegada">${botaoSubstituirHorarioDespacho}  ${botaoSubstituirHorarioBA}</td>
            <td horario="termino">${botaoSubstituirHorarioDespacho}  ${botaoSubstituirHorarioBA}</td>
        </tr>`;
    if (document.querySelector('#horariosDespacho')) {
        document.querySelector('#horariosDespacho').outerHTML = linhaHorariosDespacho;
        return;
    }
    linhaHorariosBA.insertAdjacentHTML('beforeBegin', linhaHorariosDespacho);
    linhaHorariosBA.insertAdjacentHTML('beforeBegin', linhaBotoes);
    return true;
}

function substituirHorarioDespacho(botao) {
    const qualHorario = botao.parentNode.getAttribute('horario');
    const ordemColunas = {
        inicio: 0,
        chegada: 1,
        termino: 2
    };
    const linhaHorarios = Array.from(document.querySelectorAll('.bo-key')).find(td => td.innerText.includes('D/H do fato')).parentNode;
    console.log(linhaHorarios.querySelectorAll('td')[ordemColunas[qualHorario]]);
    const horarioBA = linhaHorarios.querySelectorAll('td')[ordemColunas[qualHorario]].querySelector('span').innerText;
    localStorage.setItem('inserirHorariosDespacho', `${qualHorario},${horarioBA}`);
    document.querySelector('#modalDespacho').style.display = 'flex';

    const intervalAtualizarHorarios = setInterval(() => {
        if (localStorage.getItem('inserirHorariosDespacho')) return;
        clearInterval(intervalAtualizarHorarios);
        document.querySelector('#modalDespacho').style.display = 'none';
        const idDespacho = document.querySelector('h2.actual-title a').href.replaceAll(/\D/g, "");
        document.getElementById('iframeDespacho').src = `https://sentry.procempa.com.br/web/despacho/dispatch/${idDespacho}/edit`;
        setTimeout(() => {
            inserirHorariosDespacho();
        }, 2000);

    }, 100);
}

function gerarIframeDespacho(id) {
    const modal = document.createElement('div');
    modal.setAttribute('class', "modal inmodal");
    modal.setAttribute('id', "modalDespacho");
    modal.setAttribute('style', 'display:none');
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-fullscreen">
            <iframe src="https://sentry.procempa.com.br/web/despacho/dispatch/${id}/edit"
                        id="iframeDespacho"
                        style="width:100%;height:80vh;border:none">
                    </iframe>
        </div>`
    document.body.appendChild(modal);
}

async function main() {
    await gerarBotaoInserirOutraNatureza();
    inserirHorariosDespacho();
}

main();
