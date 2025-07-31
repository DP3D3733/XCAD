
let trava_cod_montar_cad = '';
localStorage.setItem('selecionaopcao', '');
sessionStorage.removeItem('multicads_montar_cad');
sessionStorage.removeItem('cod_montar_cad');
chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("CAD Ocorrências", (d) => {
        if (d['CAD Ocorrências'] == 'desativado') return;
        var versao = '<span style="margin-right:30px;color: #d3d4d9">XCAD <strong>v1.5.0</strong>, por GM 842 Calebe. Deus é socorro bem presente!</span>';
        if (!localStorage.getItem('verifica_parametrizacao') || localStorage.getItem('verifica_parametrizacao') != new Date().getDate()) {
            localStorage.setItem('verifica_parametrizacao', 'nada');
        }
        setInterval(function () {
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
            if (document.querySelector('app-info-status-voip') && !document.querySelector('app-info-status-voip').innerHTML.includes(versao)) {
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
                    a = document.createElement("div");
                    a.setAttribute("id", "naorepete");
                    document.querySelector("gl-host").insertAdjacentElement('beforebegin', a);
                    a.innerHTML = '<div style="background:#1454b4;color:white;width:fit-content;padding:7px;border-radius:5px;margin:5px;font-weight:bold;user-select:none" onmouseover=this.style.cursor="pointer" onmouseout=this.style.cursor="auto" id="cod_montar_cad">Inserir Dados do CAD</div>';
                    document.querySelector('div.linha-botoes-acao').setAttribute('style', 'right:25px;position:fixed;z-index:9999;margin-top:0');
                    async function colar_dados_cad() {
                        sessionStorage.removeItem('multicads_montar_cad');
                        sessionStorage.removeItem('cod_montar_cad');
                        trava_cod_montar_cad = '';
                        console.log(await window.navigator.clipboard.readText());
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
                    document.querySelector('datalist').innerHTML = "<option>QTH .-. ENDEREÇO .-. TIPO DE LOCAL</option><option>1033 PRAÇA QUINZE DE NOVEMBRO .-. Praça Quinze de Novembro, s/n - Centro Histórico - 90020-080 .-. Praça / Parque</option><option>241 UBS 1° MAIO .-. Avenida Prof. Oscar Pereira, 6199 .-. Estabelecimentos de saúde</option><option>058 CECORES- CENTRO COMUNITÁRIO RESTINGA .-. Avenida Economista Nilo Wulff, 681 .-. Repartição pública</option><option>267 SME CECOPAM .-. Rua Arroio Grande , 50 .-. Repartição pública</option><option>627 CECOFLOR - CENTRO COM. VL. FLORESTA .-. Rua Irene Capponi Santiago, 290 .-. Repartição pública</option><option>651 CEPRIMA .-. Rua Camoati, 64 .-. Repartição pública</option><option>727 CEVI-CENTRO ESPORTIVO VILA INGÁ .-. RUA PAPA PIO XXII, 350 .-. Repartição pública</option><option>4021 PRAÇA DOS GUSMÕES .-. Av. Plínio Brasil Milano, 1662 - Passo d'Areia, Porto Alegre .-. Praça / Parque</option><option>1075 ESTAÇÃO RODOVIÁRIA .-. Rodoviária de Porto Alegre - Largo Vespasiano Júlio Veppo .-. Terminal de ônibus</option><option>14000 POSTO AVANÇADO GLÊNIO PERES .-. Praça Quinze de Novembro, 90 .-. Repartição pública</option><option>1078 PRAÇA OSVALDO CRUZ .-. R. Carlos Chagas, 12 - Centro Histórico, Porto Alegre .-. Praça / Parque</option><option>1020 TÚNEL DA CONCEIÇÃO E ELEVADAS .-. Túnel da Conceição-Elevadas - Centro Histórico .-. Praça / Parque</option><option>1024 VIADUTO OTÁVIO ROCHA .-. Viaduto Otávio Rocha, av. Borges de Medeiros - Centro Histórico .-. Via urbana</option><option>9002 PRAÇA MARCELLO DIHL FEIJÓ .-. R. Rimolo Biágio, 100 - Ipanema, Porto Alegre - RS, 91760-024 .-. Praça / Parque</option><option>1052 PRAÇA DALTRO FILHO .-. Rua Demétrio Ribeiro, 1163 .-. Praça / Parque</option><option>146 LOJA - ARRECADAÇÃO SMF .-. Tv. Mário Cinco Paus, 856-930 - Centro Histórico .-. Repartição pública</option><option>1053 PRAÇA CONDE DE PORTO ALEGRE .-. Praça Conde de Porto Alegre, 40 .-. Praça / Parque</option><option>1055 PRAÇA DOM SEBASTIÃO .-. Av. Independencia .-. Praça / Parque</option><option>1077 PRAÇA NELÇO SANGOI .-. R. Antonio Carlos Guimarães, 149 - Cidade Baixa, Porto Alegre - RS, 90050-200 .-. Praça / Parque</option><option>CB 1 Castelo Branco .-. Avenida Castelo Branco, 6247 - Farrapos, Porto Alegre - RS, Brasil .-. Repartição pública</option><option>CB 10 Campo Nova Brasilía .-. Rua Aderbal Rocha de Fraga, 235 - Sarandi, Porto Alegre - RS, Brasil .-. Repartição pública</option><option>CB 11A Cristal .-. Av. Icaraí, 1531 - Cristal, Porto Alegre - RS, 90810-010 .-. Repartição pública</option><option>CB 11B Icaraí .-. Av. Icaraí, 1241 - Cristal, Porto Alegre - RS, 90810-000 .-. Repartição pública</option><option>CB 12 Praia de Belas .-. WQQ7+CJ Praia de Belas, Porto Alegre - RS .-. Repartição pública</option><option>CB 13 Edvaldo Pereira Paiva .-. Av. Edvaldo Pereira Paiva, 771 - Praia de Belas, Porto Alegre - RS, 90110-060 .-. Repartição pública</option><option>CB 14 Arroio Dilúvio .-. Av. Ipiranga, 1337 - Praia de Belas, Porto Alegre - RS, 90160-093 .-. Repartição pública</option><option>CB 15 Dezessete de Junho .-. R. Dezessete de Junho, 947 - Menino Deus, Porto Alegre - RS, 90110-170 .-. Repartição pública</option><option>CB 16 Rótula das Cuias .-. Av. Edvaldo Pereira Paiva, 16 - Praia de Belas, Porto Alegre - RS, 90110-060 .-. Repartição pública</option><option>CB 17 Siqueira Campos .-. R. Siqueira Campos, 300 - Centro Histórico, Porto Alegre - RS, 90020-006 .-. Repartição pública</option><option>CB 18 Carlos Chagas .-. Av. Mauá, 1825 - Centro Histórico, Porto Alegre - RS, 90030-080 .-. Repartição pública</option><option>CB 2 Farrapos .-. Avenida Castelo Branco, 5183 - Farrapos, Porto Alegre - RS, Brasil .-. Repartição pública</option><option>CB 3 Voluntários da Pátria .-. R. Voluntários da Pátria, 2822 - São Geraldo, Porto Alegre - RS, 90230-010 .-. Repartição pública</option><option>CB 4 Navegantes .-. Ac. Um - Navegantes, Porto Alegre - RS, 90230-010 .-. Repartição pública</option><option>CB 5 Trezentos e Dois .-. Alameda Trezentos e Dois, 59 - Farrapos, Porto Alegre - RS, 90250-600 .-. Repartição pública</option><option>CB 6 Anchieta .-. Avenida dos Estados, 2905 - São João, Porto Alegre - RS, Brasil .-. Repartição pública</option><option>CB 8 Vila Farrapos .-. R. Adelino Machado de Souza, 298-252 - Farrapos, Porto Alegre - RS, 90245-020 .-. Repartição pública</option><option>CB 9 Sarandi .-. 2VJ6+QHP Porto Alegre, RS .-. Repartição pública</option><option>CB Asa Branca .-. R. Jorge Valmor Gonçalves Teixeira, 573 - Sarandi, Porto Alegre - RS, 91140-503 .-. Repartição pública</option><option>CB Santa Terezinha .-. R. Dr. Olinto de Oliveira, 142-76 - Santana, Porto Alegre - RS, 90040-250 .-. Repartição pública</option><option>CB Silvio Brum .-. XRXH+54M Porto Alegre, RS .-. Repartição pública</option><option>CB Trincheira Ceará .-. 2R36+G59 Porto Alegre, RS .-. Repartição pública</option><option>CB Vila Minuano .-. 2V56+P4Q Porto Alegre, RS .-. Repartição pública</option><option>EBAP 03 São Pedro .-. Av. São Pedro, 1 - São Geraldo .-. Repartição pública</option><option>ETE São João Navegantes .-. Alameda três, 159 - Farrapos .-. Repartição pública</option><option>732 US DOMENICO FEOLI .-. Rua Domênico Feoli, 127 .-. Estabelecimentos de saúde</option><option>1202 SMIM - SECRETARIA .-. Avenida Borges de Medeiros, 2244 .-. Repartição pública</option><option>1080 TERMINAL SALGADO FILHO .-. Av. Senador Salgado Filho 327, Porto Alegre - RS .-. Terminal de ônibus</option><option>1269 TERMINAL RUI BARBOSA .-. Av. Júlio de Castilhos, 235 - Centro Histórico, Porto Alegre - RS, 90030-001 .-. Terminal de ônibus</option><option>CONFEITARIA ROCCO .-. Rua Riachuelo 1576 - Centro Histórico .-. Repartição pública</option><option>1040 LARGO ZUMBI DOS PALMARES .-. Travessa do Carmo, 126 .-. Repartição pública</option><option>4011 PRAÇA CÔNEGO ALFREDO ODY .-. Rua Mario Leitão .-. Praça / Parque</option><option>4048 PRAÇA CRISTO REDENTOR .-. Rua Visconde de Macaé, 138 - Cristo Redentor .-. Praça / Parque</option><option>1056 PRAÇA DOM FELICIANO .-. Rua Professor Annes Dias - Centro Histórico, Porto Alegre - RS, Brasil .-. Praça / Parque</option><option>432 UBS VILA JARDIM .-. Rua Nazaré, 570 .-. Estabelecimentos de ensino</option><option>4410 PARQUE ARARIGBOIA .-. Parque Municipal Ararigboia - Rua Saicã - Petrópolis .-. Praça / Parque</option><option>4410 PARQUE ARARIGBOIA .-. Rua Saicã, 06 .-. Praça / Parque</option><option>604 E.M.E.F. JOÃO GOULART .-. Rua João Luiz Pufal, 100 .-. Estabelecimento de ensino</option><option>BORGES X SALGADO .-. Av. Senador Salgado Filho, 500 - Centro Histórico, Porto Alegre - RS .-. Via urbana</option><option>RUA DA CONCEIÇÃO, EMBAIXO DA ANTIGA PASSARELA DA RODOVIÁRIA .-. R. da Conceição, 117 - Centro Histórico, Porto Alegre .-. Praça / Parque</option><option>001 CGGM COMANDO GERAL GUARDA MUNICIPAL .-. Rua João Neves Da Fontoura , 91 .-. Repartição pública</option><option>003 SETRAN - SETOR DE TRANSPORTES .-. Rua Conde D'eu, 12 .-. Repartição pública</option><option>004 ACADEMIA DA GUARDA MUNICIPAL .-. Rua Dª Leonor, 340 .-. Repartição pública</option><option>005 CEIC - CENTRO INTEGRADO DE COMANDO .-. Rua João Neves Da Fontoura , 91 .-. Repartição pública</option><option>006 SSE SETOR DE SEGURANÇA ELETRÔNICA .-. Rua Olavo Bilac, 541 .-. Outros</option><option>007 EAPC EQUIPE DE AÇÕES PREVENTIVAS E COMUNITÁRIAS DA GUARDA MUNICIPAL .-. Rua Domingos Crescêncio , 868 .-. Repartição pública</option><option>008 EFEGM ESCOLA DE FORMAÇÃO E ENSINO DA GUARDA MUNICIPAL .-. Rua Dª Leonor, 340 .-. Outros</option><option>009 SAC SETOR DE ARMAMENTO E COMUNICAÇÃO .-. Rua Dª Leonor, 340 .-. Repartição pública</option><option>014 CÂMARA MUNICIPAL .-. Avenida Loureiro da Silva, 255 .-. Repartição pública</option><option>051 BASE SAMU RESTINGA .-. Rua Alvaro Difini, 3143 .-. Outros</option><option>052 BASE SAMU BELÉM NOVO .-. Rua Florencio Faria, 195 .-. Outros</option><option>054 ESPLANADA RESTINGA .-. Estrada João Antonio Da Silveira, 1969 .-. Repartição pública</option><option>055 ORLA DO LAMI .-. Beco Beira Rio - Lami .-. Via urbana</option><option>056 INSTITUTO FEDERAL .-. Rua Alberto Hoffmann, 285 .-. Estabelecimento de ensino</option><option>056 INSTITUTO FEDERAL .-. Rua Alberto Hoffmann, 285 .-. Repartição pública</option><option>1001 PARQUE FARROUPILHA .-. Parque Farroupilha .-. Praça / Parque</option><option>063 PORTO SECO .-. Avenida Plínio Kroeff, 1055 - Costa E Silva, Porto Alegre - RS, Brasil .-. Associação/sindicato</option><option>069 CECOVE - CENTRO COM. VILA ELIZABETH .-. Rua Paulo Gomes de Oliveira, 200 .-. Repartição pública</option><option>081 BASE SAMU LOMBA DO PINHEIRO .-. Avenida João De Oliveira Remião, 4444 .-. Outros</option><option>091 ORLA DE IPANEMA .-. Avenida Guaíba, 204 .-. Via urbana</option><option>095 TERRENO DA PONTA GROSSA .-. Estrada Retiro Da Ponta Grossa .-. Terreno baldio</option><option>096 TERMINAL DE ÔNIBUS BELEM VELHO .-. Rua João Couto,299 .-. Estabelecimentos de saúde</option><option>1000 ROMU .-. Rua Dona Leonor,340 .-. Repartição pública</option><option>1002 PARQUE MARINHA DO BRASIL .-. Avenida Borges de Medeiros, 2493 .-. Praça / Parque</option><option>1003 ORLA DO GUAÍBA .-. Avenida Edvaldo Pereira Paiva .-. Via urbana</option><option>1004 PRAÇA IBERÊ CAMARGO .-. Rua Luiz Carlos pinheiro Cabral, 20 .-. Praça / Parque</option><option>1005 PRAÇA SANTA CATARINA .-. Rua BARBEDO .-. Praça / Parque</option><option>1006 PRAÇA ESTADO DE ISRAEL .-. Praça Estado de Israel - Passagem Um - Menino Deus .-. Praça / Parque</option><option>1007 PRAÇA ITÁLIA .-. Praça Itália - Avenida Borges de Medeiros - Menino Deus .-. Praça / Parque</option><option>1008 PRAÇA ROTARY .-. Praça Rotary - Avenida Borges de Medeiros - Menino Deus .-. Praça / Parque</option><option>1009 PRAÇA BRIGADEIRO SAMPAIO .-. Rua dos Andradas, 230 .-. Praça / Parque</option><option>101 PAÇO MUNICIPAL .-. Praça Montevideo, 10 .-. Repartição pública</option><option>1013 PARQUE MOINHOS DE VENTO .-. Parque Moinhos de Vento (Parcão) - Rua Comendador Caminha .-. Praça / Parque</option><option>1012 PARQUE MASCARENHAS DE MORAES .-. Parque Mascarenhas de Moraes - Rua Irmão Félix Roberto .-. Praça / Parque</option><option>1014 PRAÇA FLORIDA .-. Praça Bartolomeu de Gusmão .-. Praça / Parque</option><option>1015 PARQUE MAURÍCIO SIROSTSKY SOBRINHO .-. Avenida Loureiro da Silva .-. Praça / Parque</option><option>1016 MONUMENTO A BENTO GONÇALVES .-. Monumento a Bento Gonçalves - Av. João Pessoa - Farroupilha .-. Praça / Parque</option><option>1017 MONUMENTO AO EXPEDICIONÁRIO .-. Av. José Bonifácio, 1015 - Cidade Baixa .-. Praça / Parque</option><option>1018 ESPELHO D'AGUA - PARQUE FARROUPILHA .-. Av. José Bonifácio, 1015 - Cidade Baixa .-. Praça / Parque</option><option>1019 VIADUTO IMPERATRIZ LEOPOLDINA .-. Viaduto Imperatriz Leopoldina - Avenida João Pessoa .-. Via urbana</option><option>102 ED INTENDENTE JOSÉ MONTAURY .-. Rua Siqueira Campos, 1300 .-. Repartição pública</option><option>1021 MURO DA AV. MAUÁ .-. Avenida Mauá .-. Via urbana</option><option>1022 PRAÇA DA MATRIZ .-. Praça Mal. Deodoro - Centro Histórico .-. Praça / Parque</option><option>1023 VIADUTO LOUREIRO DA SILVA .-. Viaduto José Loureiro da Silva - Centro Histórico .-. Via urbana</option><option>ENTREGA MORADIAS HUMAITÁ .-. Rua Dona Teodora, 1409 .-. Associação/sindicato</option><option>1025 VIADUTO DOS AÇORIANOS .-. Av. Borges De Medeiros, 1350 .-. Via urbana</option><option>1026 TEATRO SÃO PEDRO .-. Teatro São Pedro - Praça Marechal Deodoro - Centro Histórico .-. Repartição pública</option><option>1027 LARGO GLÊNIO PERES .-. Largo Jornalista Glênio Péres, Porto Alegre .-. Praça / Parque</option><option>1028 PRAÇA PINHEIRO MACHADO .-. Avenida Brasil, 600 - Navegantes .-. Praça / Parque</option><option>1029 PRAÇA LAURENTINO ZOTTIS .-. Rua Mucio Teixeira, 33 - Menino Deus .-. Praça / Parque</option><option>103 aguardo .-. Rua Doutor João Inácio, 549 .-. Repartição pública</option><option>1030 VIADUTO DOM PEDRO I .-. Viaduto Dom Pedro I - Praia de Belas, Porto Alegre .-. Via urbana</option><option>1031 PRAÇA JÚLIO MESQUITA .-. Passagem General Salustiano-Presidente João Goularte, 22 .-. Praça / Parque</option><option>1032 PRAÇA JULIO ANDREATTA .-. AV BENJAMIN CONSTANT .-. Praça / Parque</option><option>463 CEMITÉRIO MUNICIPAL SÃO JOÃO .-. Rua Ari Marinho, 297 .-. Cemitério</option><option>1034 SÍTIO DO LAÇADOR .-. Sítio do Laçador - Avenida dos Estados - São João .-. Repartição pública</option><option>1036 PRAÇA SPORT CLUB INTERNACIONAL .-. Praça Sport Club Internacional - Rua Jornal do Brasil - Azenha .-. Praça / Parque</option><option>1038 PRAÇA RÁDIO GAÚCHA .-. Rua Saldanha Marinho, 42 - Menino Deus .-. Praça / Parque</option><option>104 PINACOTECA RUBEN BERTA .-. Rua Duque De Caxias, 973 .-. Repartição pública</option><option>1262 ORLA MOACYR SCLIAR .-. Avenida Edvaldo Pereira Paiva, 265 .-. Via urbana</option><option>1041 PRAÇA SÃO GERALDO .-. Av. Guido Mondim, 964 - São Geraldo .-. Praça / Parque</option><option>1042 PRAÇA RECANTO DA FLORESTA .-. Praça Recanto da Floresta - Rua Ramiro Barcelos - Floresta .-. Praça / Parque</option><option>1044 PRAÇA ALFANDEGA .-. Rua Siqueira Campos .-. Praça / Parque</option><option>1045 PRAÇA REVOLUÇÃO FARROUPILHA .-. Av. Mauá, 1200 - Centro Histórico .-. Praça / Parque</option><option>1046 TERRENO DA JOÃO INÁCIO .-. Rua João Inácio, 247 .-. Terreno baldio</option><option>1047 VIADUTO ILDO MENEGHETTI .-. Av Vasco Da Gama .-. Via urbana</option><option>1048 MORRO RICALDONE .-. Rua General Neto .-. Repartição pública</option><option>1049 PRAÇA MAURÍCIO CARDOSO .-. Rua Tobias Da Silva .-. Praça / Parque</option><option>105 US FRADIQUE VIZEU .-. Rua Frederico Mentz, 374 .-. Estabelecimentos de saúde</option><option>1050 PRAÇA OTÁVIO ROCHA .-. Avenida Otávio Rocha .-. Praça / Parque</option><option>1051 PRAÇA Á CATÓLICA .-. Av. Borges De Medeiros .-. Praça / Parque</option><option>931 CEMITÉRIO PARQUE BELEM .-. Rua Doutor Vergara, 5205 .-. Cemitério</option><option>1054 PRAÇA ARGENTINA .-. Praça Raul Pilla, 10 - Centro Histórico .-. Praça / Parque</option><option>1010 PRAÇA GARIBALDI .-. Praça Garibaldi - Cidade Baixa .-. Praça / Parque</option><option>1057 VIADUTO PINHEIRO BORDA .-. Avenida Pinheiro Borda, 85 - Cristal .-. Via urbana</option><option>1058 PRAÇA BERTA STAROSTA .-. R Vasco Da Gama,320 .-. Praça / Parque</option><option>1059 PRAÇA PIRATINI .-. Av. João Pessoa,1739 .-. Praça / Parque</option><option>106 -NÚCLEO DE DISTRIBUIÇÃO DE MEDICAMENTO - NDM .-. Rua Frederico Mentz, 1315 .-. Outros</option><option>1060 PRAÇA RAUL PILLA .-. Avenida João Pessoa,9 .-. Praça / Parque</option><option>1061 PRAÇA JOÃO PAULO I .-. Avenida Jerônimo De Ornelas, 507 .-. Praça / Parque</option><option>1062 PRAÇA PROFESSORA OLGA GUTIERRES .-. Rua Hipolito Da Costa,226 .-. Praça / Parque</option><option>1063 PRAÇA MAJOR JOAQUIM DE QUIEROS .-. Avenida Jerônimo De Ornelas, 252 .-. Praça / Parque</option><option>1064 PRAÇA DOUTOR JULIO DE ARAGÃO BOZANO .-. Travessa Ferreira De Abreu,149 .-. Praça / Parque</option><option>1065 MERCADO PUBLICO .-. Largo Jornalista Glênio Péres .-. Estabelecimento comercial</option><option>1066 TERMINAL TRIANGULO .-. Av. Assis Brasil, 4320 .-. Terminal de ônibus</option><option>1067 E.S. ACADEMICOS DA ORGIA .-. Av. Ipiranga , 2741 .-. Outros</option><option>1068 S.R.B.C. FIDALGOS E ARISTOCRATAS .-. Av. Ipiranga , 2485 .-. Outros</option><option>1069 S.R.B. IMPERADORES DO SAMBA .-. Av. Padre Cacique ,1567 .-. Outros</option><option>107 CINE TEATRO CAPITÓLIO .-. Rua Demétrio Ribeiro, 1085 .-. Repartição pública</option><option>1070 S.R.B.C. PRAIANA .-. Av. Padre Cacique,1559 .-. Outros</option><option>1071 BANDA DA SALDANHA .-. Av. Padre Cacique,1355 .-. Outros</option><option>1072 TERMINAL PAROBÉ .-. Praça Pereira Parobé .-. Terminal de ônibus</option><option>1073 REFÚGIO DO LAGO .-. Parque Farroupilha .-. Praça / Parque</option><option>1074 VIADUTO TIRADENTES .-. Viaduto Tiradentes - Rio Branco, Porto Alegre - RS, Brasil .-. Via urbana</option><option>1204 GINÁSIO TESOURINHA .-. Avenida Érico Verissimo, 105 .-. Estádio esportivo</option><option>1076 MARQUESA DE SEVIGNÉ .-. Rua Gen. Lima e Silva, 1 .-. Praça / Parque</option><option>1079 PRAÇA DO SESI .-. R. Bambas da Orgia, 30 - Farrapos, Porto Alegre - RS .-. Praça / Parque</option><option>1081 PRAÇA PRINCESA ISABEL .-. Av. Princesa Isabel 45, Azenha, Porto Alegre - RS .-. Praça / Parque</option><option>109 PARQUE MASCARANHAS DE MORAES - ADMINISTRAÇÃO .-. Avenida José Aloísio Filho, 570 .-. Praça / Parque</option><option>110 E.M.E.I. HUMAITÁ .-. Rua Doutor Caio Brandão De Mello, 81 .-. Estabelecimento de ensino</option><option>1100 ORLA .-. A. Edvaldo Pereira Paiva, 200 .-. Via urbana</option><option>111 E.M.E.F. VEREADOR ANTÔNIO GIÚDICE .-. Rua Doutor Caio Brandão De Mello, 115 .-. Estabelecimento de ensino</option><option>112 E.M.E.I. JP PATINHO FEIO .-. Avenida Brasil, 593 .-. Estabelecimento de ensino</option><option>113 E.M.E.I. JP PASSARINHO DOURADO .-. Avenida Guido Mondim, 973 .-. Estabelecimento de ensino</option><option>114 ARQUIVO PÚBLICO MUNICIPAL .-. Rua Sete De Setembro, 1123 .-. Repartição pública</option><option>115 EMEF PORTO ALEGRE .-. Rua Washington Luiz, 203 .-. Estabelecimento de ensino</option><option>116 E.M.E.I. JP MEU AMIGUINHO .-. Rua São Carlos, 636 .-. Estabelecimento de ensino</option><option>117 CASA TORELLY .-. Avenida Independência, 453 .-. Repartição pública</option><option>118 CASA GODÓY .-. Avenida Independência, 456 .-. Repartição pública</option><option>119 E.M.E.I. JP CIRANDINHA .-. Rua 24 De Outubro, 211 .-. Estabelecimento de ensino</option><option>1200 ÁREA CENTRO .-. Rua João Neves Da Fontoura , 91 .-. Repartição pública</option><option>12000 COMANDO REGIONAL CENTRO - CRC .-. Rua José Bonifácio, 208 .-. Repartição pública</option><option>12000 COMANDO REGIONAL CENTRO - CRC .-. Rua José Bonifácio, 208 .-. Repartição pública</option><option>1203 SEDE MARINHA .-. Avenida Borges de Medeiros, 2713 .-. Repartição pública</option><option>1205 SME SERP ÉRICO VERISSIMO .-. Avenida Érico Verissimo, 843 .-. Outros</option><option>1206 CENTRO MUNICIPAL DE CULTURA .-. Avenida Érico Verissimo, 307 .-. Repartição pública</option><option>1207 AUDITÓRIO ARAÚJO VIANA .-. Avenida Osvaldo Aranha, 685 .-. Outros</option><option>1208 TEATRO DE CÂMARA TÚLIO PIVA .-. Rua da República, 575 .-. Repartição pública</option><option>1209 MUSEU JOAQUIM FELIZARDO .-. Rua João Alfredo, 582 .-. Estabelecimentos de saúde</option><option>121 CRIP HUMAITA NAVEGANTES .-. Rua Cairú, 721 .-. Repartição pública</option><option>1210 DEPÓSITO SMDET .-. Travessa do Carmo, 120 .-. Repartição pública</option><option>1211 EPAT SMS .-. Rua Santana, 175 .-. Repartição pública</option><option>1212 ANFITEATRO PÔR-DO-SOL .-. Avenida Edvaldo Pereira Paiva, 829 .-. Praça / Parque</option><option>1213 UVP - UNIDADE DE VEÍCULOS PRÓPRIOS .-. Rua Marcílio Dias, 1396 .-. Repartição pública</option><option>1214 SMS - SECRETARIA .-. Avenida João Pessoa, 325 .-. Repartição pública</option><option>1215 ESTUR - ESCRITÓRIO DE TURISMO .-. Travessa do Carmo, 84 .-. Repartição pública</option><option>1216 EMEI JP CANTINHO AMIGO - PRAÇA GARIBALDI .-. Praça Garibaldi .-. Praça / Parque</option><option>1217 EMEI TIO BARNABÉ .-. Rua Oto Ernest Meier, 55 .-. Estabelecimento de ensino</option><option>1219 CENTRAL DE VEÍCULOS .-. Avenida Loureiro da Silva, 255 .-. Repartição pública</option><option>122 UBS DIRETOR PESTANA .-. Rua Dona Teodora, 1406 .-. Estabelecimentos de saúde</option><option>1220 ALMOXARIFADO CENTRAL .-. Rua Santana, 175/ Rua Olavo Bilac 542 .-. Repartição pública</option><option>1222 SMAMS MARINHA .-. Avenida Borges de Medeiros, 2035 .-. Repartição pública</option><option>1223 DEFESA CIVIL .-. Rua Múcio Teixeira, 33 .-. Repartição pública</option><option>1225 CASA SANTA TEREZINHA .-. Rua Santa Terezinha, 711 .-. Repartição pública</option><option>1226 ADMINISTRAÇÃO PARQUE FARROUPILHA .-. Parque Farroupilha .-. Praça / Parque</option><option>1227 DEP - DEPARTAMENTO DE ESGOTOS PLUVIAIS .-. Rua General Lima e Silva, 972 .-. Repartição pública</option><option>1229 CAPS I - CASA HARMONIA .-. Avenida Loureiro da Silva, 1955 .-. Estabelecimentos de saúde</option><option>1229 CAPS I - CASA HARMONIA .-. Avenida Loureiro da Silva, 1955 .-. Estabelecimentos de saúde</option><option>123 CS NAVEGANTES TÉRREO .-. Av. Pres. Franklin Roosevelt, 75 - NavegantesPorto Alegre - RS, 90230-000 .-. Estabelecimentos de saúde</option><option>1230 SECRETARIA MUNICIPAL DE SAÚDE .-. Avenida João Pessoa, 325 .-. Outros</option><option>1231 SECRETARIA MUNICIPAL DE SAÚDE .-. Avenida João Pessoa, 325 .-. Outros</option><option>1232 CAIS MENTAL .-. Avenida José Bonifácio, 71 .-. Estabelecimentos de saúde</option><option>1233 PARQUE RAMIRO SOUTO .-. Avenida Osvaldo Aranha, 685 .-. Praça / Parque</option><option>1237 EMAC .-. Avenida Venâncio Aires, 67 .-. Repartição pública</option><option>1238 DMLU .-. Avenida da Azenha, 631 .-. Repartição pública</option><option>1239 HOSPITAL DE PRONTO SOCORRO .-. Largo Theodoro Herltz, s/n .-. Estabelecimentos de saúde</option><option>124 UBS FARRAPOS .-. Rua Graciano Camozzato, 185 .-. Estabelecimentos de saúde</option><option>1240 DMLU ALMOXARIFADO .-. Rua freitas e Castro, 95 .-. Repartição pública</option><option>1241 VIGILÂNCIA SANITÁRIA .-. Avenida Padre Cacique, 372 .-. Repartição pública</option><option>1242 CENTRO SAÚDE MODELO .-. Avenida Jerônimo de Ornelas, 55 .-. Estabelecimentos de saúde</option><option>1243 CASA DOS CONSELHOS .-. Avenida João Pessoa, 1110 .-. Repartição pública</option><option>1244 GMP GERÊNCIA DE MATERIAL E PATRIMÔNIO .-. Rua Giordano Bruno, 335 .-. Repartição pública</option><option>1245 CMET PAULO FREIRE .-. Rua Santa Terezinha, 572 .-. Estebelecimento de ensino</option><option>1246 DEPÓSITO FASC .-. Rua Olavo Bilac, 542 .-. Repartição pública</option><option>1247 DEPÓSITO SMED .-. Rua Olavo Bilac, 542 .-. Repartição pública</option><option>1248 CENTRO CULTURAL USINA DO GASÔMETRO - .-. Avenida Presidente João Goulart, 551 .-. Estabelecimentos de saúde</option><option>1249 ABRIGO DA FAMILIA .-. Rua Augusto Pestana, 200 .-. Casa de Abrigo e Assistência</option><option>125 SMED ANDRADAS .-. Rua Dos Andradas, 680 .-. Repartição pública</option><option>1250 COMPLEXO OLAVO BILAC .-. Rua Olavo Bilac, 542 .-. Repartição pública</option><option>1252 ABRIGO MUNICIPAL MARLENE .-. Avenida Getúlio Vargas, 40 .-. Casa de Abrigo e Assistência</option><option>1253 CENTRO POP I .-. Avenida João Pessoa, 2384 .-. Estabelecimentos de saúde</option><option>1254 CRAS CENTRO .-. Rua Alm. Álvaro Alberto da Mota e Silva .-. Casa de Abrigo e Assistência</option><option>1255 CREAS ILHAS HUMAITA E NAVEGANTES .-. Travessa do Carmo, 50 .-. Outros</option><option>1256 RESERVA TECNICA DO MUSEU JOAQUIM FELIZARDO .-. Rua João Alfredo, 582 .-. Estabelecimentos de saúde</option><option>1257 CENTRO DE TRIAGEM .-. Travessa Pesqueiro, 93 .-. Repartição pública</option><option>1258 CTMR8 .-. Rua Fernando Machado 657 .-. Repartição pública</option><option>1260 JUNTA MILITAR .-. Rua Gen. João Manoel, 157 .-. Repartição pública</option><option>1261 FASC .-. Avenida Ipeiranga, 310 .-. Repartição pública</option><option>1263 SEDE ESEGM .-. Rua Olavo Bilac, 542 .-. Repartição pública</option><option>1264 CENTRO LOGÍSTICO DE MEDICAMENTOS ESPECIAIS .-. Avenida da Azenha, 295 .-. Repartição pública</option><option>1265 SMDS - SECRETARIA MUNICIPAL DE DESENVOLVIMENTO SOCIAL .-. Av. João Pessoa, 1105 - Farroupilha, Porto Alegre - RS, 90040-001 .-. Repartição pública</option><option>1266 CAPS II LESTE NORDESTE E LOMBA .-. R. São Manoel, 285 - Rio Branco .-. Estabelecimentos de saúde</option><option>1268 CAPS AD III PERNAMBUCO .-. Rua Dr. Caio Brandão de Mello, 250 - Bairro Humaitá .-. Estabelecimentos de saúde</option><option>127 CS SANTA MARTA .-. Rua Capitão Montanha, 27 .-. Estabelecimentos de saúde</option><option>129 UBS MARIO QUINTANA .-. Rua Seiscentos e noventa e oito, 106 .-. Estabelecimentos de saúde</option><option>130 E.M.E.I. J P PICA PAU AMARELO .-. Rua Coronel Fernando Machado .-. Estabelecimento de ensino</option><option>1300 ROF FISCALIZAÇÃO .-. Rua João Neves Da Fontoura , 91 .-. Repartição pública</option><option>131 FARMÁCIA NAVEGANTES .-. Avenida Presidente F Roosevelt, 75 .-. Repartição pública</option><option>132 CRAS ILHAS .-. R. Dr. Salomão Pires Abrahão Arquipélago .-. Casa de Abrigo e Assistência</option><option>133 E.M.E.I. ILHA DA PINTADA .-. Rua Garruchos, 129 .-. Estabelecimento de ensino</option><option>134 UBS ILHA DA PINTADA .-. Avenida Pres. Vargas, 397 .-. Estabelecimentos de saúde</option><option>135 UBS ILHA DOS MARINHEIROS .-. Rua Santa Rita De Cassia .-. Estabelecimentos de saúde</option><option>136 PQ MOINHO DE VENTO .-. Rua Comendador Caminha, 342 .-. Praça / Parque</option><option>137 PINACOTECA ALDO LOCATELLI .-. Praça Montevideo, 10 .-. Repartição pública</option><option>736 E.M.E.I. JARDIM LEOPOLDINA .-. Rua Trinta e Nove, 149 Porto Alegre-RS .-. Estabelecimento de ensino</option><option>138 ALBERGUE MUNICIPAL .-. Rua Comendador Azevedo, 215 .-. Repartição pública</option><option>139 OFICINA GERAÇÃO DE RENDA .-. Avenida Mariante, 500 .-. Estabelecimento comercial</option><option>140 CRAS VILA FARRAPOS .-. Rua Maria Trindade, 115 .-. Casa de Abrigo e Assistência</option><option>141 EQUIPE DE MATERIAL E PATRIMONIO .-. Avenida Cristóvão Colombo, 167 .-. Repartição pública</option><option>142 PRÓPRIO SMS .-. Rua Frederico Mentz, 1824 .-. Repartição pública</option><option>143 COLEÇÃO ZELMANOWICZ .-. Praça Montevideo, 10 .-. Repartição pública</option><option>145 CAR ILHA .-. Praça Salomão Pires .-. Repartição pública</option><option>148 RESERVA TÉCNICA PINACOTECA ALDO LOCATELLI .-. Praça Montevideo, 10 .-. Repartição pública</option><option>149 BIBLIOTECA ECOLÓGICA Mª DINORA .-. Rua Comendador Caminha, 342 .-. Repartição pública</option><option>150 RESERVA TÉCNICA PINACOTECA RUBEN BERTA .-. Rua Duque De Caxias, 973 .-. Repartição pública</option><option>152 CENTRO POP II .-. Rua Gaspar Martins, 114 .-. Repartição pública</option><option>154 CAPS AD CÉU ABERTO .-. Rua Comendador Azevedo, 97 .-. Estabelecimentos de saúde</option><option>155 EMAT EQUIPE DE MATERIAIS DA SMS .-. Rua Frederico Mentz, 1315 fundos .-. Repartição pública</option><option>156 CENTRO POP III .-. Avenida França, 396 .-. Repartição pública</option><option>157 CAPS AD III .-. AV. Pernambuco. 1700 .-. Estabelecimentos de saúde</option><option>158 US ILHA DO PAVÃO .-. Rua A 45, Ilha do Pavão Arquipélago .-. Estabelecimentos de saúde</option><option>159 CS NAVEGANTES PISO SUPERIOR .-. Av. Pres. Franklin Roosevelt, 75 - NavegantesPorto Alegre - RS, 90230-000 .-. Estabelecimentos de saúde</option><option>189 SMED JOÃO MANOEL .-. Rua João Manoel,90 .-. Repartição pública</option><option>1892 SEDE DA GUARDA MUNICIPAL .-. Rua João Neves Da Fontoura , 91 .-. Repartição pública</option><option>190 CENTRO ADMINISTRATIVO MUNICIPAL .-. Rua General João Manoel, 157 .-. Repartição pública</option><option>199 CTMR1 .-. Av. Maranhão, 156 .-. Repartição pública</option><option>200 ÁREA CRUZEIRO .-. Rua Coelho Da Costa, 300 .-. Repartição pública</option><option>201 PACS .-. Rua Professor Manoel Lobato, 151 .-. Estabelecimentos de saúde</option><option>202 US MOAB CALDAS .-. Rua Moab caldas, 400 .-. Estabelecimentos de saúde</option><option>2024 PRAÇA MAURICIO ZADUCHLIVER .-. Rua Coelho Da Costa .-. Praça / Parque</option><option>2025 PRAÇA HAMILTON CHAVES .-. Rua Belmonte de Macedo .-. Praça / Parque</option><option>2026 PRAÇA ALEXANDRE ZÁCHIA .-. Avenida Chui, 146 .-. Praça / Parque</option><option>2027 PARQUE DO PONTAL .-. Avenida Padre Cacique, 2893 .-. Praça / Parque</option><option>2028 PRAÇA GUIA LOPES .-. Rua Praça Guia Lopes .-. Praça / Parque</option><option>203 EMEF EMILIO MEYER .-. Av Niterói, 472 - Medianeira Porto Alegre - RS .-. Estabelecimento de ensino</option><option>2031 PASSAGEM DE NÍVEL ENGº JOSÉ PORTELLA NUNES .-. Avenida Teresópolis, 2662 .-. Via urbana</option><option>204 EMEF MARTIN ARANHA .-. Rua Cônego Paulo Isidoro de Nadal, 144 .-. Estabelecimento de ensino</option><option>205 EMEF LOUREIRO DA SILVA .-. Avenida Capivari, 1508 .-. Estabelecimento de ensino</option><option>206 EMEEF ELISEU PAGLIOLI .-. Rua Butui, 221 .-. Estabelecimento de ensino</option><option>207 EMEF GABRIEL OBINO .-. Rua Engenheiro Ludolfo Boehl, 1402 .-. Estabelecimento de ensino</option><option>208 EMEF ARAMY SILVA .-. Rua Chico Pedro, 390 .-. Estabelecimento de ensino</option><option>209 UBS DIVISA .-. Rua Upamoroti, 735 .-. Estabelecimentos de saúde</option><option>2090 RESTAURANTE POPULAR - VILA CRUZEIRO .-. R. Dona Otília, 210 - Santa Tereza, Porto Alegre .-. Repartição pública</option><option>210 CAPS AD III SUL/CENTRO-SUL .-. Av Cavalhada, 1930 .-. Estabelecimentos de saúde</option><option>211 ANEXO UBS J CASCATA .-. Rua Martins De Carvalho, 109 .-. Estabelecimentos de saúde</option><option>212 EMEI OSMAR FREITAS .-. Rua Dona Otilia, 497 .-. Estabelecimento de ensino</option><option>213 CAPS AD CRUZEIRO .-. Rua Raul Moreira, 253 .-. Estabelecimentos de saúde</option><option>214 CAPS GCC CRUZEIRO .-. Av. Dr. Campos Velho, 1718 .-. Estabelecimentos de saúde</option><option>215 CRIP CRUZEIRO .-. Rua Mariano De Matos, 889 .-. Repartição pública</option><option>216 SOLAR PARAISO .-. Travessa Paraiso, 71 .-. Repartição pública</option><option>217 EMEI CAVALHADA .-. Rua Canela , 180 .-. Estabelecimento de ensino</option><option>218 CRAS CENTRO SUL .-. Rua Arroio Grande, 50 .-. Casa de Abrigo e Assistência</option><option>219 CRAS GLORIA .-. Rua Cel. Neves , 506 .-. Casa de Abrigo e Assistência</option><option>220 CRAS CRUZEIRO .-. Travessa Mato Grosso, 65 .-. Casa de Abrigo e Assistência</option><option>221 EMEI VILA TRONCO .-. Avenida Moab Caldas, 129 .-. Estabelecimento de ensino</option><option>222 CREAS GLORIA/CRUZ/CR .-. Rua General Gomes Carneiro, 481 .-. Outros</option><option>223 UBS SÃO GABRIEL .-. Rua Gilberto Jaime, 59 .-. Estabelecimentos de saúde</option><option>224 CRAS CRISTAL .-. Rua Curupaiti, 27. Cristal .-. Casa de Abrigo e Assistência</option><option>227 SMAM ZONA SUL .-. Avenida Wenceslau Escobar, 1980 .-. Repartição pública</option><option>228 DEP SUL .-. Avenida Copacabana, 1134 .-. Repartição pública</option><option>229 UBS S.VICENTE MARTIR .-. Rua Emília Perrone Fernandes, 110 .-. Estabelecimentos de saúde</option><option>230 AR 6 OSICOM .-. Rua Jaguari, 748 .-. Repartição pública</option><option>231 CTMR 5 .-. Rua Professor Oscar Pereira, 2603 .-. Repartição pública</option><option>233 CAR CENTRO SUL .-. Avenida Otto Niemeyer, 3204 .-. Repartição pública</option><option>234 CAR CRISTAL .-. Avenida Copacabana, 1134 .-. Repartição pública</option><option>235 GINASIO LUPI MARTINS .-. Avenida Arnaldo Bohrer, 320 .-. Estádio esportivo</option><option>237 UBS GLORIA .-. Avenida Professor Oscar Pereira, 3229 .-. Estabelecimentos de saúde</option><option>238 UBS ALTO ERECHIN .-. Rua Doutor Ney Cabral, 581 .-. Estabelecimentos de saúde</option><option>239 UBS CRISTAL .-. Rua Cruzeiro Do Sul, 2702 .-. Estabelecimentos de saúde</option><option>240 UBS CRUZEIRO .-. Avenida Capivari, 2020 .-. Estabelecimentos de saúde</option><option>242 UBS NONOAI .-. Rua Erechim, 985 .-. Estabelecimentos de saúde</option><option>243 CAPS II ALTOS DA GLÓRIA .-. Avenida Prof. Oscar Pereira, 3391 .-. Estabelecimentos de saúde</option><option>244 UBS ALPES .-. Estrada Dos Alpes, 671 .-. Estabelecimentos de saúde</option><option>245 UBS VILA GAUCHA .-. Rua Dona Maria, 60 .-. Estabelecimentos de saúde</option><option>246 CRIP GLÓRIA .-. Rua Cel. Neves , 506 .-. Repartição pública</option><option>249 UBS CRUZEIRO .-. Rua Dona Malvina, 195 Acesso A .-. Estabelecimentos de saúde</option><option>250 UBS S. TEREZA .-. Rua Dona Otilia, 05 .-. Estabelecimentos de saúde</option><option>251 UBS J. CASCATA .-. Rua Martins De Carvalho, 109 .-. Estabelecimentos de saúde</option><option>253 UBS SANTA ANITA .-. Rua Gregorio Da Fonseca, 98 .-. Estabelecimentos de saúde</option><option>257 COORDENAÇÃO DE DEFESA CIVIL .-. Rua Copacabana, 1096 .-. Repartição pública</option><option>258 SMAM ZONA SUL .-. Rua Wenceslau Escobar, 1980 .-. Repartição pública</option><option>259 UBS OSMAR FREITAS .-. Acesso Das Figueiras, 146 .-. Estabelecimentos de saúde</option><option>260 UBS GRACILIANO RAMOS .-. Rua É - Arlindo Nicolau Bertagnolli, 105 .-. Estabelecimentos de saúde</option><option>263 CAR SUL/CENTRO SUL .-. Avenida Otto Niemayer, 3261 .-. Repartição pública</option><option>266 SME CEGEB .-. Rua Cel. Neves , 506 .-. Repartição pública</option><option>1218 BASE DESATIVADA .-. Avenida Érico Verissimo, 1173 .-. Repartição pública</option><option>268 UBS Nª S GRAÇAS .-. Rua Diomário Moojen, 147 .-. Estabelecimentos de saúde</option><option>269 COROADOS .-. Rua Coroados, 983 .-. Repartição pública</option><option>300 ÁREA PARTENON .-. Rua Manoel Vitorino, 10 .-. Repartição pública</option><option>301 E.M.E.F. MARCÍRIO LOUREIRO .-. Rua Saibreira, 113 .-. Estabelecimento de ensino</option><option>302 E.M.E.I GIRAFINHA .-. Praça Jaime Teles, 26 .-. Estabelecimento de ensino</option><option>303 E.M.E.F. JUDITH M. DE ARAÚJO .-. Rua Saul Constantino, 10 .-. Estabelecimento de ensino</option><option>3032 PRAÇA DARCI AZAMBUJA - INTERCAP .-. Praça Darcí Azambuja .-. Praça / Parque</option><option>3033 PRAÇA CLIO FIORI DRUCK .-. Rua Dr. Telmo Vergara, 716 .-. Praça / Parque</option><option>3034 PRAÇA LEDA SCHNEIDER - INTERCAP .-. Praça Leda Schneider .-. Praça / Parque</option><option>3035 PRAÇA UNIVERSIDADE - INTERCAP .-. Praça Universiade .-. Praça / Parque</option><option>3036 PRAÇA IVO JOHASON - INTERCAP .-. Rua Marcone, 123 .-. Praça / Parque</option><option>3037 PRAÇA DR SAMIR SQUEFF - INTERCAP .-. Rua Capitão Pedro Werlang, 145 .-. Praça / Parque</option><option>3038 VIADUTO SÃO JORGE .-. Avenida Dr. Salvador França, 120 .-. Via urbana</option><option>3039 PRAÇA TRISTÃO SUCUPIRA VIANA .-. Rua Euclídes Miranda, 255 .-. Praça / Parque</option><option>304 E.M.E.F. AMÉRICA .-. Rua Padre Ângelo Costa, 175 .-. Estabelecimento de ensino</option><option>3040 PRAÇA CEL. TRISTÃO JOSÉ DE FRAGA .-. Rua Padre Todesco, 220 .-. Praça / Parque</option><option>3041 PRAÇA JOSUÉ RIBAS MARTINS .-. Praça Josué Ribas Martins .-. Praça / Parque</option><option>305 CTMR 4 .-. Rua Manuel Vitorino, 10 .-. Repartição pública</option><option>306 UBS VILA VARGAS .-. Rua Padre Ângelo Costa, 9 .-. Estabelecimentos de saúde</option><option>307 UBS SANTO ALFREDO .-. Rua Santo Alfredo, 37 .-. Estabelecimentos de saúde</option><option>308 E.M.E.F. MORRO DA CRUZ .-. Rua Santa Teresa, 541 .-. Estabelecimento de ensino</option><option>309 ARQUIVO HISTÓRICO MOISÉS VELHINHO .-. Avenida Bento Gonçalves, 1129 .-. Repartição pública</option><option>310 UBS ERNESTO ARAUJO .-. Rua Ernesto Araujo, 443 .-. Estabelecimentos de saúde</option><option>311 UBS CERES .-. Avenida Ceres, 329 .-. Estabelecimentos de saúde</option><option>313 PSF CAMPO DA TUCA .-. Rua Coronel Rodrigues Sobral 958 .-. Repartição pública</option><option>314 UBS MORRO DA CRUZ .-. Trav. 25 De Julho, 26 .-. Estabelecimentos de saúde</option><option>315 UBS MURIALDO .-. Avenida Bento Gonçalves, 3722 .-. Estabelecimentos de saúde</option><option>317 EMEI WALTER SILBER .-. Rua Frei Clemente, 150 .-. Estabelecimento de ensino</option><option>318 EMEI PADRE ÂNGELO COSTA .-. Rua Primeiro De Março, 300 .-. Estabelecimento de ensino</option><option>319 EMEI MAMÃE CORUJA .-. Avenida Bento Gonçalves, 642 .-. Estabelecimento de ensino</option><option>320 E.M.E.F SALOMÃO WAITNICK .-. Rua Pedro Werlang, 1011 .-. Estabelecimento de ensino</option><option>321 SUB. PREFEITURA .-. Avenida Bento Gonçalves, 6670 .-. Repartição pública</option><option>322 E.M.E.I. JD BENTO GONÇALVES .-. Rua Sargento-Expedicionário Geraldo Santana, 40 .-. Estabelecimento de ensino</option><option>323 ANEXO ARQUIVO EPAC .-. Avenida Bento Gonçalves, 1129 .-. Repartição pública</option><option>324 SMAM ZONAL LESTE .-. Rua Francisco Braga, 300 .-. Repartição pública</option><option>325 US PITORESCA .-. Rua Pitoresca, 591 .-. Estabelecimentos de saúde</option><option>327 CRAS PARTENON .-. Rua Barão Do Amazonas, 1959 .-. Casa de Abrigo e Assistência</option><option>328 UBS APARÍCIO BORGES .-. Rua São Miguel, 487 .-. Estabelecimentos de saúde</option><option>329 UBS BANANEIRAS .-. Avenida Cel Aparício Borges, 2494 .-. Estabelecimentos de saúde</option><option>330 CREAS PARTENON .-. Rua Luis de Camões, 410 .-. Outros</option><option>331 UBS MARIA DA CONCEIÇÃO .-. Rua Mário De Artagão, 13 .-. Estabelecimentos de saúde</option><option>332 UBS SÃO CARLOS .-. Avenida Bento Gonçalves, 6670 .-. Estabelecimentos de saúde</option><option>333 AR8 .-. Rua Cel. Jaime Pereira Da Costa, 344 .-. Repartição pública</option><option>335 AR7 .-. Rua Caldre Fião, 295 .-. Repartição pública</option><option>336 CRAS PARTENON .-. Rua Barão Do Amazonas, 1959 .-. Casa de Abrigo e Assistência</option><option>337 SMAM GOMES JARDIM .-. Rua Gomes Jardim, 758 .-. Repartição pública</option><option>340 UBS SÃO JOSÉ .-. Rua Santos Ferreira, 60 .-. Estabelecimentos de saúde</option><option>343 CAPS AD III PARTENON .-. Rua Dona Firmina, 144 .-. Estabelecimentos de saúde</option><option>344 CAIS METAL .-. Rua Tobias Barreto 145 .-. Repartição pública</option><option>345 AR12 .-. Rua Dr. Pereira Da Cunha, 52 .-. Repartição pública</option><option>347 AR11 .-. Rua Cel. Aparicio Borges .-. Repartição pública</option><option>348 DEMHAB .-. Avenida Princesa Isabel, 1115 .-. Repartição pública</option><option>400 ÁREA LESTE .-. Rua Luiz Volcker, 55 .-. Repartição pública</option><option>4002 PRAÇA TAMANDARÉ .-. Avenida Caçapava, 489 .-. Praça / Parque</option><option>4003 PRAÇA RUY TEIXEIRA .-. Rua General Tibúrcio .-. Praça / Parque</option><option>4004 PRAÇA SAN MARTIM .-. Avenida Dr. João Simplicio Alves De Carvalho, 657 .-. Praça / Parque</option><option>4005 PRAÇA ADAIR FIGUEIREDO .-. Rua Vicente Da Fontoura, 1919 .-. Praça / Parque</option><option>4006 PRAÇA ALFRED SEHBE .-. Praça Alfred Sehbe .-. Praça / Parque</option><option>4006 PRAÇA ALFRED SEHBE .-. Praça Alfred Sehbe .-. Praça / Parque</option><option>4007 PRAÇA ABRAÃO CHWARTZMANN .-. Rua Sapé, 834 .-. Praça / Parque</option><option>4007 PRAÇA ABRAÃO CHWARTZMANN .-. Rua Sapé, 834 .-. Praça / Parque</option><option>4008 PRAÇA FRANK LONG .-. Avenida Grécia, 707 .-. Praça / Parque</option><option>4008 PRAÇA FRANK LONG .-. Avenida Grécia, 707 .-. Praça / Parque</option><option>4009 PRAÇA DAVI ROSEMBLI .-. Rua Jary, 488 .-. Praça / Parque</option><option>4009 PRAÇA DAVI ROSEMBLI .-. Rua Jary, 488 .-. Praça / Parque</option><option>401 ABRIGO BOM JESUS .-. Rua São Domingos, 165 .-. Estabelecimentos de saúde</option><option>4010 PRAÇA GAL. DARCY VIGNOLI .-. Rua Jary, 2 .-. Praça / Parque</option><option>4010 PRAÇA GAL. DARCY VIGNOLI .-. Rua Jary, 333 .-. Praça / Parque</option><option>4012 PRAÇA NAÇÕES ÁRABES .-. Av. Beno Mentz,626 .-. Praça / Parque</option><option>4012 PRAÇA NAÇÕES ÁRABES .-. Av. Beno Mentz,626 .-. Praça / Parque</option><option>4013 PRAÇA BELA VISTA .-. PRAÇA BELA VISTA, 88 .-. Praça / Parque</option><option>4014 PRAÇA GUSTAVO LANGSCH .-. Rua Artur Rocha, s/nº .-. Praça / Parque</option><option>4015 PRAÇA ANDRÉ FOSTER .-. Rua LUIZ SÓ, 190 .-. Praça / Parque</option><option>4016 PRAÇA BRENO VIGNÓLI (Jamaiquinha) .-. AV. NILO PEÇANHA , 350 .-. Praça / Parque</option><option>4017 PRAÇA JAPÃO .-. PRAÇA JAPÃO .-. Praça / Parque</option><option>4018 PRAÇA PROVÍNCIA DE CHIGA .-. Av.CRISTÓVÃO COLOMBO s/n .-. Praça / Parque</option><option>4019 PRAÇA MACEDÔNIA .-. Av. PLÍNIO BRASIL MILANO, 1357 .-. Praça / Parque</option><option>402 DIP SMOV TIBIRIÇA .-. Rua Engenheiro Antônio Carlos Tibiriça, 363 .-. Repartição pública</option><option>403 COORDENAÇÃO DE CONSERVAÇÃO E MANUTENÇÃO - CCM .-. Rua Engenheiro Antônio Carlos Tibiriça, 175 .-. Repartição pública</option><option>404 EMEF NOSSA SENHORA DE FÁTIMA .-. Rua Gilda Correa Vieira, 24 - Bom Jesus, Porto Alegre - RS, Brasil .-. Estabelecimento de ensino</option><option>4042 PRAÇA CARLOS SIMÃO ARNT - ENCOL .-. Avenida Nilópolis .-. Praça / Parque</option><option>4042 PRAÇA ENCOL .-. Avenida Nilópolis .-. Praça / Parque</option><option>4043 PRAÇA JD. SALSO .-. Rua Affonso Sanmartim, 438 .-. Praça / Parque</option><option>4043 PRAÇA JD. SALSO .-. Rua Affonso Sanmartim, 438 .-. Praça / Parque</option><option>4044 PRAÇA DESEMBARGADOR LA HIRE GUERRA .-. Rua José Antonio Aranha, 202 .-. Praça / Parque</option><option>4044 PRAÇA DESEMBARGADOR LA HIRE GUERRA .-. Rua José Antonio Aranha, 202 .-. Praça / Parque</option><option>4045 PRAÇA NAÇÕES UNIDAS .-. Rua Artigas, 123 .-. Praça / Parque</option><option>4045 PRAÇA NAÇÕES UNIDAS .-. Rua Artigas, 123 .-. Praça / Parque</option><option>4046 PRAÇA FORTUNATO PIMENTEL .-. Rua Cipó, 1096 .-. Praça / Parque</option><option>4046 PRAÇA FORTUNATO PIMENTEL .-. Rua Cipó, 1096 .-. Praça / Parque</option><option>4047 PRAÇA LEOPOLDO BERNARDO BOECK .-. Rua Cipó,625 .-. Praça / Parque</option><option>4047 PRAÇA LEOPOLDO BERNARDO BOECK .-. Rua Cipó,625 .-. Praça / Parque</option><option>4049 PRAÇA VINTE DE MAIO .-. Rua Prof. Bertrand Rússel .-. Praça / Parque</option><option>405 EMEF JOÃO CARLOS D'ÁVILA PAIXÃO CÔRTES (LAÇADOR) .-. R. Bpo. Sardinha, 159 - Vila Ipiranga .-. Estabelecimento de ensino</option><option>406 CASA DE APOIO VIVA MARIA .-. Rua Porto Seguro, 261 .-. Repartição pública</option><option>4062 PARQUE ALIM PEDRO .-. Avenida dos Industriários .-. Praça / Parque</option><option>4062 PARQUE ALIM PEDRO .-. Avenida dos Industriários .-. Praça / Parque</option><option>4064 VIADUTO UTZIG .-. Viaduto José Eduardo Utzig - São João, Porto Alegre - RS, Brasil .-. Via urbana</option><option>4065 PRAÇA FREDERICO ARNALDO BALVE .-. Avenida Cristóvão Colombo, 4009 .-. Praça / Parque</option><option>4065 PRAÇA FREDERICO ARNALDO BALVE .-. Avenida Cristóvão Colombo, 4009 .-. Praça / Parque</option><option>407 SMAM SECRETARIA .-. Avenida Carlos Gomes, 2120 .-. Repartição pública</option><option>408 E.M.E.F. LYGIA AVERBUCK .-. Rua São Josemaría Escrivá, 306 .-. Estabelecimento de ensino</option><option>409 E.M.E.F. LUCENA BORGES .-. Rua Cláudio Manoel Da Costa, 270 .-. Estabelecimento de ensino</option><option>411 E.M.E.F. MARIANO BECK .-. Rua T, 711 .-. Estabelecimento de ensino</option><option>413 UBS JARDIM CARVALHO .-. Rua Três, 4 - Jardim Carvalho .-. Estabelecimentos de saúde</option><option>414 CENTRO REG. ASSIST. LESTE .-. Rua Jerusalem, 615 .-. Repartição pública</option><option>415 ESCA LESTE .-. Rua Nazaré, 570 .-. Repartição pública</option><option>422 EAT-SIP SMSURB .-. Rua Engenheiro Antônio Carlos Tibiriça, 175 .-. Repartição pública</option><option>423 CONSELHO TUTELAR R3 .-. Rua São Felipe, 140 .-. Repartição pública</option><option>424 E.M.E.I. PROTÁSIO ALVES .-. Rua Araci Fróes, 210 .-. Estabelecimento de ensino</option><option>425 E.M.E.I. VALE VERDE .-. Rua Franklin, 270 .-. Estabelecimento de ensino</option><option>426 CAR LESTE .-. Rua São Felipe, 144 .-. Repartição pública</option><option>427 CENTRO ESPORTIVO CULTURAL B. JESUS .-. Rua Marta Costa Franzen, 101 .-. Estabelecimentos de saúde</option><option>428 CREAS LESTE .-. Rua Porto Seguro, 261 .-. Outros</option><option>430 UBS BOM JESUS .-. RUA BOM JESUS,410 .-. Estabelecimentos de saúde</option><option>433 UBS VILA PINTO .-. Rua 5, 560 .-. Estabelecimentos de saúde</option><option>435 UBS MATO SAMPAIO .-. R. Jayr Amaury Koebe, 90 .-. Estabelecimentos de saúde</option><option>437 UBS VILA IPIRANGA .-. Rua Alberto Silva, 1830 .-. Estabelecimentos de saúde</option><option>441 CREAS LESTE .-. Rua Porto Seguro, 261 .-. Outros</option><option>4412 PARQUE GERMANIA .-. Parque Germânia - Avenida Túlio de Rose .-. Praça / Parque</option><option>4412 PARQUE GERMANIA .-. Avenida Túlio de Rose. S/N .-. Praça / Parque</option><option>4461 VIADUTO MENDES RIBEIRO .-. Avenida Protásio Alves, 3700 .-. Via urbana</option><option>4462 VIADUTO JAYME C. BRAUN .-. Avenida Nilo Peçanha, 821 .-. Via urbana</option><option>4463 VIADUTO OBIRICI .-. Viaduto Obirici, 1800 - Porto Alegre .-. Via urbana</option><option>449 UBS VILA BRASÍLIA .-. Rua Juvenal Cruz, 246 .-. Estabelecimentos de saúde</option><option>456 UBS MILTA RODRIGUES .-. Rua Comendador Eduardo Secco, 200 .-. Estabelecimentos de saúde</option><option>464 SMOV DCMP .-. Rua Ari Marinho, 231 .-. Repartição pública</option><option>465 CLINCA DA FAMÍLIA IAPI .-. Rua três de Abril, 90 .-. Repartição pública</option><option>466 ARQUIVO CENTRAL SMS .-. Rua itacolomi, 30 .-. Repartição pública</option><option>467 CASA ESTRELA .-. Rua Camerino, 34 .-. Repartição pública</option><option>468 SEC SMSURB .-. Rua Gen. Antonio Carlos Tibiriça, 139 .-. Repartição pública</option><option>469 ADM CEMITÉRIO SÃO JOÃO .-. Rua Ari Marinho, 279 .-. Repartição pública</option><option>470 CAPS II BEM VIVER .-. R. Marco Polo, 278 - Cristo Redentor .-. Estabelecimentos de saúde</option><option>471 CAPSI PANDORGA .-. R. Dom Diogo de Souza, 429 - Cristo Redentor .-. Estabelecimentos de saúde</option><option>500 ÁREA RESTINGA .-. Rua Rubens Pereira Torelly, 333/Rua Antonio Rocha Meireles Leite, 50 .-. Repartição pública</option><option>5001 PRAÇA INACIO ANTÔNIO DA SILVA .-. Avenida Heitor Viêira, 453 .-. Praça / Parque</option><option>5002 ORLA DE BELEM NOVO .-. Avenida Beira Rio - Belém Novo .-. Via urbana</option><option>5003 PRAÇA LAGOS DOS PATOS HÍPICA .-. R. IVO WALTER KEN,170 .-. Praça / Parque</option><option>5004 TERMINAL HOSPITAL RESTINGA .-. Rua Alberto Hoffmann .-. Terminal de ônibus</option><option>5005 DISTRITO INDUSTRIAL .-. Estrada joão Antonio da Silveira, 3240 .-. Estabelecimentos de saúde</option><option>501 E.M.E.F. LARRY ALVES .-. Avenida Economista Nilo Wulff, 681 .-. Estabelecimento de ensino</option><option>502 E.M.E.F. MORADAS DA HÍPICA .-. Rua Geraldo Tollens Linck, 689 .-. Estabelecimento de ensino</option><option>503 E.M.E.F. DOLORES CALDAS .-. Rua Dr. Carlos Niederauer Hofmeister, 85 .-. Estabelecimento de ensino</option><option>504 USF PAULO VIARO .-. Avenida Do Lami, 4350 .-. Estabelecimentos de saúde</option><option>505 E.M.E.F. ALBERTO PASQUALINI .-. Rua Tenente Arizoly Fagundes, 159 .-. Estabelecimento de ensino</option><option>5050 TERMINAL RESTINGA VELHA .-. Rua Tobago, 869 .-. Terminal de ônibus</option><option>5053 TERMINAL RESTINGA 209 .-. Avenida Ignês Fagundes, 30 .-. Terminal de ônibus</option><option>5057 TERMINAL RESTINGA NOVA .-. Avenida Economista Nilo Wulff, 896 .-. Terminal de ônibus</option><option>5059 TERMINAL BELÉM NOVO .-. Avenida Beira Rio - Belém Novo .-. Terminal de ônibus</option><option>506 UBS NÚCLEO ESPERANÇA .-. Rua Sete Mil Cento E Quatorze, 13 .-. Estabelecimentos de saúde</option><option>507 E.M.E.F. PESSOA DE BRUM .-. Rua Abolição, 1334 .-. Estabelecimento de ensino</option><option>508 E.M.E.F. LIDOVINO FANTON .-. Rua Manoel Faria Da Rosa Primo, 940 .-. Estabelecimento de ensino</option><option>509 E.M.E.F. MARIO QUINTANA .-. Acesso B Vl Castelo, 1 .-. Estabelecimento de ensino</option><option>510 E.M.E.E.F TRISTÃO S VIANA .-. Avenida Economista Nilo Wulff, 858 .-. Estabelecimento de ensino</option><option>511 IETINGA .-. Avenida Ricardo Leônidas Ribas, 35 .-. Repartição pública</option><option>512 CTMR7 .-. Rua Rubens pereira torelly 333 .-. Repartição pública</option><option>513 E.M.E.I FLORÊNCIA SOCIAS .-. Rua Rubens Pereira Torelly, 369 .-. Estabelecimento de ensino</option><option>514 E.M.E.I. DOM LUIS DE NADAL .-. Rua Doutor Carlos Niederauer Hofmeister, 605 .-. Estabelecimento de ensino</option><option>515 E.M.E.I. VILA NOVA RESTINGA .-. Rua Álvaro Difini, 480 .-. Estabelecimento de ensino</option><option>516 E.M.E.I. PAULO FREIRE .-. Avenida Meridional, 149 .-. Estabelecimento de ensino</option><option>517 UBS MACEDÔNIA .-. Avenida Macedônia, 151 .-. Estabelecimentos de saúde</option><option>518 UBS BELÉM NOVO .-. Rua Florêncio Faria, 191 .-. Estabelecimentos de saúde</option><option>519 CREA RESTINGA E EXTREMO SUL .-. Avenida Macedônia, 1000 .-. Repartição pública</option><option>520 CRAS RESTINGA .-. Avenida Economista Nilo Wulff,681 .-. Casa de Abrigo e Assistência</option><option>521 UBS VILA CHACÁRA DO BANCO .-. Rua Sandra Bréa, 193 .-. Estabelecimentos de saúde</option><option>522 UBS VILA PITINGA .-. Rua Marco Antonio Veiga Pereira, 341 .-. Estabelecimentos de saúde</option><option>523 UBS RESTINGA .-. Rua Abolição, 850 .-. Estabelecimentos de saúde</option><option>524 UBS LAMI .-. Rua Nova Olinda, 202 .-. Estabelecimentos de saúde</option><option>525 CLÍNICA DA FAMÍLIA .-. Av. João Antônio Silveira, 3330 .-. Estabelecimentos de saúde</option><option>527 CLÍNICA DA FAMÍLIA ÁLVARO DIFINI .-. Rua Álvaro Difini, 3402 .-. Estabelecimentos de saúde</option><option>528 EMEI MORADAS DA HIPICA .-. Rua Elvira Dendena,185 .-. Estabelecimento de ensino</option><option>529 CRAS RESTINGA 5ª UNIDADE .-. Rua São João Calábria, 10 .-. Casa de Abrigo e Assistência</option><option>530 UBS 5ª UNIDADE .-. Rua São João Calábria, 10 .-. Estabelecimentos de saúde</option><option>531 CRIP EXTREMO- SUL .-. Avenida Desembargador Melo Guimarães, 12 .-. Repartição pública</option><option>532 E.M.E.F. NOSSA SRA. DO CARMO .-. Rua Bispo Marino Prudencio Moreira, 95 - Restinga, Porto Alegre .-. Estabelecimento de ensino</option><option>533 UBS MORADAS DA HÍPICA .-. Rua Geraldo Tollens Linck, 235 .-. Estabelecimentos de saúde</option><option>534 FARMÁCIA DISTRITAL .-. Rua Álvaro Difini, 3402 .-. Estabelecimentos de saúde</option><option>537 CEU - RESTINGA .-. Rua Doutor Arno Horn,211 .-. Repartição pública</option><option>538 CAPS AD III GIRASSOL .-. Rua João Antônio da Silveira, 440 .-. Estabelecimentos de saúde</option><option>539 CRAS HÍPICA .-. R. Francisca Prezi Bolognese, no 352 - Hípica .-. Casa de Abrigo e Assistência</option><option>549 MULTIMEIOS RESTINGA .-. Avenida Ricardo Leônidas Ribas, 75 .-. Repartição pública</option><option>600 ÁREA NORTE .-. Rua Amparo, 30 .-. Repartição pública</option><option>6000 COMANDO REGIONAL NORTE - CRN .-. Rua Amparo, 30 .-. Repartição pública</option><option>6005 PRAÇA PORTO NOVO .-. Rua Amélia Santini Fortunati .-. Praça / Parque</option><option>6006 PRAÇA CARAÍ .-. Rua Praça Carai .-. Praça / Parque</option><option>6007 PRAÇA VALVERDE .-. R. Carmelita Grippi, 575 .-. Praça / Parque</option><option>6008 PRAÇA PROFESSOR JORGE DOS SANTOS ROSA .-. R. Francisco Galecki .-. Praça / Parque</option><option>601 CTMR2 .-. Rua Paulo Gomes de Oliveira,200 .-. Repartição pública</option><option>6012 PRAÇA ROMEU RITTER DOS REIS .-. Av. Bernardino Silveira Amorim, 3605 .-. Praça / Parque</option><option>6013 PRAÇA VILMAR BERTELI .-. Rua Bernardino de Oliveira Paim, 100 .-. Praça / Parque</option><option>6014 PRAÇA CAMPO DE FUTEBOL JORNAL DO COMÉRCIO .-. Rua V, 96 - Rubem Berta .-. Praça / Parque</option><option>6017 PRAÇA ELIAS JORGE MOUSSALLE .-. R. Jackson de Figueiredo, 1075 .-. Praça / Parque</option><option>6018 PRAÇA JORGE BASTANE .-. Travessa Gurupi .-. Praça / Parque</option><option>6019 PRAÇA TORBEN DE ALENCASTRO FRIEDRICH .-. Rua Mauro Guedes de Oliveira, 122 .-. Praça / Parque</option><option>602 E.M.E.F. DÉCIO MARTINS COSTA .-. Rua Cristóvão Jaques, 388 .-. Estabelecimento de ensino</option><option>6020 PRAÇA HARRYSSON CURTYS TESTA .-. Av. Jorge Benjamin Eckert, 350 .-. Praça / Parque</option><option>6021 PRAÇA CARLOS IVAHY PRESSER .-. Av. Carneiro da Fontoura .-. Praça / Parque</option><option>6022 PRAÇA ANTÔNIO AMÁBILE .-. Rua Barão de Itaqui, 91 .-. Praça / Parque</option><option>6023 PRAÇA NELSON MARCHEZAN .-. Av. Dante Angelo Pilla, 235 - Costa E Silva, Porto Alegre - RS, 91150-080 .-. Praça / Parque</option><option>6024 PRAÇA FRANCISCO JOSÉ ZAFFARI .-. Rua Aloísio Olimpio de Mello .-. Praça / Parque</option><option>6025 PRAÇA PROFESSOR HERNANI ESTRELLA .-. R. Leonor Dionisia Peres .-. Praça / Parque</option><option>6026 PRAÇA TOM JOBIM .-. Rua Silveira Félix Rodrigues .-. Praça / Parque</option><option>6027 PRAÇA IVO CORRÊA MEYER .-. Rua Rolante, 49 .-. Praça / Parque</option><option>6028 PRAÇA POETISA CONSUELO BELLONI .-. Av. Marquês de Souza .-. Praça / Parque</option><option>603 E.M.E.F. ILDO MENEGHETTI .-. Rua Jayme Cyrino Machado de Oliveira, 226 .-. Estabelecimento de ensino</option><option>6030 PRAÇA LAMPADOSA .-. Av. Vinte e um de abril .-. Praça / Parque</option><option>6032 PRAÇA OLIVEIRA ROLIM .-. Rua Praça Oliveira Rolim .-. Praça / Parque</option><option>60336 PRAÇA CORONEL FRANCELINO CORDEIRO .-. R. Paulo Bento Lobato, 357 .-. Praça / Parque</option><option>6034 PARQUE IBIRAMA ECOVILLE .-. R. Abaeté .-. Praça / Parque</option><option>6035 PRAÇA JOÃO CALEGARI NETO .-. Av. Alcides São Severiano .-. Praça / Parque</option><option>6037 LOTEAMENTO RESIDENCIAL SENHOR DO BOM FIM .-. RUA Nossa Sra. do Caravagio .-. Repartição pública</option><option>6038 PRAÇA MALCON .-. Av. Gen. Raphael Zippin .-. Praça / Parque</option><option>6039 PARQUE RESERVA DO ACONGUI .-. Av. Willy Eugênio Fleck .-. Praça / Parque</option><option>6040 PRAÇA CORONEL ORPHEU CORREA DA SILVA .-. Rua Romeu Paliosa, 50 .-. Praça / Parque</option><option>6041 PRAÇA JUAN SONDERMAN .-. R. Waldemar Pinheiro Cantergi .-. Praça / Parque</option><option>6043 LARGO MARIA APARECIDA DA CUNHA .-. R. Ulisses de Alencastro Brandão .-. Praça / Parque</option><option>605 E.M.E.F. PORTO NOVO .-. Rua Amélia Santini Fortunati, 101 .-. Estabelecimento de ensino</option><option>6050 PRAÇA PEDRO JOÃO FACCIO .-. Rua Rudi Schaly .-. Praça / Parque</option><option>6051 PRAÇA FLAVIO VEIGA MIRANDA .-. R. Abdo Jorge Curi .-. Praça / Parque</option><option>6052 PRAÇA DONA EMILIA .-. R. Hugo Nelson Magalhães .-. Praça / Parque</option><option>6053 PRAÇA GEN. SADI CAHEM FISCHER .-. Travessa Quatro com a Travessa Três, bairro Costa e Silva. .-. Praça / Parque</option><option>6054 PRAÇA HÉLIO PELLEGRINO .-. Rua Procópio Ferreira com Cacilda .-. Praça / Parque</option><option>6055 PRAÇA GERALDINA BATISTA .-. Rua Geraldina da Silva - Costa e Silva .-. Praça / Parque</option><option>6059 PRAÇA UBIRAJARA VALDEZ .-. R. Lygia Pratini de Moraes .-. Praça / Parque</option><option>606 EMEF LIBERATO SALZANO VIEIRA DA CUNHA .-. Rua Xavier de Carvalho, 274 .-. Estabelecimento de ensino</option><option>6061 PRAÇA LIBANESA .-. Avenida Montreal .-. Praça / Parque</option><option>6066 PRAÇA ONZE DE DEZEMBRO .-. Rua Engenheiro Fernando de Abreu Pereira .-. Praça / Parque</option><option>6067 PRAÇA FEB .-. Rua Lindolfo Henke, 91 .-. Praça / Parque</option><option>6068 PRAÇA MIGUEL GUSTAVO .-. Rua Sylvio Sanson, 725 .-. Praça / Parque</option><option>607 E.M.E.F. JOÃO ANTÔNIO SATTE .-. Avenida Gamal Abdel Nasser, 498 .-. Estabelecimento de ensino</option><option>608 E.M.E.F. JEAN PIAGET .-. Avenida Major Manoel José Monteiro, 580 .-. Estabelecimento de ensino</option><option>6090 RESTAURANTE POPULAR EIXO BALTAZAR .-. Rua Caetano Fulginiti, 95 .-. Repartição pública</option><option>611 E.M.E.I. NOVA GLEBA .-. Rua Guido Alberto Werlang, 747 .-. Estabelecimento de ensino</option><option>612 E.M.E.I. MAX GEISS .-. Rua Antônio Francisco Lisboa, 402 .-. Outros</option><option>613 E.M.E.I. SANTA ROSA .-. Avenida Donário Braga, 85 .-. Estabelecimento de ensino</option><option>614 E.M.E.I. VILA PÁSCOA .-. Rua Lóris José Isatto, 98 .-. Estabelecimento de ensino</option><option>615 E.M.E.F ILDO MENEGHETTI/ANEXO .-. Rua Jayme Cyrino Machado Oliveira, 161 .-. Estabelecimento de ensino</option><option>616 E.M.E.I. PARQUE DOS MAIAS .-. Rua Amauri Cafrune, 169 .-. Praça / Parque</option><option>617 E.M.E.I. VILA ELIZABETH .-. Rua Paulo Gomes de Oliveira, 120 .-. Estabelecimento de ensino</option><option>618 UBS SARANDI .-. Rua Francisco Pinto da Fontoura, 341 .-. Estabelecimentos de saúde</option><option>619 E.M.E.I. VILA FLORESTA .-. Rua Monte Alegre, 55 .-. Estabelecimento de ensino</option><option>620 E.M.E.F. MIGRANTES .-. Avenida Severo Dullios, 165 .-. Estabelecimento de ensino</option><option>621 CRIP NOROESTE .-. Rua Santa Catarina, 105 .-. Repartição pública</option><option>622 ESMA NEB/ SMS .-. RUA RODRIGUES DA COSTA, Nº11 .-. Estabelecimentos de saúde</option><option>623 UBS SANTA MARIA .-. Rua Geraldina Batista, 235 .-. Estabelecimentos de saúde</option><option>624 UBS SANTA FÉ .-. Rua Professor Alvaro Barcellos Ferreira, 510 .-. Estabelecimentos de saúde</option><option>625 UBS SANTO AGOSTINHO .-. R. João Paris, 180 - Santa Rosa de Lima, Porto Alegre .-. Estabelecimentos de saúde</option><option>626 UBS CORDEIRO ESPERANÇA .-. Rua Homero Guerreiro, 271 .-. Estabelecimentos de saúde</option><option>2030 PRAÇA DOUTOR JURANDY BARCELOS DA SILVA .-. Av. Joracy Camargo, 280 - Santa Tereza, Porto Alegre - RS, 90840-520 .-. Praça / Parque</option><option>629 CRIP NORTE .-. Rua Afonso Paulo Feijó, 220 .-. Repartição pública</option><option>632 UBS NOVA BRASÍLIA .-. Rua Vieira da Silva, 1016 .-. Estabelecimentos de saúde</option><option>633 UBS SANTA ROSA .-. Avenida Donário Braga, 174 .-. Estabelecimentos de saúde</option><option>634 UBS RAMOS .-. Rua K, 140 .-. Estabelecimentos de saúde</option><option>635 UBS ASSIS BRASIL .-. Avenida Assis Brasil, 6619 .-. Estabelecimentos de saúde</option><option>636 UBS NAZARETH .-. Travessa 1, 31 .-. Estabelecimentos de saúde</option><option>637 UBS VILA ELIZABETH .-. Rua Paulo Gomes de Oliveira, 170 .-. Estabelecimentos de saúde</option><option>638 UBS SÃO BORJA .-. Rua Martim Ferreira de Carvalho, 271 .-. Estabelecimentos de saúde</option><option>639 UBS VILA ASA BRANCA .-. Rua Vinte e Cinco de Outubro, 318 .-. Estabelecimentos de saúde</option><option>640 UBS NOVA GLEBA .-. Rua Paulo HenriqueTen-Caten, 171 .-. Estabelecimentos de saúde</option><option>641 UBS JENOR JARROS .-. Rua Mario de Arnaud Sampaio, 45 .-. Estabelecimentos de saúde</option><option>642 CREAS NORTE E NOROESTE .-. Rua Paulo Gomes de Oliveira, 200 .-. Outros</option><option>643 CENTRO DIA DO IDOSO .-. Rua Irene Capponi Santiago, 400 .-. Repartição pública</option><option>644 CRAS NOROESTE .-. Rua Irene Capponi Santiago, 290 .-. Casa de Abrigo e Assistência</option><option>646 CRAS NORTE .-. Rua Paulo Gomes de Oliveira, 200 .-. Casa de Abrigo e Assistência</option><option>647 CRAS SANTA ROSA .-. Rua Abelino Nicolau de Almeida, 390 .-. Casa de Abrigo e Assistência</option><option>648 EMEI MIGUEL VELASQUES .-. Rua Armando Costa, 111 .-. Estabelecimento de ensino</option><option>649 GERÊNCIA DISTRITAL NORTE EIXO BALTAZAR .-. Avenida Baltazar de Oliveira Garcia, 744 .-. Repartição pública</option><option>650 EMEI SANTO EXPEDITO .-. Rua Santo Expedito .-. Estabelecimento de ensino</option><option>270 HOSPITAL SANTA ANA .-. Praça Simões Lopes Neto, 175 .-. Estabelecimentos de saúde</option><option>653 CRIP EIXO BALTAZAR .-. Av. Baltazar de Oliveira Garcia,2132 .-. Repartição pública</option><option>654 CRÁS EIXO- BALTAZAR/ NORDESTE .-. Rua Petronilla Cogo, 34 .-. Repartição pública</option><option>657 CAPS AD III PASSO A PASSO .-. Av. Carneiro da Fontoura, 57 - Jardim São Pedro, Porto Alegre .-. Estabelecimentos de saúde</option><option>700 ÁREA EIXO BALTAZAR .-. RUA ANA AURORA DO AMARAL LISBOA, 60 .-. Repartição pública</option><option>7000 PRAÇA DR. ERNESTO CORRÊA .-. Avenida Karl Iwers, 634 .-. Praça / Parque</option><option>7001 PRAÇA DAS AMORAS .-. RUA PROFESSOR ISIDORO LA PORTA, 42 .-. Praça / Parque</option><option>7002 PARQUE DA BRIGADA MILITAR .-. Avenida Walter Kaufmann, 628 .-. Praça / Parque</option><option>7003 PRAÇA JOAQUIM SANDRI DOS SANTOS .-. Rua Joel Halpern, 113 .-. Praça / Parque</option><option>7004 PRAÇA MAURI MEURER .-. Rua Dona Adda Mascarenhas de Moraes, 633 .-. Praça / Parque</option><option>7005 PRAÇA ANTÔNIO VALENTIM STOLL .-. Rua Valdir Zottis, 121 .-. Praça / Parque</option><option>7006 PRAÇA PADRE JOÃO PETERS .-. Rua Luiz José Biernfeld Figueiredo .-. Praça / Parque</option><option>7007 PRAÇA AUGUSTO RUSKI .-. Rua Ruben Berta, 235 .-. Praça / Parque</option><option>7008 PRAÇA CAMPO DO SAFIRA .-. Rua Algemiro Nunes da Costa, 107 .-. Praça / Parque</option><option>7009 PRAÇA ARQUITETO EDGAR GRAEFF .-. Avenida Nilo Ruschel,423 .-. Praça / Parque</option><option>701 E.M.E.F LAURO RODRIGUES .-. Rua Dr Marino Abraão, 240 .-. Estabelecimento de ensino</option><option>7010 PRAÇA PARQUE DO SABIÁ .-. Rua Dr. Heitor Pires, 232 .-. Praça / Parque</option><option>7011 PRAÇA MAURICIO ROSENBLATT .-. Avenida Nilo Ruschel, esq r. Dionísio João Pasin .-. Praça / Parque</option><option>7012 PRAÇA DR. ERNESTO CORRÊA .-. Avenida Karl Iwers, 634 .-. Praça / Parque</option><option>7013 PRAÇA ARQ. EDGAR ALBUQUERQUE GRAEFF .-. Rua Doutor Heitor Píres, 215 .-. Praça / Parque</option><option>702 E.M.E.F PROFª ANA ÍRIS DO AMARAL .-. Avenida Mario Meneghetti, 1000 .-. Estabelecimento de ensino</option><option>703 E.M.E.F. CHICO MENDES .-. Rua Gentil Amâncio Clemente,156 .-. Estabelecimento de ensino</option><option>704 E.M.E.F. DEP. VICTOR ISSLER .-. Rua 19 De Fevereiro, 346 .-. Estabelecimento de ensino</option><option>431 UPA BOM JESUS .-. RUA BOM JESUS,410 .-. Estabelecimentos de saúde</option><option>7047 PRAÇA MARCO RUBIM - GUAÍBA CAR .-. Avenida Protásio Alves, 7207 a 7319 .-. Praça / Parque</option><option>705 LOTEAMENTO IRMÃOS MARISTAS .-. Estrada Irmãos Maristas, 400 .-. Residência</option><option>706 E.M.E.F GRANDE ORIENTE DO RS .-. Rua Wolfram Metzler, 650 .-. Estabelecimento de ensino</option><option>707 E.M.E.F. WESCESLAU FONTOURA .-. RUA IRMÃ INÊS FAVERO, S/N° .-. Estabelecimento de ensino</option><option>7071 PRAÇA MÉXICO .-. RUA Ada Vaz Cabeda, 497 .-. Praça / Parque</option><option>7072 PARQUE CHICO MENDES .-. Rua Irmão Ildefonso Luiz, 240 .-. Praça / Parque</option><option>7073 PRAÇA MIGUEL ANIBAL GENTA .-. RuaDr. Derli Monteiro, s/n° .-. Praça / Parque</option><option>7074 PRAÇA POVO PALESTINO .-. Rua PoÁ Cidade Joía, S/Nº .-. Praça / Parque</option><option>7075 PRAÇA VEREADOR VALNERI ANTUNES .-. Avenida Mário Meneghetti, s/nº .-. Praça / Parque</option><option>7076 PRAÇA PROVINCIA DE SÃO PEDRO .-. Rua José Carlos Batista dos Santos. S/Nº .-. Praça / Parque</option><option>7077 PRAÇA LINO AUGUSTO SCHIEFFERDECKER .-. Avenida Nestor Valdman, 79 .-. Praça / Parque</option><option>7078 PRAÇA LUIZ CARVALHO .-. Avenida Karl Iwers, 150 .-. Praça / Parque</option><option>7079 PRAÇA GUILHERME FLORES DA CUNHA .-. Avenida Karl Iwers, 287 .-. Praça / Parque</option><option>708 E.M.E.F. PEPITA DO LEÃO .-. Rua Estádio,29 .-. Estabelecimento de ensino</option><option>7080 PRAÇA SÃO MARUM .-. Rua Concorde, S/Nº .-. Praça / Parque</option><option>7081 PRAÇÃO IRCEU ANTÔNIO GASPARIN .-. Rua Delegado Jhair Souza Pinto, S/Nº .-. Praça / Parque</option><option>7082 PRAÇA LEOPOLDO TIETBOHL .-. Rua Professor Leopoldo Tietbohl, S/Nº .-. Praça / Parque</option><option>709 E.M.E.F. PRESIDENTE VARGAS .-. Rua Ana Aurora Do Amaral Lisboa, 60 .-. Estabelecimento de ensino</option><option>710 E.M.E.F TIMBAÚVA .-. R. Seis, 49 - Mário Quintana, Porto Alegre - RS, 91250-715 .-. Estabelecimento de ensino</option><option>711 E.M.E.I. VILA VALNERI ANTUNES .-. Estrada Martin Félix Berta, 2353 .-. Estabelecimento de ensino</option><option>712 ASSOCIAÇÃO DE RECICLAGEM ECOLÓGICA RUBEM BERTA .-. Estr. Antônio Severino, 1317 .-. Associação/sindicato</option><option>713 UBS CHÁCARA DA FUMAÇA .-. Estrada Martin Félix Berta, 2432 .-. Estabelecimentos de saúde</option><option>714 UBS SÃO CRISTOVÃO .-. Rua Cel. Ricardo Leal Keleter, 137 .-. Estabelecimentos de saúde</option><option>715 UBS PASSOS DAS PEDRAS .-. Avenida Gomes De Carvalho, 510 .-. Estabelecimentos de saúde</option><option>716 US PASSO DAS PEDRAS ANEXO 2 PISO - ANTIGO PLANALTO .-. Gomes de Carvalho, 510 .-. Estabelecimentos de saúde</option><option>717 UBS VILA SAFIRA .-. AVENIDA DELEGADO ELY PRADO, 945 .-. Estabelecimentos de saúde</option><option>718 UBS BATISTA FLORES .-. Avenida Serafim Machado, 215 .-. Estabelecimentos de saúde</option><option>719 UBS WESCESLAU FONTOURA .-. Rua José Luiz Martins Costa, 200 .-. Estabelecimentos de saúde</option><option>720 UBS BECO DOS COQUEIROS .-. Avenida Vitória, 35 .-. Estabelecimentos de saúde</option><option>721 UBS PASSOS DAS PEDRAS II .-. Avenida 10 De Maio, 255 .-. Estabelecimentos de saúde</option><option>722 E.M.E.I. ÉRICO VERISSIMO .-. Rua Modesto Franco, 100 .-. Estabelecimento de ensino</option><option>723 CAR NORDESTE .-. Estrada Martin Félix Berta, 2355 .-. Repartição pública</option><option>724 UBS RUBEM BERTA .-. Rua Wolfram Metzler, 675 .-. Estabelecimentos de saúde</option><option>725 UBS JARDIM DA FAPA .-. Rua Cristal Da Paz, 146 .-. Estabelecimentos de saúde</option><option>726 UBS TIMBAÚVA .-. Rua Sebastião Do Nascimento, 1050 .-. Estabelecimentos de saúde</option><option>ÁREA DE PRESERVAÇÃO PERMANENTE .-. Rua Solon Vieira Marques .-. Reserva ambiental</option><option>729 UBS JARDIM PROTÁSIO ALVES .-. Rua Violetas , 02 .-. Estabelecimentos de saúde</option><option>730 UBS SAFIRA NOVA .-. Rua Alberto Gália, 233 .-. Estabelecimentos de saúde</option><option>731 CRAS BARBARA MAIX .-. Rua Joséfa Barreto, 150 .-. Casa de Abrigo e Assistência</option><option>733 CRAS TIMBAÚVA .-. Rua Irmão Faustino João, 89 .-. Casa de Abrigo e Assistência</option><option>735 CRAS NORDESTE .-. Estrada Martin Felix Berta, 2357 .-. Casa de Abrigo e Assistência</option><option>738 AR4 .-. Rua Manoel Ferrador, 155 .-. Repartição pública</option><option>739 AR1 .-. Rua Dionisio João Pasin, 105 (antigo AR 9) .-. Repartição pública</option><option>740 CONSELHO TUTELAR MR10 .-. Rua Dr Marino Abraão, 25 .-. Repartição pública</option><option>741 SAMU MORRO SANTANA .-. Rua Heitor Pires, 248 .-. Repartição pública</option><option>742 FARMACIA DISTRITAL BOM JESUS .-. Avenida Protásio Alves, 7771 .-. Estabelecimentos de saúde</option><option>744 CRAS LESTE II .-. R. Emílio Keidan, 50 .-. Casa de Abrigo e Assistência</option><option>745 UBS TIJUCA .-. Rua Reverendo Daniel Betts, 319 .-. Estabelecimentos de saúde</option><option>746 UBS LARANJEIRAS .-. Rua 5, 24 Morro Santana .-. Estabelecimentos de saúde</option><option>747 UBS MORRO SANTANA .-. Rua Marieta Menna Barreto, 210 .-. Estabelecimentos de saúde</option><option>748 CAPS AD III CAMINHOS DO SOL .-. Av. Protásio Alves, 7585 - Alto Petrópolis, Porto Alegre .-. Estabelecimentos de saúde</option><option>800 ÁREA PINHEIRO .-. Estrada João De Oliveira Remião 5100 - Lomba do Pinheiro, Porto Alegre .-. Repartição pública</option><option>8001 PRACINHA DA CULTURA .-. Av. João de Oliveira Remião, 5252 .-. Praça / Parque</option><option>8002 PRAÇA PROFESSOR ALTAYR LUIZ BARISON .-. Beco do David, 2783 .-. Praça / Parque</option><option>8003 TERMINAL BONSUCESSO .-. Rua Tangará 391 .-. Terminal de ônibus</option><option>8004 PRAÇA TANGARA .-. R. Tangará, 310 - Lomba do Pinheiro, Porto Alegre - RS, 91570-350 .-. Praça / Parque</option><option>8005 TERMINAL PARADA 21 .-. Estrada João de Oliveira Remião, 8495 - Lomba do Pinheiro, Porto Alegre .-. Terminal de ônibus</option><option>8006 TERMINAL SANTA HELENA .-. Avenida Deputado Adão Preto, 1727 .-. Terminal de ônibus</option><option>8007 PRAÇA MAPA I .-. Rua Pedro Golombiewski, 152 .-. Praça / Parque</option><option>8008 PARADA 04 LOMBA DO PINHEIRO .-. Estrada João de Oliveira Remião, 1979 - Lomba do Pinheiro, Porto Alegre .-. Terminal de ônibus</option><option>8009 PARADA 09 LOMBA DO PINHEIRO .-. Estrada João de Oliveira Remião, 4463 - Lomba do Pinheiro, Porto Alegre .-. Terminal de ônibus</option><option>801 E.M.E.F. HEITOR V. LOBOS .-. Avenida Santo Dias Da Silva, 226 .-. Estabelecimento de ensino</option><option>8010 PARADA 13 LOMBA DO PINHEIRO .-. Estrada João de Oliveira Remião, 5400 - Lomba do Pinheiro, Porto Alegre .-. Terminal de ônibus</option><option>8011 PARADA 16 LOMBA DO PINHEIRO .-. Estrada João de Oliveira Remião, 6471 - Lomba do Pinheiro, Porto Alegre .-. Terminal de ônibus</option><option>8012 PARADA 24 LOMBA DO PINHEIRO .-. Estr. João de Oliveira Remião, 8949 - Lomba do Pinheiro .-. Terminal de ônibus</option><option>8013 TERMINAL QUINTA DO PONTAL .-. Rua Jaime Lino dos Santos Filho, 641 .-. Terminal de ônibus</option><option>802 E.M.E.F. GUERREIRO LIMA .-. Rua Guaiba 203 .-. Estabelecimento de ensino</option><option>803 CENTRO CULTURAL .-. Estrada João Oliveira Remião, 5378 - Lomba do Pinheiro, Porto Alegre .-. Repartição pública</option><option>804 E.M.E.F. SÃO PEDRO .-. Avenida Deputado Adão Pretto 1170 .-. Estabelecimento de ensino</option><option>805 E.M.E.F. SAINT' HILAIRE .-. Rua Gervazio Braga Pinheiro, 427 .-. Estabelecimento de ensino</option><option>806 CAD SMIC .-. Estrada Berico José Bernardes, 2939 .-. Repartição pública</option><option>808 VIVEIRO MUNICIPAL .-. Rua Victorino Luiz De Fraga, 1378 .-. Repartição pública</option><option>809 E.M.E.I. MARIA MARQUES FERNANDES .-. Avenida Santo Dias Da Silva, 677 .-. Estabelecimento de ensino</option><option>810 E.M.E.I. VILA MAPA 2 .-. Rua Pedro Golombiewski 112 .-. Estabelecimento de ensino</option><option>811 UBS HERDEIROS .-. Rua Alfredo Tôrres De Vasconcelos 90 .-. Estabelecimentos de saúde</option><option>812 UBS ESMERALDA .-. Rua Dolores Duran 1056 .-. Estabelecimentos de saúde</option><option>813 UPA LOMBA DO PINHEIRO .-. Estrada João De Oliveira Remião 5110 .-. Estabelecimentos de saúde</option><option>814 UBS MAPA .-. Rua Cel. Jaime Rolemberg De Lima 92 .-. Estabelecimentos de saúde</option><option>815 UBS PANORAMA .-. Rômulo Da Silva Pinheiro .-. Estabelecimentos de saúde</option><option>816 UBS VILA SÃO PEDRO .-. Rua São Pedro 526 .-. Estabelecimentos de saúde</option><option>817 UBS VILA VIÇOSA .-. Rua Orquídea 501 .-. Estabelecimentos de saúde</option><option>818 CEVIVE .-. Avenida Sen Salgado Filho, 2875 .-. Repartição pública</option><option>819 SMED CONSERVAÇÃO .-. Estrada João De Oliveira Remião 5100 .-. Repartição pública</option><option>820 E.M.E.I. NOVA SÃO CARLOS .-. Rua Darcy Reis Nunes 20 .-. Estabelecimento de ensino</option><option>821 CRIP PINHEIRO .-. Estrada João O Remião, 5450 .-. Repartição pública</option><option>822 CTMR9 .-. Estrada João De Oliveira Remião, 1178 .-. Repartição pública</option><option>823 ADMINISTRAÇÃO DO PARQUE SAINT'HILAIRE .-. Avenida Senador Salgado Filho 2875 .-. Praça / Parque</option><option>824 US LOMBA DO PINHEIRO .-. Estrada João De Oliveira Remião, 6123 .-. Estabelecimentos de saúde</option><option>825 US SANTA HELENA .-. Rua Pôr-Do-Sol 25 .-. Estabelecimentos de saúde</option><option>826 US RECREIO DA DIVISA .-. Estrada João De Oliveira Remião 6252 .-. Estabelecimentos de saúde</option><option>827 CREAS LOMBA DO PINHEIRO .-. Estrada João Oliveira Remião 5873 .-. Outros</option><option>828 CRAS AMPLIADO LOMBA DO PINHEIRO .-. Rua Jaime Rollemberg De Lima, 108 .-. Casa de Abrigo e Assistência</option><option>830 UNIDADE DE MEDICINA VETERINÁRIA - UMV .-. Estrada Bérico Bernardes, 3489 .-. Estabelecimentos de saúde</option><option>831 ESTAÇÃO DE TRANSBORDO .-. Estrada Afonso Lourenço Mariante, 4401 .-. Repartição pública</option><option>832 HORTA COMUNITÁRIA DA LOMBA DO PINHEIRO .-. Estr. João de Oliveira Remião, 5370 - Lomba do Pinheiro, Porto Alegre - RS, Brasil .-. Repartição pública</option><option>900 ÁREA EIXO SUL .-. Rua João Salomoni, 1340 .-. Repartição pública</option><option>9001 PARQUE PROFESSOR GAELZER .-. Rua Armando Barbedo, 861 .-. Praça / Parque</option><option>901 E.M.E.F. NEUSA BRIZOLA .-. Rua Monsenhor Ruben Neis,430 .-. Estabelecimento de ensino</option><option>902 E.M.E.F. MONTE CRISTO .-. Rua Carlos Superti, 84 .-. Estabelecimento de ensino</option><option>9029 PARQUE GABRIEL KNIJNIK .-. Rua Amapá, 2300 .-. Praça / Parque</option><option>903 E.M.E.F. LEOCÁDIA F. PRESTES .-. Rua Romeu De Vasconcellos Rosa, 10 .-. Estabelecimento de ensino</option><option>904 E.M.E.F. GILBERTO JORGE .-. Rua Morro Alto, 433 .-. Estabelecimento de ensino</option><option>905 E.M.E.F. CAMPOS DO CRISTAL .-. Beco Do Império, 75 .-. Estabelecimento de ensino</option><option>906 E.M.E.F. ANÍSIO TEIXEIRA .-. Rua Francisco Mattos Terres,40 .-. Estabelecimento de ensino</option><option>907 E.M.E.F. CHAPÉU DO SOL .-. Rua Gomercindo De Oliveira,47 .-. Estabelecimento de ensino</option><option>908 E.M.E.F. RINCÃO .-. Rua Luiz Otávio, 347 .-. Estabelecimento de ensino</option><option>909 E.M.E.I. VILA NOVA .-. Rua Fernando Pessoa, 350 .-. Estabelecimento de ensino</option><option>9091 ORLA DE IPANEMA .-. Av. Guaíba, 818 - Ipanema, Porto Alegre - RS, 91760-740 .-. Via urbana</option><option>9092 PARQUE ZENO SIMON .-. Avenida Guaíba, 3124 - Guarujá, .-. Praça / Parque</option><option>9093 PRAÇA ADEL CARVALHO .-. Rua Edgar Luiz Schneider, 435 .-. Praça / Parque</option><option>9094 PRAÇA BERNARDO DREHER .-. Rua Morano Calabro,246 .-. Praça / Parque</option><option>9095 PRAÇA APIACÁ .-. Praça Apiacá .-. Praça / Parque</option><option>9097 PRAÇA MAJOR TITO .-. Rua Nossa Senhora Do Rosário .-. Praça / Parque</option><option>9098 PRAÇA MARIANA E MALANE FRANCO CASAGRANDE .-. Rua Carlos José Michelon - Vila Nova, Porto Alegre .-. Praça / Parque</option><option>9099 PRAÇA FRANCISCO PERASI .-. R. Dr. Pereira Neto, 2115 - Tristeza .-. Praça / Parque</option><option>910 E.M.E.I. JARDIM SALOMONI .-. R Joaquim De Carvalho, 325 .-. Estabelecimento de ensino</option><option>911 E.M.E.I. MARIA HELENA GUSMÃO .-. Rua Silvino Oliveira,250 .-. Estabelecimentos de saúde</option><option>912 E.M.E.I. JARDIM CAMAQUÃ .-. Rua Jardim Das Bromélias,130 .-. Estabelecimento de ensino</option><option>913 E.M.E.I. PONTA GROSSA .-. Estrada Retiro Da Ponta Grossa, 3581 .-. Estabelecimento de ensino</option><option>914 UBS RINCÃO .-. Estrada Afonso Lourenço Mariante, 1410 .-. Estabelecimentos de saúde</option><option>916 UBS CAMPOS DO CRISTAL .-. Rua Cristiano Kraemer, 450 .-. Estabelecimentos de saúde</option><option>917 UBS CAMPO NOVO .-. Rua Colina, 160 .-. Estabelecimentos de saúde</option><option>918 UBS MONTE CRISTO .-. Rua Alfredo Da Luz Padilha, 34 .-. Estabelecimentos de saúde</option><option>919 UBS CALÁBRIA .-. Rua Gervásio Da Rosa, 51 .-. Estabelecimentos de saúde</option><option>920 UBS CAMAQUÃ .-. Rua Prof.Dr. João Pitta Pinheiro Filho, 176 .-. Estabelecimentos de saúde</option><option>921 UBS TRISTEZA .-. Avenida Wenceslau Escobar, 2442 .-. Estabelecimentos de saúde</option><option>922 UBS JARDIM DAS PALMEIRAS .-. Rua Ângelo Barbosa, 38 .-. Estabelecimentos de saúde</option><option>923 UBS CIDADE DE DEUS .-. Rua Da Fé, 350 .-. Estabelecimentos de saúde</option><option>924 UBS PONTA GROSSA .-. Estrada Da Ponta Grossa, 3023 .-. Estabelecimentos de saúde</option><option>925 UBS BECO DO ADELAR .-. Avenida Juca Batista, 3480 .-. Estabelecimentos de saúde</option><option>926 UBS GUARUJÁ .-. Avenida Guarujá ,190 .-. Estabelecimentos de saúde</option><option>927 UBS IPANEMA .-. Avenida Tramandaí, 351 .-. Estabelecimentos de saúde</option><option>928 US MORRO DOS SARGENTOS .-. Rua Argemiro Oganda Corrêa 330 .-. Estabelecimentos de saúde</option><option>932 CTMR6 .-. Rua Eng. Coelho Parreira, 585 .-. Repartição pública</option><option>933 PSF NOSSA SENHORA DE BELÉM .-. Rua João Couto, 294 .-. Repartição pública</option><option>935 SME OFICINAS .-. Avenida Cavalhada, 6735 .-. Repartição pública</option><option>936 UBS NOVA IPANEMA .-. Rua Nova Ipanema, 130 .-. Estabelecimentos de saúde</option><option>937 BASE SAMU .-. Rua Denize Crespo Gay Da Fonseca .-. Outros</option><option>938 UBS CHAPÉU DO SOL .-. Rua Gomercindo De Oliveira,75 .-. Estabelecimentos de saúde</option><option>939 CRIP SUL .-. Eduardo Prado 1921 .-. Repartição pública</option><option>941 ABRIGO SABIÁ V .-. Rua Miguel Ascolese, 97 .-. Repartição pública</option><option>942 CREAS SUL E CENTRO SUL .-. Rua Engenheiro Tito Marques Fernandes, 409 .-. Outros</option><option>943 CRAS SUL .-. Avenida Serraria, 1145 .-. Casa de Abrigo e Assistência</option><option>944 CRAS EXTREMO SUL .-. Rua Gomercindo De Oliveira , 23 .-. Casa de Abrigo e Assistência</option><option>945 CEMITÉRIO MUNICIPAL DA TRISTEZA .-. Rua Liberal, 19 .-. Repartição pública</option><option>946 ABRIGO QUERO-QUERO .-. Rua Padre João Batista Réus, 838 .-. Repartição pública</option><option>947 UBS COHAB .-. Rua Paulo Maciel, 220 .-. Estabelecimentos de saúde</option><option>948 CENTRO DIA DO IDOSO .-. Rua Silvio Silveira Soares, 2713 .-. Repartição pública</option><option>949 EQUIPE DE SAÚDE DA CRIANÇA E DO ADOLESCENTE SCS .-. Av. João Vedana, nº 355 .-. Estabelecimentos de saúde</option><option>950 DEPÓSITO DEFESA CIVIL .-. Rua Dr Barcelos .-. Repartição pública</option><option>951 SUBPREFEITURA CENTRO-SUL .-. Rua João Salomoni, 1340 .-. Repartição pública</option><option>9930 PARQUE MORRO DO OSSO .-. Rua Irmã Jacomina Veronese, 170 .-. Praça / Parque</option><option>Andradas x Gen. Câmara .-. R. Gen. Câmara, 243 - Centro Histórico, Porto Alegre - RS, 90010-230 .-. Via urbana</option><option>ARROIO DO MANECÃO .-. Rua Luiz Corrêa da Silva, 4501 .-. Rio / Lago / Represa</option><option>Dr. Flores x Otávio Rocha .-. Praça Otávio Rocha, 100-76 - Centro Histórico, Porto Alegre - RS, 90020-006 .-. Via urbana</option><option>ESQUINA DEMOCRÁTICA .-. R. dos Andradas, 200 - Centro Histórico, Porto Alegre - RS, 90020-023 .-. Via urbana</option><option>ESTUR - ESCRITÓRIO DETURISMO .-. Travessa do Carmo, 84 .-. Repartição pública</option><option>Igreja Missão Americana .-. Av. Francisco Silveira Bitencourt, 734 - Sarandi .-. Centro Religioso</option><option>Marechal X Andradas .-. R. dos Andradas, 1480 - Centro Histórico, Porto Alegre .-. Via urbana</option><option>ÁREA DE INTERESSE DA PMPA .-. Rua Vida Alegre, 200 - Sarandi .-. Terreno baldio</option><option>Terreno Bento Gonçalves .-. Avenida Bento Gonçalves, 5653 .-. Terreno baldio</option><option>Terreno Centro DMAE .-. Av. Loureiro da Silva, 104 - Cidade Baixa, Porto Alegre - RS, 90010-420 .-. Terreno baldio</option><option>Terreno Centro Receira Federal .-. Av. Loureiro da Silva, 678 - Cidade Baixa, Porto Alegre - RS, 90050-240 .-. Terreno baldio</option><option>Terreno Humaitá .-. R. Voluntários da Pátria, 314 - Centro Histórico, Porto Alegre - RS, 90030-001 .-. Terreno baldio</option><option>Terreno São Geraldo .-. R. Voluntários da Pátria, 3522 - Centro Histórico, Porto Alegre - RS, 90230-010 .-. Terreno baldio</option><option>Terreno Sarandi .-. R. Sérgio Jungblut Dieterich, 1201 - Sarandi, Porto Alegre - RS, 91060-410 .-. Terreno baldio</option><option>Terreno Serraria .-. Av. da Serraria, 2517 - Espírito Santo, Porto Alegre - RS, 91770-010 .-. Terreno baldio</option><option>Terreno Tresmaiense .-. Av. dos Estados, 1653 - Anchieta .-. Terreno baldio</option><option>Terreno Voluntários da Pátria .-. 2Q9X+MQP Porto Alegre, RS .-. Terreno baldio</option><option>ENTORNO BEIRA RIO .-. R. Nestor Ludwig .-. Via urbana</option>";
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
            if (localStorage.getItem("dados_para_o_cad") && document.getElementById('cod_montar_cad') && document.querySelector('app-logradouro-autocomplete input[placeholder="Por Favor Informe ao Menos 3 caracteres"]') && document.querySelector('app-protocolo-tempo-chamado').innerHTML.includes('GM-POA2025')) {
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
                        if (document.querySelectorAll("app-regiao-selecionavel")[i].innerHTML.includes(area)) {
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
                            document.querySelectorAll('mat-option')[2].click();
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
                            document.querySelector('textarea[formcontrolname="relato"]').value = 'A guarnição NUM_NOM_GU realizou uma abordagem onde foi consultada a ficha criminal do indivíduo bem como realizada a revista pessoal.Não tendo sido encontrado nada em seu desfavor, foi liberado. Ação realizada dentro da normalidade.';
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
                atalho_botao_salvar(document.querySelectorAll('app-edicao-ocorrencia-formulario button[botaoconfirmar]')[2]);
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
            if (document.querySelector('app-finalizar-ocorrencia-modal') && document.querySelector('app-async-data-loading') && document.querySelector('app-async-data-loading').querySelector('span') && document.querySelector('app-async-data-loading').innerHTML.includes('GM-POA')) {
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
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-CONSULTA AO SISTEMA DE FICHA CRIMINAL-&-input[placeholder="Selecione a Natureza Final"]-&-ABORDAGEM A PESSOA EM ATITUDE SUSPEITA-&-');
                    } else if (natureza_inicial == 'Exercício Ilegal de Profissão Ou Atividade') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-EXERCÍCIO ILEGAL DE PROFISSÃO OU ATIVIDADE-&-');
                    } else if (natureza_inicial == 'Assistência Humanitária') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-ASSISTÊNCIA HUMANITÁRIA-&-');
                    } else if (natureza_inicial == 'Paciente Alterado') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-COMUNICAÇÃO - ORIENTAÇÃO DAS PARTES-&-input[placeholder="Selecione a Natureza Final"]-&-FUGA DE PACIENTE-&-');
                    } else if (natureza_inicial == 'Apoio Ao Samu') {
                        localStorage.setItem('selecionaopcao', 'input[placeholder="Selecione a Categoria"]-&-Finalizado no Local-&-input[placeholder="Selecione o Motivo"]-&-Averiguação Policial sem Alteração-&-input[placeholder="Selecione a Natureza Final"]-&-EMERGÊNCIA PSIQUIÁTRICA-&-');
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
                        document.querySelectorAll('div[class="barra-botoes-container"]')[0].innerHTML += '<div style=display:inline-block><input type="checkbox" checked id="selecionacad1" name="selecionacad1" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for="selecionacad1">Cad 1</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad2" name="cad2" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad2>Cad 2</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad3" name="cad3" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad3>Cad 3</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad4" name="cad4" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad4>Cad 4</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad5" name="cad5" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad5>Sem empenho</label></div><div style=display:inline-block><input type="checkbox" checked id="selecionacad6" name="cad6" style=display:inline-block /><label style=display:inline-block;user-select:none;cursor:pointer for=selecionacad6>Somente meus cads</label></div>'
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
                            var cads = document.querySelectorAll('div[class="barra-botoes-container"]')[0].querySelectorAll('input[type="checkbox"]');
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

            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && document.querySelector('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia p[class*="dado-card protocolo"]') && (!document.querySelector('app-ocorrencias-despachadas-golden-layout').innerHTML.includes('GM-POA2025') || !document.querySelector('app-ocorrencias-nao-despachadas-golden-layout').innerHTML.includes('GM-POA2025'))) {
                document.querySelector("#painelMenuFiltrosOcorrenciasDespachadas div[class*= toggle-switch]").click();
                if (document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]").length - 1].checked == true) {
                    document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasDespachadas input[type=checkbox]").length - 1].click();
                }
                document.querySelector("#painelMenuFiltrosOcorrenciasNaoDespachadas div[class*= toggle-switch]").click();
                if (document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]").length - 1].checked == true) {
                    document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]")[document.querySelectorAll("#painelMenuFiltrosOcorrenciasNaoDespachadas input[type=checkbox]").length - 1].click();
                }
                document.querySelectorAll('app-ocorrencias-nao-despachadas-golden-layout app-card-ocorrencia').forEach(item => {
                    item.querySelector('p[class*="dado-card protocolo"]').style.display = 'none';
                    item.querySelector('p[class*="data-hora"]').style.display = 'none';
                    Array.from(item.querySelectorAll('p[class*=dado-card]')).filter(p => p.innerText.includes('GM-POA')).forEach(i => { i.style.display = 'none' });
                })
            }
            if (document.querySelector('app-ocorrencias-despachadas-golden-layout') && document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))') && Array.from(document.querySelector('app-ocorrencias-despachadas-golden-layout').querySelector('app-card-ocorrencia:not(:has(button[acao="Referenciar CAD"]))').querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('GM-POA2025'))[0]) {
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
                area = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes(' GM-POA'))[0];
                let tipo_local = '';
                if (Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('Tipo Local'))[0]) {
                    tipo_local = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('Tipo Local'))[0].innerHTML.split('Tipo Local:')[1].trim();
                }
                var n_registro = Array.from(cad.querySelectorAll('p')).filter((dado) => dado.innerHTML.includes('GM-POA2025'))[0];
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
        if (event.key === 'Enter' && event.altKey) {
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
