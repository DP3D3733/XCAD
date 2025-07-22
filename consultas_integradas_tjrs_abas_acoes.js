setInterval(function () {
    //verifica se o indivíduo tem a aba de ocorrências
    if (document.getElementById('aoAbasElem5[class="ABASDes"]')) {
        localStorage.setItem('tem_ocorrencia', 'não');
    } else {
        localStorage.setItem('tem_ocorrencia', 'sim');
    }
    //verifica se o indivíduo tem a aba de imagem
    if (document.getElementById('aoAbasElem2') && document.getElementById('aoAbasElem2').getAttribute('class') == 'ABASDes') {
        localStorage.setItem('tem_imagem', 'não');
    } else {
        localStorage.setItem('tem_imagem', 'sim');
    }
    if (document.getElementById('doAbasElem5')) {
        if (localStorage.getItem('dados_prontos') == 'basicos' && document.getElementById('aoAbasElem0').getAttribute("class") == 'ABASOn') {
            if (document.getElementById('aoAbasElem5').getAttribute("class") == 'ABASOff') {
                document.getElementById('aoAbasElem5').click();
            } else {
                localStorage.setItem("dados_completos", decodeURIComponent('*DADOS BÁSICOS:*') + localStorage.getItem('dados_basicos') + '\n\n*'+decodeURIComponent('OCORRÊNCIAS')+':*\n'+decodeURIComponent('Não há')+'.');
                localStorage.setItem("dados_prontos", "ocorrencias");
            }

        }
        if (localStorage.getItem('dados_prontos') == 'ocorrencias' && document.getElementById('aoAbasElem2').getAttribute("class") == 'ABASOff') {
            document.getElementById('aoAbasElem2').click();
            localStorage.removeItem('dados_prontos');
        }
    }
});