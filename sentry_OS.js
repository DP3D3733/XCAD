let qths;
let associacoes;
let dadosAssociacoesEAtendimentos;
main();
async function main() {
    dadosAssociacoesEAtendimentos = await buscarAssociacoesEAtendimentos();
    associacoes = dadosAssociacoesEAtendimentos;
    qths = await listarLocais();
    criarBotaoImportarOS();

}

async function buscarAssociacoesEAtendimentos() {

    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/activity/8`,
        {
            credentials: "include"
        }
    );

    const dados = await response.json();
    const associacoes = dados?.activity?.activityObservation || '{}';
    return JSON.parse(associacoes);
}


function criarBotaoImportarOS() {
    const botaoCadastrarAtividade = Array.from(document.querySelectorAll('button')).find(botao => botao.innerText.includes('Cadastrar atividade programada'));
    if (!botaoCadastrarAtividade) return;
    const botaoImportarOS = botaoCadastrarAtividade.cloneNode(true);
    botaoImportarOS.removeAttribute('onclick');
    botaoImportarOS.innerHTML = 'Importar OS';
    botaoCadastrarAtividade.insertAdjacentElement('beforeBegin', botaoImportarOS);
    const modal = document.createElement('div');
    modal.setAttribute('class', "modal inmodal");
    modal.setAttribute('id', "modalImportarOS");
    modal.setAttribute('style', "display:none");
    const numOSInicial = ajustaNumOSInicial();
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Importar OS</h3>
                    <input type="number" id="numOS" placeholder="001" value="${numOSInicial[0]}" /><input type="number" id="ano" placeholder="2026"  value="${numOSInicial[1]}" />
                </div>
                <div class="modal-body">
                    <input type="file" id="arquivo" accept=".zip"><label><input id=checkVerCertas type=checkbox checked=true />Certas</label><label><input id=checkVerErradas type=checkbox checked=true />Erradas</label>
                    <div id="resultado"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-mdb-dismiss="modal" aria-label="Close">Cancelar</button>
                    <button class="btn btn-default" data-mdb-dismiss="modal" aria-label="Inserir" onclick="importarOS()">Importar</button>
                </div>
            </div>
        </div>`
    document.body.appendChild(modal);
    botaoImportarOS.addEventListener('click', () => document.getElementById('modalImportarOS').style.display = 'block');
    document.getElementById('arquivo').addEventListener('change', async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const zip = await JSZip.loadAsync(file);

        let htmlFile = null;

        zip.forEach((path, entry) => {

            if (
                !htmlFile &&
                !entry.dir &&
                path.toLowerCase().endsWith('.html')
            ) {
                htmlFile = entry;
            }
        });

        if (!htmlFile) {
            alert('Nenhum HTML encontrado.');
            return;
        }

        const texto = await htmlFile.async('string');

        const parser = new DOMParser();

        const doc = parser.parseFromString(
            texto,
            'text/html'
        );

        const dados = extrairDados(doc);

        renderizarTabela(dados);
        qths = await listarLocais();
        associacoes = await buscarAssociacoesEAtendimentos();

        conferirDados();

    });

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="modalMapa">
        <div class="modal-dialog" style="max-width:95vw">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Mapa</h5>
                </div>

                <div class="modal-body p-0">
                    <iframe
                        id="iframeMapa"
                        style="width:100%;height:80vh;border:none">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
    `);
}



function extrairDados(doc) {

    const resultado = [];

    const elementos = Array.from(doc.body.children);
    console.log(elementos.find(el => el.innerText.includes('ORDEM DE SERVIÇO'))?.innerText);
    let secaoAtual = '';
    let finalidadeAtual = '';
    let naturezaAtual = '';
    const numAnoOSDiv = elementos.find(el => el.innerText.includes('ORDEM DE SERVIÇO'));
    if (numAnoOSDiv) {
        const resultado = numAnoOSDiv.innerText.replace(/[^\d/]/g, "");
        const numOSInput = document.querySelector('#numOS');
        const anoOSInput = document.querySelector('#ano');
        numOSInput.value = resultado.split('/')[0];
        anoOSInput.value = resultado.split('/')[1];
    }

    for (const el of elementos) {


        if (el.tagName === 'H1') {
            secaoAtual = limpar(el.innerText);
        }

        const texto = limpar(el.innerText || '');


        if (texto.startsWith('FINALIDADE:')) {

            finalidadeAtual = texto
                .replace('FINALIDADE:', '')
                .trim();
        }

        if (texto.startsWith('NATUREZA:')) {

            naturezaAtual = texto
                .replace('NATUREZA:', '')
                .trim();
        }

        if (el.tagName !== 'TABLE') continue;

        const linhas =
            Array.from(el.querySelectorAll('tr'))
                .slice(1);

        const rowspanMap = [
            null,
            null,
            null,
            null
        ];

        for (const linha of linhas) {

            const cols =
                Array.from(linha.querySelectorAll('td'));

            const registro = ['', '', '', ''];

            let colIndex = 0;
            let tdIndex = 0;

            let recursos = [];

            while (colIndex < 4) {

                if (
                    rowspanMap[colIndex] &&
                    rowspanMap[colIndex].restante > 0
                ) {

                    registro[colIndex] =
                        rowspanMap[colIndex].valor;

                    rowspanMap[colIndex].restante--;

                    colIndex++;
                    continue;
                }

                const td = cols[tdIndex++];

                if (!td) break;

                if (colIndex === 0) {

                    registro[colIndex] = Array
                        .from(td.querySelectorAll('p'))
                        .map(p => p.textContent.trim())
                        .filter(Boolean)
                        .join('\n');

                }
                else if (colIndex === 1) {

                    recursos = Array
                        .from(td.querySelectorAll('p'))
                        .map(p => limpar(p.textContent))
                        .filter(Boolean);

                    if (!recursos.length) {

                        recursos = [
                            limpar(td.textContent)
                        ];
                    }

                    registro[colIndex] =
                        recursos.join(' | ');
                }
                else {

                    registro[colIndex] =
                        limpar(td.innerText);
                }

                const rowspan = parseInt(
                    td.getAttribute('rowspan') || '1'
                );

                if (rowspan > 1) {

                    rowspanMap[colIndex] = {
                        valor: registro[colIndex],
                        restante: rowspan - 1
                    };
                }
                else {

                    rowspanMap[colIndex] = null;
                }

                colIndex++;
            }

            const base = {
                secao: secaoAtual,
                finalidade: finalidadeAtual,
                natureza: naturezaAtual,
                local: registro[0],
                horario: registro[2],
                atividade: registro[3]
            };

            if (recursos.length > 1) {

                recursos.forEach(recurso => {

                    resultado.push({
                        ...base,
                        recurso
                    });
                });
            }
            else {

                resultado.push({
                    ...base,
                    recurso:
                        recursos[0] ||
                        registro[1]
                });
            }
        }
    }

    return resultado;
}

function limpar(texto) {

    return String(texto ?? '')
        .replace(/\s+/g, ' ')
        .trim();
}

function limparMultilinha(texto) {
    return texto
        .replace(/\r/g, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s+/g, '\n')
        .trim();
}

function renderizarTabela(dados) {
    const botoesDemandaOS = gerarBotoesOS();
    let html = `
<div style="max-height:700px;overflow-y:auto;border:1px solid #ccc;">
    <table style="width:100%;border-collapse:separate;border-spacing:0;font-family:Arial,sans-serif;font-size:14px">
        <thead>
            <tr>
                <th style="position:sticky;top:0;z-index:101;background:#fff;border:1px solid #ccc;padding:8px">${botoesDemandaOS || ''}</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">NOME</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">FINALIDADE</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">NATUREZA</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">LOCAL</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">ASSOCIAÇÃO</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">RECURSO</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">HORÁRIO</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">ATIVIDADE</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">PB?</th>
                <th style="position:sticky;top:0;z-index:101;background:#fff;">REPETIR?</th>
            </tr>

            <tr>
                <th style="position:sticky;top:35px;z-index:100;background:#fff;"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
                <th contenteditable="true" oninput="filtrarDemandas(this)" style="position:sticky;top:35px;z-index:100;background:#fff;border:1px solid #ccc;padding:8px"></th>
            </tr>
        </thead>
        <tbody>
`;

    for (const item of dados) {

        html += `
            <tr>
                <td style="border:1px solid #ccc;padding:8px">${botoesDemandaOS || ''}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.secao)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.finalidade)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.natureza)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.local).replaceAll('\n', '<br>')}</td>
                <td style="
                    border:1px solid #ccc;
                    padding:8px;
                    position:relative;
                "
                onmouseenter="this.querySelector('.acoes').style.display='flex'"
                onmouseleave="this.querySelector('.acoes').style.display='none'">

                    <div class="associacao"></div>
                    <div class="acoes"
                        style="
                            display:none;
                            position:absolute;
                            top:4px;
                            right:4px;
                            gap:4px;
                        ">
                        <button onclick="associarLocal(this.closest('td').previousElementSibling)">📍</button>
                    </div>

                </td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.recurso)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.horario)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.atividade).replaceAll('\n', '<br>')}</td>
                <td style="border:1px solid #ccc;padding:8px"><input type="checkbox" /></td>
                <td style="border:1px solid #ccc;padding:8px"><input type="checkbox" /></td>
            </tr>
        `;
    }

    html += `
        </tbody>
    </table>
</div>
`;

    document.getElementById('resultado').innerHTML = html;

    document.querySelectorAll('#resultado tbody td').forEach(td => {
        td.addEventListener('input', () => conferirDados());
    });
}

function escapeHtml(texto) {

    return String(texto ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function gerarBotoesOS() {
    const botaoExcluirDemanda = document.createElement('button');
    botaoExcluirDemanda.innerText = '🗑️';
    botaoExcluirDemanda.setAttribute('onclick', 'excluirDemandaOS(this)');

    const botaoSelecionarDemanda = document.createElement('input');
    botaoSelecionarDemanda.setAttribute('type', 'checkbox');
    botaoSelecionarDemanda.classList.add('selecionaDemanda');
    botaoSelecionarDemanda.setAttribute('onchange', 'selecionarTodasAsDemandas(this)')

    const botoes = document.createElement('div');
    botoes.setAttribute('style', 'display:flex; gap:10px;');
    botoes.appendChild(botaoSelecionarDemanda);
    botoes.appendChild(botaoExcluirDemanda);
    return botoes.outerHTML;
}

function excluirDemandaOS(botao) {
    if (!botao.closest('th')) {
        botao.closest('tr').remove();
        return;
    }
    const inputsMarcados = Array.from(document.querySelectorAll('#resultado tbody tr:not([style="display: none;"]) input.selecionaDemanda:checked'));
    inputsMarcados.forEach(input => {
        input.closest('tr').remove();
    })
}

function filtrarDemandas(campo) {
    const linhas = document.querySelectorAll('#resultado tbody tr');
    const index = Array.from(campo.parentNode.querySelectorAll('th')).indexOf(campo);
    linhas.forEach(linha => {
        linha.style.display = 'none';
        const celulas = linha.querySelectorAll('td');
        if (celulas[index].innerText.toUpperCase().includes(campo.innerText.toUpperCase().trim())) linha.style.display = '';
    })
}

function conferirDados() {
    const qthsNomes = qths.data.data.map(qth => qth.name);
    const naturezas = ['PATRULHAMENTO PREVENTIVO', 'AÇÃO PRÓPRIA', 'AÇÃO INTEGRADA', 'AÇÃO CONJUNTA', 'FISCALIZAÇÃO E POLICIAMENTO - EVENTOS'];
    const guarnicoes = ['21', '31', '41', '51', '61', '71', '81', '91', '22', '32', '42', '52', '62', '72', '82', '92', 'C1', 'C2', 'C3', 'C4', 'C5'];
    const areas = ['CRUZEIRO', 'PARTENON', 'LESTE', 'RESTINGA', 'NORTE', 'EIXO BALTAZAR', 'PINHEIRO', 'EIXO SUL', 'CENTRO', 'CHARLIE', 'ROMU', 'DAZ'];

    const linhas = document.querySelectorAll('#resultado tbody tr');
    console.log(associacoes);
    linhas.forEach(linha => {
        const celulas = linha.querySelectorAll('td');
        for (let index = 0; index < celulas.length; index++) {
            if ((index == 1 || index == 3 || index == 4 || index == 6) && celulas[index].innerText.trim() == '') {
                celulas[index].closest('tr').classList.add('errada');
                celulas[index].style.backgroundColor = "#df6060";
                continue;
            }
            if (index == 3 && !naturezas.includes(celulas[3].innerText.trim())) {
                celulas[3].closest('tr').classList.add('errada');
                celulas[3].style.backgroundColor = "#df6060";
                continue;
            }
            if (index == 4 && (!qthsNomes.find(qth => celulas[4].innerText.includes(qth)) && (!associacoes[celulas[4].innerText.trim()] || (!associacoes[celulas[4].innerText.trim()].place && !associacoes[celulas[4].innerText.trim()].street)))) {
                celulas[4].closest('tr').classList.add('errada');
                celulas[4].style.backgroundColor = "#df6060";
                continue;
            }
            if (qthsNomes.find(qth => celulas[4].innerText.includes(qth))) {
                celulas[5].querySelector('div.associacao').innerText = qthsNomes.find(qth => celulas[4].innerText.includes(qth));
            } else if (associacoes[celulas[4].innerText.trim()]) {
                const ass = associacoes[celulas[4].innerText.trim()];
                celulas[5].querySelector('div.associacao').innerText = `${ass.place} - ${ass.street}, ${ass.number} - ${ass.neighborhood}`;
            };
            if (index == 6 && (!guarnicoes.find(guarnicao => celulas[6].innerText.includes(guarnicao)) && !areas.find(area => celulas[6].innerText.includes(area)))) {
                celulas[6].closest('tr').classList.add('errada');
                celulas[6].style.backgroundColor = "#df6060";
                continue;
            }
            celulas[index].style.backgroundColor = "white";
        }
    })
}

async function listarLocais() {

    const response = await fetch(
        "https://sentry.procempa.com.br/web/place/list",
        {
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            body: JSON.stringify({
                filter: [],
                page: 1,
                size: 1000,
                sort: [
                    {
                        field: "name",
                        dir: "asc"
                    }
                ]
            }),
            method: "POST",
            credentials: "include"
        }
    );

    const dados = await response.json();

    return dados;
}





async function associarLocal(local) {
    sessionStorage.setItem('associarLocal', local.innerText.trim());
    document
        .getElementById('iframeMapa')
        .src = 'https://sentry.procempa.com.br/web/despacho/attendance/create';

    new mdb.Modal(
        document.getElementById('modalMapa')
    ).show();
    document
        .getElementById('modalMapa')
        .addEventListener('hidden.mdb.modal', () => {
            document.getElementById('iframeMapa').src = '';
        });

    const intervalFinalizouAssociacao = setInterval(async () => {
        if (sessionStorage.getItem('associacao') != 'pronta') return;
        clearInterval(intervalFinalizouAssociacao);
        mdb.Modal.getInstance(document
            .getElementById('modalMapa'))?.hide();

        const associacaoPronta = JSON.parse(sessionStorage.getItem('associarLocal'));
        Object.assign(associacoes, associacaoPronta);
        dadosAssociacoesEAtendimentos = associacoes;
        await salvarAssociacoesEAtendimentos(dadosAssociacoesEAtendimentos);
        conferirDados();
        sessionStorage.removeItem('associacao');
        sessionStorage.removeItem('associarLocal');

    }, 1000);
}

function selecionarTodasAsDemandas(input) {
    if (!input.closest('th')) return;
    const checks = document.querySelectorAll('#resultado tbody tr:not([style="display: none;"]) input.selecionaDemanda');
    checks.forEach(check => {
        check.checked = input.checked;
    })
}

function ajustaNumOSInicial() {
    const dataObj = new Date();
    const anoAtual = dataObj.getFullYear();
    const primeiroDeJaneiro = new Date(anoAtual, 0, 1);
    const diasDesdePrimeiroDeJaneiro =
        Math.ceil(
            (dataObj - primeiroDeJaneiro)
            / (1000 * 60 * 60 * 24)
        );
    return [diasDesdePrimeiroDeJaneiro * 2, anoAtual];
}

async function importarOS() {
    const numOS = `OS n.º ${document.querySelector('#numOS').value}/${document.querySelector('#ano').value}`
    const demandas = Array.from(document.querySelectorAll('#resultado tbody tr:not([class="errada"])'));
    const demandasProntas = demandas.map(demanda => {
        /*
        {"name":"OS n.º 315/2026 - PARQUES E PRAÇAS - 700 (2)","dateUsageMin":"2026-06-07","dateUsageMax":"2026-06-07","description":"Efetuar patrulhamentos preventivos com a finalidade de garantir a segurança dos munícipes e usuários dos parques urbanos. Inspecionar locais e instalações com intuito de verificar se há indícios de depredação, furto de fios e cabos, invasão ou ocupação irregular de próprio municipal. Efetuar abordagens a indivíduos em atividades que consistam em atitudes suspeitas. Inibir a ação de guardadores de veículos nas vias.","attachment":[],"groups":{"teams":[],"intendedFunctions":[],"sectors":["Subintendência Regional Eixo Baltazar"],"weekdays":[]},"activities":[{"hours":{"type":"FIXED","startHour":"15:00","startChangeDay":false,"endChangeDay":false,"allowRepeat":false},"duration":"03:00","reason":"Patrulhamento Preventivo","description":"Ponto de parada base visando inibir ação de ambulantes.","address":{"district":"RS","city":"PORTO ALEGRE","neighborhood":"PRAIA DE BELAS","street":"Avenida Edvaldo Pereira Paiva","number":"458","latitude":-30.055608,"longitude":-51.233739,"sectors":[]}}]}
        */
        const celulas = demanda.querySelectorAll('td');
        const dataOS = obterDataPorOS(document.querySelector('#numOS').value, document.querySelector('#ano').value)
        const nome = celulas[1].innerText;
        const finalidade = celulas[2].innerText;
        const naturezas = ['Patrulhamento Preventivo', 'Ação Própria', 'Ação Integrada', 'Ação Conjunta', 'Fiscalização e Policiamento em Eventos'];
        const natureza = naturezas.find(nat => nat.toUpperCase().includes(celulas[3].innerText.substring(0, 10)));
        const local = verificarEndereco(celulas[4].innerText.split('<div')[0].trim());
        console.log(local);
        const recurso = verificarQualArea(celulas[6].innerText);
        const dadosHorario = verificarHorario(celulas[7].innerText);
        const horárioInicial = dadosHorario.inicio;
        const horarioFinal = dadosHorario.fim;
        const duracao = dadosHorario.duracao;
        const iniciarOutroDia = dadosHorario.iniciarOutroDia;
        const terminarOutroDia = dadosHorario.terminarOutroDia;
        const atividade = celulas[8].innerText;
        const horarioFixo = celulas[9].querySelector('input').checked ? 'FIXED' : 'INTERVAL';
        const repetir = celulas[10].querySelector('input').checked;
        const demandaObj = {};
        demandaObj.name = `${numOS} - ${nome} - ${celulas[4].innerText} - ${recurso.numeralArea} - ${celulas[7].innerText}`;
        demandaObj.dateUsageMin = dataOS;
        demandaObj.dateUsageMax = dataOS;
        demandaObj.description = finalidade;
        demandaObj.attachment = [];
        demandaObj.groups = {
            "teams": [],
            "intendedFunctions": [],
            "sectors": [recurso.subintendencia],
            "weekdays": []
        };
        demandaObj.activities = [
            {
                "hours":
                {
                    "type": horarioFixo,
                    "startHour": horárioInicial,
                    "startChangeDay": iniciarOutroDia,
                    "endChangeDay": terminarOutroDia,
                    "allowRepeat": repetir
                },
                "duration": horarioFixo == 'FIXED' ? '' : duracao,
                "reason": natureza,
                "description": atividade,
                "address": local
            }
        ];
        if (horarioFixo == 'INTERVAL') demandaObj.activities[0].hours.endHour = horarioFinal;
        return demandaObj;
    });
    const resultados = await Promise.all(
        demandasProntas.map(async demanda => {
            return await cadastrarAtividadeProgramada(demanda);
        })
    );
    atualizarOSRotinas(document.querySelector('#numOS').value + '/' + document.querySelector('#ano').value);
    sessionStorage.setItem('aguardandoEnvioOS', 'sim');
    setInterval(() => {
        if (!sessionStorage.getItem('aguardandoEnvioOS')) window.location.reload();
    }, 100);
}

function verificarQualArea(gu) {
    const areas = {
        2: { numeralArea: 200, subintendencia: "Subintendência Regional Cruzeiro" },
        3: { numeralArea: 300, subintendencia: "Subintendência Regional Partenon" },
        4: { numeralArea: 400, subintendencia: "Subintendência Regional Leste" },
        5: { numeralArea: 500, subintendencia: "Subintendência Regional Restinga" },
        6: { numeralArea: 600, subintendencia: "Subintendência Regional Norte" },
        7: { numeralArea: 700, subintendencia: "Subintendência Regional Eixo Baltazar" },
        8: { numeralArea: 800, subintendencia: "Subintendência Regional Pinheiro" },
        9: { numeralArea: 900, subintendencia: "Subintendência Regional Eixo Sul" },
        'R': { numeralArea: 1000, subintendencia: "Subintendência da Ronda Ostensiva Municipal" },
        'P': { numeralArea: 1100, subintendencia: "Subintendência da Patam" },
        'C': { numeralArea: 1200, subintendencia: "Subintendência Regional Centro" },
        'D': { numeralArea: 1500, subintendencia: "Divisão de Ação Zoneada" },
    }
    const area = areas[gu.toUpperCase().replaceAll('\n', '').replaceAll('GU', '').replaceAll('GM', '').replaceAll('GCM', '').trim().charAt(0)];
    if (!area) return console.log(gu, 'não encontrado');
    return area;
}

function verificarEndereco(local) {
    const l = qths.data.data.find(qth => local.includes(qth.name)) || associacoes[local];
    const endereco = {
        "place": l.name || l.place,
        "placeType": l.type || l.placeType,
        "district": l.district || l.state,
        "city": l.city,
        "neighborhood": l.neighborhood,
        "street": l.street,
        "number": l.number,
        "latitude": l.latitude,
        "longitude": l.longitude,
        "sectors": []
    }
    return endereco;
}

function verificarHorario(texto) {
    const partes = texto.split(/\s*x\s*/i);

    const inicio = partes[0];

    const numOS = document.querySelector('#numOS').value;

    let iniciarOutroDia = false;

    const ehOutroDia = (hora) => {
        const [h, m] = hora.split(':').map(Number);
        return (h * 60 + m) < (6 * 60 + 30);
    };

    if (parseInt(numOS) % 2 == 0) {
        iniciarOutroDia = ehOutroDia(inicio);
    }


    if (partes.length === 1) {
        return {
            inicio,
            fim: null,
            duracao: "00:00",
            iniciarOutroDia,
            terminarOutroDia: false
        };
    }

    const fim = partes[1];
    const terminarOutroDia = ehOutroDia(fim);

    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = fim.split(':').map(Number);

    let inicioMin = h1 * 60 + m1;
    let fimMin = h2 * 60 + m2;

    if (fimMin <= inicioMin) {
        fimMin += 24 * 60;
    }

    const duracaoMin = fimMin - inicioMin;

    return {
        inicio,
        fim,
        duracao:
            String(Math.floor(duracaoMin / 60)).padStart(2, '0') +
            ':' +
            String(duracaoMin % 60).padStart(2, '0'),
        iniciarOutroDia,
        terminarOutroDia
    };
}

function obterDataPorOS(numeroOS, ano) {
    const diasDesdePrimeiroDeJaneiro =
        Math.floor((numeroOS - 1) / 2);

    const data = new Date(ano, 0, 1);
    data.setDate(data.getDate() + diasDesdePrimeiroDeJaneiro);

    const yyyy = data.getFullYear();
    const mm = String(data.getMonth() + 1).padStart(2, '0');
    const dd = String(data.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

async function atualizarOSRotinas(numOS) {
    const atividadesProgramadasIds = await buscarOS(numOS);

    const atividadesProgramadas = await Promise.all(
        atividadesProgramadasIds.map(atividade =>
            buscarAtividadeProgramada(atividade.id)
        )
    );
    let dataOS;
    const atividadesProntasParaEnvio = {};

    atividadesProgramadas.forEach(atividade => {
        const id = atividade.schedule.id;

        const dadosAtividade = atividade.schedule;
        atividadesProntasParaEnvio[id] = {};
        atividadesProntasParaEnvio[id].nomeDemanda = atividade.schedule.name.split(' - ')[1];
        atividadesProntasParaEnvio[id].finalidade = atividade.schedule.description;
        atividadesProntasParaEnvio[id].natureza = atividade.schedule.activities[0].reason;
        const enderecoDados = atividade.schedule.activities[0].address;
        atividadesProntasParaEnvio[id].qth = enderecoDados.place || '';
        atividadesProntasParaEnvio[id].endereco = `${enderecoDados.street}${enderecoDados.number ? ', ' + enderecoDados.number : ''} - ${enderecoDados.neighborhood}`;
        atividadesProntasParaEnvio[id].area = atividade.schedule.groups.sectors[0];
        const horaInicial = atividade.schedule.activities[0].hours.startHour;
        let horaFinal = '';
        if (atividade.schedule.activities[0].hours.endHour) horaFinal = atividade.schedule.activities[0].hours.endHour;
        if (atividade.schedule.activities[0].hours.duration) {
            const [h, m] = horaInicial.split(':').map(Number);
            const [dh, dm] = atividade.schedule.activities[0].hours.duration.split(':').map(Number);

            const data = new Date();
            data.setHours(h, m, 0, 0);

            data.setMinutes(data.getMinutes() + (dh * 60) + dm);

            horaFinal = data.toTimeString().slice(0, 5);
        }
        if (!dataOS) dataOS = new Date(atividade.schedule.dateUsageMin).toISOString();
        const [ano, mes, dia] = atividade.schedule.dateUsageMin.split('-');
        atividadesProntasParaEnvio[id].dataHoraInicial = (new Date(atividade.schedule.dateUsageMin + ' ' + horaInicial)).toISOString();
        const diaFinal = horaFinal.split(':').map(Number)[0] < horaInicial.split(':').map(Number)[0] ? parseInt(dia) + 1 : dia;
        atividadesProntasParaEnvio[id].dataHoraFinal = (new Date(atividade.schedule.dateUsageMax + ' ' + horaFinal)).toISOString();
    })
    window.postMessage({ type: "enviarOSRotinas", data: atividadesProntasParaEnvio }, "*");
}






