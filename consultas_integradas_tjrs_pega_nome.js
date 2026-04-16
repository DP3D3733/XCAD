var a = 'a';
const continuarPesquisa = impedirPesquisaEmLooping();
if (continuarPesquisa) {
    setInterval(function () {
        if (document.getElementById('tabOcorrparentDadosoLista') && document.getElementById("tabOcorrparentDadosoLista").rows.length == 1 && a == 'a') {
            document.querySelectorAll('a')[1].click();
            a = 'b';
        }
        if (document.body.innerHTML.includes('Não existe indivíduo com os critérios informados!') && chrome.storage.local.get("pedido_consulta")) {
            chrome.storage.local.remove("pedido_consulta");
        }
        if (document.body.innerHTML.includes('CPF inválido') && chrome.storage.local.get("pedido_consulta")) {
            chrome.storage.local.remove("pedido_consulta");
        }
    }, 100);
}

function impedirPesquisaEmLooping() {
    const pesquisaAtual = localStorage.getItem('pesquisaAtual');
    if (!pesquisaAtual) return true;

    const pesquisaAnterior = localStorage.getItem('pesquisaAnterior');
    if (!pesquisaAnterior || pesquisaAnterior != pesquisaAtual) {
        localStorage.setItem('pesquisaAnterior', pesquisaAtual);
        return true;
    }

    const querRepetirAPesquisa = confirm("Consulta idêntica à anterior. Continuar?")
    if (querRepetirAPesquisa == false) {
        chrome.storage.local.remove("pedido_consulta");
        return false;
    }

    return true;
}