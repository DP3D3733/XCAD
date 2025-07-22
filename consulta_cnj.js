chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("CNJ", (d) => {
        if (d['CNJ'] == 'desativado') return;
        if (!sessionStorage.getItem('dados_envolvido') && (!sessionStorage.getItem('dados_envolvido_ja_pesquisados') || !sessionStorage.getItem('dados_envolvido_ja_pesquisados').includes(sessionStorage.getItem('dados_envolvido')))) {
            //wait();
            chrome.storage.local.get("dados_consulta", (result) => {
                if (result.dados_consulta !== undefined) {
                    console.log("Valor recuperado:", result.dados_consulta);
                    sessionStorage.setItem('dados_envolvido', result.dados_consulta);
                    // Aqui você pode usar o valor para atualizar a página, etc
                } else {
                    console.log("Valor não encontrado no storage.");
                }
            });
        }
        async function wait() {
            sessionStorage.setItem('dados_envolvido', await window.navigator.clipboard.readText());
        }
        function selecionarTabela(el) {
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
                document.execCommand('copy');
                range.blur();
            } catch (error) {
                // Exceção aqui
            }
        }
        var procurado = '';
        var mae = '';
        var cpf = '';
        var dataNascimento = '';
        setInterval(function () {
            if (document.querySelector('app-pesquisa-peca') && !document.body.innerText.includes('Nenhum registro encontrado') && !document.body.innerText.includes('DADOS BÁSICOS')) {
                let copiar_resultados = document.createElement("button");
                copiar_resultados.setAttribute('id', 'copiar_resultados');
                copiar_resultados.setAttribute('style', 'height:150px;width:400px');
                copiar_resultados.innerHTML = 'Copiar Resultados';
                document.querySelector('h3').parentNode.insertAdjacentElement('beforebegin', copiar_resultados);
                var resultado = document.querySelector('h3').parentNode;
                chrome.storage.local.get("imagem_consulta", (result) => {
                    if (result.imagem_consulta) {
                        const img = document.createElement("img");
                        img.src = result.imagem_consulta;
                        img.style.maxWidth = "300px";
                        resultado.appendChild(img);
                    }
                });
                let dados_envolvido = sessionStorage.getItem('dados_envolvido');
                sessionStorage.clear();
                resultado.innerHTML = ('<div dados>*ATENÇÃO! CONDUZIR! ENVIAR IMAGENS DA CONDUÇÃO.*\n\n*MANDADO:*\n' + document.querySelector('tbody td').innerText + dados_envolvido + '</div>').replaceAll('\n', '<br>');
                chrome.storage.local.get("pedido_consulta", (result) => {
                    if (result.pedido_consulta) {
                        chrome.storage.local.remove('pedido_consulta', function () {
                            console.log('Removido!');
                        });
                        chrome.storage.local.set({ dados_consulta: '*ATENÇÃO! CONDUZIR!*\n\n*MANDADO:*\n' + document.querySelector('tbody td').innerText + '\n\n' + dados_envolvido }, () => {
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
            }
            if (document.querySelector('input[name=nomePessoa]') && sessionStorage.getItem('dados_envolvido') && (!sessionStorage.getItem('dados_envolvido_ja_pesquisados') || !sessionStorage.getItem('dados_envolvido_ja_pesquisados').includes(sessionStorage.getItem('dados_envolvido')))) {
                var pesquisa = sessionStorage.getItem('dados_envolvido');
                procurado = pesquisa.split('Nome: ')[1]?.split('\n')[0].replaceAll('&nbsp;', '');
                mae = pesquisa.split('Nome da mãe: ')[1]?.split('\n')[0].replaceAll('&nbsp;', '');
                cpf = pesquisa.split('CPF: ')[1]?.split('\n')[0].replaceAll('&nbsp;', '');
                dataNascimento = pesquisa.split('Nascimento: ')[1]?.split('\n')[0].replaceAll('&nbsp;', '');

                if (cpf && cpf.trim() != '') {
                    document.querySelector('input[name=numeroCpf]').click();
                    document.querySelector('input[name=numeroCpf]').value = cpf;
                    document.querySelector('input[name=numeroCpf]').dispatchEvent(
                        new Event("input", { bubbles: true, cancelable: true })
                    );
                    sessionStorage.setItem('ultima_abordagem', "https://cadweb.sinesp.gov.br/paineis-estatisticos/app/discover#/?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,field:envolvidos.listaDocumentos.numeroDocumento,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,key:envolvidos.listaDocumentos.numeroDocumento,negate:!f,params:(query:'" + cpf.replaceAll(/[/.-]/g, '') + "'),type:phrase),query:(match_phrase:(envolvidos.listaDocumentos.numeroDocumento:'" + cpf.replaceAll(/[/.-]/g, '') + "')))),refreshInterval:(pause:!t,value:60000),time:(from:now-12y,to:now))&_a=(columns:!(logradouro,numero,bairro,pontoReferencia,envolvidos,equipesEmpenhadas,dataHoraFato),filters:!(),grid:(columns:(naturezasFinais:(width:130))),hideChart:!t,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,interval:auto,query:(language:kuery,query:''),sort:!(!(dataHoraRegistroChamadoUTC,desc)))&ultimaabordagem=sim");
                } else {
                    document.querySelector('input[name=nomePessoa]').click();
                    document.querySelector('input[name=nomePessoa]').value = procurado;
                    document.querySelector('input[name=nomePessoa]').dispatchEvent(
                        new Event("input", { bubbles: true, cancelable: true })
                    );
                    document.querySelector('input[name=nomeMae]').click();
                    document.querySelector('input[name=nomeMae]').value = mae;
                    document.querySelector('input[name=nomeMae]').dispatchEvent(
                        new Event("input", { bubbles: true, cancelable: true })
                    );
                    document.querySelector('input[name=dataNascimento]').click();
                    document.querySelector('input[name=dataNascimento]').value = dataNascimento;
                    document.querySelector('input[name=dataNascimento]').dispatchEvent(
                        new Event("input", { bubbles: true, cancelable: true })
                    );
                    sessionStorage.setItem('ultima_abordagem', "https://cadweb.sinesp.gov.br/paineis-estatisticos/app/discover#/?_g=(filters:!(('$state':(store:globalState),meta:(alias:!n,disabled:!f,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,negate:!f,params:!((meta:(alias:!n,disabled:!f,field:envolvidos.nome,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,key:envolvidos.nome,negate:!f,params:(query:'" + procurado.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '').replaceAll(' ', '%20') + "'),type:phrase),query:(match_phrase:(envolvidos.nome:'" + procurado.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '').replaceAll(' ', '%20') + "'))),(meta:(alias:!n,disabled:!f,field:envolvidos.nomeMae,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,key:envolvidos.nomeMae,negate:!f,params:(query:'" + mae.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '').replaceAll(' ', '%20') + "'),type:phrase),query:(match_phrase:(envolvidos.nomeMae:'" + mae.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '').replaceAll(' ', '%20') + "'))),('$state':(store:appState),meta:(alias:!n,disabled:!f,field:envolvidos.dataNascimento,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,key:envolvidos.dataNascimento,negate:!f,params:(query:'" + dataNascimento.split('/')[2] + '-' + dataNascimento.split('/')[1] + '-' + dataNascimento.split('/')[0] + "T00:00:00.000Z'),type:phrase),query:(match_phrase:(envolvidos.dataNascimento:'" + dataNascimento.split('/')[2] + '-' + dataNascimento.split('/')[1] + '-' + dataNascimento.split('/')[0] + "T00:00:00.000Z')))),relation:AND,type:combined),query:())),refreshInterval:(pause:!t,value:60000),time:(from:now-12y,to:now))&_a=(columns:!(logradouro,numero,bairro,pontoReferencia,envolvidos,equipesEmpenhadas,dataHoraFato),filters:!(),grid:(columns:(naturezasFinais:(width:130))),hideChart:!t,index:cfc8e00b-b566-4aa1-8650-972ed33cc53d,interval:auto,query:(language:kuery,query:''),sort:!(!(dataHoraRegistroChamadoUTC,desc)))&ultimaabordagem=sim");
                }
            }
            if (document.querySelector('input[name=nomePessoa]') && (document.querySelector('input[name=numeroCpf]').value != '' || (document.querySelector('input[name=nomePessoa]').value != '' && document.querySelector('input[name=nomeMae]').value != '' && document.querySelector('input[name=dataNascimento]').value != '')) && sessionStorage.getItem('dados_envolvido') && (!sessionStorage.getItem('dados_envolvido_ja_pesquisados') || !sessionStorage.getItem('dados_envolvido_ja_pesquisados').includes(sessionStorage.getItem('dados_envolvido')))) {
                sessionStorage.setItem('dados_envolvido_ja_pesquisados', pesquisa);
                setTimeout(() => {
                    document.querySelector('button[label=Pesquisar]').click();
                    document.removeEventListener("click", wait);
                }, "500");
            }
            if (document.querySelector('app-sem-resultado') && sessionStorage.getItem('dados_envolvido') && !document.querySelector('app-sem-resultado').innerHTML.includes('DADOS BÁSICOS')) {
                resultado = document.querySelector('app-sem-resultado');
                let copiar_resultados = document.createElement("button");
                copiar_resultados.setAttribute('id', 'copiar_resultados');
                copiar_resultados.setAttribute('style', 'height:150px;width:400px');
                copiar_resultados.innerHTML = 'Copiar Resultados';
                resultado.parentNode.insertAdjacentElement('beforebegin', copiar_resultados);
                let buscar_ultima_abordagem = document.createElement("button");
                buscar_ultima_abordagem.setAttribute('id', 'buscar_ultima_abordagem');
                buscar_ultima_abordagem.setAttribute('style', 'height:150px;width:400px');
                buscar_ultima_abordagem.innerHTML = 'Buscar Última Abordagem';
                resultado.parentNode.insertAdjacentElement('beforebegin', buscar_ultima_abordagem);
                chrome.storage.local.get("imagem_consulta", (result) => {
                    if (result.imagem_consulta) {
                        const img = document.createElement("img");
                        img.src = result.imagem_consulta;
                        img.style.maxWidth = "300px";
                        resultado.appendChild(img);
                    }
                });
                let dados_envolvido = sessionStorage.getItem('dados_envolvido');
                sessionStorage.clear();
                resultado.innerHTML = ('<div dados>*SEM NOVIDADES!*\n\n' + dados_envolvido + '</div>').replaceAll('\n', '<br>');
                chrome.storage.local.get("pedido_consulta", (result) => {
                    if (result.pedido_consulta) {
                        chrome.storage.local.remove('pedido_consulta', function () {
                            console.log('Removido!');
                        });
                        chrome.storage.local.set({ dados_consulta: '*SEM NOVIDADES!*\n\n' + dados_envolvido }, () => {
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

                document.querySelector('#buscar_ultima_abordagem').addEventListener('click', function () {
                    navigator.clipboard.writeText(resultado.innerHTML.replace('*DADOS BÁSICOS:*', '\n\n*DADOS BÁSICOS:*').replace('*OCORRÊNCIAS:*', '\n*OCORRÊNCIAS:*').replaceAll('&nbsp;', ''));
                    const range = document.createRange();
                    const selection = window.getSelection();

                    // Apaga qualquer seleção anterior
                    selection.removeAllRanges();

                    // Cria uma faixa de seleção e seleciona o conteúdo
                    range.selectNodeContents(resultado);

                    // Adiciona a seleção ao window.getSelection()
                    selection.addRange(range);
                    window.open(sessionStorage.getItem('ultima_abordagem'), "_blank");
                });
            }
        }, 100);

    });
});