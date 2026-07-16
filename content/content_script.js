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
    chrome.runtime.sendMessage({ action: "atualizar_efetivo", data: event.data.data }, response => {
      if (chrome.runtime.lastError) {
        console.error("Erro na mensagem:", chrome.runtime.lastError.message);
      } else {
        sessionStorage.setItem('efetivoAtualizado', 'sim');
      }
    });
  }
  if (event.data.type === "enviarOSRotinas") {
    chrome.runtime.sendMessage({ action: "enviarOSRotinas", demanda: event.data.data }, response => {
      if (chrome.runtime.lastError) {
        console.error("Erro na mensagem:", chrome.runtime.lastError.message);
      } else {
        sessionStorage.removeItem('aguardandoEnvioOS');
      }
    });
  }
  if (event.data.type === "excluirDemandaOSRotinas") {
    chrome.runtime.sendMessage({ action: "excluirDemandaOSRotinas", id: event.data.id }, response => {
      if (chrome.runtime.lastError) {
        window.postMessage({
          type: "excluirDemandaOSRotinasResposta",
          status: "erro",
          erro: erro.message
        }, "*");
      } else {
        window.postMessage({
          type: "excluirDemandaOSRotinasResposta",
          status: "ok"
        }, "*");
      }
    });
  }
  if (event.data.type === "enviarNovoAtendimento") {
    chrome.runtime.sendMessage({ action: "enviarNovoAtendimento", atendimento: event.data.data }, response => {
      if (chrome.runtime.lastError) {
        window.postMessage({
          type: "enviarNovoAtendimentoResposta",
          status: "erro",
          erro: erro.message
        }, "*");
      } else {
        window.postMessage({
          type: "enviarNovoAtendimentoResposta",
          status: "ok"
        }, "*");
      }
    });
  }
  if (event.data.type === "enviarNovaAtualizacaoEfetivo") {
    sessionStorage.removeItem('efetivoAtualizado');
    window.reload();
  }
  if (event.data.type === "novoAlertaCercamento") {
    chrome.runtime.sendMessage({ action: "novoAlertaCercamento", atendimento: event.data.data, endereco: event.data.endereco });
  }

});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "focarEfetivo") {
    window.postMessage({ type: "focarEfetivo" }, "*");
  }
});

const url = window.location.href;
if (url.includes('sentry')) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("web_accessible_resources/sentry/sentry.js");
  document.documentElement.appendChild(script);
}

if (url.includes('sentry.procempa.com.br/web/bos')) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("web_accessible_resources/sentry/ba.js");
  document.documentElement.appendChild(script);
}

if (url.includes('sentry.procempa.com.br/web/despacho/dispatch/')) {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("web_accessible_resources/sentry/despacho.js");
  document.documentElement.appendChild(script);
}

if (url.includes('sentry.procempa.com.br/web/despacho/schedule-garrison')) {
  const scriptOS = document.createElement("script");
  scriptOS.src = chrome.runtime.getURL("web_accessible_resources/sentry/os.js");
  document.documentElement.appendChild(scriptOS);

  const scriptJSZip = document.createElement("script");
  scriptJSZip.src = chrome.runtime.getURL("libs/jszip.js");
  document.documentElement.appendChild(scriptJSZip);
}