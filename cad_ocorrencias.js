
let trava_cod_montar_cad = '';
localStorage.setItem('selecionaopcao', '');
sessionStorage.removeItem('multicads_montar_cad');
sessionStorage.removeItem('cod_montar_cad');

chrome.runtime.sendMessage({ action: "atualizar_qths" }, (response_atualizar_qths) => {
    if (!response_atualizar_qths?.dados?.qth) return;
    const qths = response_atualizar_qths?.dados?.qth;
    const qthsLimpos = qths.split('-++-').map(qth => {
        return `<option>${qth.split('-()-')[1]}.-.${qth.split('-()-')[4]}.-.${qth.split('-()-')[2]}</option>`;
    }).join("");
    localStorage.setItem('qths', qthsLimpos);
});

chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("CAD Ocorrências", (d) => {
        if (d['CAD Ocorrências'] == 'desativado') return;
        let versao, versiculo;
        fetch(chrome.runtime.getURL("versiculos.json"))
            .then(response => response.json())
            .then(data => {
                versiculo = data[Math.floor(Math.random() * data.length)].text;
                versao = `<span style="margin-right:30px;color: #d3d4d9">XCAD <strong>v1.5.6</strong>, por GM 842 Calebe. ${versiculo}</span>`;
            })
            .catch(err => {
                console.error("Erro ao carregar JSON:", err);
                versao = `<span style="margin-right:30px;color: #d3d4d9">XCAD <strong>vv1.5.6</strong>, por GM 842 Calebe.</span>`;
            });
        if (!localStorage.getItem('verifica_parametrizacao') || localStorage.getItem('verifica_parametrizacao') != new Date().getDate()) {
            localStorage.setItem('verifica_parametrizacao', 'nada');
        }
        setInterval(function () {
            if (!document.querySelector('#limpar_dados') && document.querySelector('app-barra-usuario')) {
                const button = document.createElement('button');
                button.setAttribute('id', 'limpar_dados');
                button.innerText = 'Desbugar';
                document.querySelector('app-barra-usuario').append(button);
                button.addEventListener('click', () => {
                    (async () => {
                        // localStorage e sessionStorage
                        localStorage.clear();
                        sessionStorage.clear();

                        // IndexedDB (Chrome/Edge)
                        if (indexedDB.databases) {
                            const dbs = await indexedDB.databases();
                            for (const db of dbs) {
                                indexedDB.deleteDatabase(db.name);
                            }
                        }

                        // Cache Storage (PWAs / SW)
                        if ('caches' in window) {
                            const keys = await caches.keys();
                            for (const key of keys) {
                                await caches.delete(key);
                            }
                        }

                        // Service Workers
                        if ('serviceWorker' in navigator) {
                            const registrations = await navigator.serviceWorker.getRegistrations();
                            for (const reg of registrations) {
                                await reg.unregister();
                            }
                        }

                        // Cookies não-HttpOnly
                        document.cookie
                            .split(";")
                            .forEach(c => {
                                const eq = c.indexOf("=");
                                const name = eq > -1 ? c.substr(0, eq) : c;
                                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                            });
                    })();

                })
            }
            if (!document.querySelector('div[class="carregando cad-material-styles"]') && localStorage.getItem('verifica_parametrizacao') && localStorage.getItem('verifica_parametrizacao') == 'nada' && !document.querySelector('app-parametrizacao-atendimento')) {
                localStorage.setItem('verifica_parametrizacao', 'aguardando');
                var menu_botoes = document.querySelector('cad-menu')?.querySelectorAll('div[routerlinkactive="item-menu-selected"]');
                if (menu_botoes && Array.from(menu_botoes).filter((botao) => botao.innerText.includes('Parametrização'))[0]) {
                    Array.from(menu_botoes).filter((botao) => botao.innerText.includes('Parametrização'))[0].click();
                }
            }
            if (localStorage.getItem('verifica_parametrizacao') && document.querySelector('app-parametrizacao-atendimento') && localStorage.getItem('verifica_parametrizacao') != new Date().getDate()) {
                if (document.querySelector('mat-checkbox:not([class*=checked]) input')) {
                    document.querySelector('mat-checkbox:not([class*=checked]) input').click();
                } else if (document.querySelector('mat-radio-button[value=S]:not([class*=checked]) input')) {
                    document.querySelector('mat-radio-button[value=S]:not([class*=checked]) input').click();
                } else if (document.querySelector('input[placeholder="Selecione a UF"]').value != 'Rio Grande do Sul') {
                    document.querySelector('input[placeholder="Selecione a UF"]').value = 'Rio Grande do Sul';
                    document.querySelector('input[placeholder="Selecione a UF"]').dispatchEvent(new Event('input', { bubbles: true }));
                    localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a UF"]-&-Rio Grande do Sul-&-');
                } else if (document.querySelector('input[placeholder="Selecione o Município"]').value != 'Porto Alegre' && !document.querySelector('mat-option')) {
                    document.querySelector('input[placeholder="Selecione o Município"]').click();
                } else if (document.querySelector('input[placeholder="Selecione o Município"]').value != 'Porto Alegre' && document.querySelector('mat-option') && Array.from(document.querySelectorAll('mat-option')).filter((municipios) => municipios.innerText.includes('Porto Alegre')).length == 1) {
                    Array.from(document.querySelectorAll('mat-option')).filter((municipios) => municipios.innerText.includes('Porto Alegre'))[0].click();
                } else if (document.querySelector('input[placeholder="Selecione o Meio de Aviso"]').value != 'Ordem de Serviço') {
                    localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione o Meio de Aviso"]-&-Ordem de Serviço-&-');
                } else if (document.querySelector('input[placeholder="Selecione o Tipo de Via"]').value != 'Via Urbana') {
                    localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione o Tipo de Via"]-&-Via Urbana-&-');
                } else if (document.querySelector('input[placeholder="Selecione a UF"]').value == 'Rio Grande do Sul' && document.querySelector('input[placeholder="Selecione o Município"]').value == 'Porto Alegre' && document.querySelector('input[placeholder="Selecione o Meio de Aviso"]').value == 'Ordem de Serviço' && document.querySelector('input[placeholder="Selecione o Tipo de Via"]').value == 'Via Urbana' && !document.querySelector('mat-option')) {
                    localStorage.setItem('verifica_parametrizacao', new Date().getDate());
                    document.querySelector('button[botaoconfirmar]').click();
                }
            }
            if (versao && document.querySelector('app-info-status-voip') && !document.querySelector('app-info-status-voip').innerHTML.includes(versao)) {
                document.querySelector('app-info-status-voip').innerHTML = versao
            }
            document.querySelectorAll('.tabela-title').forEach(function (item) { item.style.display = 'none' });
            if (localStorage.getItem('selecionaopcao') && localStorage.getItem('selecionaopcao') != '') {
                if (localStorage.getItem('selecionaopcao').split('-&-').length % 2 != 0 && document.querySelector(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-')))) {
                    document.querySelector(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-'))).click();
                    localStorage.setItem('selecionaopcao', localStorage.getItem('selecionaopcao').replace(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-')) + '-&-', ""));
                } else {
                    var naotem = 'nao';
                    var option = document.querySelectorAll('mat-option');
                    for (let i = 0; i < option.length; i++) {
                        if (option[i].innerHTML.toUpperCase().includes(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-')).trim().toUpperCase())) {
                            naotem = 'tem';
                            option[i].click();
                            localStorage.setItem('selecionaopcao', localStorage.getItem('selecionaopcao').replace(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-')) + '-&-', ""));
                            break;
                        }
                    };
                    if (naotem == 'nao' && document.querySelector('mat-option')) {
                        document.querySelector('mat-option').click();
                        localStorage.setItem('selecionaopcao', localStorage.getItem('selecionaopcao').replace(localStorage.getItem('selecionaopcao').substring(0, localStorage.getItem('selecionaopcao').indexOf('-&-')) + '-&-', ""));
                    }
                }
            }
            if (document.querySelector('app-toast')) {
                document.querySelector('app-toast').querySelector('button[aria-label="Fechar Mensagem"]').click();
            }
            async function wait() {
                try {
                    const cad = await navigator.clipboard.readText();
                    alert(cad);

                    if (!sessionStorage.getItem('cod_montar_cad')) {
                        if (cad.includes('-()-') || cad.includes('Demanda via')) {
                            const atual = localStorage.getItem("dados_para_o_cad");
                            if (!atual || atual !== cad) {
                                localStorage.setItem("dados_para_o_cad", cad);
                            }
                        }
                    }

                } catch (err) {
                    console.error("Erro ao acessar o clipboard:", err);
                    alert("Erro ao acessar a área de transferência. Você precisa clicar para ativar.");
                }
            }
            /*if (document.querySelector('app-barra-botoes') && !document.querySelector('app-barra-botoes').querySelector('#temos_cads_romu') && Array.from(document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')).filter((div) => div.innerText.includes('Dashboard'))[0]) {
                let but_dashboard_original = Array.from(document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')).filter((div) => div.innerText.includes('Dashboard'))[0];
                let but_dashboard_clone = but_dashboard_original.cloneNode(true);
                but_dashboard_original.style.display = 'none';
                but_dashboard_original.insertAdjacentElement('beforebegin', but_dashboard_clone);
                but_dashboard_clone.addEventListener('click', function () {
                    wait().then(() => {
                        but_dashboard_original.click();
                    });

                });
                a = document.createElement("div");
                a.setAttribute("id", "temos_cads_romu");
                document.querySelector("app-barra-botoes").append(a);
            }*/
            if (document.querySelector('app-inicio-registro-chamada') && !document.body.innerHTML.includes('e suas ocorrências criados com sucesso!')) {
                document.querySelector('app-inicio-registro-chamada').querySelectorAll('div')[3].click();
                document.querySelector("#mat-snack-bar-container-live-1 > div > simple-snack-bar > div.mat-mdc-snack-bar-actions.mdc-snackbar__actions.ng-star-inserted > button")
            }
            if (document.body.innerHTML.includes('e suas ocorrências criados com sucesso!')) {
                document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')[2].click();
                document.querySelector('simple-snack-bar').querySelector('button').click();
            }
            if (document.querySelector('simple-snack-bar') && document.querySelector('app-empenhar-unidade-tela-principal')) {
                document.querySelector('simple-snack-bar').querySelector('button').click();
            }
            if (document.querySelector('app-chamado') && document.querySelector('input[formcontrolname="nomeSolicitante"]') && document.querySelector('input[formcontrolname="nomeSolicitante"]').value == '') {
                document.querySelector('input[formcontrolname="nomeSolicitante"]').value = 'Comando-geral';
                document.querySelector('input[formcontrolname="nomeSolicitante"]').dispatchEvent(new Event('input', { bubbles: true }));
                atalho_botao_salvar(document.querySelectorAll('button[type=submit]')[1]);
            }
            if (document.querySelector('mat-checkbox[formcontrolname="calcularDistanciasRA"]') && document.querySelector('mat-checkbox[formcontrolname="calcularDistanciasRA"]').querySelector('input').checked == true) {
                document.querySelector('mat-checkbox[formcontrolname="calcularDistanciasRA"]').querySelector('input').click();
            }
            if (document.querySelector('div:not([n_repete]) > input[formcontrolname="pontoReferencia"]')) {
                document.querySelector('div:not([n_repete]) > input[formcontrolname="pontoReferencia"]').setAttribute('maxlength', '400');
                document.querySelector('div:not([n_repete]) > input[formcontrolname="pontoReferencia"]').addEventListener('input', function () {
                    var ponto_referencia = this;
                    if (ponto_referencia.value.includes('.-.')) {
                        document.querySelector('input[formcontrolname="campoPesquisa"]').value = ponto_referencia.value.split('.-.')[1].trim();
                        document.querySelector('input[formcontrolname="campoPesquisa"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('input[placeholder="Selecione o Tipo de Local"]').value = ponto_referencia.value.split('.-.')[2].trim();
                        document.querySelector('input[placeholder="Selecione o Tipo de Local"]').dispatchEvent(new Event('input', { bubbles: true }));
                        let ponto_referencia_valor = ponto_referencia.value.split('.-.')[0].trim();
                        localStorage.setItem('selecionaopcao', 'input[formcontrolname="campoPesquisa"]-&-ttherreh-&-input[placeholder="Selecione o Tipo de Local"]-&-' + ponto_referencia.value.split('.-.')[2].trim() + '-&-');
                        const intervalId = setInterval(() => {
                            if (ponto_referencia.value !== ponto_referencia_valor) {
                                ponto_referencia.value = ponto_referencia_valor;
                                ponto_referencia.dispatchEvent(new Event('input', { bubbles: true }));
                            } else {
                                clearInterval(intervalId); // Remove o intervalo
                            }
                        }, 1000);
                    } else if (ponto_referencia.value != ponto_referencia.value.toUpperCase()) {
                        ponto_referencia.value = ponto_referencia.value.toUpperCase();
                        ponto_referencia.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    localStorage.setItem('ptref', ponto_referencia.value);
                });
                document.querySelector('div:not([n_repete]) > input[formcontrolname="pontoReferencia"]').addEventListener('focus', function () {
                    this.select();
                });
                document.querySelector('div:not([n_repete]) > input[formcontrolname="pontoReferencia"]').parentNode.setAttribute('n_repete', '');
            }
            if (document.querySelector("input[formcontrolname=dataFato") && localStorage.getItem('datahora') && localStorage.getItem('datahora').includes('/')) {
                document.querySelector('input[formcontrolname="dataFato"]').value = localStorage.getItem('datahora').split(' ')[0];
                document.querySelector('input[formcontrolname="dataFato"]').dispatchEvent(new Event('input', { bubbles: true }));
                document.querySelector('input[formcontrolname="horaFato"]').click();
                document.querySelector('input[formcontrolname="horaFato"]').value = localStorage.getItem('datahora').split(' ')[1];
                document.querySelector('input[formcontrolname="horaFato"]').dispatchEvent(new Event('input', { bubbles: true }));
                if (document.querySelector("input[formcontrolname=dataFato").value == localStorage.getItem('datahora').split(' ')[0] && document.querySelector("input[formcontrolname=horaFato").value == localStorage.getItem('datahora').split(' ')[1]) {
                    localStorage.removeItem('datahora');
                }
            }
            if (document.querySelector("app-chamado") && document.querySelector("span[class=numeroProtocolo]") && !document.querySelector("span[class=numeroProtocolo]").innerText.includes('Gerando Protocolo') && localStorage.getItem("cad_relacionado_original")) {
                localStorage.setItem("cad_relacionado_original", localStorage.getItem("cad_relacionado_original").split('-()-')[0] + '-()-' + document.querySelector('input[placeholder="Selecione a Natureza Inicial"]').value);
                localStorage.setItem("cad_relacionado_decorrente", document.querySelector("span[class=numeroProtocolo]").innerText + '-()-' + document.querySelector('input[placeholder="Selecione a Natureza Inicial"]').value);
            }
            if (sessionStorage.getItem('multicads_montar_cad') && !sessionStorage.getItem('cod_montar_cad')) {
                let cads = JSON.parse(sessionStorage.getItem('multicads_montar_cad'));
                if (cads.length > 1) {
                    let cad = cads.shift();
                    sessionStorage.setItem('cod_montar_cad', cad);
                    sessionStorage.setItem('multicads_montar_cad', JSON.stringify(cads));
                    trava_cod_montar_cad = '';
                } else if (cads[0] != '') {
                    sessionStorage.setItem('cod_montar_cad', cads[0]);
                    sessionStorage.removeItem('multicads_montar_cad');
                }
            }
            if (document.querySelector('app-modal-confirmacao')?.innerHTML.includes('Deseja realmente sair do formulário de atendimento')) {
                const butConfirm = document.querySelector('app-modal-confirmacao [botaoconfirmar]');
                if (!butConfirm.innerHTML.includes('(Alt + Enter)')) atalho_botao_salvar(butConfirm);
            }
            if (document.querySelector("app-chamado") && document.querySelector("app-chamado").querySelector("input[formcontrolname=pontoReferencia]") && !document.querySelector("span[class=numeroProtocolo]").innerText.includes('Gerando Protocolo')) {
                if (document.querySelector('span[class="label-natureza"]').innerText == 'Abandono de Incapaz') {
                    document.querySelector('button[type=submit]').parentNode.style.display = 'none';
                } else {
                    document.querySelector('button[type=submit]').parentNode.style.display = '';
                }

                if (document.querySelector('div[title="Chamadas Semelhantes"]')) {
                    document.querySelector('div[title="Chamadas Semelhantes"]').parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                }
                if (localStorage.getItem('ptref') && document.querySelector("app-chamado") && document.querySelector("app-chamado").querySelector("input[formcontrolname=pontoReferencia]").value == '') {
                    //document.querySelector("app-chamado").querySelector("input[formControlName='pontoReferencia']").value = localStorage.getItem('ptref');
                    //document.querySelector("app-chamado").querySelector('input[formcontrolname="pontoReferencia"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (!localStorage.getItem('ptref') && document.querySelector("input[formControlName='pontoReferencia']").value != '') {
                    localStorage.setItem('ptref', document.querySelector("input[formControlName='pontoReferencia']").value);
                }
                if (localStorage.getItem('referenciar_cad')) {

                }
                if (sessionStorage.getItem('cod_montar_cad') && trava_cod_montar_cad != 'trava') {
                    trava_cod_montar_cad = 'trava';
                    var cod_montar_cad = sessionStorage.getItem('cod_montar_cad');
                    if (cod_montar_cad.indexOf('Demanda via') > -1) {
                        let natureza_inicial = ''
                        if (cod_montar_cad.toUpperCase().indexOf('SAMU') > -1) {
                            natureza_inicial = 'Apoio Ao Samu';
                        }
                        let dados = [cod_montar_cad.split('*Nome:*')[1].split('\n')[0].trim(), cod_montar_cad.split('*Número:*')[1].split('\n')[0].replace(/[^0-9]/g, ''), cod_montar_cad.split('*Situação:*')[1].split('\n')[0].trim(), natureza_inicial, cod_montar_cad.split('*Data-hora:* ')[1].split('\n')[0].split(' ')[0], cod_montar_cad.split('*Data-hora:* ')[1].split('\n')[0].split(' ')[1].substr(0, 5), cod_montar_cad.split('*Endereço:*\n')[1].split('\n')[0].split('http')[0], '', 'Residência'];
                        preencher_chamado(dados);

                    } else if (cod_montar_cad.indexOf('-()-') > -1 && cod_montar_cad.split('-()-').length == 11) {
                        cod_montar_cad = cod_montar_cad.split('-()-');
                        let dados = ['', '', '', '', '', '', '', '', '']
                        if (cod_montar_cad[10].replaceAll('"', '') != '') {
                            dados[0] = cod_montar_cad[10];

                        } else if (cod_montar_cad[2] == '' && cod_montar_cad[0] != '') {
                            var numero_area = cod_montar_cad[0].trim().substring(0, 1);
                            var comando_norte = '3467';
                            var comando_sul = '2589';
                            var comando_centro = '1';
                            if (comando_norte.includes(numero_area)) {
                                dados[0] = 'Comando-norte';
                            } else if (comando_sul.includes(numero_area)) {
                                dados[0] = 'Comando-sul';
                            } else if (comando_centro.includes(numero_area)) {
                                dados[0] = 'Comando-centro';
                            }
                        }
                        dados[1] = cod_montar_cad[9];
                        dados[6] = cod_montar_cad[3];
                        dados[8] = cod_montar_cad[1].split('http')[0];
                        dados[3] = cod_montar_cad[4];
                        dados[4] = cod_montar_cad[6].split(' ')[0];
                        dados[5] = cod_montar_cad[6].split(' ')[1].substr(0, 5);
                        dados[7] = cod_montar_cad[0];
                        dados[2] = cod_montar_cad[2];

                        if (cod_montar_cad[5] && cod_montar_cad[5].includes("C") && cod_montar_cad[5].length == 2) {
                            localStorage.setItem('area', document.querySelector('span[class="numeroProtocolo"]').innerText + "-()-C0" + cod_montar_cad[5].slice(-1));
                        } else {
                            localStorage.setItem('area', document.querySelector('span[class="numeroProtocolo"]').innerText + "-()-" + cod_montar_cad[5])
                        }
                        document.querySelector("textarea[formcontrolname=relato]").value = cod_montar_cad[2];
                        document.querySelector('textarea[formcontrolname="relato"]').dispatchEvent(new Event('input', { bubbles: true }));
                        //document.querySelector('cad-mapa').querySelector('input').value = cod_montar_cad[3];
                        //document.querySelector('cad-mapa').querySelector('input').dispatchEvent(new Event('input', { bubbles: true }));
                        localStorage.setItem('chegada_no_local', document.querySelector('span[class="numeroProtocolo"]').innerText + '-&&-' + cod_montar_cad[7] + '-&&-' + cod_montar_cad[8]);
                        preencher_chamado(dados);
                    }

                }
                if (document.querySelector("div[id='naorepete']")) {
                } else {
                    Array.from(document.querySelectorAll('button[botaoconfirmar]')).filter(button => button.innerText.includes('Encaminhar') && !button.innerText.includes('Encaminhar e Finalizar'))[0].style.display = 'none';
                    a = document.createElement("div");
                    a.setAttribute("id", "naorepete");
                    document.querySelector("gl-host").insertAdjacentElement('beforebegin', a);
                    a.innerHTML = '<div style="background:#1454b4;color:white;width:fit-content;padding:7px;border-radius:5px;margin:5px;font-weight:bold;user-select:none" onmouseover=this.style.cursor="pointer" onmouseout=this.style.cursor="auto" id="cod_montar_cad">Inserir Dados do CAD</div>';
                    document.querySelector('div.linha-botoes-acao').setAttribute('style', 'right:25px;position:fixed;z-index:9999;margin-top:0');
                    async function colar_dados_cad() {
                        sessionStorage.removeItem('multicads_montar_cad');
                        sessionStorage.removeItem('cod_montar_cad');
                        trava_cod_montar_cad = '';
                        sessionStorage.setItem('multicads_montar_cad', JSON.stringify((await window.navigator.clipboard.readText()).replaceAll('\r', '').replaceAll('\"', '').replaceAll('"', '').split('-++-')));
                    }
                    document.getElementById('cod_montar_cad').addEventListener('click', function () {
                        colar_dados_cad();
                    });
                    document.querySelector("app-chamado").querySelector("input[placeholder='Selecione a Natureza Inicial']").addEventListener('blur', function () {
                        if (document.querySelector("textarea[formcontrolname=relato]").value.includes('NATUREZA_INICIAL')) {
                            document.querySelector("textarea[formcontrolname=relato]").value = document.querySelector("textarea[formcontrolname=relato]").value.replace('NATUREZA_INICIAL', document.querySelector("app-chamado").querySelector("input[placeholder='Selecione a Natureza Inicial']").value.toLowerCase());
                            document.querySelector('textarea[formcontrolname="relato"]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    });
                    document.querySelector("input[formcontrolname=nomeSolicitante]").addEventListener('input', function () {
                        if (document.querySelector("input[formcontrolname=nomeSolicitante]").value.includes('Agente')) {
                            document.querySelector('input[placeholder="Selecione o Meio de Aviso"]').value = 'Telefone';
                            document.querySelector('input[placeholder="Selecione o Meio de Aviso"]').dispatchEvent(new Event('input', { bubbles: true }));
                            localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione o Meio de Aviso"]-&-Telefone-&-');
                        }
                    });
                    document.querySelector("input[formcontrolname=nomeSolicitante]").addEventListener('focus', function () {
                        document.querySelector("input[formcontrolname=nomeSolicitante]").select();
                    });
                    var datalist = document.createElement("datalist");
                    datalist.setAttribute("id", "qth_option");
                    datalist.setAttribute("name", "qth_option");
                    document.querySelector(".espaco").append(datalist);
                    document.querySelector('datalist').innerHTML = localStorage.getItem('qths');
                    document.querySelector("input[formcontrolname=pontoReferencia]").setAttribute('list', 'qth_option');
                    datalist = document.createElement("datalist");
                    datalist.setAttribute("id", "gm_option");
                    datalist.setAttribute("name", "gm_option");
                    datalist.innerHTML = "<option>Agente 007 FERREIRA</option><option>Agente 013 CAVENATTI</option><option>Agente 014 ANGELA</option><option>Agente 016 AQUINO</option><option>Agente 020 ALAN</option><option>Agente 022 LUIZ</option><option>Agente 023 NILSON</option><option>Agente 029 MAIA</option><option>Agente 039 REGER</option><option>Agente 041 VARGAS</option><option>Agente 045 CANDINHO</option><option>Agente 046 SADI</option><option>Agente 049 TEVAH</option><option>Agente 053 GUILHERME</option><option>Agente 054 SOARES</option><option>Agente 057 J FERNANDO</option><option>Agente 064 ANA</option><option>Agente 067 NILO</option><option>Agente 073 PERES</option><option>Agente 076 FADINI</option><option>Agente 084 MEDEIROS</option><option>Agente 086 GILMAR</option><option>Agente 089 ANDRÉ</option><option>Agente 090 IRAN</option><option>Agente 097 P CÉSAR</option><option>Agente 098 GETÚLIO</option><option>Agente 099 J GUIMARÃES</option><option>Agente 100 RICARDO</option><option>Agente 101 CHAGAS</option><option>Agente 104 FRANCISCO</option><option>Agente 105 TABAJARA</option><option>Agente 110 NIAMAR</option><option>Agente 111 CABREIRA</option><option>Agente 113 P MACHADO</option><option>Agente 114 GEREMIAS</option><option>Agente 115 GILBERTO</option><option>Agente 117 SANDRO</option><option>Agente 120 ROSSES</option><option>Agente 124 EDUARDO</option><option>Agente 128 LEANDRO</option><option>Agente 129 ROSELI</option><option>Agente 134 SOLLER</option><option>Agente 137 IGNACIO</option><option>Agente 138 GERMANN</option><option>Agente 139 CLAUDENIR</option><option>Agente 140 SALLES</option><option>Agente 144 MACIEL</option><option>Agente 147 EDIMILSON</option><option>Agente 153 ALBERI</option><option>Agente 154 VALDELANIO</option><option>Agente 155 BARCELOS</option><option>Agente 156 BALTEZAN</option><option>Agente 157 GARCEZ</option><option>Agente 159 NÉDSON</option><option>Agente 162 ILDO</option><option>Agente 164 R SANTOS</option><option>Agente 166 FREITAS</option><option>Agente 167 NETTO</option><option>Agente 172 RONALDO</option><option>Agente 173 ITAMAR</option><option>Agente 187 KOLAKOWSKI</option><option>Agente 188 SURIS</option><option>Agente 191 LIMA</option><option>Agente 192 RIVA</option><option>Agente 204 ANTUNES</option><option>Agente 209 BAUMGARTEN</option><option>Agente 211 FOGASSO</option><option>Agente 212 RIBEIRO</option><option>Agente 214 BOMBASSARO</option><option>Agente 217 LUZ</option><option>Agente 218 CONRADO</option><option>Agente 219 SAPATA</option><option>Agente 222 FLÁVIO</option><option>Agente 224 NASSR</option><option>Agente 225 J RODRIGUES</option><option>Agente 226 BERTUOL</option><option>Agente 227 HENRIQUE</option><option>Agente 229 ASSIS</option><option>Agente 231 BRUM</option><option>Agente 233 P ANDRÉ</option><option>Agente 236 CARMEM</option><option>Agente 246 DARIO</option><option>Agente 247 PACHECO</option><option>Agente 250 TABILE</option><option>Agente 255 M GOULART</option><option>Agente 257 CLÓVIS</option><option>Agente 258 EDERSON</option><option>Agente 265 MAGNO</option><option>Agente 269 </option><option>Agente 277 J CARLOS</option><option>Agente 278 JADIR</option><option>Agente 279 JULIO</option><option>Agente 295 A NASCIMENTO</option><option>Agente 299 SANTOS</option><option>Agente 307 BEIJOSA</option><option>Agente 315 DARCI</option><option>Agente 318 RODRIGUES</option><option>Agente 320 AGUIAR</option><option>Agente 321 LUIZ ADÃO</option><option>Agente 325 GERALDO</option><option>Agente 331 THEODORO</option><option>Agente 336 CLAUDIA</option><option>Agente 338 TRINDADE</option><option>Agente 341 IVAN</option><option>Agente 343 E SANTO</option><option>Agente 354 TRINDADE</option><option>Agente 361 DUBAL</option><option>Agente 364 EDSON</option><option>Agente 365 ELIANDO</option><option>Agente 372 J GONÇALVES</option><option>Agente 373 RUDNEI</option><option>Agente 377 DA LUZ</option><option>Agente 383 WALMIR</option><option>Agente 391 LAURO </option><option>Agente 408 BURATO</option><option>Agente 411 IVALDO</option><option>Agente 413 FRANCISCO</option><option>Agente 416 R BARCELLOS</option><option>Agente 417 VIEIRA</option><option>Agente 424 OSVALDO</option><option>Agente 426 LÂNDIO</option><option>Agente 427 PUJURANTAN</option><option>Agente 429 RONCOLI</option><option>Agente 435 SILVEIRA</option><option>Agente 443 CLAIRTON</option><option>Agente 445 RONALDO</option><option>Agente 446 SILVIO</option><option>Agente 447 OLAVO</option><option>Agente 454 DE OLIVEIRA</option><option>Agente 449 VLADIMIR</option><option>Agente 456 LEAL</option><option>Agente 457 FERRARI</option><option>Agente 459 ALEXANDRE</option><option>Agente 460 RAUL</option><option>Agente 462 GENERI</option><option>Agente 463 CLEOMAR</option><option>Agente 464 MARCELO</option><option>Agente 465 STRIEDER</option><option>Agente 466 FLAMARION</option><option>Agente 467 DOS SANTOS</option><option>Agente 469 SÉRGIO</option><option>Agente 470 JOEL</option><option>Agente 471 MOISÉS</option><option>Agente 473 DANIEL</option><option>Agente 474 ROBEN</option><option>Agente 475 BANDEIRA</option><option>Agente 476 FRANKLIN</option><option>Agente 478 ALDO</option><option>Agente 479 A LUIS</option><option>Agente 481 ARISTIDES</option><option>Agente 482 CAMPELO</option><option>Agente 483 BASTOS</option><option>Agente 485 FERNANDO</option><option>Agente 486 CABRAL</option><option>Agente 487 FERNANDEZ</option><option>Agente 488 MICHEL</option><option>Agente 491 BERNARDES</option><option>Agente 492 BETIATTO</option><option>Agente 493 VALTER</option><option>Agente 494 SADIR</option><option>Agente 496 ROGÉRIO</option><option>Agente 497 BERTO</option><option>Agente 500 EVERTON</option><option>Agente 502 MEIRELLES</option><option>Agente 505 SALAZAR</option><option>Agente 506 RENATO</option><option>Agente 507 M AURELIO</option><option>Agente 508 ANTONIO</option><option>Agente 512 GENTIL</option><option>Agente 513 G ALVES</option><option>Agente 514 M CASTRO</option><option>Agente 516 L SANTOS </option><option>Agente 517 NEY</option><option>Agente 519 G SILVA</option><option>Agente 520 CAMPOS</option><option>Agente 521 PEDRO</option><option>Agente 522 LEONIDAS</option><option>Agente 523 J FARIAS</option><option>Agente 524 ALVES</option><option>Agente 525 MAGNO</option><option>Agente 526 CLAUDIO</option><option>Agente 528 ADRIANO</option><option>Agente 529 MARQUES</option><option>Agente 531 MARTA</option><option>Agente 533 AUGUSTO</option><option>Agente 535 CESAR</option><option>Agente 538 LEONEL</option><option>Agente 541 AIDA</option><option>Agente 543 LIMANA</option><option>Agente 544 EMERSON</option><option>Agente 547 DALMIR</option><option>Agente 549 AJALA</option><option>Agente 551 GIOVANNI</option><option>Agente 554 ALCEMIR</option><option>Agente 555 RANULFO</option><option>Agente 556 DO VAL</option><option>Agente 558 GUIMARÃES</option><option>Agente 559 MENIN</option><option>Agente 560 GLAUBER</option><option>Agente 570 VOLNEI</option><option>Agente 571 VALDOMIRO</option><option>Agente 572 DÁCIO</option><option>Agente 573 P RAMOS</option><option>Agente 574 C GONÇALVES</option><option>Agente 575 ROSALVO</option><option>Agente 576 RUBEM</option><option>Agente 577 J AIRTON</option><option>Agente 578 HERALDO</option><option>Agente 581 JEAN</option><option>Agente 585 PATACHO</option><option>Agente 586 CLAUDINO</option><option>Agente 591 L EDUARDO</option><option>Agente 594 CASTRO</option><option>Agente 595 </option><option>Agente 597 M GONÇALVES</option><option>Agente 599 MARIA</option><option>Agente 600 MATEUS</option><option>Agente 601 M FERREIRA</option><option>Agente 603 MIGUEL</option><option>Agente 604 MILTON</option><option>Agente 607 LORETO</option><option>Agente 608 RUBIN</option><option>Agente 609 RÉGIS</option><option>Agente 610 RENE</option><option>Agente 611 PRADO</option><option>Agente 615 MEOTTI</option><option>Agente 618 ROMOALDO</option><option>Agente 619 FONTOURA</option><option>Agente 621 OLIVEIRA</option><option>Agente 622 TADEU</option><option>Agente 623 TAIS</option><option>Agente 626 WALCONI </option><option>Agente 628 M LEAL</option><option>Agente 630 CALLAI</option><option>Agente 635 QUIROGA</option><option>Agente 641 J PAULO</option><option>Agente 642 MAROBIM</option><option>Agente 643 L RICARDO</option><option>Agente 644 J MAURO</option><option>Agente 646 ANDERSON</option><option>Agente 648 S CESAR</option><option>Agente 649 ADEMIR</option><option>Agente 650 S HITER</option><option>Agente 651 JEFFERSON</option><option>Agente 652 MENDES</option><option>Agente 653 HOPPE</option><option>Agente 656 MARCOS</option><option>Agente 659 ARENO</option><option>Agente 660 LUIS</option><option>Agente 661 FERIGOLO</option><option>Agente 664 ANTONELLI</option><option>Agente 665 C FARIAS</option><option>Agente 666 PETRY</option><option>Agente 667 GRUSCKE</option><option>Agente 669 KLEEMANN</option><option>Agente 670 CLARTIA</option><option>Agente 672 BERG</option><option>Agente 676 NEILA</option><option>Agente 677 CRISTIANO</option><option>Agente 679 PITHAN</option><option>Agente 691 REJANE</option><option>Agente 704 OSOWSKI</option><option>Agente 705 DUARTE</option><option>Agente 706 CHARLES</option><option>Agente 708 ABEL</option><option>Agente 711 FERNANDA</option><option>Agente 712 NASCIMENTO</option><option>Agente 713 TERRES</option><option>Agente 714 TONIOLO</option><option>Agente 716 ALEX</option><option>Agente 717 MARCIO</option><option>Agente 718 CARVALHO</option><option>Agente 719 LEONARDO</option><option>Agente 720 M SANTOS</option><option>Agente 721 JULIANO</option><option>Agente 722 VOLPATTO</option><option>Agente 723 J EDUARDO</option><option>Agente 727 MENGER</option><option>Agente 728 COSTA</option><option>Agente 730 JONATHAS</option><option>Agente 731 DORNELLES</option><option>Agente 733 TUBBS</option><option>Agente 735 DEIVES</option><option>Agente 736 XAVIER</option><option>Agente 737 GRACIELA</option><option>Agente 738 MENEZES</option><option>Agente 740 FELTES</option><option>Agente 742 DIEGO</option><option>Agente 743 J FERNANDES</option><option>Agente 746 PEREIRA</option><option>Agente 747 PLATE</option><option>Agente 748 MARISTELA</option><option>Agente 749 SCHUCH</option><option>Agente 750 LUCIANA</option><option>Agente 751 JAQUET</option><option>Agente 753 ESCOBAR</option><option>Agente 754 L FELIPE</option><option>Agente 756 ALMEIDA</option><option>Agente 757 NUNES</option><option>Agente 758 SÍLVIA</option><option>Agente 762 VANESSA</option><option>Agente 765 LUDOVIG</option><option>Agente 766 MORAES</option><option>Agente 767 OSÉIAS</option><option>Agente 768 J SILVEIRA</option><option>Agente 770 RAFAEL</option><option>Agente 771 CARLESSO</option><option>Agente 772 P ROBERTO</option><option>Agente 774 P ROBERTO</option><option>Agente 775 DA SILVA</option><option>Agente 776 FRANCO</option><option>Agente 777 ROGER</option><option>Agente 778 CLIVIA</option><option>Agente 781 PIEKATOSKI</option><option>Agente 783 NAHOR</option><option>Agente 784 MAGALHÃES</option><option>Agente 785 GOMES</option><option>Agente 786 DIAS</option><option>Agente 788 A SANDRO</option><option>Agente 789 ODAIR</option><option>Agente 790 SOUZA</option><option>Agente 791 VANDERLEI</option><option>Agente 792 ABNER</option><option>Agente 793 J CESAR</option><option>Agente 795 JORGE</option><option>Agente 796 BONA</option><option>Agente 797 GUERREIRO</option><option>Agente 798 </option><option>Agente 799 REINALDO</option><option>Agente 800 ALAOR</option><option>Agente 801 DANILO</option><option>Agente 803 MOLINA</option><option>Agente 804 L COSTA</option><option>Agente 805 RAMOS</option><option>Agente 806 ERNESTO</option><option>Agente 807 GASPARY</option><option>Agente 808 PRESTES</option><option>Agente 809 PEDRO LUIS</option><option>Agente 810 CORREA</option><option>Agente 811 </option><option>Agente 812 HELIO</option><option>Agente 813 PIVETTA</option><option>Agente 814 BATISTA</option><option>Agente 815 BENITES</option><option>Agente 816 OLI</option><option>Agente 817 </option><option>Agente 818 GRANGEIRO</option><option>Agente 819 NAZIAZENO</option><option>Agente 820 MOURA</option><option>Agente 821 PODEWILS</option><option>Agente 822 BUENO</option><option>Agente 823 TEDESCO</option><option>Agente 824 PADILHA</option><option>Agente 825 RAMIRES</option><option>Agente 826 ROSARIO</option><option>Agente 827 GOULART</option><option>Agente 828 DE SOUZA</option><option>Agente 829 ALBUQUERQUE</option><option>Agente 830 SCHNEIDER</option><option>Agente 831 COUTO</option><option>Agente 832 CAMPOS</option><option>Agente 833 MACKOSKI</option><option>Agente 834 RUAN</option><option>Agente 835 CEZAR</option><option>Agente 836 DOS SANTOS</option><option>Agente 837 MELLO</option><option>Agente 838 MELGAREJO</option><option>Agente 839 ZAPATA</option><option>Agente 840 BOCK</option><option>Agente 841 REGINATTO</option><option>Agente 842 CALEBE</option><option>Agente 843 DE MOURA</option><option>Agente 844 BARBOSA</option><option>Agente 845 MENDONÇA</option><option>Agente 846 </option><option>Agente 847 M VIEIRA</option><option>Agente 848 GARCIA</option><option>Agente 849 AFONSO</option><option>Agente 850 </option><option>Agente 851 PRATES</option><option>Agente 852 FILIPE</option><option>Agente 853 SCHIMIDT</option><option>Agente 854 BORBA</option><option>Agente 855 OTÁVIO</option><option>Agente 856 JÚLIA</option><option>Agente 857 KRISTIAN</option><option>Agente 858 JAQUES</option><option>Agente 859 FLEMMING</option><option>Agente 860 COLLOVINI</option><option>Agente 861 KAREN</option><option>Agente 863 C MIGUEL</option><option>Agente 864 FRONTEIRA</option><option>Agente 865 HENRIQUO</option><option>Agente 866 LEHMEN</option><option>Agente 867 SANTOS</option><option>Agente 868 TOLEDO</option><option>Agente 869 AMANDA</option><option>Agente 870 LOURENCI</option><option>Agente 871 MARAZINI</option><option>Agente 873 RONZANI</option><option>Agente 874 COELHO</option>";
                    document.querySelector(".espaco").append(datalist);
                    document.querySelector("input[formcontrolname=nomeSolicitante]").setAttribute('list', 'gm_option');
                }
                let enderecos_cads = JSON.parse(sessionStorage.getItem('enderecos_cads')) || {};
                enderecos_cads[document.querySelector('span[class="numeroProtocolo"]').innerText.trim()] = { 'logradouro': document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]')?.value || '', 'numero': document.querySelector('input[formcontrolname="numero"]')?.value || '', 'bairro': document.querySelector('input[placeholder="Selecione o Bairro"]')?.value || '', 'cep': document.querySelector('input[formcontrolname="cep"]')?.value || '', 'ponto_referencia': document.querySelector('input[formcontrolname="pontoReferencia"]')?.value || '' };
                sessionStorage.setItem('enderecos_cads', JSON.stringify(enderecos_cads));
            };
            if (document.querySelector("input[formcontrolname=horaFato]") && document.querySelector("input[formcontrolname=horaFato]").value == '__:__' && document.querySelector("input[formcontrolname=dataFato]") && document.querySelector("input[formcontrolname=dataFato]").value != '' && document.getElementById('cod_montar_cad').value.match(/\d{2}(\D)\d{2}\1\d{4}/g)) {
                document.getElementById('cod_montar_cad').dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (localStorage.getItem("dados_para_o_cad") && document.getElementById('cod_montar_cad') && document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]') && document.querySelector('app-protocolo-tempo-chamado').innerHTML.includes('GCM-POA202')) {
                sessionStorage.setItem('multicads_montar_cad', JSON.stringify(localStorage.getItem("dados_para_o_cad").split('-++-')));
                localStorage.removeItem("dados_para_o_cad");
            }
            if (document.getElementById('cod_montar_cad') && !document.querySelector('app-protocolo-tempo-chamado').innerHTML.includes('Gerando protocolo')) {
                if (localStorage.getItem('meus_cads')) {
                    if (!localStorage.getItem('meus_cads').includes(document.querySelector("span[class=numeroProtocolo]").innerText.split('-')[1])) {
                        localStorage.setItem('meus_cads', localStorage.getItem('meus_cads') + document.querySelector("span[class=numeroProtocolo]").innerText.split('-')[1])
                    }
                } else {
                    localStorage.setItem('meus_cads', localStorage.getItem('meus_cads') + document.querySelector("span[class=numeroProtocolo]").innerText.split('-')[1]);
                }
            }
            if (document.querySelector("app-distribuicao-chamado-agencia") && localStorage.getItem('area')) {
                if (document.querySelector("div[id='naorepeteapp-distribuicao-chamado-agencia']")) {
                } else {
                    var nrepete_distribuicao_chamado = document.createElement("div");
                    nrepete_distribuicao_chamado.setAttribute("id", "naorepeteapp-distribuicao-chamado-agencia");
                    document.querySelector("app-distribuicao-chamado-agencia").append(nrepete_distribuicao_chamado);
                    //document.querySelector('mat-expansion-panel-header').click();
                    //document.querySelector('input[class="mdc-checkbox__native-control mdc-checkbox--selected"]').click();
                    //document.querySelectorAll('mat-expansion-panel-header')[2].click();
                    while (document.querySelector("app-distribuicao-chamado-agencia").querySelector('mat-expansion-panel-header[aria-expanded="false"]')) {
                        document.querySelector("app-distribuicao-chamado-agencia").querySelector('mat-expansion-panel-header[aria-expanded="false"]').click();
                    }
                    var area = localStorage.getItem('area');
                    const areaMap = {
                        'C': 'Centro',
                        'A': 'Centro',
                        'P': 'Patam',
                        'R': 'Romu',
                        '2': 'Cruzeiro',
                        '3': 'Partenon',
                        '4': 'Leste',
                        '5': 'Restinga',
                        '6': 'Norte',
                        '7': 'Baltazar',
                        '8': 'Pinheiro',
                        '9': 'Sul'
                    };

                    const firstChar = area.trim().split('-()-')[1].charAt(0);
                    area = areaMap[firstChar] || 'Centro';
                    for (let i = 0; i < document.querySelectorAll("app-regiao-selecionavel").length; i++) {
                        if (document.querySelectorAll("app-regiao-selecionavel")[i].innerHTML.includes(area) && document.querySelectorAll("app-regiao-selecionavel")[i].innerHTML.includes('Guarda Municipal')) {
                            document.querySelectorAll("app-regiao-selecionavel")[i].querySelector('label').click();
                        }
                    }
                }
            }



            if (localStorage.getItem('abordado')) {
                if (document.querySelector('mat-select[formcontrolname="participacao"]')) {
                    var dados = localStorage.getItem('abordado');
                    if (!document.querySelector('mat-select[formcontrolname="participacao"]').innerHTML.includes('Averiguado') && document.querySelectorAll('mat-option').length == 0) {
                        document.querySelector('mat-select[formcontrolname="participacao"]').click();
                    }

                    if (dados.split('CPF:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('CPF') && document.querySelectorAll('mat-option').length == 0 && !document.querySelector('mat-select[formcontrolname="idTipoDocumento"]').innerHTML.includes('CPF')) {
                        document.querySelector('mat-select[formcontrolname=idTipoDocumento]').click();
                    }
                    if (dados.split('CPF:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('CPF') && document.querySelectorAll('mat-option').length == 0 && document.querySelector('mat-select[formcontrolname="idTipoDocumento"]').innerHTML.includes('CPF')) {
                        document.querySelector('input[formcontrolname=numeroDocumento]').value = dados.split('CPF:')[1].split('\n')[0].trim();
                        document.querySelector('input[formcontrolname=numeroDocumento]').dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (document.querySelector('input[formcontrolname="numeroDocumento"]').value != '') {
                        document.querySelector('app-documentos-envolvido-form').querySelector('button').click();
                    }
                    if (dados.split('RG:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('RG') && document.querySelectorAll('mat-option').length == 0 && !document.querySelector('mat-select[formcontrolname="idTipoDocumento"]').innerHTML.includes('RG')) {
                        document.querySelector('mat-select[formcontrolname=idTipoDocumento]').click();
                    }
                    if (dados.split('RG:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('RG') && document.querySelectorAll('mat-option').length == 0 && document.querySelector('mat-select[formcontrolname="idTipoDocumento"]').innerHTML.includes('RG')) {
                        document.querySelector('input[formcontrolname=numeroDocumento]').value = dados.split('RG:')[1].split('\n')[0].trim();
                        document.querySelector('input[formcontrolname=numeroDocumento]').dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (document.querySelectorAll('mat-option').length == 0 && !document.querySelector('mat-select[formcontrolname="sexo"]').innerHTML.includes('RG')) {
                        document.querySelector('mat-select[formcontrolname=sexo]').click();
                    }
                    if (document.querySelector('mat-select[formcontrolname="sexo"]').innerHTML.includes('Sexo') && document.querySelectorAll('mat-option').length == 0) {
                        document.querySelector('mat-select[formcontrolname="sexo"]').click();
                    }
                    if (document.querySelector('mat-select[formcontrolname="racaCor"]').innerText.trim() == '' && document.querySelectorAll('mat-option').length == 0) {
                        document.querySelector('mat-select[formcontrolname="racaCor"]').click();
                    }
                    if (document.querySelectorAll('mat-option').length > 0) {
                        if (document.querySelectorAll('mat-option')[0].parentNode.innerHTML.includes('Averiguado')) {
                            setTimeout(() => {
                                Array.from(document.querySelectorAll('mat-option')).find(option => option.innerText.includes('Averiguado'))?.click();
                            }, 1000);
                        } else if (document.querySelectorAll('mat-option')[0].parentNode.innerHTML.includes('Masculino')) {
                            var sexo = dados.split('Sexo: ')[1].split('\n')[0].trim();
                            var opcoes_sexo = document.querySelectorAll('mat-option');
                            for (let i = 0; i < opcoes_sexo.length; i++) {
                                if (opcoes_sexo[i].innerHTML.includes(sexo)) {
                                    opcoes_sexo[i].click();
                                }
                            }
                        } else if (document.querySelectorAll('mat-option')[0].parentNode.innerHTML.includes('Amarela')) {
                            var cor_da_pele = '';
                            if (dados.split('Cor da pele: ')[1].split('\n')[0].trim() == 'Mulato') {
                                cor_da_pele = 'Parda';
                            } else {
                                cor_da_pele = dados.split('Cor da pele: ')[1].split('\n')[0].trim();
                            }
                            var opcoes_cor_pele = document.querySelectorAll('mat-option');
                            for (let i = 0; i < opcoes_cor_pele.length; i++) {
                                if (opcoes_cor_pele[i].innerHTML.includes(cor_da_pele)) {
                                    opcoes_cor_pele[i].click();
                                }
                            }
                        } else if (document.querySelectorAll('mat-option')[0].parentNode.innerHTML.includes('CPF') && dados.split('CPF:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('CPF')) {
                            document.querySelectorAll('mat-option').forEach(function (item) {
                                if (item.innerHTML.includes('CPF')) {
                                    item.click();
                                }
                            });
                        } else if (document.querySelectorAll('mat-option')[0].parentNode.innerHTML.includes('RG') && dados.split('RG:')[1].split('\n')[0].trim().length > 0 && !document.querySelector('app-documentos-envolvido-list').innerHTML.includes('RG')) {
                            document.querySelectorAll('mat-option').forEach(function (item) {
                                if (item.innerHTML.includes('RG - Carteira de Identidade')) {
                                    item.click();
                                }
                            });
                        }
                    }
                } else {
                    localStorage.removeItem('abordado');
                }
            }

            if (document.querySelector("app-formulario-envolvidos")) {
                if (document.querySelector("textarea[id='naorepete_abordado']")) {
                } else {
                    var naorepete_abordado = document.createElement("textarea");
                    naorepete_abordado.setAttribute("id", "naorepete_abordado");
                    localStorage.removeItem('abordado');
                    document.querySelector("app-formulario-envolvidos").parentNode.insertBefore(naorepete_abordado, document.querySelector("app-formulario-envolvidos"));
                    // document.querySelector("app-formulario-envolvidos").append(naorepete_abordado);
                    //document.querySelector('input[formcontrolname=nome]').removeAttribute('maxLength');
                    document.getElementById('naorepete_abordado').addEventListener('input', function () {
                        var dados = this.value.trim();
                        if (document.querySelector('input[formcontrolname="nome"]').value == '') {
                            document.querySelector('input[formcontrolname=nome]').value = dados.split('Nome:')[1].split('\n')[0].trim();
                            document.querySelector('input[formcontrolname=nome]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        if (document.querySelector('input[formcontrolname="dataNascimento"]').value == '') {
                            document.querySelector('input[formcontrolname=dataNascimento]').value = dados.split('Nascimento:')[1].split('\n')[0].trim();
                            document.querySelector('input[formcontrolname=dataNascimento]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        if (document.querySelector('input[formcontrolname="idade"]').value == '') {
                            var dateString = dados.split('Nascimento:')[1].split('\n')[0].trim();
                            var [day, month, year] = dateString.split('/');
                            var d = new Date,
                                ano_atual = d.getFullYear(),
                                mes_atual = d.getMonth() + 1,
                                dia_atual = d.getDate(),
                                ano_aniversario = +year,
                                mes_aniversario = +month,
                                dia_aniversario = +day,
                                quantos_anos = ano_atual - ano_aniversario;

                            if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
                                quantos_anos--;
                            }
                            document.querySelector('input[formcontrolname=idade]').value = quantos_anos;
                            document.querySelector('input[formcontrolname=idade]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        if (document.querySelector('input[formcontrolname="nomeMae"]').value == '') {
                            document.querySelector('input[formcontrolname=nomeMae]').value = dados.split('Nome da mãe:')[1].split('\n')[0].trim();
                            document.querySelector('input[formcontrolname=nomeMae]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        if (document.querySelector('input[formcontrolname="nomePai"]').value == '') {
                            document.querySelector('input[formcontrolname=nomePai]').value = dados.split('Nome do pai:')[1].split('\n')[0].trim();
                            document.querySelector('input[formcontrolname=nomePai]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        if (document.querySelector('input[formcontrolname="naturalidade"]').value == '') {
                            document.querySelector('input[formcontrolname=naturalidade]').value = dados.split('Naturalidade:')[1].split('\n')[0].trim();
                            document.querySelector('input[formcontrolname=naturalidade]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        var selecionaopcao = 'mat-select[formcontrolname="participacao"]-&-Averiguado-&-';
                        if (dados.split('Cor da pele: ')[1].split('\n')[0].trim() != '') {
                            selecionaopcao += 'mat-select[formcontrolname="racaCor"]-&-';
                            if (dados.split('Cor da pele: ')[1].split('\n')[0].trim() == 'Mulato') {
                                selecionaopcao += 'Parda-&-';
                            } else {
                                selecionaopcao += dados.split('Cor da pele: ')[1].split('\n')[0].trim() + '-&-';
                            }
                        }
                        setInterval(function () {
                            if (document.querySelector('mat-option')) {
                                document.querySelectorAll('mat-option').forEach(function (item) {
                                    item.addEventListener('click', function () {
                                        if (item.innerText == 'CPF' && dados.split('CPF: ')[1].split('\n')[0].trim() != '') {
                                            document.querySelector('input[formcontrolname="numeroDocumento"]').value = dados.split('CPF: ')[1].split('\n')[0].trim();
                                            document.querySelector('input[formcontrolname=numeroDocumento]').dispatchEvent(new Event('input', { bubbles: true }));
                                            dados = dados.replace(dados.split('CPF: ')[1].split('\n')[0].trim(), '');
                                            document.querySelector('app-documentos-envolvido-form').querySelector('button').click();
                                        } else if (item.innerText == 'RG - Carteira de Identidade' && dados.split('RG: ')[1].split('\n')[0].trim() != '') {
                                            document.querySelector('input[formcontrolname="numeroDocumento"]').value = dados.split('RG: ')[1].split('\n')[0].trim();
                                            document.querySelector('input[formcontrolname=numeroDocumento]').dispatchEvent(new Event('input', { bubbles: true }));
                                            dados = dados.replace(dados.split('RG: ')[1].split('\n')[0].trim(), '');
                                            document.querySelector('app-documentos-envolvido-form').querySelector('button').click();
                                        }
                                    });
                                });
                            }

                        }, 100);
                        if (dados.split('Sexo: ')[1].split('\n')[0].trim() != '') {
                            selecionaopcao += 'mat-select[formcontrolname="sexo"]-&-' + dados.split('Sexo: ')[1].split('\n')[0].trim() + '-&-mat-select[formcontrolname="idTipoDocumento"]-&-CPF-&-mat-select[formcontrolname="idTipoDocumento"]-&-RG - Carteira de Identidade-&-';
                        }
                        localStorage.setItem('selecionaopcao', selecionaopcao);
                        //localStorage.setItem('abordado',dados);
                        document.getElementById('naorepete_abordado').value = '';

                    });
                }
            };
            if (!localStorage.getItem('cads_com_relato')) {
                localStorage.setItem('cads_com_relato', ' ');
            }
            if (document.querySelector('mat-form-field:has(textarea[formcontrolname="relato"])') && !document.querySelector('#ferramentas_edicao_texto')) {
                a = document.createElement('div');
                a.setAttribute('id', 'ferramentas_edicao_texto')
                document.querySelector('mat-form-field:has(textarea[formcontrolname="relato"])').insertAdjacentElement('afterbegin', a);
                a.innerHTML = '<div id=abrir_menu_ferramentas_texto>🔧Aa</div><div style=display:none id=botoes_ferramentas_edicao_texto><div>Selecionar Tudo</div><div>MAIÚSCULO</div><div>minúsculo</div><div>Primeiras Maiúsculas</div><div>Remover Espaços Extras</div><div>Remover Quebra de Linha</div></div>';
                document.querySelector('#abrir_menu_ferramentas_texto').style = 'box-sizing: border-box; font-family: Roboto,Helvetica Neue,sans-serif;font-size: 12px; font-weight: 500; user-select: none; cursor: pointer; outline: none; border: none; vertical-align: middle; align-items: center; white-space: nowrap; text-decoration: none;  justify-content: center; text-align: center; margin: 5px; width: fit-content; line-height: 20px; padding: 4px; border-radius: 4px; box-shadow: 0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f; transition: background .4s cubic-bezier(.25,.8,.25,1),box-shadow .28s cubic-bezier(.4,0,.2,1); background-color: #fff';
                document.querySelector('#abrir_menu_ferramentas_texto').addEventListener('click', function () {
                    if (document.querySelector('#botoes_ferramentas_edicao_texto').style.display == 'none') {
                        document.querySelector('#botoes_ferramentas_edicao_texto').style.display = '';
                        this.innerHTML = '🔧Aa❌';
                    } else {
                        document.querySelector('#botoes_ferramentas_edicao_texto').style.display = 'none';
                        this.innerHTML = '🔧Aa';
                    }
                    document.querySelector('textarea[formcontrolname="relato"]').focus();
                });
                document.querySelector('#botoes_ferramentas_edicao_texto').querySelectorAll('div').forEach(function (item) {
                    item.style = 'box-sizing: border-box; font-family: Roboto,Helvetica Neue,sans-serif;font-size: 12px; font-weight: 500; user-select: none; cursor: pointer; outline: none; border: none; vertical-align: middle; align-items: center; white-space: nowrap; text-decoration: none;  display: inline-block; justify-content: center; text-align: center; margin: 5px; width: fit-content; line-height: 20px; padding: 4px; border-radius: 4px; box-shadow: 0 3px 1px -2px #0003,0 2px 2px #00000024,0 1px 5px #0000001f; transition: background .4s cubic-bezier(.25,.8,.25,1),box-shadow .28s cubic-bezier(.4,0,.2,1); background-color: #fff';
                    item.addEventListener('click', function () {
                        var ferramenta = this.innerHTML;
                        if (ferramenta == 'Selecionar Tudo') {
                            document.querySelector('textarea[formcontrolname="relato"]').select();
                            item.innerHTML = 'Limpar Seleção';
                        } else if (ferramenta == 'Limpar Seleção') {
                            document.getSelection().removeAllRanges();
                            item.innerHTML = 'Selecionar Tudo';
                        } else {
                            var selectionStart = document.querySelector('textarea[formcontrolname="relato"]').selectionStart;
                            var selectionEnd = document.querySelector('textarea[formcontrolname="relato"]').selectionEnd;
                            var texto = document.querySelector('textarea[formcontrolname="relato"]').value;
                            if (ferramenta == 'MAIÚSCULO') {
                                document.querySelector('textarea[formcontrolname="relato"]').value = texto.substring(0, selectionStart) + texto.substring(selectionStart, selectionEnd).toUpperCase() + texto.substring(selectionEnd, texto.length);
                            } else if (ferramenta == 'minúsculo') {
                                document.querySelector('textarea[formcontrolname="relato"]').value = texto.substring(0, selectionStart) + texto.substring(selectionStart, selectionEnd).toLowerCase() + texto.substring(selectionEnd, texto.length);
                            } else if (ferramenta == 'Primeiras Maiúsculas') {
                                var selecao = texto.substring(selectionStart, selectionEnd).toLowerCase();
                                var b = '';
                                selecao.split(' ').forEach(function (palavra) {
                                    b += palavra.substring(0, 1).toUpperCase() + palavra.substring(1, palavra.length) + ' ';
                                });
                                document.querySelector('textarea[formcontrolname="relato"]').value = texto.substring(0, selectionStart) + b.substring(0, b.length - 1) + texto.substring(selectionEnd, texto.length);
                            } else if (ferramenta == 'Remover Espaços Extras') {
                                selecao = texto.substring(selectionStart, selectionEnd);
                                while (selecao.includes('  ')) {
                                    selecao = selecao.replaceAll('  ', ' ');
                                }
                                document.querySelector('textarea[formcontrolname="relato"]').value = texto.substring(0, selectionStart) + selecao + texto.substring(selectionEnd, texto.length);
                            } else if (ferramenta == 'Remover Quebra de Linha') {
                                selecao = texto.substring(selectionStart, selectionEnd);
                                while (selecao.includes('\n')) {
                                    selecao = selecao.replaceAll('\n', '');
                                }
                                document.querySelector('textarea[formcontrolname="relato"]').value = texto.substring(0, selectionStart) + selecao + texto.substring(selectionEnd, texto.length);
                            }
                            document.querySelector('textarea[formcontrolname="relato"]').dispatchEvent(new Event('input', { bubbles: true }));
                            document.querySelector('textarea[formcontrolname="relato"]').selectionStart = selectionStart;
                            document.querySelector('textarea[formcontrolname="relato"]').selectionEnd = selectionEnd;
                            document.querySelector('textarea[formcontrolname="relato"]').focus();
                        }
                    });
                });
            }

            if (document.querySelector('textarea[formcontrolname="relato"]') && document.querySelector('app-async-data-loading') && localStorage.getItem('verifica_relato') && localStorage.getItem('verifica_relato') == document.querySelector('app-async-data-loading').querySelector('span').innerText.trim() && !document.querySelector('app-dados-natureza-ocorrencia div[class="natureza__valor"]').innerText.includes('NÃO INFORMADO')) {
                if (document.querySelector("div[id='naorepete']")) {
                } else {
                    var b = document.createElement("div");
                    b.setAttribute("id", "naorepete");
                    document.querySelector('app-dados-ocorrencia-tabs').append(b);
                    if (document.querySelector('textarea[formcontrolname="relato"]').value == '') {
                        if (document.querySelector('app-dados-natureza-ocorrencia').innerText.includes('APOIO AO SAMU')) {
                            document.querySelector('textarea[formcontrolname="relato"]').value = 'A guarnição NUM_NOM_GU  prestou apoio à equipe n.º NUM_EQUIPE_SAMU do Samu, sob responsabilidade da técnica NOME_TÉCNICO_ENFERMAGEM , num atendimento de pessoa em surto. Ação realizada dentro da normalidade.';
                        } else if (document.querySelector('app-dados-natureza-ocorrencia').innerText.includes('ABORDAGEM A PESSOA EM ATITUDE SUSPEITA')) {
                            document.querySelector('textarea[formcontrolname="relato"]').value = 'A guarnição NUM_NOM_GU realizou uma abordagem onde foi consultada a ficha criminal do indivíduo bem como realizada a revista pessoal. Não tendo sido encontrado nada em seu desfavor, foi liberado. Ação realizada dentro da normalidade.';
                        } else {
                            document.querySelector('textarea[formcontrolname="relato"]').value = 'Ação realizada dentro da normalidade.';
                        }
                        document.querySelector('textarea[formcontrolname="relato"]').dispatchEvent(new Event('input', { bubbles: true }));
                    }

                }
            }
            if (document.querySelector('app-edicao-ocorrencia-formulario') && !document.querySelector("div[id='naorepetealtenter_salvar']")) {
                var b = document.createElement("div");
                b.setAttribute("id", "naorepetealtenter_salvar");
                document.querySelector('app-edicao-ocorrencia-formulario').append(b);
                atalho_botao_salvar(document.querySelectorAll('app-edicao-ocorrencia-formulario button[botaoconfirmar]')[4]);
                document.querySelectorAll('app-edicao-ocorrencia-formulario button[botaoconfirmar]')[4].addEventListener('click', () => {
                    const intervalFecharEdicao = setInterval(() => {
                        if (document.body.innerHTML.includes('atualizada com sucesso')) {
                            clearInterval(intervalFecharEdicao);
                            window.close();
                        }
                    }, 100);
                })
            }
            if (document.querySelector('textarea[formcontrolname="relato"]') && document.querySelector('textarea[formcontrolname="relato"]').value != '' && localStorage.getItem('verifica_relato') && !document.querySelectorAll('button[botaoconfirmar]')[document.querySelectorAll('button[botaoconfirmar]').length - 1].getAttribute('disabled')) {
                localStorage.setItem('cads_com_relato', localStorage.getItem('cads_com_relato') + ',' + document.querySelector('app-async-data-loading').querySelector('span').innerText.trim());
                document.querySelectorAll('button[botaoconfirmar]')[document.querySelectorAll('button[botaoconfirmar]').length - 2].click();
                localStorage.removeItem('verifica_relato')
            }
            if (document.querySelector('textarea[formcontrolname="relato"]') && localStorage.getItem("cad_relacionado_original") && localStorage.getItem("cad_relacionado_original").split('-()-').length == 2 && document.querySelector('app-async-data-loading') && localStorage.getItem("cad_relacionado_original").split('-()-')[0] == document.querySelector('app-async-data-loading').querySelector('span').innerText.trim() && document.querySelector('app-dados-natureza-ocorrencia').querySelector('div[class=natureza__valor]').innerText.toLowerCase() != 'não informado') {
                var rel = 'Durante a atividade de ' + document.querySelector('app-dados-natureza-ocorrencia').querySelector('div[class=natureza__valor]').innerText.toLowerCase() + ', houve uma ' + localStorage.getItem("cad_relacionado_decorrente").split('-()-')[1].toLowerCase() + ' descrita no registro n.º ' + localStorage.getItem("cad_relacionado_decorrente").split('-()-')[0] + '-OC-GM.';
                if (!document.querySelector('textarea[formcontrolname="relato"]').value.includes(rel)) {
                    document.querySelector('textarea[formcontrolname="relato"]').value += rel;
                    document.querySelector('textarea[formcontrolname="relato"]').dispatchEvent(new Event('input', { bubbles: true }));
                    localStorage.removeItem("cad_relacionado_original");
                    localStorage.removeItem("cad_relacionado_decorrente");
                }
            }
            if (document.querySelector('app-finalizar-ocorrencia-modal') && document.querySelector('app-async-data-loading') && document.querySelector('app-async-data-loading').querySelector('span') && document.querySelector('app-async-data-loading').innerHTML.includes('GCM-POA')) {
                if (document.querySelector("div[id='naorepete']")) {
                } else {
                    var natureza_inicial = '';
                    document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelectorAll('p').forEach(function (item) {
                        if (item.innerHTML.trim() == document.querySelector('app-async-data-loading').querySelector('span').innerText.trim()) {
                            natureza_inicial = item.parentNode.querySelector('span').innerHTML.trim();
                        }
                    });
                    b = document.createElement("div");
                    b.setAttribute("id", "naorepete");
                    document.querySelector('app-finalizar-ocorrencia-modal').append(b);
                    if (natureza_inicial == 'Abordagem a Pessoa Em Atitude Suspeita') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-ABORDAGEM A PESSOA EM ATITUDE SUSPEITA-&-');
                    } else if (natureza_inicial == 'Exercício Ilegal de Profissão Ou Atividade') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-EXERCÍCIO ILEGAL DE PROFISSÃO OU ATIVIDADE-&-');
                    } else if (natureza_inicial == 'Assistência Humanitária') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-ASSISTÊNCIA HUMANITÁRIA-&-');
                    } else if (natureza_inicial == 'Paciente Alterado') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-COMUNICAÇÃO - ORIENTAÇÃO DAS PARTES-&-input[placeholder="Selecione a Natureza Final"]-&-FUGA DE PACIENTE-&-');
                    } else if (natureza_inicial == 'Apoio Ao Samu') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-APOIO AO SAMU-&-');
                    } else if (natureza_inicial == 'Abordagem a Morador de Rua') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Partes Orientadas-&-input[placeholder="Selecione a Natureza Final"]-&-COMUNICAÇÃO - ORIENTAÇÃO DAS PARTES-&-input[placeholder="Selecione a Natureza Final"]-&-ABORDAGEM A MORADOR DE RUA-&-');
                    } else {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-PATRULHAMENTO PREVENTIVO-&-');
                    }
                    sessionStorage.removeItem('cod_montar_cad');
                    let inicia_proximo_cad_interval = setInterval(() => {
                        if (!document.querySelector('app-finalizar-ocorrencia-modal') && !localStorage.getItem("chegada_no_local") && sessionStorage.getItem('cod_montar_cad')) {
                            document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')[1].click();
                            clearInterval(inicia_proximo_cad_interval);
                        }
                    }, 100);
                    atalho_botao_salvar(document.querySelector('app-finalizar-ocorrencia-modal button[botaoconfirmar]'));
                }
            }
            if (document.querySelector('app-finalizar-ocorrencia-modal') && document.querySelector('input[placeholder="Selecione a Categoria"]').value != '' && document.querySelector('input[placeholder="Selecione o Motivo"]').value != '' && document.querySelector('input[placeholder="Selecione o Motivo"]').value != '' && document.querySelector('app-finalizar-ocorrencia-modal').innerText.includes('Naturezas Finais Adicionadas') && localStorage.getItem('cads_com_relato') && document.querySelector('app-async-data-loading') && document.querySelector('app-async-data-loading').querySelector('span') && !localStorage.getItem('cads_com_relato').includes(document.querySelector('app-async-data-loading').querySelector('span').innerText.trim())) {
                if (document.querySelector("div[id='naorepete_verifica_relato']")) {
                } else {
                    b = document.createElement("div");
                    b.setAttribute("id", "naorepete_verifica_relato");
                    document.querySelector('app-finalizar-ocorrencia-modal').append(b);
                    document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelectorAll('p').forEach(function (item) {
                        if (item.innerHTML.trim() == document.querySelector('app-async-data-loading').querySelector('span').innerText.trim()) {
                            localStorage.setItem('verifica_relato', document.querySelector('app-async-data-loading').querySelector('span').innerText.trim());
                            item.parentNode.querySelector('app-icone-acao-editar button').click();
                        }
                    });
                }
            }
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
                        range.select();
                    }
                    try {
                        document.execCommand('copy');
                        range.blur();
                    } catch (error) {
                        // Exceção aqui
                    }
                }
            }
            if (document.querySelector('app-card-ocorrencia-pesquisa')) {
                if (document.querySelector("button[id='naorepete']")) {
                } else {
                    var c = document.createElement("button");
                    c.setAttribute("id", "naorepete");
                    document.querySelector(".opcoes-pesquisa").append(c);
                    var div_num_cads = document.createElement("div");
                    div_num_cads.setAttribute("id", "num_cads");
                    document.querySelector(".opcoes-pesquisa").append(div_num_cads);
                    document.getElementById('naorepete').innerHTML = 'Copiar Nº CADS';
                    var but_cads = document.createElement("button");
                    but_cads.setAttribute("id", "but_cads");
                    document.querySelector(".opcoes-pesquisa").append(but_cads);
                    var but__copiar_tabela_cads = document.createElement("button");
                    but__copiar_tabela_cads.setAttribute("id", "but__copiar_tabela_cads");
                    document.querySelector(".opcoes-pesquisa").append(but__copiar_tabela_cads);
                    but__copiar_tabela_cads.innerHTML = 'Copiar tabela de Cads';
                    var tab_resumo_cads = document.createElement("table");
                    tab_resumo_cads.setAttribute("id", "tab_resumo_cads");
                    document.querySelector(".opcoes-pesquisa").append(tab_resumo_cads);
                    but__copiar_tabela_cads.addEventListener('click', function () {
                        Tabela.selecionarTabela(tab_resumo_cads);
                    });
                    document.getElementById('but_cads').innerHTML = 'Gerar Tabela de Cads';
                    document.querySelector("mat-select[formcontrolname=registrosPorPagina]").click();
                    setTimeout(() => {
                        document.querySelectorAll('mat-option')[4].click();
                    }, "1000");
                    document.getElementById('naorepete').addEventListener('click', function () {
                        setTimeout(() => {
                            var cads = document.querySelectorAll('app-card-ocorrencia-pesquisa');
                            var textcads = '<table id=tb_num_cads><tbody>';
                            cads.forEach((item) => {
                                if (!item.querySelectorAll('span')[0].innerHTML.includes('Patrulhamento Preventivo') || !item.querySelectorAll('span')[0].innerHTML.includes('Patrulhamento Preventivo')) {
                                    textcads += '<tr><td>' + item.querySelectorAll('span')[2].innerHTML + '</td></tr>';
                                }
                            });
                            textcads += '</table>';
                            document.getElementById('num_cads').innerHTML = textcads;
                            textcads = '<table id=tb_num_cads><tbody>';
                            var tabelaDeDados = document.getElementById("tb_num_cads");
                            Tabela.selecionarTabela(tabelaDeDados);
                            document.getElementById('num_cads').innerHTML = 'Nº CADS copiado para a área de transferência';
                        }, "1000");
                    });
                    document.getElementById('but_cads').addEventListener('click', function () {
                        localStorage.setItem('resumo_cads', '');
                        var cads_para_tabela = document.querySelectorAll('app-icone-acao-visualizar-ocorrencia');
                        var i = 0;
                        localStorage.setItem('cad_lido', 'sim');
                        localStorage.setItem('processo_busca_cads_e_monta_tabela', 'sim');
                        var busca_cads_e_monta_tabela = setInterval(function () {
                            if (i < cads_para_tabela.length && localStorage.getItem('cad_lido') == 'sim') {
                                localStorage.setItem('cad_lido', 'não');
                                cads_para_tabela[i].querySelector('button').click();
                                i++;
                            } else if (localStorage.getItem('resumo_cads') != '') {
                                var linhas_prontas_dados_dos_cads = '';
                                var dados_dos_cads = localStorage.getItem('resumo_cads').split('__--__');
                                for (let i = 0; i < dados_dos_cads.length; i++) {
                                    linhas_prontas_dados_dos_cads += '<tr>';
                                    var a = dados_dos_cads[i].split('-@@-');
                                    for (let d = 0; d < a.length; d++) {
                                        linhas_prontas_dados_dos_cads += '<td>' + a[d] + '</td>';
                                    }
                                    linhas_prontas_dados_dos_cads += '</tr>';
                                }
                                localStorage.setItem('resumo_cads', '');
                                localStorage.removeItem('processo_busca_cads_e_monta_tabela', 'sim');
                                if (tab_resumo_cads.innerHTML == '') {
                                    tab_resumo_cads.innerHTML = '<thead><tr><th>Nº Ocorrência</th><th>Natureza Inicial</th><th>Acionamento</th><th>Natureza Final</th><th>Finalização</th><th>Endereço</th><th>Narrativa</th><th>Relato</th><th>Envolvidos</th><th>Equipes</th></tr></thead><tbody>' + linhas_prontas_dados_dos_cads + '</tbody>';
                                } else {
                                    tab_resumo_cads.querySelector('tbody').innerHTML += linhas_prontas_dados_dos_cads;
                                }
                            }

                        }, 1000);
                    });
                }
            }

            if ('app-card-ocorrencia') {
                if (document.getElementById('naorepeteselecionacad')) {
                } else {
                    var d = document.createElement("div");
                    d.setAttribute("id", "naorepeteselecionacad");
                    if (document.querySelector('div[class="barra-botoes-container"]')) {
                        document.querySelector('div[class="barra-botoes-container"]').append(d);
                        d.innerHTML += '<div style=display:inline-block><input type="checkbox" checked id="selecionacad1" name="selecionacad1" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for="selecionacad1">Cad 1</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad2" name="cad2" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad2>Cad 2</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad3" name="cad3" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad3>Cad 3</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad4" name="cad4" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad4>Cad 4</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad5" name="cad5" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad5>Sem empenho</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad6" name="cad6" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad6>Somente meus cads</label></div>'
                        if (localStorage.getItem('cadselecionados')) {
                            var cadselecionados = localStorage.getItem('cadselecionados');
                            if (cadselecionados.split('---')[0] == 'true') {
                                document.querySelector('#selecionacad1').checked = true;
                            } else {
                                document.querySelector('#selecionacad1').checked = false;
                            }
                            if (cadselecionados.split('---')[1] == 'true') {
                                document.querySelector('#selecionacad2').checked = true;
                            } else {
                                document.querySelector('#selecionacad2').checked = false;
                            }
                            if (cadselecionados.split('---')[2] == 'true') {
                                document.querySelector('#selecionacad3').checked = true;
                            } else {
                                document.querySelector('#selecionacad3').checked = false;
                            }
                            if (cadselecionados.split('---')[3] == 'true') {
                                document.querySelector('#selecionacad4').checked = true;
                            } else {
                                document.querySelector('#selecionacad4').checked = false;
                            }
                            if (cadselecionados.split('---')[4] == 'true') {
                                document.querySelector('#selecionacad5').checked = true;
                            } else {
                                document.querySelector('#selecionacad5').checked = false;
                            }
                            if (cadselecionados.split('---')[5] == 'true') {
                                document.querySelector('#selecionacad6').checked = true;
                            } else {
                                document.querySelector('#selecionacad6').checked = false;
                            }
                        }

                        setInterval(function () {
                            if (document.getElementById('selecionacad1')) {
                                atualizavisualizacaocads();
                                localStorage.setItem('cadselecionados', document.getElementById('selecionacad1').checked + '---' + document.getElementById('selecionacad2').checked + '---' + document.getElementById('selecionacad3').checked + '---' + document.getElementById('selecionacad4').checked + '---' + document.getElementById('selecionacad5').checked + '---' + document.getElementById('selecionacad6').checked)
                                /* if(localStorage.getItem('area')) {
                                    var u = document.querySelectorAll('div[class="dado-empenho cabecalho-empenho nome-unidade-servico"]');
                                    for (let i = 0; i < u.length; i++) {
                                        var span = document.createElement('span');
                                        span.innerHTML = u[i].innerHTML;
                                        if(span.textContent.includes(localStorage.getItem('area').split('-')[0].trim())) {
                                            u[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('app-icone-acao-finalizar-ocorrencia').querySelector('app-icone-acao-base').querySelector('button').click();
                                        }
                                    }
                                }*/
                            }
                        }, 1000);

                        function atualizavisualizacaocads() {
                            var card_ocorrencia = document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelectorAll('app-card-ocorrencia');
                            var unidade_sv = document.querySelectorAll('app-card-unidade-servico');
                            var cads = document.querySelectorAll('input[id*=selecionacad]');
                            var areas = [];
                            for (let idx = 0; idx < cads.length; idx++) {
                                if (cads[idx].checked == true) {
                                    if (idx == 0) {
                                        areas.push('300 Área Partenon', '400 Área Leste', '600 Área Norte', '700 Área Eixo Baltazar');
                                    }
                                    if (idx == 1) {
                                        areas.push('200 Área Cruzeiro', '500 Área Restinga', '800 Área Pinheiro', '900 Área Eixo Sul');
                                    }
                                    if (idx == 2) {
                                        areas.push('1200 Área Centro');
                                    }
                                    if (idx == 3) {
                                        areas.push('1000 Romu', 'Apoio', 'Comando Operacional', 'Comando Geral', 'Batedores', '1100 Patam', 'Eapc');
                                    }
                                    if (idx == 4) {
                                        areas.push('Empenho(s) Liberado(s)');
                                    }
                                }
                            }
                            for (let idx = 0; idx < card_ocorrencia.length; idx++) {
                                var tem = 'n';
                                for (let a = 0; a < areas.length; a++) {
                                    if (card_ocorrencia[idx].querySelector('app-empenho') && card_ocorrencia[idx].querySelector('app-empenho').parentNode.innerText.includes(areas[a])) {
                                        tem = 's';
                                        a = areas.length;
                                    } else if (areas[a] == 'Empenho(s) Liberado(s)' && card_ocorrencia[idx].innerText.includes(areas[a])) {
                                        tem = 's';
                                        a = areas.length;
                                    }
                                }
                                if (tem == 'n' && !card_ocorrencia[idx].innerHTML.includes('nao-despachado')) {
                                    card_ocorrencia[idx].parentNode.style.display = 'none';
                                } else {
                                    card_ocorrencia[idx].parentNode.style.display = '';
                                }
                                if (localStorage.getItem('meus_cads') && localStorage.getItem('meus_cads') != '') {
                                    if (document.getElementById('selecionacad6').checked == true) {
                                        if (localStorage.getItem('meus_cads').includes(card_ocorrencia[idx].querySelector('p').innerText.split('-')[1])) {
                                            card_ocorrencia[idx].parentNode.style.display = '';
                                        } else {
                                            card_ocorrencia[idx].parentNode.style.display = 'none';
                                        }
                                    }
                                }
                            }
                            for (let idx = 0; idx < unidade_sv.length; idx++) {
                                tem = 'n';
                                for (let a = 0; a < areas.length; a++) {
                                    if (unidade_sv[idx].innerText.includes(areas[a])) {
                                        tem = 's';
                                        a = areas.length;
                                    }
                                }
                                if (tem == 'n' && !unidade_sv[idx].innerHTML.includes('nao-despachado')) {
                                    unidade_sv[idx].parentNode.style.display = 'none';
                                } else {
                                    unidade_sv[idx].parentNode.style.display = '';
                                }
                            }
                        }
                    }
                }
            }

            if (document.querySelector('app-card-resumo-chamado') && localStorage.getItem('processo_busca_cads_e_monta_tabela') && document.querySelector('app-dados-grupos').innerHTML.includes('Nenhum Envolvido Informado') || document.querySelector('app-card-resumo-chamado') && localStorage.getItem('processo_busca_cads_e_monta_tabela') && document.querySelector('app-dados-grupos').innerHTML.includes('Participação')) {
                if (document.getElementById('naorepete_visualizar_ocorrencia')) {
                } else {
                    var naorepete_visualizar_ocorrencia = document.createElement("div");
                    naorepete_visualizar_ocorrencia.setAttribute("id", "naorepete_visualizar_ocorrencia");
                    document.querySelector('#visualizar-ocorrencia').append(naorepete_visualizar_ocorrencia);
                    var resumo_cads = '';
                    if (localStorage.getItem('resumo_cads')) {
                        resumo_cads = localStorage.getItem('resumo_cads');
                    }
                    var localizacao = '';
                    var endereco = '';
                    var numero_endereco = '';
                    var p_referencia = '';
                    var span_loc = document.querySelector('app-dados-localizacao').querySelectorAll('span');
                    for (let i = 0; i < span_loc.length; i++) {
                        if (span_loc[i].innerHTML == 'Logradouro: ') {
                            endereco = span_loc[i].parentNode.querySelectorAll('span')[1].innerHTML;
                        } else if (span_loc[i].innerHTML == 'Número: ') {
                            numero_endereco = span_loc[i].parentNode.querySelectorAll('span')[1].innerHTML;
                        } else if (span_loc[i].innerHTML == 'Ponto de Referência: ') {
                            p_referencia = span_loc[i].parentNode.querySelectorAll('span')[1].innerHTML;
                        }
                    }
                    localizacao = endereco + ', ' + numero_endereco + ' - ' + p_referencia;
                    var relatos = '';
                    if (document.querySelector('app-relatos')) {
                        for (let i = 0; i < document.querySelectorAll('app-relatos').length; i++) {
                            relatos += document.querySelectorAll('app-relatos')[i].querySelector('p').innerHTML + ' - ';
                        }
                        relatos = relatos.slice(0, -3);
                    }

                    var envolvidos = '';
                    if (document.querySelector('app-dados-grupos').innerHTML.includes('Nenhum Envolvido Informado')) {
                        envolvidos = 'Nenhum Envolvido Informado';
                    } else {
                        var envolvido = document.querySelector('app-dados-grupos').querySelectorAll('app-dados-envolvido');
                        for (let i = 0; i < envolvido.length; i++) {
                            var linhas_envolvido = envolvido[i].querySelectorAll('div');
                            for (let indx = 0; indx < linhas_envolvido.length; indx++) {
                                if (linhas_envolvido[indx].querySelector('span')) {
                                    envolvidos += linhas_envolvido[indx].querySelector('span').innerHTML += linhas_envolvido[indx].innerHTML.split('</span>')[1] + '<br>';
                                } else {
                                    envolvidos += linhas_envolvido[indx].innerHTML + '<br>';
                                }
                            }
                        }
                        //envolvidos = envolvidos.slice(0, -3);
                    }
                    var gu_empenhadas = '';
                    var li = document.querySelectorAll('li');
                    for (let i = 0; i < li.length; i++) {
                        if (li[i].innerHTML.includes('Unidade Serviço Empenhada')) {
                            li[i].querySelector('div').click();
                            //  setTimeout(() => {
                            li[i].querySelectorAll('mat-icon')[1].click();
                            if (li[i].querySelector('em').parentNode.innerHTML.split('(Número')[0].includes('-')) {
                                gu_empenhadas += li[i].querySelector('em').parentNode.innerHTML.split(' - ')[1].split('(Número')[0].trim() + ' - ';
                            } else {
                                gu_empenhadas += li[i].querySelector('em').parentNode.innerHTML.split('Unidade de Serviço:')[1].split('(Número')[0].trim() + ' - ';
                            }

                            //   }, "1000");


                        }
                    }
                    gu_empenhadas = gu_empenhadas.slice(0, -3);
                    localStorage.setItem('resumo_cads', resumo_cads + document.querySelector('div[class="titulo-modal-visualizar"]').innerHTML.split('</span>')[1].trim() + '-@@-' + document.querySelector('div[class="nome-natureza"]').innerHTML + '-@@-' + document.querySelector('div[class="data-hora"]').innerHTML.split('<div')[0].split('acionamento: ')[1] + '-@@-' + document.querySelector('div[class="nome-tipo-natureza"]').querySelectorAll('span')[1].innerHTML + '-@@-' + document.querySelector('app-card-dados-finalizacao').querySelectorAll('div')[12].innerHTML + document.querySelector('app-card-dados-finalizacao').querySelectorAll('div')[13].innerHTML + '-@@-' + localizacao + '-@@-' + document.querySelector('app-texto-justificado').querySelector('p').innerHTML + '-@@-' + relatos + '-@@-' + envolvidos + '-@@-' + gu_empenhadas + '__--__');
                    localStorage.setItem('cad_lido', 'sim');
                    document.querySelector('app-icone-acao-alerta').parentNode.getElementsByTagName('button')[7].click();
                }
            }

            if (document.querySelector('app-ocorrencias-nao-despachadas-golden-layout') && !document.querySelector('app-selecionar-unidade-empenhar') && localStorage.getItem('area') && Array.from(document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia')).filter(ocorrencia => ocorrencia.innerHTML.includes(localStorage.getItem('area').split('-()-')[0]))[0] && Array.from(document.querySelectorAll('app-unidades-servico-golden-layout app-card-unidade-servico')).filter(unidade => unidade.querySelector('p[class*="nome-unidade"]').innerText.includes(localStorage.getItem('area').split('-()-')[1].split('-')[0].trim()) && unidade.innerHTML.includes('background_em_servico'))[0]) {
                if (document.getElementById('naorepeteselecionaunidadeempenharclicar')) {
                } else {
                    d = document.createElement("div");
                    d.setAttribute("id", "naorepeteselecionaunidadeempenharclicar");
                    if (Array.from(document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia')).filter(ocorrencia => ocorrencia.innerHTML.includes(localStorage.getItem('area').split('-()-')[0]))[0]) {
                        Array.from(document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia')).filter(ocorrencia => ocorrencia.innerHTML.includes(localStorage.getItem('area').split('-()-')[0]))[0].append(d);
                        Array.from(document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia')).filter(ocorrencia => ocorrencia.innerHTML.includes(localStorage.getItem('area').split('-()-')[0]))[0].querySelector('button[mattooltip="Empenhar Unidade de Serviço"]').click();
                    }
                }
            }

            if (document.querySelector('app-selecionar-unidade-empenhar')) {
                if (document.getElementById('naorepeteselecionaunidadeempenhar')) {
                } else {
                    d = document.createElement("div");
                    d.setAttribute("id", "naorepeteselecionaunidadeempenhar");
                    if (document.querySelector('app-selecionar-unidade-empenhar')) {
                        document.querySelector('app-selecionar-unidade-empenhar').append(d);
                        if (localStorage.getItem('area')) {
                            var u = document.querySelectorAll('div[class="dado-empenho cabecalho-empenho nome-unidade-servico"]');
                            for (let i = 0; i < u.length; i++) {
                                var span = document.createElement('span');
                                span.innerHTML = u[i].innerHTML;
                                if (span.textContent.includes(localStorage.getItem('area').split('-()-')[1].split('-')[0].trim())) {
                                    u[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('app-icone-acao-finalizar-ocorrencia').querySelector('app-icone-acao-base').querySelector('button').click();
                                }
                            }
                            var unidades = document.querySelectorAll('p[class="dado-card nome-unidade"]');
                            for (let i = 0; i < unidades.length; i++) {


                                if (unidades[i].innerHTML.split('<span')[0].includes(localStorage.getItem('area').split('-()-')[1].split('-')[0].trim())) {
                                    unidades[i].parentNode.parentNode.nextSibling.querySelector('input[type="checkbox"]').click();
                                }
                            }
                            localStorage.removeItem('area');
                        }
                    }
                    atalho_botao_salvar(document.querySelector('app-selecionar-unidade-empenhar button[botaoconfirmar]'));
                }
            }

            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && document.querySelector('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia') && (!document.querySelector('app-ocorrencias-despachadas-golden-layout').innerHTML.includes('GCM-POA202') || !document.querySelector('app-ocorrencias-nao-despachadas-golden-layout').innerHTML.includes('GCM-POA202'))) {
                document.querySelector("#painelMenuFiltrosOcorrenciasDespachadas div[class*= toggle-switch]").click();
                if (document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]").length - 1].checked == true) {
                    document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]").length - 1].click();
                }
                document.querySelector("#painelMenuFiltrosOcorrenciasNaoDespachadas div[class*= toggle-switch]").click();
                if (document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]").length - 1].checked == true) {
                    document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]").length - 1].click();
                }
                document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia').forEach(item => {
                    if (item.querySelector('p[class*="dado-card protocolo"]')) {
                        item.querySelector('p[class*="dado-card protocolo"]').style.display = 'none';
                    }
                    item.querySelector('p[class*="data-hora"]').style.display = 'none';
                    Array.from(item.querySelectorAll('p[class*=dado-card]')).filter(p => p.innerText.includes('GCM-POA')).forEach(i => { i.style.display = 'none' });
                })
            }
            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))') && Array.from(document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))').querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('GCM-POA202'))[0]) {
                var cad = document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))');
                var botao_referenciar_cad = document.createElement('button');
                botao_referenciar_cad.setAttribute("class", "mat-mdc-tooltip-trigger button-icon");
                botao_referenciar_cad.setAttribute("acao", "Referenciar CAD");
                botao_referenciar_cad.setAttribute("style", "font-weight: bold; color: rgb(19, 81, 180);");
                botao_referenciar_cad.setAttribute("title", "Criar CAD Relacionado");
                var equipes = '';
                a = '';
                if (!cad.innerText.includes('Empenho(s) Liberado(s)')) {
                    cad.querySelectorAll('app-empenho').forEach(function (item) {
                        a += item.querySelector('div[class="dado-empenho cabecalho-empenho nome-unidade-servico"]').innerText.split('-')[1].trim() + ', ';
                    });
                    a = a.substring(0, a.length - 2);
                    if (cad.querySelectorAll('app-empenho').length > 1) {
                        equipes = 'as guarnições ' + a + ' realizaram';
                    } else {
                        equipes = 'a guarnição ' + a + ' realizou';
                    }
                }
                var data = new Date(),
                    dia = data.getDate().toString(),
                    diaF = (dia.length == 1) ? '0' + dia : dia,
                    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                    mesF = (mes.length == 1) ? '0' + mes : mes,
                    anoF = data.getFullYear();
                var data_hora = diaF + '/' + mesF + '/' + anoF + ' ' + ('0' + data.getHours()).slice(-2) + ':' + ('0' + data.getMinutes()).slice(-2);
                area = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('GCM-POA'))[0];
                if (area) {
                    let tipo_local = '';
                    if (Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('Tipo Local'))[0]) {
                        tipo_local = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('Tipo Local'))[0].innerHTML.split('Tipo Local:')[1].trim();
                    }
                    var n_registro = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('GCM-POA202'))[0];
                    let ponto_referencia = '';
                    let endereco = cad.querySelectorAll('p')[3].innerText.trim().replaceAll(' ,', ',').replaceAll('/RS', '');
                    if (cad.querySelectorAll('p').length == 8) {
                        ponto_referencia = cad.querySelectorAll('p')[2].innerText.trim();
                        endereco = cad.querySelectorAll('p')[4].innerText.trim().replaceAll(' ,', ',').replaceAll('/RS', '');
                    }
                    botao_referenciar_cad.setAttribute("dados_para_referencia", ponto_referencia + '-()-' + tipo_local + '-()-Durante uma atividade de ' + cad.querySelector('span').innerText.trim() + ' descrita no registro n.º ' + n_registro.innerText.trim() + ', ' + equipes + ' uma NATUREZA_INICIAL no local.-()-' + endereco + '-()-Abordagem a Pessoa Em Atitude Suspeita-()-' + area.innerText.replace(/\D/g, '') + '-()-' + data_hora + '-()-40-()--()--()--++-');
                    botao_referenciar_cad.innerHTML = '↔';
                    cad.querySelector('div[class*=acoes-ocorrencia]').append(botao_referenciar_cad);
                    cad.querySelector('div[class*=acoes-card-estreito]').append(botao_referenciar_cad.cloneNode(true));
                    cad.querySelectorAll('button[acao="Referenciar CAD"]').forEach(function (but) {
                        but.addEventListener('click', function () {
                            localStorage.setItem("dados_para_o_cad", this.getAttribute('dados_para_referencia'));
                            localStorage.setItem("cad_relacionado_original", this.parentNode.parentNode.parentNode.querySelector('p').innerText);
                            document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')[1].click();
                        });
                    });
                }

            }
            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && localStorage.getItem("cad_relacionado_original") && localStorage.getItem("cad_relacionado_original").split('-()-').length == 2 && document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))')) {
                var xpath = document.evaluate("//p[contains(.,'" + localStorage.getItem("cad_relacionado_original").split('-()-')[0] + "')]", document, null, XPathResult.ANY_TYPE, null);
                xpath.iterateNext().parentNode.querySelector('app-icone-acao-editar button').click();
            }
            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && localStorage.getItem("chegada_no_local")) {
                let cad = Array.from(document.querySelectorAll('app-ocorrencias-despachadas-golden-layout app-card-ocorrencia')).filter((cad) => cad.innerHTML.includes(localStorage.getItem("chegada_no_local").split('-&&-')[0]))[0];
                let situacao = localStorage.getItem("chegada_no_local").split('-&&-')[1];
                if (cad && !cad.innerHTML.includes('Chegada no Local') && !cad.innerHTML.includes('Em Deslocamento')) {
                    if (!document.querySelector('app-atualizar-situacao-empenho')) {
                        cad.querySelector('button[mattooltip="Editar Situação do Empenho"]').click();
                    } else if (document.querySelector('app-atualizar-situacao-empenho input[placeholder="Situação"]').value != 'Em Deslocamento' && document.querySelector('app-atualizar-situacao-empenho input[placeholder="Situação"]').value != 'Chegada no Local' && !document.querySelector('mat-option') && document.querySelector('app-atualizar-situacao-empenho button[aria-label="Limpar"]')) {
                        document.querySelector('app-atualizar-situacao-empenho button[aria-label="Limpar"]').click();
                    } else if (document.querySelector('app-atualizar-situacao-empenho input[placeholder="Situação"]').value != 'Em Deslocamento' && document.querySelector('app-atualizar-situacao-empenho input[placeholder="Situação"]').value != 'Chegada no Local' && document.querySelector('mat-option')) {
                        let sit = '';
                        if (situacao == '72') {
                            sit = 'Em Deslocamento';
                        } else {
                            sit = 'Chegada no Local';
                        }
                        Array.from(document.querySelectorAll('mat-option')).filter((opcao) => opcao.innerText == sit)[0].click();
                    } else {
                        document.querySelector('app-atualizar-situacao-empenho button[botaoconfirmar]').click();
                        if (localStorage.getItem("chegada_no_local").split('-&&-')[2] == '') {
                            localStorage.removeItem("chegada_no_local");
                            sessionStorage.removeItem('cod_montar_cad');
                            document.querySelectorAll('div[routerlinkactive="item-menu-selected"]')[1].click();
                        }
                    }
                } else if (cad && cad.innerHTML.includes('Chegada no Local') && localStorage.getItem("chegada_no_local").split('-&&-')[2] != '' && !document.querySelector('app-atualizar-situacao-empenho')) {
                    cad.querySelector('app-icone-acao-finalizar-ocorrencia button').click();
                    localStorage.removeItem("chegada_no_local");
                }
            }
        }, 100);

    });
});

function preencher_chamado(dados) {
    let campos = ['input[formcontrolname="nomeSolicitante"]', 'input[formcontrolname="telefone"]', 'textarea[formcontrolname="relato"]', 'input[placeholder="Selecione a Natureza Inicial"]', 'input[formcontrolname="dataFato"]', 'input[formcontrolname="horaFato"]', 'input[formcontrolname="campoPesquisa"]', 'input[formcontrolname="pontoReferencia"]', 'input[placeholder="Selecione o Tipo de Local"]'];
    let data_do_fato_interval = setInterval(() => {
        if (!document.querySelector('input[formcontrolname="dataFato"]')) {
            if (!document.querySelector('mat-option')) {
                document.querySelector('mat-select[formcontrolname="fatoOcorrendoMomento"]').click();
            } else {
                Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.includes('Não'))[0].click();
            }
        } else if (document.querySelector('input[formcontrolname="dataFato"]') && document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]') && document.querySelector('input[placeholder="Selecione o Tipo de Local"]')) {
            if (document.querySelector('cad-select-autocomplete[formcontrolname="tipoLocal"] button')) {
                document.querySelector('cad-select-autocomplete[formcontrolname="tipoLocal"] button').click();
            } else if (Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.includes('Via urbana'))[0]) {
                document.querySelector('input[formcontrolname="nomeSolicitante"]').click();
            } else if (document.querySelector('cad-select-autocomplete[formcontrolname="naturezaInicial"] button')) {
                document.querySelector('cad-select-autocomplete[formcontrolname="naturezaInicial"] button').click();
            } else if (Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.includes('Patrulhamento Preventivo'))[0]) {
                document.querySelector('input[formcontrolname="nomeSolicitante"]').click();
            } else {
                clearInterval(data_do_fato_interval);
                campos.forEach(campo => {
                    if (document.querySelector(campo).value != '') {
                        document.querySelector(campo).value = '';
                    }
                });
                for (let index = 0; index < dados.length; index++) {
                    document.querySelector(campos[index]).value = dados[index];
                    document.querySelector(campos[index]).dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (dados[3] != '') {
                    let natureza_interval = setInterval(() => {
                        if (document.querySelector('span.label-natureza').innerText.toLowerCase().trim() != dados[3].toLowerCase().trim()) {
                            if (document.querySelector('cad-select-autocomplete[formcontrolname="naturezaInicial"] button')) {
                                document.querySelector('cad-select-autocomplete[formcontrolname="naturezaInicial"] button').click();
                            } else if (!document.querySelector('mat-option')) {
                                document.querySelector(campos[3]).click();
                            } else if (Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.toLowerCase().trim().includes(dados[3].toLowerCase().trim()))[0]) {
                                Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.toLowerCase().trim().includes(dados[3].toLowerCase().trim()))[0].click();
                            } else if (document.querySelectorAll('mat-option').length == 341) {
                                clearInterval(natureza_interval);
                            }
                        } else {
                            clearInterval(natureza_interval);
                        }
                    }, 100);
                    let meio_de_aviso_interval = setInterval(() => {
                        if (document.querySelector('cad-select-autocomplete[formcontrolname="meioAviso"]') && dados[3] != 'Patrulhamento Preventivo' && dados[3] != 'Ação Conjunta' && dados[3] != 'Ação Própria' && dados[3] != 'Ação Integrada' && dados[3] != 'Fiscalização e Policiamento - Eventos') {
                            if (document.querySelector('cad-select-autocomplete[formcontrolname="meioAviso"] button')) {
                                document.querySelector('cad-select-autocomplete[formcontrolname="meioAviso"] button').click();
                            } else if (!document.querySelector('mat-option')) {
                                document.querySelector('input[placeholder="Selecione o Meio de Aviso"]').click();
                            } else if (Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText == 'Telefone')[0]) {
                                Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText == 'Telefone')[0].click();
                                clearInterval(meio_de_aviso_interval);
                            } else {
                                clearInterval(meio_de_aviso_interval);
                            }
                        } else {
                            clearInterval(meio_de_aviso_interval);
                        }
                    }, 100);
                }

                let endereco_interval = setInterval(() => {
                    if (document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]')) {
                        if (document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]').value == '' || document.querySelector(campos[6]).value != '') {
                            if (!document.querySelector('mat-option')) {
                                document.querySelector(campos[6]).click();
                            } else {
                                document.querySelector('mat-option').click();
                            }
                        } else if (document.querySelectorAll(campos[7])[1].value = dados[7].replaceAll('"', '')) {
                            document.querySelectorAll(campos[7])[1].value = dados[7].replaceAll('"', '');
                            document.querySelectorAll(campos[7])[1].dispatchEvent(new Event('input', { bubbles: true }));
                            clearInterval(endereco_interval);
                        }

                    }
                }, 100);

                let tipo_de_local_interval = setInterval(() => {
                    if (document.querySelector('cad-select-autocomplete[formcontrolname="tipoLocal"]')) {
                        if (!document.querySelector('cad-select-autocomplete[formcontrolname="tipoLocal"] button')) {
                            if (!document.querySelector('mat-option')) {
                                document.querySelector(campos[8]).click();
                            } else if (Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.includes(dados[8]))[0]) {
                                Array.from(document.querySelectorAll('mat-option')).filter(option => option.innerText.includes(dados[8]))[0].click();
                            }
                        } else {
                            clearInterval(tipo_de_local_interval);
                        }
                    }
                }, 100);
            }
        }
    }, 100);
}

function atalho_botao_salvar(button) {
    button.innerHTML += '<span style="font-size:10px">&nbsp;(Alt + Enter)</span>';
    if (document.querySelector('app-distribuicao-chamado button[botaoconfirmar]')) {
        button = document.querySelector('app-distribuicao-chamado button[botaoconfirmar]');
    }
    document.addEventListener('keydown', function (event) {
        const isAltGr = event.getModifierState && event.getModifierState('AltGraph');
        if (event.key === 'Enter' && (event.altKey || isAltGr)) {
            if (document.querySelector('app-distribuicao-chamado button[botaoconfirmar]')) {
                button = document.querySelector('app-distribuicao-chamado button[botaoconfirmar]');
                button.innerHTML += '<span style="font-size:10px">&nbsp;(Alt + Enter)</span>';
            }
            if (button) {
                event.preventDefault();
                button.focus();
                button.click();
            }
        }
    });
}
/*
if (window.location.href.includes('editar-ocorrencia')) {
    let bairro;
    let manter_bairro = setInterval(() => {
        if (document.querySelector("#mat-input-10") && !bairro) {
            bairro = document.querySelector("#mat-input-10").value;
            console.log(document.querySelector("#mat-input-10").outerHTML)
        } else if (document.querySelector("#mat-input-10") && bairro && document.querySelector("#mat-input-10").value != bairro && document.querySelector("#mat-input-3").value == 'Porto Alegre') {
            document.querySelector("body > app-pop-out > div > app-edicao-ocorrencia-formulario > div.formulario-edicao > div.div-golden-layout > gl-host > div > div > div:nth-child(3) > div:nth-child(1) > div > section.lm_items > div > div > app-edicao-ocorrencia-golden-layout > div > ng-component > div > div > cad-tab-vertical-set > div > div.vertical-menu-content > cad-tab > app-chamado-form-localizacao > form > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > cad-select-autocomplete > mat-form-field > div.mat-mdc-text-field-wrapper.mdc-text-field.ng-tns-c508571215-27.mdc-text-field--outlined > div > div.mat-mdc-form-field-icon-suffix.ng-tns-c508571215-27.ng-star-inserted > button").click();
            const alvo = document.querySelector("#mat-input-10");
            alvo.value = bairro;
            ["mousedown", "mouseup", "click", "focus", "input", "blur"].forEach(evtName => {
                const evt = new Event(evtName, { bubbles: true, cancelable: true });
                alvo.dispatchEvent(evt);
            });
            ["mousedown", "mouseup", "click", "focus", "input", "blur"].forEach(evtName => {
                const evt = new Event(evtName, { bubbles: true, cancelable: true });
                alvo.dispatchEvent(evt);
            });

        }
    }, 100);
}*/