window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data.type === "dados") {
    chrome.runtime.sendMessage({ action: "dados", data: event.data.payload });
  }
  if (event.data.type === "img") {
    chrome.runtime.sendMessage({ action: "imagem", data: event.data.payload });
  }
  if (event.data.type === "banco") {
    chrome.runtime.sendMessage({ action: "banco", data: event.data.payload });
  }

  if (event.data.type === "verifica_pedido") {
    chrome.storage.local.get("pedido_consulta", (d) => {
      if (d['pedido_consulta'] && d['pedido_consulta'] != '') {
        window.postMessage({ type: "tem_pedido", data: d['pedido_consulta'] }, "*");
      }
    })
  }
  if (event.data.type === "atualizar_efetivo") {
    console.log(event.data.data)
    chrome.runtime.sendMessage({ action: "atualizar_efetivo", data: event.data.data }, response => {
      if (chrome.runtime.lastError) {
        console.error("Erro na mensagem:", chrome.runtime.lastError.message);
      } else {
        sessionStorage.setItem('efetivoAtualizado', 'sim');
      }
    });
  }
  if (event.data.type === "enviarNovaAtualizacaoEfetivo") {
    sessionStorage.removeItem('efetivoAtualizado');
    window.reload();
  }
});
const url = window.location.href;
if (url.includes('sentry')) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("sentry.js");
  document.documentElement.appendChild(script);
}