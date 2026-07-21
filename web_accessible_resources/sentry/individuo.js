inserirBotaoColarIndividuo();

habilitarDropGlobalFoto();

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
        if (dados['Cor da pele'] == 'PRETO') dados['Cor da pele'] = 'NEGRO';
        if (dados['Cor da pele'] == 'MULATO') dados['Cor da pele'] = 'NEGRO';
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
