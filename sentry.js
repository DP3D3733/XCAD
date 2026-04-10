let tabela2;
const insereBotaoInterval = setInterval(() => {
    const url = window.location.href;
    const botaoAtual = document.getElementById('btn-export');
    if (url == 'https://sentry.procempa.com.br/web/effectives' && botaoAtual && table && document.querySelector('#table .tabulator-page-counter').innerText.includes('Mostrando 1-100')) {
        botaoAtual.removeAttribute('onclick');
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

window.addEventListener("resize", ajustarHeader);