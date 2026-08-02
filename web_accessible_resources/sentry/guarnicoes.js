

async function copiarEfetivo(botao) {
    const guarnicoes = table.getData();
    const dadosGuarnicoes = await Promise.all(
        guarnicoes.map(async guarnicao => {
            return await buscarGuarnicao(guarnicao.garrison_id);
        })
    );
    try {
        await navigator.clipboard.writeText(dadosGuarnicoes.join('\n'));
        console.log("Texto copiado!");
        botao.innerHTML = `<i class="fa fa-check"></i>`;
        setTimeout(() => {
            botao.innerHTML = `<i class="fa fa-users"></i>`;
        }, 1000);
    } catch (err) {
        console.error("Erro ao copiar:", err);
    }
}

async function buscarGuarnicao(id) {
    const response = await fetch(
        `https://sentry.procempa.com.br/web/despacho/garrison/${id}/edit`,
        {
            credentials: "include",
        }
    );

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const equipeNome = doc.querySelector("form [name='team']")?.value;
    const integrantes = Array.from(doc.querySelectorAll('select[positionname]')).map(select => `${select.selectedOptions[0].text.trim().replace(' ', '\t')}\t${select.getAttribute('positionname')}`);
    const vtrs = Array.from(doc.querySelectorAll('select[name="myModel.garrisonComposition"]')).map(select => select.selectedOptions[0].text.replace('-', '').replace('|', '-')).join(', ');
    return integrantes.map(integrante => `${equipeNome}\t${integrante}\t${vtrs}`).join('\n');
}

function inserirBotaoCopiarGuarnicoes() {
    const botaoCopiarGuarnicoes = document.createElement('button');
    botaoCopiarGuarnicoes.setAttribute('class', 'btn btn-default');
    botaoCopiarGuarnicoes.innerHTML = `<i class="fa fa-users"></i>`;
    botaoCopiarGuarnicoes.title = 'Copiar Guarnicoes';
    botaoCopiarGuarnicoes.setAttribute('style', "height: 35px !important; margin: 0px 0px 0px 5px;")
    botaoCopiarGuarnicoes.addEventListener('click', () => copiarEfetivo(botaoCopiarGuarnicoes));
    const intervalEsperarBotaoTurnoAtual = setInterval(() => {
        const botaoTurnoAtual = document.querySelector('#btn-turno-atual');
        if (!botaoTurnoAtual) return;
        botaoTurnoAtual.insertAdjacentElement('afterend', botaoCopiarGuarnicoes);
        botaoTurnoAtual.closest('div.buttons').style.width = '190px';
        clearInterval(intervalEsperarBotaoTurnoAtual);
    }, 100);
}

async function copiarQAP(botao) {
    const guarnicoes = table.getData();
    const texto = guarnicoes.map(guarnicao => {
        console.log(guarnicao);
        if (!guarnicao.garrison_team) return '';
        const equipe = guarnicao.garrison_team.split('-')[0].trim();
        const hora = guarnicao.garrison_start.split(' ')[1];
        return `${equipe} - ${hora}`;
    });
    try {
        await navigator.clipboard.writeText(texto.join('\n'));
        console.log("Texto copiado!");
        botao.innerHTML = `<i class="fa fa-check"></i>`;
        setTimeout(() => {
            botao.innerHTML = `<i class="fa fa-clock"></i>`;
        }, 1000);
    } catch (err) {
        console.error("Erro ao copiar:", err);
    }
}

function inserirBotaoCopiarQAP() {
    const botaoCopiarQAP = document.createElement('button');
    botaoCopiarQAP.setAttribute('class', 'btn btn-default');
    botaoCopiarQAP.innerHTML = `<i class="fa fa-clock"></i>`;
    botaoCopiarQAP.setAttribute('style', "height: 35px !important; margin: 0px 0px 0px 5px;")
    botaoCopiarQAP.title = 'Copiar QAP';
    botaoCopiarQAP.addEventListener('click', () => copiarQAP(botaoCopiarQAP));
    const intervalEsperarBotaoTurnoAtual = setInterval(() => {
        const botaoTurnoAtual = document.querySelector('#btn-turno-atual');
        if (!botaoTurnoAtual) return;
        botaoTurnoAtual.insertAdjacentElement('afterend', botaoCopiarQAP);
        clearInterval(intervalEsperarBotaoTurnoAtual);
    }, 100);
}

inserirBotaoCopiarGuarnicoes();
inserirBotaoCopiarQAP();

