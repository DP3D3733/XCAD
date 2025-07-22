if (!document.querySelector('meta[charset="UTF-8"]')) {
    document.querySelector('head').innerHTML += '<meta charset="UTF-8">';
}
if (localStorage.getItem('dados_basicos')) {
    localStorage.removeItem('dados_basicos')
}
if (localStorage.getItem('dados_completos')) {
    localStorage.removeItem('dados_completos')
}
if (localStorage.getItem('procurado')) {
    localStorage.removeItem('procurado')
}
if (localStorage.getItem('mae')) {
    localStorage.removeItem('mae')
}
if (sessionStorage.getItem('img_n_repete')) {
    sessionStorage.removeItem('img_n_repete');
}
setTimeout(() => {
    localStorage.setItem("dados_completos", "nada");


    async function wait() {
        localStorage.removeItem("abordado");
        var pesquisa = '';
        if (localStorage.getItem("abordado")) {
            pesquisa = localStorage.getItem("abordado");
        } else {
            pesquisa = await window.navigator.clipboard.readText();
        }
        pesquisa = await window.navigator.clipboard.readText();
        consultar(pesquisa)
        document.removeEventListener("click", wait);
    }


    var but_cola_e_pesquisa = document.createElement("div");
    but_cola_e_pesquisa.setAttribute("id", "but_cola_e_pesquisa");
    but_cola_e_pesquisa.textContent = 'Copiar da área de transferência e pesquisar';
    but_cola_e_pesquisa.setAttribute("style", "vertical-align: middle; background:#c8c5c2; width:80%; height: 40%");
    document.querySelector("#CriteriosGerais").parentNode.insertBefore(but_cola_e_pesquisa, document.querySelector("#CriteriosGerais"));
    if (localStorage.getItem("abordado")) {
        var d_abrd_lista = document.createElement("div");
        d_abrd_lista.setAttribute("id", "abordado");
        var d_abrd = localStorage.getItem("abordado").split('aeaeae');
        var a = '';
        localStorage.removeItem("abordado");
        for (let i = 0; i < d_abrd.length; i++) {
            if (d_abrd[i].replace(/\D/g, '').length == 10) {
                document.querySelector('#tr_rg').click();
                document.querySelector('input[name=N10_rg]').value = d_abrd[i];
                document.querySelector('#frmRg').submit();
            } else if (d_abrd[i].replace(/\D/g, '').length == 11) {
                document.querySelector('#tr_cpf').click();
                document.querySelector('input[name=N_cpf]').value = d_abrd[i];
                document.querySelector('#frmCpf').submit();
            } else {
                a += d_abrd[i] + '<br>';
            }
        }
        d_abrd_lista.innerHTML = a;
        document.querySelector('#CriteriosGerais').parentNode.insertBefore(d_abrd_lista, document.querySelector('#CriteriosGerais'));
    }
    but_cola_e_pesquisa.addEventListener("click", wait);

}, "1000");

function consultar(pesquisa) {
    pesquisa = pesquisa.trim();
    pesquisa = pesquisa.replaceAll('aeaeae', "\n");
    if (/[\n|\n\r]/.test(pesquisa)) {
        pesquisa = pesquisa.replaceAll(/[\n|\n\r]/g, 'aeaeae');
        var dados = pesquisa.split('aeaeae');
        if (dados.length >= 2 && dados.length <= 3) {
            for (let i = 0; i < dados.length; i++) {
                var d = dados[i];
                if (d.includes('/')) {
                    if (d.length < 8) {
                        d = d.replaceAll('/', '');
                        if (d.substring(4, 5) == '0' || d.substring(4, 5) == '1' || d.substring(4, 5) == '2') {
                            d = d.substring(0, 2) + '/' + d.substring(2, 4) + '/20' + d.substring(4);
                        } else {
                            d = d.substring(0, 2) + '/' + d.substring(2, 4) + '/19' + d.substring(4);
                        }

                    }
                    document.querySelector('input[name=A10_dn1]').value = d;
                } else if (d.toUpperCase().includes('MÃE ') || d.toUpperCase().includes('MÂE ') || d.toUpperCase().includes('MAE ')) {
                    document.querySelector('input[name=A33_mae]').value = d.substring(4);
                } else {
                    document.querySelector('input[name=A66_nome]').value = d;
                }
            }
        }
        //document.frmNome.submit();
    } else {
        var pesquisan = pesquisa.replace(/\D/g, '');
        if (!isNaN(parseFloat(pesquisan)) && isFinite(pesquisan)) {
            if (pesquisan.length == 10) {
                document.querySelector('#tr_rg').click();
                document.querySelector('input[name=N10_rg]').value = pesquisan;
                document.querySelector('#frmRg').submit();
            } else if (pesquisan.length == 11) {
                document.querySelector('#tr_cpf').click();
                document.querySelector('input[name=N_cpf]').value = pesquisan;
                document.querySelector('#frmCpf').submit();
            }
        } else {
            document.querySelector('input[name=A66_nome]').value = pesquisa;
            document.querySelector('#frmNome').submit();
        }
    }
}

setInterval(() => {
    window.postMessage({ type: "verifica_pedido", payload: '' }, "*");
}, 100);


window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type && event.data.type === "tem_pedido") {
        consultar(event.data.data);
    }
});

