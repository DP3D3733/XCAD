function insereBotaoCopiarParaSentry() {
    const botaoOriginal = document.querySelector('button[data-value="Rotas"]');
    const divBotaoOriginal = botaoOriginal.parentNode;
    const novaDiv = '<div class="etWJQ jym1ob HRm8Bc kdfrQc WY7ZIb"><button id="botaoCopiarSentry" class="S9kvJb " aria-label="Sentry" data-value="Sentry"><span class="DVeyrd "><div class="NRH0ac pMsEOd"></div><span class="ZHFdpf google-symbols" aria-hidden="true" style="font-size: 18px;"></span></span><div class="R8c4Qb fontLabelMedium">Sentry</div></button></div>'
    divBotaoOriginal.insertAdjacentHTML("beforebegin", novaDiv);
    document.querySelector('#botaoCopiarSentry').addEventListener('click', copiarParaSentry);
}

function copiarParaSentry() {
    const url = window.location.href;
    const coordenadas = extrairCoordenadas(url);
    const endereco = document.querySelector('[jsaction*="info.copyText"]').innerText.substring(2);
    const [logradouro, numero, bairro] = endereco.split(/,| - /);
    const enderecoFinal = `${logradouro}-++-${numero}-++-${bairro}-++-${coordenadas.latitude}-++-${coordenadas.longitude}`;
    inserirNaAreaTransferencia(enderecoFinal);
}


function extrairCoordenadas(url) {
    const match = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

    return match
        ? {
            latitude: Number(match[1]),
            longitude: Number(match[2])
        }
        : null;
}

async function inserirNaAreaTransferencia(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        console.log('Texto copiado com sucesso!');
    } catch (erro) {
        console.error('Erro ao copiar:', erro);
    }
}