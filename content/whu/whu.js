chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("WHU", (d) => {
        if (d['WHU'] == 'desativado') return;
        setInterval(() => {
            if (document.querySelector('li[id^="msg"]')) {
                const ultimaMensagemAtual = [...document.querySelectorAll('li[id^="msg"]')].pop().innerText;

                const ultimaMensagemGravada = localStorage.getItem("ultimaMensagem") || '';
                if (ultimaMensagemAtual != ultimaMensagemGravada && !document.hasFocus()) {
                    const remetente = document.querySelector('div[class="title"]')?.innerText;
                    notificar(`${remetente}: ${ultimaMensagemAtual?.split('\n')[3] || ultimaMensagemAtual}`);
                }
                localStorage.setItem("ultimaMensagem", ultimaMensagemAtual);
            };

        }, 1000);

        async function notificar(mensagem) {
            // Se o usuário ainda não decidiu
            if (Notification.permission === "default") {
                const permissao = await Notification.requestPermission();

                if (permissao !== "granted") {
                    return; // não insiste
                }
            }

            // Se já estiver liberado
            if (Notification.permission === "granted") {
                new Notification("WHU", {
                    body: mensagem,
                });
            }
        }
    })
})