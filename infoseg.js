chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("InfoSeg", (d) => {
        if (d['InfoSeg'] == 'desativado') return;
        var a = 'a';
        setInterval(function () {
            chrome.storage.local.get("dados_consulta", (result) => {
                if (result.dados_consulta !== undefined) {
                    console.log("Valor recuperado:", result.dados_consulta);
                    sessionStorage.setItem('dados_envolvido', result.dados_consulta);
                    chrome.storage.local.remove("dados_consulta", () => { });
                    buscar_mandado();
                    // Aqui você pode usar o valor para atualizar a página, etc
                }
            });

            if (!document.querySelector('#buscar_mandado')) {
                const but_buscar_mandado = document.createElement('button');
                but_buscar_mandado.setAttribute('id', 'buscar_mandado');
                but_buscar_mandado.innerHTML = 'Buscar Mandado';
                document.querySelector("#searchContainer").insertAdjacentElement('afterend', but_buscar_mandado);
                but_buscar_mandado.addEventListener('click', function () { buscar_mandado(); });
            }
        }, 100);
        function buscar_mandado() {
            const abrirBuscaAvancada = setInterval(() => {
                document.querySelector('#advanced-search').click();
                document.querySelector('#slct-base-individuos').click();
                document.querySelector('option[label="CNJ-BNMP"]').selected = true;
                document.querySelector('#slct-base-individuos').dispatchEvent(new Event('change', { bubbles: true }));
                clearInterval(abrirBuscaAvancada);
            }, 100);

            const buscarMandado = setInterval(() => {
                if (!sessionStorage.getItem('dados_envolvido')) return;
                const dados = sessionStorage.getItem('dados_envolvido');
                const nome = dados.split('Nome: ')[1].split('\n')[0];
                const mae = dados.split('mãe: ')[1].split('\n')[0];
                document.querySelector('#mandados-nome').value = nome;
                document.querySelector('#mandados-nomeMae').value = mae;
                document.querySelector('#btn-pesquisar-mandados').click();
                setTimeout(() => {
                    const apresentarResultado = setInterval(() => {
                        if (!document.querySelector('#copiar_resultados')) {
                            if (document.querySelector('input[data-servico="SRV_MANDADOS"]') && document.querySelector('input[data-servico="SRV_MANDADOS"]').getAttribute('data-key').includes('buscaPorOrgaos')) {
                                let copiar_resultados = document.createElement("button");
                                copiar_resultados.setAttribute('id', 'copiar_resultados');
                                copiar_resultados.setAttribute('style', 'height:150px;width:400px');
                                copiar_resultados.innerHTML = 'Copiar Resultados';
                                document.querySelector("#sinesp-body").insertAdjacentElement('beforebegin', copiar_resultados);
                                let resultado = document.createElement("div");
                                copiar_resultados.insertAdjacentElement('afterend', resultado);
                                let enviar_whats = document.createElement("button");
                                enviar_whats.setAttribute('id', 'enviar_whats');
                                enviar_whats.setAttribute('style', 'height:150px;width:400px');
                                enviar_whats.innerHTML = 'Enviar P/ WhatsApp';
                                copiar_resultados.insertAdjacentElement('afterend', enviar_whats);
                                chrome.storage.local.get("imagem_consulta", (result) => {
                                    if (result.imagem_consulta) {
                                        const img = document.createElement("img");
                                        img.src = result.imagem_consulta;
                                        img.style.maxWidth = "300px";
                                        copiar_resultados.insertAdjacentElement('afterend', img);
                                    }
                                });
                                let dados_envolvido = sessionStorage.getItem('dados_envolvido');
                                resultado.innerHTML = ('<div dados>*SEM NOVIDADES!*\n\n' + dados_envolvido + '</div>').replaceAll('\n', '<br>');
                                chrome.storage.local.get("pedido_consulta", (result) => {
                                    if (result.pedido_consulta) {
                                        chrome.storage.local.remove('pedido_consulta', function () {
                                            console.log('Removido!');
                                        });
                                        chrome.storage.local.set({ dados_consulta: '*SEM NOVIDADES!*\n\n' + dados_envolvido }, () => {
                                            chrome.runtime.sendMessage({ action: "retorna_consulta", data: '' });
                                            clearInterval(apresentarResultado);
                                        });
                                    }
                                });
                                document.querySelector('#copiar_resultados').addEventListener('click', function () {
                                    navigator.clipboard.writeText(resultado.querySelector('div[dados]').innerText);
                                    const range = document.createRange();
                                    const selection = window.getSelection();

                                    // Apaga qualquer seleção anterior
                                    selection.removeAllRanges();

                                    // Cria uma faixa de seleção e seleciona o conteúdo
                                    range.selectNodeContents(resultado);

                                    // Adiciona a seleção ao window.getSelection()
                                    selection.addRange(range);
                                });
                                document.querySelector('#enviar_whats').addEventListener('click', function () {
                                    chrome.storage.local.remove('pedido_consulta', function () {
                                        console.log('Removido!');
                                    });
                                    chrome.storage.local.set({ dados_consulta: this.nextElementSibling.querySelector('div[dados]').innerHTML.replaceAll('<br>', '\n') }, () => {
                                        chrome.runtime.sendMessage({ action: "retorna_consulta", data: '' });
                                    });
                                });
                            }
                            if (document.querySelector('input[data-servico="SRV_MANDADOS"]') && !document.querySelector('input[data-servico="SRV_MANDADOS"]').getAttribute('data-key').includes('buscaPorOrgaos')) {
                                let copiar_resultados = document.createElement("button");
                                copiar_resultados.setAttribute('id', 'copiar_resultados');
                                copiar_resultados.setAttribute('style', 'height:150px;width:400px');
                                copiar_resultados.innerHTML = 'Copiar Resultados';
                                document.querySelector("#sinesp-body").insertAdjacentElement('beforebegin', copiar_resultados);
                                let resultado = document.createElement("div");
                                copiar_resultados.insertAdjacentElement('afterend', resultado);
                                chrome.storage.local.get("imagem_consulta", (result) => {
                                    if (result.imagem_consulta) {
                                        const img = document.createElement("img");
                                        img.src = result.imagem_consulta;
                                        img.style.maxWidth = "300px";
                                        copiar_resultados.insertAdjacentElement('afterend', img);
                                    }
                                });
                                let enviar_whats = document.createElement("button");
                                enviar_whats.setAttribute('id', 'enviar_whats');
                                enviar_whats.setAttribute('style', 'height:150px;width:400px');
                                enviar_whats.innerHTML = 'Enviar P/ WhatsApp';
                                copiar_resultados.insertAdjacentElement('afterend', enviar_whats);
                                let dados_envolvido = sessionStorage.getItem('dados_envolvido');
                                resultado.innerHTML = ('<div dados>*ATENÇÃO! CONDUZIR! ENVIAR IMAGENS DA CONDUÇÃO.*\n\n*MANDADO:*\n' + document.querySelectorAll("#p0-ADVANCED_SEARCH-lista-conteudo div")[9].innerText + '\n\n' + dados_envolvido + '</div>').replaceAll('\n', '<br>').replaceAll('Foragido Polícia Penal<br>', '');
                                chrome.storage.local.get("pedido_consulta", (result) => {
                                    if (result.pedido_consulta) {
                                        chrome.storage.local.remove('pedido_consulta', function () {
                                            console.log('Removido!');
                                        });
                                        chrome.storage.local.set({ dados_consulta: '*ATENÇÃO! CONDUZIR! ENVIAR IMAGENS DA CONDUÇÃO.*\n\n*MANDADO:*\n' + document.querySelector('tbody td').innerText + '\n\n' + dados_envolvido }, () => {
                                            chrome.runtime.sendMessage({ action: "retorna_consulta", data: '' });
                                        });
                                    }
                                });
                                document.querySelector('#copiar_resultados').addEventListener('click', function () {
                                    navigator.clipboard.writeText(resultado.querySelector('div[dados]').innerText);
                                    const range = document.createRange();
                                    const selection = window.getSelection();

                                    // Apaga qualquer seleção anterior
                                    selection.removeAllRanges();

                                    // Cria uma faixa de seleção e seleciona o conteúdo
                                    range.selectNodeContents(resultado);

                                    // Adiciona a seleção ao window.getSelection()
                                    selection.addRange(range);
                                });
                                document.querySelector('#enviar_whats').addEventListener('click', function () {
                                    chrome.storage.local.remove('pedido_consulta', function () {
                                        console.log('Removido!');
                                    });
                                    chrome.storage.local.set({ dados_consulta: this.nextElementSibling.querySelector('div[dados]').innerHTML.replaceAll('<br>', '\n') }, () => {
                                        chrome.runtime.sendMessage({ action: "retorna_consulta", data: '' });
                                    });
                                });
                            }
                        } else {
                            clearInterval(apresentarResultado);
                        }

                    }, 100);
                }, 500);
                clearInterval(buscarMandado);
            }, 100);
        }
    });
});
