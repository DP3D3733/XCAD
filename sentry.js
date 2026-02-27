const insereBotaoInterval = setInterval(() => {
    const url = window.location.href;
    const botaoAtual = document.getElementById('btn-export');
    if (url == 'https://sentry.procempa.com.br/web/effectives' && botaoAtual) {
        botaoAtual.removeAttribute('onclick');
        const novoBotao = botaoAtual.cloneNode(true);
        novoBotao.addEventListener('click', function () {
            capturaCPFs();
            localStorage.setItem('dadosEfetivo', '');
            window.location.href = 'https://sentry.procempa.com.br/web/effectives/1/edit';
        });
        botaoAtual.parentNode.replaceChild(novoBotao, botaoAtual);
        clearInterval(insereBotaoInterval);
    }
    if (url.includes('https://sentry.procempa.com.br/web/effectives') && url.includes('/edit') && localStorage.getItem('cpfs') && document.getElementById('cpf')) {
        const cpfDaPagina = document.getElementById('cpf').value;
        const cpfs = localStorage.getItem('cpfs').split(',');
        const proxPessoa = `${url.split('effectives/')[0]}effectives/${parseInt(url.split('effectives/')[1].split('/')) + 1}/edit`;
        if (!cpfs.includes(cpfDaPagina)) {
            clearInterval(insereBotaoInterval);
            window.location.href = proxPessoa;
        } else {
            const dados = extraiRegistro();
            let dadosEfetivo = localStorage.getItem('dadosEfetivo') || '';
            if (dadosEfetivo == '') {
                dadosEfetivo = extraiCabecalho().join(';') + '\n';
            }
            localStorage.setItem('dadosEfetivo', dadosEfetivo + dados.join(';') + '\n');
            cpfs.splice(cpfs.indexOf(cpfDaPagina), 1);
            if (cpfs.length == 0) {
                baixarCSVExcel('dadosEfetivo');
                localStorage.removeItem('cpfs');
                localStorage.removeItem('dadosEfetivo');
            } else {
                localStorage.setItem('cpfs', cpfs);
                window.location.href = proxPessoa;
            }
            clearInterval(insereBotaoInterval);

        }
    }
}, 100);

function capturaCPFs() {
    const cpfs = Array.from(document.querySelectorAll('div[tabulator-field="cpf"][role="gridcell"]')).map(cpf => cpf.innerText);
    localStorage.setItem('cpfs', cpfs);
}

function extraiRegistro() {
    const dados = [];
    document.querySelectorAll('#root input:not([type="hidden"]):not([type="file"]), select').forEach(input => {
        try {
            dados.push(input.value);
        } catch (error) {
            console.error(error, input);
        }
    });
    return dados;
}

function extraiCabecalho() {
    const headers = [];
    document.querySelectorAll('#root input:not([type="hidden"]):not([type="file"]), select').forEach(input => {
        try {
            let head = '';
            if (input.closest('div[class="card-body documents"]')) {
                head = `${input.closest('div.row').querySelector('label').innerText} -`;
            }
            head += input.parentNode.querySelector('label').innerText;
            headers.push(head);
        } catch (error) {
            console.error(error, input);
        }
    });
    return headers;
}

function baixarCSVExcel(chave, nomeArquivo = 'dados.csv') {
    const csv = localStorage.getItem(chave);
    if (!csv) return;

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