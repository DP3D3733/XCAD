let qths;
let associacoes;
main();
async function main() {
    associacoes = await buscarAssociacoes();
    qths = await listarLocais();
    criarBotaoImportarOS();

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
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Importar OS</h3>
                </div>
                <div class="modal-body">
                    <input type="file" id="arquivo" accept=".zip">
                    <div id="resultado"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-mdb-dismiss="modal" aria-label="Close">Ok</button>
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
        associacoes = await buscarAssociacoes();

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

    let secaoAtual = '';
    let finalidadeAtual = '';
    let naturezaAtual = '';

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

    let html = `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
        <thead>
            <tr>
                <th></th>
                <th>SEÇÃO</th>
                <th>FINALIDADE</th>
                <th>NATUREZA</th>
                <th>LOCAL</th>
                <th>RECURSO</th>
                <th>HORÁRIO</th>
                <th>ATIVIDADE</th>
                <th>PB?</th>
                <th>REPETIR?</th>
            </tr>
        </thead>
        <tbody>
            `;
    const botoesDemandaOS = gerarBotoesOS();
    for (const item of dados) {

        html += `
            <tr>
                <td style="border:1px solid #ccc;padding:8px">${botoesDemandaOS || ''}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.secao)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.finalidade)}</td>
                <td contenteditable="true" style="border:1px solid #ccc;padding:8px">${escapeHtml(item.natureza)}</td>
                <td style="
                    border:1px solid #ccc;
                    padding:8px;
                    position:relative;
                "
                onmouseenter="this.querySelector('.acoes').style.display='flex'"
                onmouseleave="this.querySelector('.acoes').style.display='none'">

                    ${escapeHtml(item.local).replaceAll('\n', '<br>')}

                    <div class="acoes"
                        style="
                            display:none;
                            position:absolute;
                            top:4px;
                            right:4px;
                            gap:4px;
                        ">
                        <button onclick="associarLocal(this.closest('td'))">📍</button>
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
    botaoExcluirDemanda.setAttribute('onclick', 'excluirDemandaOS(this)')
    const botoes = document.createElement('div');
    botoes.appendChild(botaoExcluirDemanda);
    return botoes.outerHTML;
}

function excluirDemandaOS(botao) {
    botao.closest('tr').remove();
}

function conferirDados() {
    const qthsNomes = qths.data.data.map(qth => qth.name);
    const naturezas = ['PATRULHAMENTO PREVENTIVO', 'AÇÃO PRÓPRIA', 'AÇÃO INTEGRADA', 'AÇÃO CONJUNTA', 'FISCALIZAÇÃO E POLICIAMENTO - EVENTOS'];
    const guarnicoes = ['21', '31', '41', '51', '61', '71', '81', '91', '22', '32', '42', '52', '62', '72', '82', '92', 'C1', 'C2', 'C3', 'C4', 'C5'];
    const areas = ['CRUZEIRO', 'PARTENON', 'LESTE', 'RESTINGA', 'NORTE', 'EIXO BALTAZAR', 'PINHEIRO', 'EIXO SUL', 'CENTRO', 'CHARLIE', 'ROMU'];

    const linhas = document.querySelectorAll('#resultado tbody tr');
    linhas.forEach(linha => {
        const celulas = linha.querySelectorAll('td');
        for (let index = 0; index < celulas.length; index++) {
            if ((index == 1 || index == 3 || index == 4 || index == 5) && celulas[index].innerText.trim() == '') {
                celulas[index].style.backgroundColor = "#df6060";
                continue;
            }
            if (index == 3 && !naturezas.includes(celulas[3].innerText.trim())) {
                celulas[3].style.backgroundColor = "#df6060";
                continue;
            }
            if (index == 4 && (!qthsNomes.find(qth => celulas[4].innerText.includes(qth)) && !associacoes[celulas[4].innerHTML.split('<div')[0].trim()])) {
                celulas[4].style.backgroundColor = "#df6060";
                continue;
            }
            if (index == 5 && (!guarnicoes.find(guarnicao => celulas[5].innerText.includes(guarnicao)) && !areas.find(area => celulas[5].innerText.includes(area)))) {
                celulas[5].style.backgroundColor = "#df6060";
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

async function buscarAssociacoes() {

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

async function salvarAssociacoes(associacoes) {
    const activityObservation = JSON.stringify(associacoes);
    const dados = await fetch(
        'https://sentry.procempa.com.br/despacho/activity/8',
        {
            credentials: 'include'
        }
    ).then(r => r.json());

    const atividade = dados.activity;

    const payload = {
        onDuty: atividade.onDuty.split('-').reverse().join('/'),
        activityObservation: activityObservation,
        bossInspector: String(atividade.bossInspector),
        garrison: atividade.garrison,
        bos: atividade.bos,
        systemUpdate: atividade.systemUpdate
    };

    const response = await fetch(
        'https://sentry.procempa.com.br/despacho/activity/8',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );

    const texto = await response.text();

    return texto;
}

function associarLocal(local) {
    sessionStorage.setItem('associarLocal', local.innerHTML.split('<div')[0].trim());
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
        salvarAssociacoes(associacoes);
        document.querySelector("#arquivo").dispatchEvent(
            new Event('change', {
                bubbles: true
            })
        );
        sessionStorage.removeItem('associacao');
        sessionStorage.removeItem('associarLocal');

    }, 1000);
}


