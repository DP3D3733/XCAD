setInterval(function () {
    if (localStorage.getItem('pula_tela_inicial') == 'pula') {
        localStorage.setItem('pula_tela_inicial', 'n_pula');
        document.querySelector('#individuo a').click();
    }
}, 1000);