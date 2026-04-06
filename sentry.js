const insereBotaoInterval = setInterval(() => {
    const url = window.location.href;
    const botaoAtual = document.getElementById('btn-export');
    if (url == 'https://sentry.procempa.com.br/web/effectives' && botaoAtual) {
        botaoAtual.removeAttribute('onclick');
        const novoBotao = botaoAtual.cloneNode(true);
        novoBotao.addEventListener('click', function () {
            const tabDadosEfetivo = Tabulator.findTable("#table")[0];
            const csv = criarCSV(tabDadosEfetivo.getData());
            baixarCSVExcel(csv);
        });
        botaoAtual.parentNode.replaceChild(novoBotao, botaoAtual);
        clearInterval(insereBotaoInterval);
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

function criarCSV(dadosBrutos) {
    let csv = 'Efetivo ativo;CPF *;Nome *;Nome de guerra *;E-mail;Sexo;Fator sanguíneo;Nascimento;Mãe;Pai;Escolaridade;Estado civil;Naturalidade;Patente;Setor;Número funcional;Admissão;Tipo de Endereço;Logradouro;Número;Complemento;Bairro;Município;CEP;RG -Número;RG -Emissor (RG);RG -Expedição (RG);CNH -Número;CNH -Data de emissão;CNH -Data de vencimento;CNH -Categoria CNH;CTPS -Número;Porte de arma -Data de expedição;Porte de arma -Data de vencimento;Porte de arma -Número da cautela;Porte de arma -Número do porte;Exame de tiro -Data de expedição;Exame de tiro -Data de vencimento;Exame psicológico -Data de expedição;Exame psicológico -Data de vencimento;CRAF -Data de expedição;CRAF -Data de vencimento;Boina, bibico, capacete;Blusa, jaqueta, camiseta, gandola;Colete balístico (número e tamanho);Braçal;Cotoveleira;Luva meio dedo;Calça, bermuda;Cinturão;Joelheira;Meia;Conjunto de chuva;Calçados (Bota, sapato)\n'
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