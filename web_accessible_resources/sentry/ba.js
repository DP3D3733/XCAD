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

        .adicionar {
            color:red !important;
        }

        .botaoSelecionado {
            background:red;
        }
    `;

    document.head.appendChild(style);
    const linhaTituloNaturezas = Array.from(document.querySelectorAll('strong')).find(elemento => elemento.innerText == 'NATUREZAS');
    if (!linhaTituloNaturezas) return;
    const tabelaNaturezasLinhaTitulo = linhaTituloNaturezas.closest('tr');
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
    const inputCorrecao = document.querySelector('#rejectObs');
    const naturezasDoBA = Array.from(document.querySelectorAll('td.bo-key')).filter(td => td.innerText.includes('Natureza')).map(natureza => natureza.parentNode);
    inputCorrecao.value = inputCorrecao.value.replace(/A natureza .*? deve ser retirada\./gi, "");
    inputCorrecao.value = inputCorrecao.value.replace(/A natureza .*? deve ser adicionada\./gi, "");
    naturezasDoBA.forEach(natureza => {
        natureza.classList.remove('remover');
        if (naturezasSelecionadas.includes(natureza.querySelector('span').innerText)) return;
        if (!natureza.classList.contains('adicionada')) {
            natureza.classList.add('remover');
            inputCorrecao.value += `A natureza ${natureza.querySelector('span').innerText} deve ser retirada.`
            return;
        };
        natureza.remove();
    });
    naturezasSelecionadas.forEach(natureza => {
        if (naturezasDoBA.map(natureza => natureza.querySelector('span').innerText).includes(natureza)) return;
        inputCorrecao.value += `A natureza ${natureza} deve ser adicionada.`;
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
    const início = dados.dispatch?.start || '-';
    const partida = dados.dispatch.displacement[0]?.goingDate || '-';
    const chegada = dados.dispatch.displacement[0]?.arrivalDate || '-';
    const fim = dados.dispatch?.end || '-';

    return [
        formatarDataHora(início),
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
    const celulaHorariosBA = Array.from(document.querySelectorAll('td.bo-key')).find(td => td.innerText.includes('D/H do fato'));
    if (!celulaHorariosBA) return;
    const linhaHorariosBA = celulaHorariosBA.parentNode;
    const horariosBA = Array.from(linhaHorariosBA.querySelectorAll('td span')).map(horario => horario.innerText);
    const horariosDespacho = await buscarDespacho(true);
    const botaoSubstituirHorarioDespacho = '<button onclick="substituirHorarioDespacho(this)">⬆️</button>';
    const botaoSubstituirHorarioBA = '<button onclick="substituirHorarioBA(this)">⬇️</button>';

    const linhaHorariosDespacho = `
        <tr id="horariosDespacho">
            <td class="bo-key" style="width: 33%">Despacho: <span class="bo-value">${horariosDespacho[0]}</span></td>
            <td class="bo-key" style="width: 33%">Início: <span class="bo-value">${horariosDespacho[2]}</span></td>
            <td class="bo-key" style="width: 33%">Término: <span class="bo-value">${horariosDespacho[3]}</span></td>
        </tr>`;
    const linhaBotoes = `
        <tr id="linhasBotoesAjusteHorarios">
            <td horario="início">${horariosBA[0] != horariosDespacho[0] ? botaoSubstituirHorarioDespacho + botaoSubstituirHorarioBA : ''}</td>
            <td horario="chegada">${horariosBA[1] != horariosDespacho[2] ? botaoSubstituirHorarioDespacho + botaoSubstituirHorarioBA : ''}</td>
            <td horario="término">${horariosBA[2] != horariosDespacho[3] ? botaoSubstituirHorarioDespacho + botaoSubstituirHorarioBA : ''}</td>
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
        'início': 0,
        'chegada': 1,
        'término': 2
    };
    const linhaHorarios = Array.from(document.querySelectorAll('.bo-key')).find(td => td.innerText.includes('D/H do fato')).parentNode;
    const horarioBA = linhaHorarios.querySelectorAll('td')[ordemColunas[qualHorario]].querySelector('span').innerText;
    console.log(horarioBA);
    localStorage.setItem('inserirHorariosDespacho', `${qualHorario},${horarioBA}`);
    document.querySelector('#modalDespacho').style.display = 'flex';

    const intervalAtualizarHorarios = setInterval(() => {
        const idDespacho = document.querySelector('h2.actual-title a').href.replaceAll(/\D/g, "");
        if (document.getElementById('iframeDespacho').contentWindow.location.href == `https://sentry.procempa.com.br/web/despacho/dispatch/${idDespacho}/edit`) return;
        clearInterval(intervalAtualizarHorarios);
        document.querySelector('#modalDespacho').style.display = 'none';
        document.getElementById('iframeDespacho').src = `https://sentry.procempa.com.br/web/despacho/dispatch/${idDespacho}/edit`;
        inserirHorariosDespacho();

    }, 100);
}

function substituirHorarioBA(botao) {
    const inputCorrecao = document.querySelector('#rejectObs');
    const qualHorario = botao.parentNode.getAttribute('horario');
    const ordemColunas = {
        'início': 0,
        'chegada': 1,
        'término': 2
    };
    const linhaHorarios = Array.from(document.querySelectorAll('.bo-key')).find(td => td.innerText.includes('D/H do fato')).parentNode;
    const linhaHorariosDespacho = document.getElementById('horariosDespacho');
    let linhaHorariosCorreta = document.getElementById('linhaHorariosCorreta');
    if (botao.classList.contains('botaoSelecionado')) {
        linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].innerHTML = '';
        linhaHorarios.querySelectorAll('td')[ordemColunas[qualHorario]].classList.remove('remover');
        botao.classList.toggle('botaoSelecionado');
        inputCorrecao.value = inputCorrecao.value.replace(`Falta informar o horário de ${qualHorario}. Pelo despacho, pode ser ${linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].querySelector('span').innerText}. \n`, '');
        return;
    }

    if (!linhaHorariosCorreta) {
        linhaHorariosCorretaHtml = `<tr id="linhaHorariosCorreta">
                                    <td class="bo-key" style="width: 33%"></td>
                                    <td class="bo-key" style="width: 33%"></td>
                                    <td class="bo-key" style="width: 33%"></td>
                                </tr>`
        linhaHorarios.insertAdjacentHTML('afterEnd', linhaHorariosCorretaHtml);
        linhaHorariosCorreta = document.getElementById('linhaHorariosCorreta');
    }
    linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].innerHTML =
        linhaHorariosDespacho.querySelectorAll('td')[ordemColunas[qualHorario]].innerHTML;
    linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].classList.add('adicionar');
    linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].querySelector('span').classList.add('adicionar');
    linhaHorarios.querySelectorAll('td')[ordemColunas[qualHorario]].classList.add('remover');
    botao.classList.toggle('botaoSelecionado');
    inputCorrecao.value += `Falta informar o horário de ${qualHorario}. Pelo despacho, pode ser ${linhaHorariosCorreta.querySelectorAll('td')[ordemColunas[qualHorario]].querySelector('span').innerText}. \n`;


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

async function verificarEnvolvidos() {
    const cpfsElements = Array.from(document.querySelectorAll('span[class="cpf bo-value bo-value-bold"]'));
    if (!cpfsElements.length) return;
    const cpfs = cpfsElements.map(element => element.innerText);
    const resultados = Object.fromEntries(
        await Promise.all(
            cpfs.map(async cpf => {
                const numero = cpf.replace(/[^0-9]/g, '');
                return [
                    cpf,
                    await buscarEnvolvido(numero)
                ];
            })
        )
    );
    const relacaoDadosBABD = {
        'Nome completo': 'name',
        'Data de nasc.': 'dtBirth',
        'Mãe': 'mother',
        'Pai': 'father',
        'Sexo': 'sex',
        'Nacionalidade': 'nationality',
        'Naturalidade': 'cityOfBirth',
        'Cútis': 'color'
    }
    cpfsElements.forEach(cpfElement => {
        if (!resultados[cpfElement.innerText].encontrado) {
            cpfElement.innerHTML += `<button onclick="consultar('${cpfElement.innerText}')">Consultar</button>`;
            return;
        }
        const idEnvolvidoBA = cpfElement.closest('tr.individual-component-print').querySelector('strong').innerText.replace(/[^0-9]/g, '');
        const dadosIndividuosBA = {};
        Array.from(document.querySelectorAll(`tr.individual-component-${idEnvolvidoBA} td.bo-key`))
            .forEach(dado => {
                const [chave, valor] = dado.innerText.split(':');
                if (!relacaoDadosBABD[chave]?.trim()) return;
                if (resultados[cpfElement.innerText][relacaoDadosBABD[chave]].trim() != valor.trim()) {
                    const botaoReinserirCPF = cpfElement.parentNode.querySelector('button');
                    if (!botaoReinserirCPF) cpfElement.parentNode.insertAdjacentHTML('beforeend', `<button onclick="reinserir(this)"><i class="fas fa-redo"></i></button>`)
                    dado.innerHTML += `<span class="adicionar">${resultados[cpfElement.innerText][relacaoDadosBABD[chave]].trim()}</span>`;
                }
            });
    })
}

function reinserir(botao) {
    const idEnvolvidoBA = botao.closest('tr.individual-component-print').querySelector('strong').innerText.replace(/[^0-9]/g, '');
    const inputCorrecao = document.querySelector('#rejectObs');
    const cpf = botao.previousElementSibling.innerText;
    if (botao.classList.contains('botaoSelecionado')) {
        botao.classList.remove('botaoSelecionado');
        inputCorrecao.value = inputCorrecao.value.replace(`Reinserir o CPF ${cpf} no envolvido ${idEnvolvidoBA} e selecionar a opção para substituir os dados. Não tocar no botão em formato de bandeira.`, '');
        return;
    }
    botao.classList.add('botaoSelecionado');
    inputCorrecao.value += `Reinserir o CPF ${cpf} no envolvido ${idEnvolvidoBA} e selecionar a opção para substituir os dados. Não tocar no botão em formato de bandeira.\n`;

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

function consultar(cpf) {
    window.postMessage({ type: "consultar", data: cpf }, "*");
}

async function main() {
    await gerarBotaoInserirOutraNatureza();
    inserirHorariosDespacho();
    verificarEnvolvidos();
}

main();
