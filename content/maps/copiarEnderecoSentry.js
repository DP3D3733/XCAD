insereBotaoCopiarParaSentry();


function insereBotaoCopiarParaSentry() {
    const esperaCarregamentoBotao = setInterval(() => {
        const botaoOriginal = document.querySelector('button[data-value="Rotas"]');
        if (!botaoOriginal) return;
        if (document.querySelector('#botaoCopiarSentry')) return;

        const divBotaoOriginal = botaoOriginal.parentNode;
        const novaDiv = '<div class="etWJQ jym1ob HRm8Bc kdfrQc WY7ZIb"><button id="botaoCopiarSentry" class="S9kvJb " aria-label="Sentry" data-value="Sentry"><span class="DVeyrd "><div class="NRH0ac pMsEOd"></div><span class="ZHFdpf google-symbols" aria-hidden="true" style="font-size: 18px;"></span></span><div class="R8c4Qb fontLabelMedium">Sentry</div></button></div>'
        divBotaoOriginal.insertAdjacentHTML("beforebegin", novaDiv);
        document.querySelector('#botaoCopiarSentry').addEventListener('click', copiarParaSentry);
    }, 1000);
}

function copiarParaSentry() {
    const streetViewContainer = document.querySelector('button[aria-label="Street View"]');
    if (!streetViewContainer) return;

    streetViewContainer.click();
    setTimeout(() => {
        const url = window.location.href;
        const coordenadas = extrairCoordenadas(url);
        const endereco = document.querySelector('[jsaction*="info.copyText"],[data-item-id="address"]').innerText.substring(2);
        const enderecoDividido = endereco.split(/,| - /);
        let logradouro, numero, bairro;
        if (enderecoDividido.length == 6) [logradouro, numero, bairro] = enderecoDividido;
        if (enderecoDividido.length == 5) {
            logradouro = enderecoDividido[0];
            bairro = enderecoDividido[1];
        }
        const enderecoFinal = `${logradouro || ''}-++-${numero || ''}-++-${bairro || ''}-++-${coordenadas.latitude}-++-${coordenadas.longitude}`;
        inserirNaAreaTransferencia(enderecoFinal);
    }, 5000);


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