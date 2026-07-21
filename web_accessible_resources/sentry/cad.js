criarBotaoVisualizarOS();
inserirBotaoCopiarAtendimento();
inserirButtonNovosBAs();
verificarNovosBAs();


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
                    pesquisa.nome = atividade.name.substring(18);
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
                pesquisa.nome = demanda.schedule.name.substring(18);
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

