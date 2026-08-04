criarBotaoVisualizarOS();
inserirBotaoCopiarAtendimento();
inserirButtonNovosBAs();
verificarNovosBAs();
inserirBotaoQTHs();


function criarBotaoVisualizarOS() {
    setInterval(() => {
        if (document.querySelector('#buttonVisualizarOS')) return;
        const titulo = document.querySelector('h2.actual-title');
        const buttonVisualizarOS = document.createElement('button');
        buttonVisualizarOS.setAttribute('class', 'btn btn-xs btn-primary');
        buttonVisualizarOS.setAttribute('id', 'buttonVisualizarOS');
        buttonVisualizarOS.innerHTML = '<b>OS (O)</b>';
        document.querySelector('span.garrisonActionsButton').insertAdjacentElement('beforeEnd', buttonVisualizarOS);
        document.addEventListener("keydown", (e) => {

            if (e.key === "o" && buttonVisualizarOS) {
                buttonVisualizarOS.click();
            }

        });
        document.addEventListener("mousedown", (e) => {

            const modal = document.querySelector("#modalOS .modal-content");

            if (!modal.contains(e.target)) {

                document.querySelector("#modalOS").style.display = 'none';

                // ou:
                // $("#modalOS").modal("hide");
            }
        });
        buttonVisualizarOS.addEventListener('click', () => {
            document.querySelector('#modalOS').style.display = 'block';
            document.querySelector('#selectOS').dispatchEvent(new Event('input', {
                bubbles: true,
                cancelable: true
            }));
        });
        if (document.querySelector('#modalOS')) return;
        const modal = document.createElement('div');
        modal.setAttribute('class', "modal inmodal");
        modal.setAttribute('id', "modalOS");
        modal.setAttribute('style', "display:none");
        modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Ordem de Serviço</h3>
                </div>
                <div class="modal-body">
                    OS: <select id="selectOS"><option>Selecione</option></select>
                    <br><br>
                    <div id="tabela-os"></div>
                    <br><br>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-mdb-dismiss="modal" aria-label="Close">Ok</button>
                </div>
            </div>
        </div>`
        document.querySelector('body').insertAdjacentElement('beforeEnd', modal);
        const select = document.querySelector('#selectOS');
        criarTabelaOS();

        (async () => {
            const numOSs = await buscarNumerosOSCadastradas();
            if (!numOSs.length) return;
            document.querySelector('#selectOS').innerHTML = '<option>Selecione</option>';
            numOSs.forEach(num => {
                select.innerHTML += `<option value="${num}">${num}</option>`;
            });
            const osSelecionada = localStorage.getItem('osSelecionada');
            if (!osSelecionada || !select.querySelector(`option[value="${osSelecionada}"]`)) return;
            select.querySelector(`option[value="${osSelecionada}"]`).selected = true;
            montarOS(osSelecionada);
        })();

        select.addEventListener('change', async function () {
            await montarOS(this.value);
            localStorage.setItem('osSelecionada', select.value);
        });
        modal.querySelector('button[data-mdb-dismiss="modal"]').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }, 500);
}

async function montarOS(numOS) {
    const modalBody = document.querySelector('#modalOS div.modal-body');

    const demandas = await buscarOS(numOS);


    const resultados = await Promise.all(
        demandas.map(async demanda => ({
            demanda,
            atividadeProgramada: await buscarAtividadeProgramada(demanda.id)
        }))
    );

    const pesquisaAtendimento = await Promise.all(
        resultados.map(async ({ demanda, atividadeProgramada }) => {
            const dataInicialCrua = atividadeProgramada.schedule.dateUsageMin || new Date().toISOString().split("T")[0];
            if (dataInicialCrua) {
                const dataInicialArray = dataInicialCrua.split('-');
                dataInicialPronta =
                    `${dataInicialArray[2]}/${dataInicialArray[1]}/${dataInicialArray[0]} 00:00`;
            }


            const dataFinalCrua = atividadeProgramada.schedule.dateUsageMax || new Date().toISOString().split("T")[0];
            if (dataFinalCrua) {
                const dataFinalArray = dataFinalCrua.split('-');
                dataFinalPronta =
                    `${dataFinalArray[2]}/${dataFinalArray[1]}/${dataFinalArray[0]} 23:59`;
            }

            const guarnicoes = await buscarGuarnicoes(
                dataInicialPronta,
                dataFinalPronta
            );

            const guarnicoesComAtendimento = await Promise.all(
                guarnicoes.map(async (guarnicao) => ({

                    ...guarnicao,

                    atividadesProgramadas:
                        await buscarAtendimentoAtividadeProgramada(
                            guarnicao.garrison_id,
                            atividadeProgramada.schedule.id
                        )
                }))
            );

            const atendimentos = guarnicoesComAtendimento.filter(
                guarnicao => guarnicao.atividadesProgramadas.length > 0
            );
            if (atendimentos[0]?.atividadesProgramadas) {
                atendimentos[0].atividadesProgramadas[0].area = atividadeProgramada.schedule.groups.sectors[0].replaceAll('Subintendência', '').replaceAll('Regional', '').replaceAll(' da', '').trim();
            }
            return atendimentos;
        })
    );

    const pesquisaPronta = [];
    pesquisaAtendimento.forEach(guarnicao => {
        guarnicao.forEach(item => {
            item.atividadesProgramadas.forEach(atividade => {
                atividade.activities.forEach(act => {
                    const pesquisa = {};
                    pesquisa.nome = atividade.name.substring(18).split('-')[0];
                    pesquisa.area = atividade.area;
                    pesquisa.atividadeId = atividade.id;
                    pesquisa.id = act.dispatchList[0]?.dispatchId || '-';
                    pesquisa.local = act.placeDescr;
                    pesquisa.natureza = act.reason;
                    pesquisa.guarnicao = item.garrison_team;
                    pesquisa.inicio = act.startText || '';
                    pesquisa.duracao = act.duration || '';
                    pesquisa.status = act.status;
                    pesquisaPronta.push(pesquisa);
                })
            })
        })
    });
    const idsDemandasAssumidas = pesquisaPronta.map(pesquisa => pesquisa.atividadeId);
    resultados.forEach(result => {
        if (!idsDemandasAssumidas.includes(result.atividadeProgramada.schedule.id)) {
            const demanda = result.atividadeProgramada;
            demanda.schedule.activities.forEach(atv => {
                const pesquisa = {};
                pesquisa.nome = demanda.schedule.name.substring(18).split('-')[0];
                pesquisa.area = demanda.schedule.groups.sectors[0].replaceAll('Subintendência', '').replaceAll('Regional', '').replaceAll(' da', '').trim();
                pesquisa.id = '-';
                pesquisa.local = atv.address.place || atv.address.street;
                pesquisa.natureza = atv.reason;
                pesquisa.guarnicao = '?';
                pesquisa.inicio = atv.hours.startHour || '';
                pesquisa.duracao = atv.duration || '';
                pesquisa.status = '💤 Não assumida';
                pesquisaPronta.push(pesquisa);
            });
        }
    })
    const tabela = Tabulator.findTable("#tabela-os")[0];
    tabela.setData(pesquisaPronta);
}

function criarTabelaOS() {
    const tabela = new Tabulator("#tabela-os", {
        persistentConfig: true,

        persistence: {
            columns: true,      // ordem, largura e visibilidade
            filter: true,       // filtros
            sort: true,         // ordenação
            headerFilter: true  // filtros do cabeçalho
        },

        layout: "fitColumns",

        rowFormatter: function (row) {

            const data = row.getData();

            const element = row.getElement();

            if (data.status === "done") {
                row.getElement().style.backgroundColor = "#e8fff0";
            }

            if (data.status === "inProgress") {
                row.getElement().style.backgroundColor = "#fff8e1";
            }

            if (data.status === "todo") {
                row.getElement().style.backgroundColor = "#ffeaea";
            }

            if (data.status === "notDone") {
                row.getElement().style.backgroundColor = "#df6060";
                row.getElement().style.color = 'white';
            }

            row.getElement().style.cursor = "pointer";

            element.addEventListener("click", () => {
                const data = row.getData();

                if (data.id == '-') return;

                window.open(
                    `https://sentry.procempa.com.br/web/reports/dispatch_info?id=${data.id}`,
                    "_blank"
                );
            });
        },

        initialSort: [
            {
                column: "inicio",
                dir: "asc"
            }
        ],

        columnDefaults: {
            tooltip: function (e, cell) {
                const el = cell.getElement();
                if (el.scrollWidth > el.clientWidth) {
                    return cell.getValue();
                }

                return null;
            }
        },

        columns: [
            {
                title: "Título",
                field: "nome",
                widthGrow: 2,
                headerFilter: "input"
            },
            {
                title: "Área",
                field: "area",
                widthGrow: 2,
                headerFilter: "list",
                headerFilterParams: {
                    valuesLookup: true, // busca valores únicos da coluna
                    multiselect: true,
                    clearable: true
                },
                headerFilterFunc: function (headerValue, rowValue) {
                    if (!headerValue || headerValue.length === 0) {
                        return true;
                    }

                    return headerValue.includes(rowValue);
                }
            },
            {
                title: "Local",
                field: "local",
                widthGrow: 2,
                headerFilter: "input"
            },
            {
                title: "Natureza",
                field: "natureza",
                headerFilter: "input"
            },
            {
                title: "Início",
                field: "inicio",
                hozAlign: "center",
                widthGrow: 1.2,
                headerFilter: "input"
            },
            {
                title: "Guarnição",
                field: "guarnicao",
                hozAlign: "center",
                headerFilter: "input"
            },
            {
                title: "Duração",
                field: "duracao",
                hozAlign: "center",
                headerFilter: "input"
            },
            {
                title: "Status",
                field: "status",
                hozAlign: "center",
                headerFilter: "list",
                headerFilterParams: {
                    values: {
                        "": "Todos",
                        done: "Concluído",
                        todo: "Pendente",
                        inProgress: "Em andamento",
                        "💤 Não assumida": "Não assumida"
                    }
                },
                formatter: function (cell) {

                    const valor = cell.getValue();

                    if (valor === "done") {
                        return "✅ Concluído";
                    }

                    if (valor === "inProgress") {
                        return "🟡 Em andamento";
                    }

                    if (valor === "notDone") {
                        return "🤦‍♂️ Não realizada";
                    }

                    if (valor == "💤 Não assumida") return valor;

                    return "❌ Pendente";
                }
            }
        ]
    });
}



async function buscarNumerosOSCadastradas() {
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
                        value: "OS n.º "
                    },
                    {
                        field: "status",
                        type: "=",
                        value: "Ativo"
                    }
                ]
            })
        }
    );

    if (!response) return [];

    const data = await response.json();

    if (!data.data.length) return [];

    const numerosOS = data.data.map(atividade => atividade.name.match(/OS n\.º\s+(\d+\/\d+)/)?.[1]);
    const numerosOsArr = [...new Set(numerosOS)].slice(0, 4);

    return numerosOsArr;
}

async function buscarGuarnicoes(dataInicial, dataFinal) {
    const response = await fetch(
        "https://sentry.procempa.com.br/despacho/garrison/list",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filter: [
                    {
                        field: "garrison_start",
                        type: "keywords",
                        value: {
                            dtStart: dataInicial,
                            dtEnd: dataFinal
                        }
                    }
                ]
            })
        }
    );

    if (!response) return [];

    const data = await response.json();

    if (!data.data.length) return [];

    return data.data
}

async function buscarAtendimentoAtividadeProgramada(guarnicaoId, atividadeId) {
    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/garrison/getGarrisonSchedule/${guarnicaoId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!response) return false;

    const data = await response.json();
    const atendimentosDaAtividade = data.filter(atividade => atividade.id == atividadeId);
    return atendimentosDaAtividade;
}

function inserirBotaoCopiarAtendimento() {
    setInterval(() => {
        const buttonMapaAtendimento = document.querySelector('button[id*="gisEventAttendance"]');
        if (!buttonMapaAtendimento) return;

        const buttonCopiarParaWhatsAppMenu = document.querySelector('#buttonCopiarParaWhatsAppMenu');
        if (buttonCopiarParaWhatsAppMenu) return;

        const id = buttonMapaAtendimento.getAttribute('id').split('-')[1];
        buttonMapaAtendimento.insertAdjacentHTML('beforeBegin', `
        <button type="button" class="btn btn-primary btn-xs dash-info-edit" id="buttonCopiarParaWhatsAppMenu" onclick="copiarAtendimentoParaWhatsApp(${id})">
            <i class="fa fa-copy"></i>
        </button>`);
    }, 1000);
}

function inserirBotaoQTHs() {
    setInterval(() => {
        const buttonAjuda = document.querySelector('button[data-mdb-target="#garrison-help"]');
        if (!buttonAjuda) return;

        const buttonVerQTHs = document.querySelector('#buttonVerQTHs');
        if (buttonVerQTHs) return;

        buttonAjuda.insertAdjacentHTML('beforeBegin', `
        <button type="button" class="btn btn-xs btn-help-cards" id="buttonVerQTHs" onclick="verQTHS()" title="QTHs">
            <i class="fa fa-map-pin"></i>
        </button>`);

        buttonAjuda.parentNode.setAttribute('style', 'display: inline-flex;align-items: center;gap: 4px;width: fit-content');
    }, 1000);
}

async function verQTHS() {
    const modalQTH = document.querySelector('#modalQTH');
    if (!modalQTH) {
        const qths = await baixarQTHs();
        if (!qths) return;
        inserirModalQTHs(qths);


        criarTabelaQth(qths);
    }
    document.querySelector('#modalQTH').style.display = 'block';

}

function inserirModalQTHs(qths) {
    if (document.querySelector('#modalQTH')) return;
    const modal = document.createElement('div');
    modal.setAttribute('class', "modal inmodal");
    modal.setAttribute('id', "modalQTH");
    modal.setAttribute('style', "display:none");
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Setores</h3>
                </div>
                <div class="modal-body">
                    <div id="tabela-qth"></div>
                    <br><br>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-mdb-dismiss="modal" aria-label="Close">Ok</button>
                    <button id="baixarQTHsButton" class="btn btn-default" aria-label="Baixar">Baixar</button>
                </div>
            </div>
        </div>`
    document.querySelector('body').insertAdjacentElement('beforeEnd', modal);
    document.addEventListener("mousedown", (e) => {
        const modal = document.querySelector("#modalQTH .modal-content");
        if (!modal.contains(e.target)) {
            document.querySelector("#modalQTH").style.display = 'none';
        }
    });
    modal.querySelector('button[data-mdb-dismiss="modal"]').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modal.querySelector('#baixarQTHsButton').addEventListener('click', () => {
        baixarCSV(qths);
    });

}

function baixarCSV(jsonData, filename = "dados.csv") {
    if (!jsonData || !jsonData.length) {
        console.warn("Nenhum dado encontrado para exportar.");
        return;
    }

    const headers = Object.keys(jsonData[0]);
    const csvRows = [];

    // Cabeçalho
    csvRows.push(headers.join(";"));

    // Dados
    for (const row of jsonData) {
        const values = headers.map(header => {
            let val = row[header] === null || row[header] === undefined ? "" : row[header];

            // Se for número (como lat/lng -29.99387), converte para string
            if (typeof val === "number") {
                val = String(val);
            } else {
                val = String(val);
            }

            // Se for um valor numérico com ponto decimal (ex: -29.99387 ou -51.22184),
            // troca o ponto por vírgula para o Excel do Brasil não inventar pontos de milhar
            if (/^-?\d+\.\d+$/.test(val.trim())) {
                val = val.trim().replace(".", ",");
            }

            // Escapa aspas duplas
            val = val.replace(/"/g, '""');

            // Envolve em aspas apenas se contiver ponto e vírgula ou quebras de linha
            if (val.includes(";") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
                val = `"${val}"`;
            }

            return val;
        });

        csvRows.push(values.join(";"));
    }

    const csvString = csvRows.join("\r\n");

    // UTF-8 BOM para abrir com acentuação correta no Excel
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

function criarTabelaQth(qths) {
    const tabela = new Tabulator("#tabela-qth", {
        maxHeight: "500px",
        data: qths,
        persistentConfig: true,
        pagination: "local",
        locale: "pt-br",
        // 2. Personaliza ou traduz os termos da tabela
        langs: {
            "pt-br": {
                "pagination": {
                    "page_size": "Mostrar",             // Rótulo do seletor de quantidade (ex: "Mostrar 10")
                    "page_title": "Ir para a página",    // Tooltip dos números das páginas
                    "first": "Primeira",                 // Botão Primeira Página
                    "first_title": "Primeira Página",    // Tooltip do botão Primeira
                    "last": "Última",                    // Botão Última Página
                    "last_title": "Última Página",       // Tooltip do botão Última
                    "prev": "Anterior",                  // Botão Página Anterior
                    "prev_title": "Página Anterior",     // Tooltip do botão Anterior
                    "next": "Próxima",                   // Botão Próxima Página
                    "next_title": "Próxima Página",      // Tooltip do botão Próxima
                    "all": "Todos",                      // Texto para a opção 'true' do selector
                }
            }
        },

        // 2. Define a quantidade de itens por página
        paginationSize: 10,

        // 3. (Opcional) Adiciona o seletor para o usuário escolher o tamanho (ex: 5, 10, 20, 50)
        paginationSizeSelector: [5, 10, 20, 50, true], // 'true' adiciona a opção "Todos"

        // 4. (Opcional) Define quantas páginas são mostradas nos botões do rodapé
        paginationButtonCount: 5,

        persistence: {
            columns: true,      // ordem, largura e visibilidade
            filter: true,       // filtros
            sort: true,         // ordenação
            headerFilter: true  // filtros do cabeçalho
        },

        layout: "fitColumns",

        rowFormatter: function (row) {

            const data = row.getData();

            const element = row.getElement();

            row.getElement().style.cursor = "pointer";

            element.addEventListener("click", () => {
                const data = row.getData();

                if (data.id == '-') return;

                if (event.ctrlKey) {
                    window.open(
                        `https://sentry.procempa.com.br/web/place/${data.id}/edit`,
                        "_blank"
                    );
                    return;
                }

                window.open(
                    `https://www.google.com/maps/d/u/0/viewer?mid=1bfLD9QS9_oIRo5AXkl9IaIpvcfDkiAw&ll=${data.latitude}%2C${data.longitude}&z=20`,
                    "_blank"
                );
            });
        },

        initialSort: [
            {
                column: "name",
                dir: "asc"
            }
        ],


        columnDefaults: {
            tooltip: function (e, cell) {
                const el = cell.getElement();
                if (el.scrollWidth > el.clientWidth) {
                    return cell.getValue();
                }

                return null;
            }
        },

        columns: [
            {
                title: "Nome",
                field: "name",
                headerFilter: "input",
                sorter: function (a, b) {
                    // Força conversão para string e remove espaços das pontas
                    var strA = String(a || "").trim();
                    var strB = String(b || "").trim();

                    // Extrai a primeira sequência numérica encontrada no início do texto
                    var matchA = strA.match(/^\d+/);
                    var matchB = strB.match(/^\d+/);

                    // Converte explicitamente para número (ou NaN se não houver número)
                    var numA = matchA ? Number(matchA[0]) : NaN;
                    var numB = matchB ? Number(matchB[0]) : NaN;
                    var temNumA = !isNaN(numA);
                    var temNumB = !isNaN(numB);

                    // 1. Caso ambos comecem com número
                    if (temNumA && temNumB) {
                        if (numA !== numB) {
                            return numA - numB; // Ordenação numérica pura (101 < 1000)
                        }
                        // Se os números forem iguais (ex: "100 RUA A" vs "100 RUA B"), ordena o restante alfabeticamente
                        return strA.localeCompare(strB, "pt-BR", { sensitivity: "base" });
                    }

                    // 2. Se apenas 'A' tem número -> 'A' vem primeiro
                    if (temNumA) return -1;

                    // 3. Se apenas 'B' tem número -> 'B' vem primeiro
                    if (temNumB) return 1;

                    // 4. Se nenhum tem número -> Ordenação alfabética simples
                    return strA.localeCompare(strB, "pt-BR", { sensitivity: "base" });
                }
            },
            {
                title: "Endereço",
                field: "street",
                headerFilter: "input",
                formatter: function (cell, formatterParams, onRendered) {
                    var rowData = cell.getData(); // Pega o objeto da linha inteira
                    const ruaNumero = rowData.street ? `${rowData.street} ${rowData.number},` : '';
                    const bairro = rowData.neighborhood ? `${rowData.neighborhood} -` : '';
                    // Retorna a combinação de HTML que você precisa
                    return `${ruaNumero} ${bairro} ${rowData.citystate}`;
                },
            },
            {
                title: "Latitude",
                field: "latitude",
                headerFilter: "input"
            },
            {
                title: "Longitude",
                field: "longitude",
                headerFilter: "input"
            },
            {
                title: "Tipo",
                field: "type",
                headerFilter: "input"
            },
            {
                title: "Contato",
                field: "contact",
                headerFilter: "input"
            },
            {
                title: "Ramal",
                field: "phone",
                headerFilter: "input"

            }
        ]
    });
}

async function baixarQTHs() {
    const response = await fetch("https://sentry.procempa.com.br/web/place/list", {
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
        },
        body: JSON.stringify({
            filter: [],
            page: 1,
            size: 2000,
            sort: [
                {
                    field: "id",
                    dir: "desc"
                }
            ]
        }),
        method: "POST",
        credentials: "include"
    });

    if (!response) return false;

    const dados = await response.json();
    return dados.data.data;
}

async function copiarAtendimentoParaWhatsApp(id) {
    let dadosAtendimento = await buscarAtendimento(id);
    if (!dadosAtendimento) return;
    dadosAtendimento.attendance.userCreated = dadosAtendimento.userCreated;
    dadosAtendimento = dadosAtendimento.attendance;
    const data = new Date(dadosAtendimento.systemUpdate);
    const dataFormatada =
        String(data.getDate()).padStart(2, '0') + '/' +
        String(data.getMonth() + 1).padStart(2, '0') + '/' +
        data.getFullYear() + ', ' +
        String(data.getHours()).padStart(2, '0') + ':' +
        String(data.getMinutes()).padStart(2, '0');

    const qthFato = dadosAtendimento.factPlace ? dadosAtendimento.factPlace + ' - ' : '';
    const enderecoFato = `${dadosAtendimento.factStreet ? dadosAtendimento.factStreet + ', ' : ''}${dadosAtendimento.factNumber ? dadosAtendimento.factNumber + ' - ' : ''}${dadosAtendimento.factNeighborhood ? dadosAtendimento.factNeighborhood : ''}`;
    const linkEndereco = dadosAtendimento.factLatitude && dadosAtendimento.factLongitude ? `https://www.google.com/maps?q=${dadosAtendimento.factLatitude},${dadosAtendimento.factLongitude}` : '';

    let mensagem = `*Demanda via ${dadosAtendimento.channel}*
                
*🚨ATIVAR AS CÂMERAS CORPORAIS🚨*

*Data-hora:* ${dataFormatada}

*Natureza:* ${dadosAtendimento.nature}

*Situação:*  ${dadosAtendimento.transcription}

*Endereço:*
    ${qthFato}${enderecoFato}
    ${linkEndereco}

*Contato denunciante:*
    *Nome:* ${dadosAtendimento.contactName || '-'}
    *Número:* ${dadosAtendimento.contactPhone || '-'}
    `;

    const obsSamu = dadosAtendimento.nature == 'Apoio ao Samu' ? `
Definir ponto de encontro e aguardar liberação para deslocamento.` : '';

    mensagem += obsSamu;

    try {
        await navigator.clipboard.writeText(mensagem);

        document.querySelector('#buttonCopiarParaWhatsAppMenu').innerHTML = '<i class="fa fa-check"></i>';
        setTimeout(() => {
            document.querySelector('#buttonCopiarParaWhatsAppMenu').innerHTML = '<i class="fa fa-copy"></i>';
        }, 1000);
    } catch (erro) {
        console.error("Erro ao copiar:", erro);
        return;
    }
}

function inserirButtonNovosBAs() {
    const buttonNovosBAs = `<button id="btnNovosBAs" title="Abrir BAs pendentes" onclick=window.location.href="https://sentry.procempa.com.br/web/bos?pendentes=true" style="
        display:none;
        position:fixed;
        top:20px;
        right:20px;
        z-index:999999;
        background:#fff;
        border:1px solid #ccc;
        color: white;
        background-color: #eb595e;
        border-radius:10px;
        padding:10px 10px;
        align-items:center;
        box-shadow:0 2px 10px rgba(0,0,0,.2);
        cursor:pointer;
        height:20px;
        font-size:15px;
        gap: 5px;
    "
>
    <span id="contadorNovosBAs">0</span>
    <i class="fa fa-file"></i>
</button>`

    const tituloCAD = document.querySelector('#page-wrapper h2');
    if (tituloCAD.innerText != 'Central de Atendimento e Despacho') return;
    tituloCAD.insertAdjacentHTML('beforeend', buttonNovosBAs);
    verificarNovosBAs();
    setInterval(() => {
        verificarNovosBAs();
    }, 10000);
}

async function verificarNovosBAs() {
    const response = await fetch("https://sentry.procempa.com.br/web/bos/list", {
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
        },
        body: JSON.stringify({
            filter: [
                { field: "status", type: "in", value: ["PENDING"] }
            ],
            page: 1,
            size: 20,
            sort: [
                {
                    field: "id",
                    dir: "desc"
                }
            ]
        }),
        method: "POST",
        credentials: "include"
    });

    const dados = await response.json();
    const qtdNovosBAs = dados.data.data.length;
    document.querySelector('#btnNovosBAs').style.display = 'none';
    if (qtdNovosBAs == 0) return;
    document.querySelector('#contadorNovosBAs').innerText = qtdNovosBAs;
    document.querySelector('#btnNovosBAs').style.display = 'flex';
}
inserirFiltroEquipes();
function inserirFiltroEquipes() {
    const filtroOrigem = document.querySelector('#garrisons-subtitles div.div-garrison-filter-counter:nth-child(2)');
    if (!filtroOrigem) return;

    const filtroEquipes = filtroOrigem.cloneNode(true);
    const areasId = ['2', '3', '4', '5', '6', '7', '8', '9', 'C', 'R', 'D'];
    const areasNome = [
        "Subintendência Regional Cruzeiro",
        "Subintendência Regional Partenon",
        "Subintendência Regional Leste",
        "Subintendência Regional Restinga",
        "Subintendência Regional Norte",
        "Subintendência Regional Eixo Baltazar",
        "Subintendência Regional Pinheiro",
        "Subintendência Regional Eixo Sul",
        "Subintendência Regional Centro",
        "Subintendência da Ronda Ostensiva Municipal",
        "Divisão de Ação Zoneada"
    ];
    filtroEquipes.querySelector('h5').setAttribute('style', 'display:flex;gap:5px');
    filtroEquipes.querySelector('h5').setAttribute('id', 'filtroEquipes');
    filtroEquipes.querySelector('h5').innerHTML = ``;
    filtroEquipes.querySelector('label').innerHTML = `Equipes`;
    areasId.forEach(item => {
        filtroEquipes.querySelector('h5').innerHTML += `<span area="${areasNome[areasId.indexOf(item)]}" class="span-garrisonsubtitles-custom-source source" onclick="ativarDesativarFiltro(this)" data-placement="top" title="Filtrar Equipes da ${areasNome[areasId.indexOf(item)]}">${item}</span>`;
    });

    filtroOrigem.insertAdjacentElement('afterend', filtroEquipes);
}

function ativarDesativarFiltro(botao) {
    botao.classList.toggle('filter-garrison');
    botao.parentNode.querySelectorAll('span').forEach(span => {
        if (botao != span) span.classList.remove('filter-garrison');
    });
    const inputFiltro = document.querySelector("#garrison-input-search");
    if (botao.classList.contains('filter-garrison')) {
        inputFiltro.value = botao.getAttribute('area');
        inputFiltro.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
        return;
    }
    inputFiltro.value = '';
    inputFiltro.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true
    }));
}
//ouvirNovosAtendimentos();

function ouvirNovosAtendimentos() {
    let buscandoAtendimentos = false;

    // Recomendo aumentar de 1s para 5s/10s para não sobrecarregar o servidor
    setInterval(async () => {
        if (buscandoAtendimentos) return;
        buscandoAtendimentos = true;

        try {
            const atendimentosAbertos = await buscarAtendimentosAbertos();

            if (!atendimentosAbertos || !atendimentosAbertos.data) {
                return;
            }

            // Recupera IDs notificados do sessionStorage tratando corretamente o array
            const rawNotificados = localStorage.getItem('atendimentosJaNotificados');
            const atendimentosAlertados = rawNotificados ? rawNotificados.split(',') : [];

            atendimentosAbertos.data.forEach(atendimento => {
                const idString = atendimento.attendance_id;

                // Se já foi notificado ou ID é inválido, ignora
                if (!idString || atendimentosAlertados.includes(idString)) return;

                // Dispara notificação no Chrome
                enviarNotificacao('Novo Atendimento!', {
                    body: `${atendimento.attendance_nature || 'Atendimento'}\n${atendimento.attendance_factaddress || ''}`,
                    url: `https://sentry.procempa.com.br/web/despacho/attendance/${idString}/edit`
                });

                // Adiciona à lista de já alertados
                atendimentosAlertados.push(idString);
            });

            // Atualiza o storage com os novos IDs
            localStorage.setItem('atendimentosJaNotificados', atendimentosAlertados.join(','));

        } catch (error) {
            console.error("Erro ao verificar novos atendimentos:", error);
        } finally {
            // Garante que a flag seja liberada mesmo em caso de erro na requisição
            buscandoAtendimentos = false;
        }

    }, 3000); // 3 segundos é um intervalo mais seguro que 1 segundo
}

async function enviarNotificacao(titulo, opcoes = {}) {
    // 1. Verifica se o navegador suporta notificações
    if (!("Notification" in window)) {
        console.warn("Este navegador não suporta notificações de área de trabalho.");
        return;
    }

    // 2. Solicita permissão se ainda não foi concedida/negada
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        await Notification.requestPermission();
    }

    // 3. Se tiver permissão, dispara a notificação
    if (Notification.permission === "granted") {
        const notificacao = new Notification(titulo, {
            icon: "https://sentry.procempa.com.br/web/public/assets/img/favicon.ico", // Ícone da notificação (opcional)
            badge: "https://sentry.procempa.com.br/web/public/assets/img/favicon.ico", // Ícone menor para mobile/Android
            body: opcoes.body || "",
        });
        // Ação ao clicar na notificação (ex: focar na janela do sistema)
        notificacao.onclick = function (event) {
            event.preventDefault();
            window.focus();
            if (opcoes.url) {
                // Abre o link do atendimento em uma nova aba (_blank)
                window.open(opcoes.url, '_blank');
            } else {
                // Se não houver URL específica, apenas foca na janela atual
                window.focus();
            }
            notificacao.close();
        };
    } else {
        console.warn("Permissão de notificação foi negada pelo usuário.");
    }
}

async function buscarAtendimentosAbertos() {
    const url = "https://sentry.procempa.com.br/despacho/attendance/list";

    // Body padrão baseado na sua requisição original
    const bodyPadrao = {
        filter: [
            { field: "attendance_statusname", type: "like", value: "ABERTO" }
        ]
    };

    const options = {
        method: "POST",
        mode: "cors",
        credentials: "include", // Envia os cookies de sessão do usuário
        headers: {
            "accept": "application/json",
            "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "x-requested-with": "XMLHttpRequest"
        },
        // Usa o filtro passado por parâmetro ou o padrão se não for informado
        body: JSON.stringify(bodyPadrao)
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Falha ao buscar atendimentos:", error);
        throw error;
    }
}
ajustarNomeGuarniçãoTabelaGuarnicoesDisponiveis();

function ajustarNomeGuarniçãoTabelaGuarnicoesDisponiveis() {
    const intervalAguardarListagem = setInterval(() => {
        const osData = Tabulator.findTable("#tabela-os")[0] ? Tabulator.findTable("#tabela-os")[0].getData() : null;
        const tabelaGuarnicoesDisponiveis = document.querySelector("#garrisonNearby");
        if (!tabelaGuarnicoesDisponiveis) return;
        const linhas = Array.from(tabelaGuarnicoesDisponiveis.querySelectorAll('tr'));
        // Pega o cabeçalho
        linhas.shift();
        const cabecalho = linhas.shift();

        if (cabecalho && cabecalho.querySelectorAll('th')[1].innerText != 'OS') {
            // Adiciona a célula de cabeçalho no FIM do tr (use 'th' ou 'td')
            cabecalho.querySelectorAll('th')[1].innerText = 'OS';
        }

        const botoesDespachar = tabelaGuarnicoesDisponiveis.querySelectorAll('button');
        if (!botoesDespachar.length) return;
        botoesDespachar.forEach(botao => {
            const celulas = botao.closest('tr').querySelectorAll('td');
            const guarnicaoId = botao.getAttribute('garrisonid');
            const guarnicaoCard = document.querySelector(`#garrisons-cards-panel div[garrisonid='${guarnicaoId}']`);
            if (!guarnicaoCard) return;
            const guarnicaoNomeSpan = Array.from(guarnicaoCard.querySelectorAll('span')).find(span =>
                span.innerText.includes(' - Dia') ||
                span.innerText.includes(' - Noite') ||
                span.innerText.includes('Daz - ')
            );
            const subintendenciaSpan = Array.from(guarnicaoCard.querySelectorAll('span')).find(span =>
                span.innerText.includes('Subintendência') ||
                span.innerText.includes('Divisão')
            );
            if (subintendenciaSpan && osData) {
                const atividadesSubintendencia = osData.filter(atividade => subintendenciaSpan.innerText.includes(atividade.area));
                if (celulas[1].innerText != atividadesSubintendencia.map(atividade => `${atividade.nome.substring(0, 15)} - ${atividade.inicio.replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, "")}`).join('\n'))
                    celulas[1].innerText = atividadesSubintendencia.map(atividade => `${atividade.nome.substring(0, 15)} - ${atividade.inicio.replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, "")}`).join('\n');
            }
            if (!guarnicaoNomeSpan) return;
            if (celulas[0].innerText == guarnicaoNomeSpan.innerText) return;
            celulas[0].innerText = guarnicaoNomeSpan.innerText;
        })

    }, 100);
}
inserirAtalhoBoletins();
function inserirAtalhoBoletins() {
    const botaoMenuAtendimentos = document.querySelector("#menu-attendance");
    if (!botaoMenuAtendimentos) return;
    const botaoMenuBAs = botaoMenuAtendimentos.cloneNode(true);
    botaoMenuBAs.setAttribute('id', 'menu-bas');
    botaoMenuBAs.querySelector('a').setAttribute('href', '/web/bos');
    botaoMenuBAs.querySelector('i').setAttribute('class', 'fa fa-file');
    botaoMenuBAs.querySelector('span').setAttribute('id', 'icon-span-bas');
    botaoMenuBAs.querySelector('span').innerText = 'Boletins';
    botaoMenuAtendimentos.insertAdjacentElement('afterend', botaoMenuBAs);
}



