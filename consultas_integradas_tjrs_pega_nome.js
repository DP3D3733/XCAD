var a = 'a';
setInterval(function() {
    if(document.getElementById('tabOcorrparentDadosoLista') && document.getElementById("tabOcorrparentDadosoLista").rows.length == 1 && a=='a') {
        document.querySelectorAll('a')[1].click();
        a='b';
    }
    if(document.body.innerHTML.includes('Não existe indivíduo com os critérios informados!') && chrome.storage.local.get("pedido_consulta")) {
        chrome.storage.local.remove("pedido_consulta");
    }
    if (document.body.innerHTML.includes('CPF inválido') && chrome.storage.local.get("pedido_consulta")) {
        chrome.storage.local.remove("pedido_consulta");
    }
},100);