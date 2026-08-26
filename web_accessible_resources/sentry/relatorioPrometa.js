function inserirColunaDataHoraAtendimento(atendimentos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thProtocolo = head.querySelector('th');
    const thDHProtocolo = thProtocolo.cloneNode(true);
    thDHProtocolo.innerText = 'D/H Inicial Atendimento';
    thProtocolo.insertAdjacentElement('afterend', thDHProtocolo);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelector('td').innerText;
        const atendimento = atendimentos.find(atendimento => atendimento.protocolo == protocolo);
        if (!atendimento) return linha.querySelector('td').insertAdjacentHTML('afterend', `<td></td>`);
        const dataProtocolo = atendimento.inicio;
        linha.querySelector('td').insertAdjacentHTML('afterend', `<td>${dataProtocolo}</td>`);
    })
}

function inserirColunaLocal(atendimentos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thNatureza = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Natureza');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thNatureza);
    const thLocal = thNatureza.cloneNode(true);
    thLocal.innerText = 'Local';
    thNatureza.insertAdjacentElement('afterend', thLocal);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelector('td').innerText;
        const atendimento = atendimentos.find(atendimento => atendimento.protocolo == protocolo);
        if (!atendimento) return linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td></td>`);
        const local = atendimento.pontoReferencia;
        linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td>${local}</td>`);
    })
}

function inserirColunaTipoLocal(atendimentos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thLocal = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Local');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thLocal);
    const thTipoLocal = thLocal.cloneNode(true);
    thTipoLocal.innerText = 'Tipo Local Descricao';
    thLocal.insertAdjacentElement('afterend', thTipoLocal);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelector('td').innerText;
        const atendimento = atendimentos.find(atendimento => atendimento.protocolo == protocolo);
        if (!atendimento) return linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td></td>`);
        const tipoLocal = atendimento.tipoLocal;
        linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td>${tipoLocal}</td>`);
    })
}

function inserirColunaEndereco(atendimentos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thTipoLocal = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Tipo Local Descricao');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thTipoLocal);
    const thEndereco = thTipoLocal.cloneNode(true);
    thEndereco.innerText = 'Endereco';
    thTipoLocal.insertAdjacentElement('afterend', thEndereco);
    const thBairro = thEndereco.cloneNode(true);
    thBairro.innerText = 'Bairro';
    thEndereco.insertAdjacentElement('afterend', thBairro);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelector('td').innerText;
        const atendimento = atendimentos.find(atendimento => atendimento.protocolo == protocolo);
        if (!atendimento) return linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td></td><td></td>`);
        const endereco = atendimento.endereco;
        const bairro = atendimento.bairro;
        linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td>${endereco}</td><td>${bairro}</td>`);
    })
}

function inserirColunaNarrativa(atendimentos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thEndereco = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Bairro');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thEndereco);
    const thNarrativa = thEndereco.cloneNode(true);
    thNarrativa.innerText = 'Narrativa';
    thEndereco.insertAdjacentElement('afterend', thNarrativa);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelector('td').innerText;
        const atendimento = atendimentos.find(atendimento => atendimento.protocolo == protocolo);
        if (!atendimento) return linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td></td>`);
        const narrativa = atendimento.narrativa;
        linha.querySelectorAll('td')[index].insertAdjacentHTML('afterend', `<td>${narrativa}</td>`);
    })
}

function inserirColunaGuarnicao() {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thGuarnicao = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Guarnição');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thGuarnicao);
    thGuarnicao.innerText = 'Guarnicao';
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const guarnicao = linha.querySelectorAll('td')[index].innerHTML.split('<b>Equipe: </b>')[1].split('<br')[0];
        linha.querySelectorAll('td')[index].innerText = guarnicao.trim();
    })
}

function inserirColunasTempos(tempos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thDespacho = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Despacho');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thDespacho);
    const thTempoDespacho = thDespacho.cloneNode(true);
    thTempoDespacho.innerText = 'Tempo ate inicio do despacho';
    head.querySelector('tr').insertAdjacentElement('beforeend', thTempoDespacho);
    const thTempoChegada = thDespacho.cloneNode(true);
    thTempoChegada.innerText = 'Tempo entre despacho e chegada no local';
    head.querySelector('tr').insertAdjacentElement('beforeend', thTempoChegada);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelectorAll('td')[index].innerText;
        const tempo = tempos.find(tempo => tempo.dispatch_numbercheckbook == protocolo);
        if (!tempo) return linha.querySelector('td:last-child').insertAdjacentHTML('afterend', `<td></td><td></td>`);
        const tempoDespacho = tempo.attendance_time;
        const tempoChegada = tempo.arrival_time;
        linha.querySelector('td:last-child').insertAdjacentHTML('afterend', `<td>${tempoDespacho}</td><td>${tempoChegada}</td>`);
    })
}

function inserirColunaRelatos(relatos) {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const thBA = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'BA GCM');
    const index = Array.from(head.querySelectorAll('th')).indexOf(thBA);
    const thNarrativa = Array.from(head.querySelectorAll('th')).find(th => th.innerText == 'Narrativa');
    const indexNarrativa = Array.from(head.querySelectorAll('th')).indexOf(thNarrativa);
    const thRelato = thNarrativa.cloneNode(true);
    thRelato.innerText = 'Relato';
    thNarrativa.insertAdjacentElement('afterend', thRelato);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        const protocolo = linha.querySelectorAll('td')[index].innerText;
        const relato = relatos.find(relato => relato.id == protocolo);
        if (!relato) return linha.querySelectorAll('td')[indexNarrativa].insertAdjacentHTML('afterend', `<td></td>`);
        linha.querySelectorAll('td')[indexNarrativa].insertAdjacentHTML('afterend', `<td>${relato.relato}</td>`);
    })
}



function removerColunas(colunas) {
    colunas.forEach(coluna => {
        const content = document.querySelector('#content');
        const head = content.querySelector('table thead tr');
        const index = Array.from(head.querySelectorAll('th')).findIndex(th => th.innerText == coluna);
        if (index == -1) return;
        head.querySelectorAll('th')[index].remove();
        const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
        linhasTbody.forEach(linha => {
            linha.querySelectorAll('td')[index].remove();
        })
    })
}



async function ajustarTabelaPrometa() {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    if (!head) return;
    const linhasTbody = Array.from(content.querySelectorAll('table tbody tr'));
    const idsProtocolo = linhasTbody
        .map(linha => {
            if (!linha.querySelector('td')) return null;
            const temAtendimento = linha.querySelector('td').innerText != '';
            if (!temAtendimento) return null;
            const url = linha.querySelector('td').querySelector('a')?.getAttribute('href');
            if (!url) return null;
            const match = url.match(/\/(\d+)\//);
            if (!match) return null;
            const idProtocolo = match[1];
            return idProtocolo;
        })
        .filter(Boolean);

    const idsBAs = linhasTbody
        .map(linha => {
            if (!linha.querySelectorAll('td')[2]) return null;
            const temAtendimento = linha.querySelectorAll('td')[2].innerText != '';
            if (!temAtendimento) return null;
            const idBA = linha.querySelectorAll('td')[2].innerText.replace('/', '-');
            return idBA;
        })
        .filter(Boolean);
    const atendimentos = await buscarAtendimentos(idsProtocolo);
    const temposDados = await buscarTempos(document.querySelector("#dtStart").value, document.querySelector("#dtEnd").value);
    const relatos = await buscarRelatos(idsBAs);
    ajustarColunaDataDespacho();
    inserirColunaDataHoraAtendimento(atendimentos);
    inserirColunaLocal(atendimentos);
    inserirColunaTipoLocal(atendimentos);
    inserirColunaEndereco(atendimentos);
    inserirColunasTempos(temposDados);
    inserirColunaNarrativa(atendimentos);
    inserirColunaRelatos(relatos);

    inserirColunaGuarnicao();
    removerColunas(['Despacho', 'BA GCM', 'Origem', 'Providência', 'Endereço']);




}

function ajustarColunaDataDespacho() {
    const content = document.querySelector('#content');
    const head = content.querySelector('table thead');
    const th = Array.from(head.querySelectorAll('tr th')).find(th => th.innerText == 'D/H');
    th.innerText = 'D/H Inicial Despacho';
    const index = Array.from(th.parentNode.querySelectorAll('th')).indexOf(th);
    const linhasTbody = content.querySelector('tbody').querySelectorAll('tr');
    linhasTbody.forEach(linha => {
        linha.querySelectorAll('td')[index].innerText = linha.querySelectorAll('td')[index].innerText.split('até')[0].trim();
    })
}

function selecionarNaturezas(valoresDesejados = []) {
    const select = document.querySelector('#reason');
    if (!select) return;

    // 1. Marca/desmarca as opções conforme o array passado
    Array.from(select.options).forEach(option => {
        option.selected = valoresDesejados.includes(option.value);
    });

    // 2. Dispara os eventos necessários para o MDBootstrap atualizar a tela
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
}

async function buscarTempos(dtStart, dtEnd) {
    const formData = new FormData();

    formData.append("dtStart", dtStart);
    formData.append("dtEnd", dtEnd);
    formData.append("numberCheckbook", "");
    formData.append("garrison", "");
    formData.append("filters", JSON.stringify({
        "Data/hora inicial *": dtStart,
        "Data/hora final *": dtEnd
    }));

    const response = await fetch("/web/dispatch_arrival/apply", {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const resultado = await response.json();
    if (!resultado) return false;
    return resultado.data.result;
}

async function buscarAtendimentos(ids) {
    const dados = await Promise.all(
        ids.map(async id => {
            return await buscarAtendimento(id);
        })
    )
    return dados.map(dado => {

        const dataInicialAtendimento = dado.attendance.start;
        const dateObj = new Date(dataInicialAtendimento);
        dateObj.setUTCHours(dateObj.getUTCHours() - 3);
        const dataInicialAtendimentoFormatada = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC' // Mantenha 'UTC' para preservar o horário exato da string Z, ou remova para converter para o fuso local do usuário
        }).format(dateObj);
        return {
            protocolo: dado.attendance.protocol,
            inicio: dataInicialAtendimentoFormatada.replaceAll(',', ''),
            pontoReferencia: dado.attendance.factPlace || '',
            tipoLocal: dado.attendance.factType || '',
            endereco: (dado.attendance.factStreet ? dado.attendance.factStreet + ', ' : '') + (dado.attendance.factNumber || ''),
            bairro: dado.attendance.factNeighborhood || '',
            narrativa: dado.attendance.transcription
        }

    });
}

async function buscarRelatos(ids) {
    const dados = await Promise.all(
        ids.map(async id => {
            return await buscarBA(id);
        })
    )
    return dados.map(dado => {
        if (!dado.data.data) return null;
        const dadosBA = JSON.parse(dado.data.data);
        return { id: dadosBA.id, relato: dadosBA.gcmReport };
    }).filter(Boolean);
}

inserirBotaoPesquisarPrometa();
ajustarParametros();

function inserirBotaoPesquisarPrometa() {
    const botaoAplicar = document.querySelector('#btn-search');
    botaoAplicar.addEventListener('click', () => {
        setTimeout(() => {
            ajustarTabelaPrometa();
        }, 2000)
    })
}

function ajustarParametros() {
    $('#bo').val('WITH_BOGCM').trigger('change');
    selecionarNaturezas(['Dano', 'Furto', 'Roubo', 'Pichação']);
    ajustarFuncaoExportarDados();
    setTimeout(() => {
        document.querySelector('#btn-search').click();
    }, 1000)

}

function ajustarFuncaoExportarDados() {
    const button = document.querySelector('button[class="dropdown-item export-item"]');
    button.setAttribute('onclick', 'exportarCSV()')
}

function exportarCSV() {
    const tabela = document.querySelector('#content table');
    if (!tabela) return;

    const linhas = Array.from(tabela.querySelectorAll('tr'));

    // Mapeia as linhas e células para o formato CSV
    const csvConteudo = linhas.map(linha => {
        const celulas = Array.from(linha.querySelectorAll('th, td'));
        return celulas
            .map(celula => {
                // Trata aspas duplas e limpa quebras de linha/espaços extras
                let texto = celula.innerText.trim().replace(/"/g, '""');
                return `"${texto}"`; // Envolve entre aspas para evitar problemas com vírgulas no texto
            })
            .join(';'); // Usa ponto e vírgula como separador (padrão do Excel no Brasil)
    }).join('\n');

    // Adiciona o BOM (\uFEFF) para garantir a acentuação correta (UTF-8) no Excel
    const blob = new Blob(['\uFEFF' + csvConteudo], { type: 'text/csv;charset=utf-8;' });

    // Cria o link invisível para acionar o download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_prometa.csv';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



