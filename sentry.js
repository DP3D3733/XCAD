let tabela2;
const url = window.location.href;
sentry();
function sentry() {
    if (!url.includes('sentry')) return;
    atualizarEfetivo();
    const insereBotaoInterval = setInterval(() => {
        const botaoAtual = document.getElementById('btn-export');
        if (url == 'https://sentry.procempa.com.br/web/effectives' && botaoAtual && table && document.querySelector('#table .tabulator-page-counter').innerText.includes('Mostrando 1-100')) {
            botaoAtual.removeAttribute('onclick');
            const botaoAtualizarEfetivo = botaoAtual.cloneNode(true);
            botaoAtualizarEfetivo.innerText = 'Sincronizar com CAD';
            botaoAtualizarEfetivo.addEventListener('click', () => {
                atualizarEfetivo('forçar');
            });
            botaoAtual.insertAdjacentElement('afterend', botaoAtualizarEfetivo);
            const novoBotao = botaoAtual.cloneNode(true);
            novoBotao.addEventListener('click', function () {
                const csv = criarCSV(table.getData());
                baixarCSVExcel(csv);
            });
            botaoAtual.parentNode.replaceChild(novoBotao, botaoAtual);
            table.setPageSize(1000);


            clearInterval(insereBotaoInterval);
        }
    }, 100);

    const intervalCriaTabela = setInterval(() => {
        if (typeof table !== "undefined" && table.getData().length > 400) {
            criarTabela();

            clearInterval(intervalCriaTabela);
        }
    }, 100);

    function baixarCSVExcel(csv, nomeArquivo = 'dados.csv') {
        const BOM = '\uFEFF'; // importante pro Excel
        const blob = new Blob([BOM + csv], {
            type: 'text/csv;charset=utf-8;'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = nomeArquivo;
        a.click();

        URL.revokeObjectURL(url);
    }

    const escolaridadeDic = {
        elementaryScholl: 'Fundamental',
        highScholl: 'Médio',
        university: 'Superior',
        postGraduate: 'Pós-graduação',
        master: 'Mestrado',
        doctorate: 'Doutorado'
    }
    const campos = 'Efetivo ativo;CPF;Nome;Nome de guerra;E-mail;Sexo;Fator sanguíneo;Nascimento;Mãe;Pai;Escolaridade;Estado civil;Naturalidade;Patente;Setor;Número funcional;Admissão;Tipo de Endereço;Logradouro;Número;Complemento;Bairro;Município;CEP;RG -Número;RG -Emissor (RG);RG -Expedição (RG);CNH -Número;CNH -Data de emissão;CNH -Data de vencimento;Categoria CNH;CTPS -Número;Porte de arma -Data de expedição;Porte de arma -Data de vencimento;Porte de arma -Número da cautela;Porte de arma -Número do porte;Exame de tiro -Data de expedição;Exame de tiro -Data de vencimento;Exame psicológico -Data de expedição;Exame psicológico -Data de vencimento;CRAF -Data de expedição;CRAF -Data de vencimento;Boina, bibico, capacete;Blusa, jaqueta, camiseta, gandola;Colete balístico (número e tamanho);Braçal;Cotoveleira;Luva meio dedo;Calça, bermuda;Cinturão;Joelheira;Meia;Conjunto de chuva;Calçados (Bota, sapato)';

    const colunas = {
        "Efetivo ativo": "is_effective-++-boolean-++-tickCross",
        "CPF": "cpf-++-string-++-input",
        "Nome": "name-++-string-++-input",
        "Nome de guerra": "namewar-++-custom-++-input",
        "E-mail": "email-++-string-++-input",
        "Sexo": "sex-++-string-++-input",
        "Fator sanguíneo": "blood_factor-++-string-++-input",
        "Nascimento": "dtBirth-++-date-++-input",
        "Mãe": "mother-++-string-++-input",
        "Pai": "father-++-string-++-input",
        "Escolaridade": "education_level-++-string-++-input",
        "Estado civil": "marital_status-++-string-++-input",
        "Naturalidade": "nationality-++-string-++-input",
        "Patente": "rank-++-string-++-input",
        "Setor": "sector-++-string-++-input",
        "Número funcional": "employee_code-++-number-++-number",
        "Admissão": "admission-++-date-++-input",
        "Tipo de Endereço": "type-++-string-++-input",
        "Logradouro": "address-++-string-++-input",
        "Número": "number-++-number-++-number",
        "Complemento": "complement-++-string-++-input",
        "Bairro": "neighborhood-++-string-++-input",
        "Município": "city-++-string-++-input",
        "CEP": "zipcode-++-string-++-input",
        "RG -Número": "rg_number-++-string-++-input",
        "RG -Emissor (RG)": "emitter_rg-++-string-++-input",
        "RG -Expedição (RG)": "expedition_rg-++-date-++-input",
        "CNH -Número": "cnh-++-string-++-input",
        "CNH -Data de emissão": "emitterCnh-++-date-++-input",
        "CNH -Data de vencimento": "expirationCnh-++-date-++-input",
        "Categoria CNH": "category_cnh-++-string-++-input",
        "CTPS -Número": "ctps-++-string-++-input",
        "Porte de arma -Data de expedição": "carryShippingDate-++-date-++-input",
        "Porte de arma -Data de vencimento": "carryDueDate-++-date-++-input",
        "Porte de arma -Número da cautela": "caution_number-++-string-++-input",
        "Porte de arma -Número do porte": "license_number-++-string-++-input",
        "Exame de tiro -Data de expedição": "shotShippingDate-++-date-++-input",
        "Exame de tiro -Data de vencimento": "shotDueDate-++-date-++-input",
        "Exame psicológico -Data de expedição": "psychoShippingDate-++-date-++-input",
        "Exame psicológico -Data de vencimento": "psychoDueDate-++-date-++-input",
        "CRAF -Data de expedição": "crafShippingDate-++-date-++-input",
        "CRAF -Data de vencimento": "crafDueDate-++-date-++-input",
        "Boina, bibico, capacete": "helmet-++-string-++-input",
        "Blusa, jaqueta, camiseta, gandola": "jacket-++-string-++-input",
        "Colete balístico (número e tamanho)": "bulletproof_vest-++-string-++-input",
        "Braçal": "military_bracer-++-string-++-input",
        "Cotoveleira": "elbow_pad-++-string-++-input",
        "Luva meio dedo": "half_finger_glove-++-string-++-input",
        "Calça, bermuda": "pants-++-string-++-input",
        "Cinturão": "belt-++-string-++-input",
        "Joelheira": "knee_brace-++-string-++-input",
        "Meia": "sock-++-string-++-input",
        "Conjunto de chuva": "rain_set-++-string-++-input",
        "Calçados (Bota, sapato)": "shoes-++-string-++-input"
    };

    function criarCSV(dadosBrutos) {
        let csv = campos + '\n';
        dadosBrutos.forEach(pessoa => {
            const dadosBasicos = JSON.parse(pessoa.effective);
            const endereco = dadosBasicos.address;
            csv += `${pessoa.is_effective ? "Sim" : "Não"};${pessoa.cpf};${pessoa.name};${pessoa.namewar};${dadosBasicos.email};${dadosBasicos.sex};${dadosBasicos.blood_factor};${ajustarData(dadosBasicos.dtBirth)};${dadosBasicos.mother};${dadosBasicos.father};${escolaridadeDic[dadosBasicos.education_level] || ''};${dadosBasicos.marital_status};${dadosBasicos.nationality};${pessoa.rank};${dadosBasicos.sector};${pessoa.employee_code};${ajustarData(dadosBasicos.admission)};${endereco.type};${endereco.address};${endereco.number};${endereco.complement};${endereco.neighborhood};${endereco.city};${endereco.zipcode};${dadosBasicos.emitter_rg};${dadosBasicos.expedition_rg};${dadosBasicos.cnh};${ajustarData(dadosBasicos.emitterCnh)};${ajustarData(dadosBasicos.expirationCnh)};${dadosBasicos.category_cnh?.join(", ") || ''};${ajustarData(dadosBasicos.carryShippingDate)};${ajustarData(dadosBasicos.carryDueDate)};${dadosBasicos.caution_number};${dadosBasicos.license_number};${ajustarData(dadosBasicos.shotShippingDate)};${ajustarData(dadosBasicos.shotDueDate)};${ajustarData(dadosBasicos.psychoShippingDate)};${ajustarData(dadosBasicos.psychoDueDate)};${ajustarData(dadosBasicos.crafShippingDate)};${ajustarData(dadosBasicos.crafDueDate)};${dadosBasicos.helmet};${dadosBasicos.jacket};${dadosBasicos.bulletproof_vest};${dadosBasicos.military_bracer};${dadosBasicos.elbow_pad};${dadosBasicos.half_finger_glove};${dadosBasicos.pants};${dadosBasicos.belt};${dadosBasicos.knee_brace};${dadosBasicos.sock};${dadosBasicos.rain_set};${dadosBasicos.shoes};\n`.replaceAll('null', '');
        });

        return csv;
    }

    function ajustarData(dataBruta) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dataBruta)) return dataBruta;
        const dataArray = dataBruta.split('-');
        return `${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`
    }



    function criarSeletorDeCampos() {
        const wrapper = document.createElement("div");
        wrapper.className = "select-wrapper";

        // criar select
        const select = document.createElement("select");
        select.className = "form-control";
        select.setAttribute("multiple", ""); // se quiser múltiplo
        select.name = "campos[]";

        //criar a label
        const label = document.createElement("label");
        label.className = 'form-label select-label';
        label.innerText = 'Colunas';

        // opções
        const dados = [
            { id: 1, nome: 'Documentos' },
            { id: 2, nome: 'Formação' }
        ];
        let id = 3;
        campos.split(';').forEach(campo => {
            dados.push({ id: id, nome: campo });
            id++;
        });

        const colunasVisiveis = tabela2.getColumns()
            .filter(col => col.isVisible())
            .map(col => col.getDefinition().title);

        dados.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.id;
            opt.textContent = item.nome;
            if (colunasVisiveis.includes(item.nome)) opt.selected = true;
            select.appendChild(opt);
        });

        // adicionar no wrapper
        wrapper.appendChild(select);
        wrapper.appendChild(label);

        // colocar nos filtros
        document.querySelector('#filters').appendChild(wrapper);

        //inicializando o componente
        new mdb.Select(select, { filter: true });
        select.addEventListener('change', () => {
            const nomesDasColunas = Array.from(select.selectedOptions)
                .map(opt => opt.textContent);
            filtrarColunas(nomesDasColunas);
        });
    }

    function filtrarColunas(nomesDasColunas) {
        const colunasVisiveis = tabela2.getColumns()
            .filter(col => col.isVisible())
            .map(col => col.getDefinition().title);

        colunasVisiveis.forEach(coluna => {
            if (nomesDasColunas.includes(coluna)) {

                return
            };
            const col = tabela2.getColumns().find(c =>
                c.getDefinition().title === coluna
            );
            if (col) col.delete();
        });

        nomesDasColunas.forEach(coluna => {

            if (colunasVisiveis.includes(coluna)) return;
            const [field, tipo, filtro] = colunas[coluna].split('-++-');

            let sorter;

            if (tipo === "custom") {
                sorter = function (a, b) {
                    const numA = parseInt(a);
                    const numB = parseInt(b);

                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }

                    return (a || "").localeCompare(b || "");
                };
            } else if (tipo === "date") {
                sorter = function (a, b) {
                    if (!a && !b) return 0;
                    if (!a) return -1;
                    if (!b) return 1;

                    return a - b;
                };
            } else {
                sorter = tipo; // "string", "number", "date", etc
            }
            tabela2.addColumn({
                title: coluna,
                field: colunas[coluna].split('-++-')[0],
                headerFilter: filtro,
                headerFilterLiveFilter: false,
                sorter: sorter,

                formatter: function (cell) {

                    if (!colunas[coluna].split('-++-')[0].includes('date') && colunas[coluna].split('-++-')[0] != 'dtBirth') return cell.getValue();
                    const date = cell.getValue();
                    if (!date) return "";
                    return date.toLocaleDateString("pt-BR");
                }
            });
            localStorage.setItem('colunasEfetivo', nomesDasColunas.join('-++-'));
        });

    }

    function criarTabela() {
        const corpo = document.querySelectorAll('.card-body')[1];
        document.querySelector('#table').style.display = 'none';

        const novaTabela = document.createElement('div'); // ✅ CORRETO
        novaTabela.setAttribute('id', 'tabela2');
        corpo.appendChild(novaTabela);

        const dados = table.getData().map(d => {
            const eff = JSON.parse(d.effective);
            const endereco = eff.address;

            const effObj = {};
            for (const key in eff) {
                if (key.toLowerCase().includes('date') || key == 'dtBirth') {
                    effObj[key] = new Date(eff[key]);
                } else {
                    effObj[key] = eff[key];
                }

            }
            return {
                ...d,
                ...effObj,
                ...endereco
            };
        });

        const colunasSalvasBruta =
            localStorage.getItem('colunasEfetivo') ||
            'Nome-++-Nome de guerra-++-Sexo-++-CPF-++-Nascimento';
        let colunasSalvasFormatadas;

        colunasSalvasFormatadas = colunasSalvasBruta.split('-++-').map(coluna => {
            const [field, tipo, filtro] = colunas[coluna].split('-++-');

            let sorter;

            if (tipo === "custom") {
                sorter = function (a, b) {
                    const numA = parseInt(a);
                    const numB = parseInt(b);

                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }

                    return (a || "").localeCompare(b || "");
                };
            } else if (tipo === "date") {
                sorter = function (a, b) {
                    if (!a && !b) return 0;
                    if (!a) return -1;
                    if (!b) return 1;

                    return a - b;
                };
            } else {
                sorter = tipo; // "string", "number", "date", etc
            }
            return {
                title: coluna,
                field: colunas[coluna].split('-++-')[0],
                headerFilter: filtro,
                headerFilterLiveFilter: false,
                sorter: sorter,
                formatter: function (cell) {

                    if (!colunas[coluna].split('-++-')[0].includes('date') && colunas[coluna].split('-++-')[0] != 'dtBirth') return cell.getValue();
                    const date = cell.getValue();
                    if (!date) return "";
                    return date.toLocaleDateString("pt-BR");
                }
            }
        });
        tabela2 = new Tabulator('#tabela2', {
            data: dados,
            layout: "fitColumns",
            height: "600px",
            columns: colunasSalvasFormatadas,
            movableColumns: true,
            footerElement: `<div class="footer-count" style="height:55px">Total de registros: 0</div>`,
            dataLoaded: function () {
                atualizarFooter(this);
            },
            dataFiltered: function () {
                atualizarFooter(this);
            },
            dataSorted: function () {
                atualizarFooter(this);
            }
        });
        tabela2.on("rowClick", function (e, row) {
            const data = row.getData();

            window.open(
                `https://sentry.procempa.com.br/web/effectives/${data.id}/edit`,
                "_blank"
            );
        });
        tabela2.on("tableBuilt", function () {
            this.setPageSize(1000);
            atualizarFooter(tabela2);
            criarSeletorDeCampos();
            document.querySelectorAll("#tabela2 .tabulator-col").forEach(col => {
                col.style.height = "75px";
            });
        });
        tabela2.on("renderComplete", function () {
            atualizarFooter(tabela2);
        });
        setTimeout(() => {
            atualizarFooter(tabela2);
        }, 1000);

    }

    function atualizarFooter(tabela) {
        const visiveis = tabela.getDataCount("active"); // 🔥 só visíveis
        const total = tabela.getDataCount();
        const footer = tabela.element.querySelector(".footer-count");
        footer.innerText =
            `Mostrando: ${visiveis} de ${total}`;
    }

    function ajustarHeader() {
        document.querySelectorAll("#tabela2 .tabulator-col").forEach(col => {
            col.style.height = "75px";
        });
    }


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
        console.log(dados.data.list.total);
        if (dados.data.list.total == 0) return false;
        return true
    }

    window.addEventListener("resize", ajustarHeader);

    window.addEventListener("message", event => {

        console.log("MESSAGE EVENT:");
        console.log(event);

        console.log("DATA:");
        console.log(event.data);

        if (event.data?.type === "verificarConsulta") {
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
        }

    });
    if (url.includes('/individual') && !url.includes('/create')) inserirBotaoColarIndividuo();

    habilitarDropGlobalFoto();
    inserirCheckboxAtividadesProgramadas();
    if (url.includes('despacho/schedule-garrison') && url.includes('/edit')) ajustarCodigoAreaNomeAtividadeProgramada();
}

//---------------SENTRY INDIVIDUOS-------------------------------------------------------------------------------------
function inserirBotaoColarIndividuo() {
    const adicionarFiltrosButton = document.getElementById('addFilterBtn');
    if (!adicionarFiltrosButton) return;
    const adicionarFiltrosButtonPai = adicionarFiltrosButton.parentNode;
    const colarDadosButton = adicionarFiltrosButtonPai.cloneNode(true);
    adicionarFiltrosButtonPai.insertAdjacentElement('afterend', colarDadosButton);
    colarDadosButton.querySelector('button').removeAttribute('onclick');
    colarDadosButton.querySelector('button').innerText = 'Colar indivíduo';
    colarDadosButton.addEventListener('click', (async () => {
        const dados = await colarIndividuo();
        if (!dados) return;

        const individuoExiste = await verificarExistenciaIndividuoBanco(dados);
        if (individuoExiste) return;

        criarIndividuo(dados);
    }));
}

async function colarIndividuo() {
    try {
        const texto = await navigator.clipboard.readText();
        if (!texto.includes('CPF:')) return false;
        const dados = Object.fromEntries(
            (texto
                .split('BÁSICOS:\n')[1] || texto)
                .split('\n\n')[0]
                .split('\n')
                .map(linha => {
                    if (!linha.includes(':')) return ['', ''];
                    const [key, value] = linha.split(':');
                    return [
                        key.trim(),
                        value.trim().replace('   ', ' ') || ''
                    ];
                })
        );
        if (dados.CPF == '') return false;
        dados.CPF = dados.CPF.replaceAll('/', '-');
        dados.Naturalidade = (`${dados.Naturalidade.substring(0, dados.Naturalidade.length - 2)} - ${dados.Naturalidade.substr(-2)}`).toUpperCase();
        dados['Cor da pele'] = (dados['Cor da pele'].substring(0, dados['Cor da pele'].length - 1) + 'O').toUpperCase();
        dados.Sexo = dados.Sexo.toUpperCase();
        dados.Nacionalidade = cidadeEhDoBrasil(dados.Naturalidade) ? 'BRASIL' : '';

        return dados;
    } catch (erro) {
        console.error("Erro ao acessar área de transferência:", erro);
        return false;
    }
}

async function verificarExistenciaIndividuoBanco(dados) {

    if (!dados) return false;

    const cpf = dados.CPF;
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

        const resultado = await response.json();
        const individuoExiste = resultado.data.list.total == 0 ? false : true;
        if (individuoExiste) {
            window.open(
                `https://sentry.procempa.com.br/web/individual/${dados.CPF.replace(/\D/g, "")}/edit`,
                "_blank",
            );
        }
        return individuoExiste;
    } catch (erro) {
        console.error("Erro ao buscar indivíduo:", erro);
    }


}

async function criarIndividuo(dados) {

    const fd = new FormData();

    fd.append("cpf", dados.CPF);
    fd.append("name", dados.Nome);

    fd.append("rg", dados.RG || "");
    fd.append("emitterRg", "SSP");
    fd.append("criminalRg", "");
    fd.append("cnh", "");

    fd.append("socialName", "");
    fd.append("nickname", "");

    fd.append("dtBirth", dados.Nascimento || "");
    fd.append("sex", dados.Sexo || "");

    fd.append("color", dados['Cor da pele'] || "");

    fd.append("maritalStatus", "");
    fd.append("nationality", dados.Nacionalidade || "");
    fd.append("cityOfBirth", dados.Naturalidade || "");

    fd.append("mother", dados['Nome da mãe'] || "");
    fd.append("father", dados['Nome do pai'] || "");

    fd.append("height", "");
    fd.append("roleCrime", "");
    fd.append("socialNetwork", "");
    fd.append("occupation", "");
    fd.append("information", "");

    fd.append("attachment", "[]");
    fd.append("attachmentDescription", "[]");

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

        if (!response) return;
        window.open(
            `https://sentry.procempa.com.br/web/individual/${dados.CPF.replace(/\D/g, "")}/edit`,
            "_blank",
        );
    } catch (erro) {
        console.error("Erro ao cadastrar indivíduo:", erro);
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

function habilitarDropGlobalFoto() {

    const input =
        document.getElementById('faceIndividual');

    if (!input) return;

    document.body.addEventListener('dragover', e => {

        // só impede o navegador de abrir o arquivo
        if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault();
        }
    });

    document.body.addEventListener('drop', e => {

        // ignora drops sem arquivo
        if (!e.dataTransfer.files.length) return;

        e.preventDefault();

        const arquivo =
            e.dataTransfer.files[0];

        // aceita só imagem
        if (!arquivo.type.startsWith('image/')) {
            console.log('Arquivo não é imagem');
            return;
        }

        const dt = new DataTransfer();

        dt.items.add(arquivo);

        input.files = dt.files;

        // dispara onchange
        input.dispatchEvent(
            new Event('change', {
                bubbles: true
            })
        );

        console.log('Imagem enviada');
    });
}

//---------------SENTRY ATIVIDADES PROGRAMADAS-------------------------------------------------------------------------------------

function inserirCheckboxAtividadesProgramadas() {
    if (url != 'https://sentry.procempa.com.br/web/despacho/schedule-garrison') return;

    const inserirCheckInterval = setInterval(() => {
        const tabela = document.querySelector('#table.tabulator');
        if (!tabela) return;
        const linhas = tabela.querySelectorAll('div.tabulator-tableholder div[role=row]');
        if (linhas.length == 0) return;
        linhas.forEach(linha => {
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.addEventListener('change', () => mostrarEsconderMenuDeOpcoes());
            linha.insertAdjacentElement('beforebegin', checkbox);
        });
        clearInterval(inserirCheckInterval);
    }, 1000);
}

function mostrarEsconderMenuDeOpcoes() {
    const atividadesSelecionadas = Array.from(document.querySelectorAll('#table.tabulator input[type=checkbox]')).filter(check => check.checked);
    const buttonCopiarAtividade = document.getElementById('copiarAtividadeButton');
    const inputNumOS = document.getElementById('inputNumOS');
    const dataOSInput = document.getElementById('dataOSInput');
    if (atividadesSelecionadas.length == 0 && !buttonCopiarAtividade) return;
    if (atividadesSelecionadas.length == 0 && buttonCopiarAtividade) {
        buttonCopiarAtividade.remove();
        inputNumOS.remove();
        dataOSInput.remove();
    };
    if (atividadesSelecionadas.length > 0 && !buttonCopiarAtividade) {
        const buttonCadastrarNovaAtividade = Array.from(document.querySelectorAll('button')).find(button => button.innerText == ' Cadastrar atividade programada');
        const novoButtonCopiarAtividade = buttonCadastrarNovaAtividade.parentNode.cloneNode(true);
        novoButtonCopiarAtividade.querySelector('button').removeAttribute('onclick');
        novoButtonCopiarAtividade.querySelector('button').innerText = 'Copiar Atividade';
        novoButtonCopiarAtividade.querySelector('button').setAttribute('id', 'copiarAtividadeButton');
        buttonCadastrarNovaAtividade.parentNode.insertAdjacentElement('afterbegin', novoButtonCopiarAtividade);
        const buttonExcluirAtividade = buttonCadastrarNovaAtividade.cloneNode(true);
        buttonExcluirAtividade.removeAttribute('onclick');
        buttonExcluirAtividade.innerText = 'Excluir Atividade';
        buttonExcluirAtividade.setAttribute('id', 'excluirAtividadeButton');
        buttonExcluirAtividade.style.backgroundColor = 'red';
        buttonCadastrarNovaAtividade.insertAdjacentElement('beforeBegin', buttonExcluirAtividade);

        const dataOSInput = document.createElement('input');
        dataOSInput.setAttribute('type', 'date');
        dataOSInput.setAttribute('id', 'dataOSInput');
        novoButtonCopiarAtividade.insertAdjacentElement('beforeBegin', dataOSInput);
        const numeroOSInput = document.createElement('input');
        numeroOSInput.setAttribute('type', 'text');
        numeroOSInput.setAttribute('id', 'inputNumOS');
        novoButtonCopiarAtividade.insertAdjacentElement('beforeBegin', numeroOSInput);

        buttonExcluirAtividade.addEventListener('click', () => excluirAtividades());
        novoButtonCopiarAtividade.addEventListener('click', () => copiarAtividades());
        dataOSInput.addEventListener('change', () => ajustaNumOS());
    }
}

function ajustaNumOS() {
    const dataValue = document.querySelector('#dataOSInput').value;
    const dataObj = new Date(dataValue);
    const anoAtual = dataObj.getFullYear();
    const primeiroDeJaneiro = new Date(anoAtual, 0, 1);
    const diasDesdePrimeiroDeJaneiro =
        Math.ceil(
            (dataObj - primeiroDeJaneiro)
            / (1000 * 60 * 60 * 24)
        );

    const numeroOSInput = document.querySelector('#inputNumOS');
    numeroOSInput.value = `OS n.º ${diasDesdePrimeiroDeJaneiro * 2 + 1}/${anoAtual}`
}

async function copiarAtividades() {
    const dataValue = document.querySelector('#dataOSInput').value;
    const numeroOSValue = document.querySelector('#inputNumOS').value;

    const atividadesSelecionadas = Array
        .from(
            document.querySelectorAll(
                '#table.tabulator input[type=checkbox]'
            )
        )
        .filter(check => check.checked)
        .map(check => check.nextElementSibling);

    for (const atividade of atividadesSelecionadas) {

        const id = atividade
            .querySelector('div[tabulator-field="id"]')
            .innerText;

        const dadosAtividade =
            await buscarAtividadeProgramada(id);

        if (!dadosAtividade)
            continue;

        const atividadeProntaPraInserir = prepararNovaAtividadeObjeto(dadosAtividade.schedule, numeroOSValue, dataValue);

        const atividadeCadastrada =
            await cadastrarAtividadeProgramada(atividadeProntaPraInserir);

        if (!atividadeCadastrada)
            continue;
    }
}

async function buscarAtividadeProgramada(id) {

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

function prepararNovaAtividadeObjeto(atividade, novoNrOs, novaData) {
    const tituloAtividadeCru = atividade.name;
    if (!tituloAtividadeCru) return;
    let tituloAtividadePronto;
    if (tituloAtividadeCru.includes(novoNrOs) && !tituloAtividadeCru.match(/\((\d+)\)/)) tituloAtividadePronto = tituloAtividadeCru + ' (2)'; //caso tenha sido copiado pra mesma OS
    if (tituloAtividadeCru.includes(novoNrOs) && tituloAtividadeCru.match(/\((\d+)\)/)) { //caso já tenha uma cópia ele aumenta um dígito do final (1) -> (2)
        const numCopia = parseInt(tituloAtividadeCru.match(/\((\d+)\)/)[1]);
        const novoNumCopia = numCopia + 1;
        tituloAtividadePronto = tituloAtividadeCru.replace(tituloAtividadeCru.match(/\((\d+)\)/)[0], `(${novoNumCopia})`);
    }
    if (!tituloAtividadeCru.includes(novoNrOs)) tituloAtividadePronto = novoNrOs + tituloAtividadeCru.substr(15);

    atividade.name = tituloAtividadePronto;
    atividade.dateUsageMin = novaData;
    atividade.dateUsageMax = novaData;

    atividade.activities.forEach(atv => delete atv.itemId);
    delete atividade.id;
    delete atividade.inactive;
    delete atividade.systemCreation;
    delete atividade.systemUpdate;
    delete atividade.userSystemId;

    console.log(atividade);
    return atividade;
}

async function cadastrarAtividadeProgramada(
    dadosDaAtividade
) {

    const anexosOriginais =
        [...(dadosDaAtividade.attachment || [])];

    // limpa referências antigas
    dadosDaAtividade.attachment = [];
    dadosDaAtividade.attachmentDescription = null;

    const fd = new FormData();

    fd.append(
        "myModel",
        JSON.stringify(dadosDaAtividade)
    );

    // reenvia arquivos binários
    for (const anexo of anexosOriginais) {

        const response = await fetch(
            `/despacho/attachment/get/${anexo.id}`,
            {
                credentials: "include"
            }
        );

        const blob =
            await response.blob();

        const file =
            new File(
                [blob],
                anexo.name,
                {
                    type: anexo.type
                }
            );

        fd.append(
            "attachFiles",
            file
        );
    }

    const response = await fetch(
        "/despacho/schedule-garrison",
        {
            method: "POST",
            body: fd,
            credentials: "include"
        }
    );

    console.log(response.status);

    const text =
        await response.text();

    console.log(text);

    return response.ok;
}

async function excluirAtividades() {
    const atividadesSelecionadas = Array
        .from(
            document.querySelectorAll(
                '#table.tabulator input[type=checkbox]'
            )
        )
        .filter(check => check.checked)
        .map(check => check.nextElementSibling);

    let todasExcluidas = true;
    for (const atividade of atividadesSelecionadas) {

        const id = atividade
            .querySelector('div[tabulator-field="id"]')
            .innerText;

        const atividadeExcluida =
            await excluirAtividade(id);

        if (!atividadeExcluida)
            todasExcluidas = false;
    }

    if (todasExcluidas) window.location.reload();
}

async function excluirAtividade(id) {

    const response = await fetch(
        `/despacho/schedule-garrison/${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    console.log(response.status);

    if (!response.ok) {

        console.error(
            await response.text()
        );

        return false;
    }

    return true;
}

function ajustarCodigoAreaNomeAtividadeProgramada() {
    const nomeAtividadeInput = document.querySelector("#myModel\\.name");
    const nomeAtividade = nomeAtividadeInput.value.replaceAll(', ', ',').replace(/\s+\S+$/, "");;
    const selectSetores = document.querySelector("#sectors");
    const codigoSetores = {
        'Subintendência Regional Cruzeiro': 200,
        'Subintendência Regional Partenon': 300,
        'Subintendência Regional Leste': 400,
        'Subintendência Regional Restinga': 500,
        'Subintendência Regional Norte': 600,
        'Subintendência Regional Eixo Baltazar': 700,
        'Subintendência Regional Pinheiro': 800,
        'Subintendência Regional Eixo Sul': 900,
        'Subintendência da Ronda Ostensiva Municipal': 1000,
        'Subintendência Regional Centro': 1200
    }
    if (!nomeAtividadeInput || !selectSetores) return;
    selectSetores.addEventListener('change', () => {
        const opcoesSelecionadas = Array.from(selectSetores.selectedOptions).map(opcao => codigoSetores[opcao.value]).join(', ');
        nomeAtividadeInput.value = `${nomeAtividade} ${opcoesSelecionadas}`;
        nomeAtividadeInput.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
    })
}






