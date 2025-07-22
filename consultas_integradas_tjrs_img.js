localStorage.setItem("dados_prontos", "nada");
var Tabela = {
    selecionarTabela: function (el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            document.getElementById('txt_resultados').value.select();
        }
        try {
            navigator.clipboard.writeText(range);
            range.blur();
        } catch (error) {
            // Exceção aqui
        }
    }
}

if (!sessionStorage.getItem('img_n_repete')) {
    document.querySelectorAll('a')[3].click();
    sessionStorage.setItem('img_n_repete', '1');
}
if (sessionStorage.getItem('img_n_repete') && sessionStorage.getItem('img_n_repete') == '1' && document.body.innerText.includes('Imagens não encontradas !')) {
    document.querySelectorAll('a')[0].click();
    sessionStorage.setItem('img_n_repete', '2');
}

if (sessionStorage.getItem('img_n_repete')) {
    var tb = localStorage.getItem('dados_completos');
    let textarea = document.createElement("span");
    textarea.setAttribute('id', 'txt_resultados');
    textarea.innerHTML = tb;
    document.querySelector('#frmImg').insertAdjacentElement('afterend', textarea);
    let botao_buscar_mandado = document.createElement("button");
    botao_buscar_mandado.setAttribute('id', 'botao_buscar_mandado');
    botao_buscar_mandado.innerHTML = 'Buscar Mandado';
    textarea.insertAdjacentElement('beforebegin', botao_buscar_mandado);
    imageToBase64(document.querySelector('img'),tb);
    document.querySelector('#botao_buscar_mandado').addEventListener('click', function (item) {
        //window.postMessage({ type: "FROM_PAGE", payload: tb }, "*");
        //navigator.clipboard.writeText(tb);
        //window.open("https://portalbnmp.cnj.jus.br/", "_blank");
    });
} else {
    document.querySelectorAll('a')[3].click();
    sessionStorage.setItem('img_n_repete', '1');
}

async function imageToBase64(img,tb) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.crossOrigin = "anonymous"; // evita erro CORS se possível

        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            try {
                const dataURL = canvas.toDataURL(); // padrão PNG
                resolve(dataURL);
                window.postMessage({ type: "img", payload: dataURL}, "*");
                window.postMessage({ type: "dados", payload: tb}, "*");
            } catch (e) {
                reject(e);
            }
        };

        img.onerror = reject;

        // Se a imagem já estiver carregada, dispara onload manualmente:
        if (img.complete && img.naturalWidth !== 0) {
            img.onload();
        }
    });
}
