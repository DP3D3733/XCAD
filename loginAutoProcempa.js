const iniciarLoginInterval = setInterval(() => {
    const inputUser = document.querySelector('#username');
    if (!inputUser) return;

    capturarCredenciais();

    const msgErro = document.querySelector('.alert-error');
    if (msgErro) return;

    logarAutomaticamente();
    clearInterval(iniciarLoginInterval);
}, 100);

function logarAutomaticamente() {
    const [login, senha] = (localStorage.getItem('loginSenha') || ',').split(',');
    if (login == '') return;

    const inputUser = document.querySelector('#username');
    if (!inputUser) return;

    const inputSenha = document.querySelector('#password');
    if (!inputSenha) return;


    inputUser.value = login;
    inputUser.dispatchEvent(new Event('input', {
        bubbles: true
    }))

    inputSenha.value = senha;
    inputSenha.dispatchEvent(new Event('input', {
        bubbles: true
    }))

    document.querySelector('#kc-form-login').submit();
}

function capturarCredenciais() {
    const inputUser = document.querySelector('#username');
    if (!inputUser) return;

    const inputSenha = document.querySelector('#password');
    if (!inputSenha) return;

    [inputUser, inputSenha].forEach(input => {
        input.addEventListener("input", () => {
            localStorage.setItem('loginSenha', `${inputUser.value},${inputSenha.value}`);
        });
    });
}