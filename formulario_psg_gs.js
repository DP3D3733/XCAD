chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("Balanço de Fiscalização", (d) => {
        if (d['Balanço de Fiscalização'] == 'desativado') return;
        //Necessário para podermos inserir elementos dinamicamente no formulário
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string
            });
        }
        //lista de campos a serem utilizados como referência para coletar os dados para a minuta do relatório
        var campos = ['div[data-params*="DATA DE INÍCIO DO PLANTÃO"]', 'div[data-params*="INFORME O TURNO"]', 'div[data-params*="INFORME O GS"]', 'div[data-params*="INFORME O Nº DA ORDEM DE SERVIÇO"]', 'div[data-params*="COGM"]', 'div[data-params*="DENÚNCIAS 156POA"]', 'div[data-params*="DENÚNCIAS CAD / EPTC"]', 'div[data-params*="DENÚNCIAS WATSAPP"]', 'div[data-params*="FISCALIZADOS"]', 'div[data-params*="ORIENTADOS"]', 'div[data-params*="AUTUADOS"]', 'div[data-params*="INTERDITADOS"]', 'div[data-params*="TROTES"]', 'div[data-params*="INFORMAÇÕES"]', 'div[data-params*="TOTAL DE CAD"]', 'div[data-params*="FECHADO APÓS ORIENTAÇÃO"]', 'div[data-params*="TOTAL DE LIGAÇÕES"]', 'div[data-params*="NÃO ATENDIDAS"]', 'div[data-params*="APOIO SAMU"]', 'div[data-params*="GU 21"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 21"]', 'div[data-params*="GU 22"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 22"]', 'div[data-params*="QAP(CIENTE DA OS) DA 21"]', 'div[data-params*="GU 31"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 31"]', 'div[data-params*="GU 32"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 32"]', 'div[data-params*="QAP(CIENTE DA OS) DA 31"]', 'div[data-params*="GU 41"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 41"]', 'div[data-params*="GU 42"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 42"]', 'div[data-params*="QAP(CIENTE DA OS) DA 41"]', 'div[data-params*="GU 51"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 51"]', 'div[data-params*="GU 52"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 52"]', 'div[data-params*="QAP(CIENTE DA OS) DA 51"]', 'div[data-params*="GU 61"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 61"]', 'div[data-params*="GU 62"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 62"]', 'div[data-params*="QAP(CIENTE DA OS) DA 61"]', 'div[data-params*="GU 71"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 71"]', 'div[data-params*="GU 72"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 72"]', 'div[data-params*="QAP(CIENTE DA OS) DA 71"]', 'div[data-params*="GU 81"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 81"]', 'div[data-params*="GU 82"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 82"]', 'div[data-params*="QAP(CIENTE DA OS) DA 81"]', 'div[data-params*="GU 91"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 91"]', 'div[data-params*="GU 92"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA GU 92"]', 'div[data-params*="QAP(CIENTE DA OS) DA 91"]', 'div[data-params*="GSO ROMU"]', 'div[data-params*="GSP ROMU"]', 'div[data-params*="PLANTÃO ROMU"]', 'div[data-params*="PORTARIA ROMU"]', 'div[data-params*="R1"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA R1"]', 'div[data-params*="R2"]:not([data-params*="VTR"])', 'div[data-params*="QAP(CIENTE DA OS) DA R1"]', 'div[data-params*="VTR DA R2"]', 'div[data-params*="R3"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA R3"]', 'div[data-params*="R4"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA R4"]', 'div[data-params*="R5"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA R5"]', 'div[data-params*="R6"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA R6"]', 'div[data-params*="GSP CENTRO"]', 'div[data-params*="PLANTÃO CENTRO"]', 'div[data-params*="PORTARIA CENTRO"]', 'div[data-params*="C1"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C1"]', 'div[data-params*="C2"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C2"]', 'div[data-params*="QAP(CIENTE DA OS) DA C1"]', 'div[data-params*="C3"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C3"]', 'div[data-params*="C4"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C4"]', 'div[data-params*="C5"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C5"]', 'div[data-params*="C6"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C6"]', 'div[data-params*="C7"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C7"]', 'div[data-params*="C8"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA C8"]', 'div[data-params*="P1"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA P1"]', 'div[data-params*="P2"]:not([data-params*="VTR"])', 'div[data-params*="VTR DA P2"]', 'div[data-params*="QAP(CIENTE DA OS) DA PATAM"]', 'div[data-params*="DEMANDAS NÃO ATENDIDAS"]', 'div[data-params*="RELATO"]'];

        //map que irá informar a relação campo no formulário/campo no JSON
        var map_campos_chave = new Map();
        function popular_map() {
            map_campos_chave.set('div[data-params*="DATA DE INÍCIO DO PLANTÃO"]', 'data');
            map_campos_chave.set('div[data-params*="INFORME O TURNO"]', 'turno');
            map_campos_chave.set('div[data-params*="INFORME O GS"]', 'gs');
            map_campos_chave.set('div[data-params*="INFORME O Nº DA ORDEM DE SERVIÇO"]', 'os');
            map_campos_chave.set('div[data-params*="COGM"]', 'cogm');
            map_campos_chave.set('div[data-params*="GU 21"]:not([data-params*="VTR"])', 'gu_21');
            map_campos_chave.set('div[data-params*="VTR DA GU 21"]', 'vtr_21');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 21"]', 'qap_21');
            map_campos_chave.set('div[data-params*="GU 22"]:not([data-params*="VTR"])', 'gu_22');
            map_campos_chave.set('div[data-params*="VTR DA GU 22"]', 'vtr_22');
            map_campos_chave.set('div[data-params*="GU 31"]:not([data-params*="VTR"])', 'gu_31');
            map_campos_chave.set('div[data-params*="VTR DA GU 31"]', 'vtr_31');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 31"]', 'qap_31');
            map_campos_chave.set('div[data-params*="GU 32"]:not([data-params*="VTR"])', 'gu_32');
            map_campos_chave.set('div[data-params*="VTR DA GU 32"]', 'vtr_32');
            map_campos_chave.set('div[data-params*="GU 41"]:not([data-params*="VTR"])', 'gu_41');
            map_campos_chave.set('div[data-params*="VTR DA GU 41"]', 'vtr_41');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 41"]', 'qap_41');
            map_campos_chave.set('div[data-params*="GU 42"]:not([data-params*="VTR"])', 'gu_42');
            map_campos_chave.set('div[data-params*="VTR DA GU 42"]', 'vtr_42');
            map_campos_chave.set('div[data-params*="GU 51"]:not([data-params*="VTR"])', 'gu_51');
            map_campos_chave.set('div[data-params*="VTR DA GU 51"]', 'vtr_51');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 51"]', 'qap_51');
            map_campos_chave.set('div[data-params*="GU 52"]:not([data-params*="VTR"])', 'gu_52');
            map_campos_chave.set('div[data-params*="VTR DA GU 52"]', 'vtr_52');
            map_campos_chave.set('div[data-params*="GU 61"]:not([data-params*="VTR"])', 'gu_61');
            map_campos_chave.set('div[data-params*="VTR DA GU 61"]', 'vtr_61');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 61"]', 'qap_61');
            map_campos_chave.set('div[data-params*="GU 62"]:not([data-params*="VTR"])', 'gu_62');
            map_campos_chave.set('div[data-params*="VTR DA GU 62"]', 'vtr_62');
            map_campos_chave.set('div[data-params*="GU 71"]:not([data-params*="VTR"])', 'gu_71');
            map_campos_chave.set('div[data-params*="VTR DA GU 71"]', 'vtr_71');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 71"]', 'qap_71');
            map_campos_chave.set('div[data-params*="GU 72"]:not([data-params*="VTR"])', 'gu_72');
            map_campos_chave.set('div[data-params*="VTR DA GU 72"]', 'vtr_72');
            map_campos_chave.set('div[data-params*="GU 81"]:not([data-params*="VTR"])', 'gu_81');
            map_campos_chave.set('div[data-params*="VTR DA GU 81"]', 'vtr_81');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 81"]', 'qap_81');
            map_campos_chave.set('div[data-params*="GU 82"]:not([data-params*="VTR"])', 'gu_82');
            map_campos_chave.set('div[data-params*="VTR DA GU 82"]', 'vtr_82');
            map_campos_chave.set('div[data-params*="GU 91"]:not([data-params*="VTR"])', 'gu_91');
            map_campos_chave.set('div[data-params*="VTR DA GU 91"]', 'vtr_91');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA 91"]', 'qap_91');
            map_campos_chave.set('div[data-params*="GU 92"]:not([data-params*="VTR"])', 'gu_92');
            map_campos_chave.set('div[data-params*="VTR DA GU 92"]', 'vtr_92');
            map_campos_chave.set('div[data-params*="C1"]:not([data-params*="VTR"])', 'gu_c1');
            map_campos_chave.set('div[data-params*="VTR DA C1"]', 'vtr_c1');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA C1"]', 'qap_c1');
            map_campos_chave.set('div[data-params*="C2"]:not([data-params*="VTR"])', 'gu_c2');
            map_campos_chave.set('div[data-params*="VTR DA C2"]', 'vtr_c2');
            map_campos_chave.set('div[data-params*="C3"]:not([data-params*="VTR"])', 'gu_c3');
            map_campos_chave.set('div[data-params*="VTR DA C3"]', 'vtr_c3');
            map_campos_chave.set('div[data-params*="C4"]:not([data-params*="VTR"])', 'gu_c4');
            map_campos_chave.set('div[data-params*="VTR DA C4"]', 'vtr_c4');
            map_campos_chave.set('div[data-params*="C5"]:not([data-params*="VTR"])', 'gu_c5');
            map_campos_chave.set('div[data-params*="VTR DA C5"]', 'vtr_c5');
            map_campos_chave.set('div[data-params*="C6"]:not([data-params*="VTR"])', 'gu_c6');
            map_campos_chave.set('div[data-params*="VTR DA C6"]', 'vtr_c6');
            map_campos_chave.set('div[data-params*="C7"]:not([data-params*="VTR"])', 'gu_c7');
            map_campos_chave.set('div[data-params*="VTR DA C7"]', 'vtr_c7');
            map_campos_chave.set('div[data-params*="C8"]:not([data-params*="VTR"])', 'gu_c8');
            map_campos_chave.set('div[data-params*="VTR DA C8"]', 'vtr_c8');
            map_campos_chave.set('div[data-params*="R1"]:not([data-params*="VTR"])', 'gu_r1');
            map_campos_chave.set('div[data-params*="VTR DA R1"]', 'vtr_r1');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA R1"]', 'qap_r1');
            map_campos_chave.set('div[data-params*="R2"]:not([data-params*="VTR"])', 'gu_r2');
            map_campos_chave.set('div[data-params*="VTR DA R2"]', 'vtr_r2');
            map_campos_chave.set('div[data-params*="R3"]:not([data-params*="VTR"])', 'gu_r3');
            map_campos_chave.set('div[data-params*="VTR DA R3"]', 'vtr_r3');
            map_campos_chave.set('div[data-params*="R4"]:not([data-params*="VTR"])', 'gu_r4');
            map_campos_chave.set('div[data-params*="VTR DA R4"]', 'vtr_r4');
            map_campos_chave.set('div[data-params*="R5"]:not([data-params*="VTR"])', 'gu_r5');
            map_campos_chave.set('div[data-params*="VTR DA R5"]', 'vtr_r5');
            map_campos_chave.set('div[data-params*="R6"]:not([data-params*="VTR"])', 'gu_r6');
            map_campos_chave.set('div[data-params*="VTR DA R6"]', 'vtr_r6');
            map_campos_chave.set('div[data-params*="P1"]:not([data-params*="VTR"])', 'gu_p1');
            map_campos_chave.set('div[data-params*="VTR DA P1"]', 'vtr_p1');
            map_campos_chave.set('div[data-params*="QAP(CIENTE DA OS) DA PATAM"]', 'qap_p1');
            map_campos_chave.set('div[data-params*="P2"]:not([data-params*="VTR"])', 'gu_p2');
            map_campos_chave.set('div[data-params*="VTR DA P2"]', 'vtr_p2');
            map_campos_chave.set('div[data-params*="GSO ROMU"]', 'gso_romu');
            map_campos_chave.set('div[data-params*="GSP ROMU"]', 'gsp_romu');
            map_campos_chave.set('div[data-params*="PLANTÃO ROMU"]', 'gp_romu');
            map_campos_chave.set('div[data-params*="PORTARIA ROMU"]', 'portaria_romu');
            map_campos_chave.set('div[data-params*="GSP CENTRO"]', 'gsp_centro');
            map_campos_chave.set('div[data-params*="PLANTÃO CENTRO"]', 'gp_centro');
            map_campos_chave.set('div[data-params*="PORTARIA CENTRO"]', 'portaria_centro');
            map_campos_chave.set('div[data-params*="DENÚNCIAS 156POA"]', 'denuncias_153');
            map_campos_chave.set('div[data-params*="DENÚNCIAS CAD / EPTC"]', 'denuncias_cad_eptc');
            map_campos_chave.set('div[data-params*="DENÚNCIAS WATSAPP"]', 'denuncias_whats');
            map_campos_chave.set('div[data-params*="FISCALIZADOS"]', 'fiscalizados');
            map_campos_chave.set('div[data-params*="ORIENTADOS"]', 'orientados');
            map_campos_chave.set('div[data-params*="AUTUADOS"]', 'autuados');
            map_campos_chave.set('div[data-params*="INTERDITADOS"]', 'interditados');
            map_campos_chave.set('div[data-params*="TROTES"]', 'trotes');
            map_campos_chave.set('div[data-params*="INFORMAÇÕES"]', 'informações');
            map_campos_chave.set('div[data-params*="TOTAL DE CAD"]', 'total_de_cads');
            map_campos_chave.set('div[data-params*="FECHADO APÓS ORIENTAÇÃO"]', 'fechados');
            map_campos_chave.set('div[data-params*="TOTAL DE LIGAÇÕES"]', 'total_de_ligações');
            map_campos_chave.set('div[data-params*="NÃO ATENDIDAS"]', 'não_atendidas');
            map_campos_chave.set('div[data-params*="APOIO SAMU"]', 'apoio_samu');
            map_campos_chave.set('div[data-params*="DEMANDAS NÃO ATENDIDAS"]', 'demandas_não_atendidas');
            map_campos_chave.set('div[data-params*="RELATO"]', 'relato');
        }
        popular_map();

        //coleta os dados dos campos conforme forem aparecendo na tela e insere no JSON armazenado no localStorage
        function atualiza_bd(campo) {
            if (document.querySelector(campo)) {
                let relatorio = JSON.parse(localStorage.getItem('resumo_relatorio'));
                let valor = '';
                if (document.querySelector(campo).querySelector('div[role=list]')) {
                    document.querySelector(campo).querySelectorAll('div[role=list] div[aria-checked=true]').forEach((input) => {
                        valor += input.getAttribute('aria-label') + ', ';
                    });
                    valor = valor.slice(0, -2);
                } else if (document.querySelector(campo).querySelector('div[role=listbox]')) {
                    valor = document.querySelector(campo).querySelector('div[role=listbox] div[aria-selected=true]').getAttribute('data-value');
                } else if (document.querySelector(campo).querySelector('div[role=group]') && document.querySelector(campo).querySelector('div[role=checkbox]')) {
                    let funcoes = {};
                    document.querySelector(campo).querySelectorAll('div[role=checkbox][aria-checked=true]').forEach((input) => {
                        if (funcoes[input.getAttribute('aria-label').split(' resposta para ')[1]]) {
                            funcoes[input.getAttribute('aria-label').split(' resposta para ')[1]] += ', ' + input.getAttribute('data-answer-value');
                        } else {
                            funcoes[input.getAttribute('aria-label').split(' resposta para ')[1]] = input.getAttribute('data-answer-value');
                        }
                    });
                    valor = funcoes;
                } else if (document.querySelector(campo).querySelector('div[role=group]') && document.querySelector(campo).querySelector('input[role=combobox]')) {
                    valor = document.querySelector(campo).querySelectorAll('input[role=combobox]')[0].value + ':' + document.querySelector(campo).querySelectorAll('input[role=combobox]')[1].value;
                } else if (document.querySelector(campo).querySelector('textarea')) {
                    valor = document.querySelector(campo).querySelector('textarea').value;
                } else {
                    valor = document.querySelector(campo).querySelector('input').value;
                }
                if (relatorio[map_campos_chave.get(campo)] != valor) {
                    relatorio[map_campos_chave.get(campo)] = valor;
                    localStorage.setItem('resumo_relatorio', JSON.stringify(relatorio));
                }
            }
        }


        setInterval(function () {
            //cria e gerencia os modelos de relato
            if (document.querySelector('div[data-params*="RELATO"]')) {
                if (!document.querySelector('div[modelos_relatorio]')) {
                    document.querySelector('div[data-params*="RELATO"]').insertAdjacentHTML('beforebegin', '<div modelos_relatorio><button id=but_salvar_como_modelo class="uArJ5e UQuaGc YhQJj zo8FOc ctEux">Salvar Como Modelo</button><button id=but_inserir_modelo class="uArJ5e UQuaGc YhQJj zo8FOc ctEux">Inserir Modelo</button></div><div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5);"> <div class="modal-content" style="background-color: white; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%; max-width: 500px;"> <span class="close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span> <h2>Escolha seu modelo:</div></div>');
                    document.querySelector('#but_salvar_como_modelo').addEventListener('click', function () {
                        let relato = document.querySelector('div[data-params*="RELATO"] textarea').value;
                        if (relato == '') {
                            alert('Campo relato em branco!');
                        } else {
                            localStorage.setItem('modelos_relato', (localStorage.getItem('modelos_relato') || '') + '-()-' + relato);
                            document.querySelector('#myModal h2').insertAdjacentHTML('afterend', '<div modelo class="uArJ5e UQuaGc YhQJj zo8FOc ctEux">' + relato.replaceAll('\n', '<br>') + '</div>');
                            alert('Modelo salvo com sucesso!');
                        }
                    });
                    document.querySelector('#but_inserir_modelo').addEventListener('click', function () {
                        document.querySelector('#myModal').style.display = '';
                        if (localStorage.getItem('modelos_relato') && localStorage.getItem('modelos_relato') != '') {
                            localStorage.getItem('modelos_relato').split('-()-').forEach(function (modelo) {
                                document.querySelector('#myModal h2').insertAdjacentHTML('afterend', '<div modelo class="uArJ5e UQuaGc YhQJj zo8FOc ctEux">' + modelo.replaceAll('\n', '<br>') + '</div><br>');
                            });
                            document.querySelectorAll('#myModal div[modelo]').forEach(function (modelo) {
                                modelo.addEventListener('click', function () {
                                    document.querySelector('div[data-params*="RELATO"] textarea').value += modelo.innerText;
                                    document.querySelector('div[data-params*="RELATO"] textarea').dispatchEvent(new Event('input', { bubbles: true }));
                                    document.getElementsByClassName("close")[0].click();
                                });
                            });
                        }
                    });
                    document.getElementsByClassName("close")[0].addEventListener('click', function () {
                        document.querySelector('#myModal').style.display = 'none';
                        document.querySelectorAll('#myModal div[modelo]').forEach(function (item) {
                            item.remove();
                        });
                    });
                }
            }

            //gera o item no bd local, caso já não tenha, que armazenará os dados do formulário para a minuta do relatório
            if (!localStorage.getItem('resumo_relatorio')) {
                let relatorio = {
                    data: '',
                    turno: '',
                    gs: '',
                    os: '',
                    cogm: '',
                    gu_21: '',
                    vtr_21: '',
                    qap_21: '',
                    gu_22: '',
                    vtr_22: '',
                    gu_31: '',
                    vtr_31: '',
                    qap_31: '',
                    gu_32: '',
                    vtr_32: '',
                    gu_41: '',
                    vtr_41: '',
                    qap_41: '',
                    gu_42: '',
                    vtr_42: '',
                    gu_51: '',
                    vtr_51: '',
                    qap_51: '',
                    gu_52: '',
                    vtr_52: '',
                    gu_61: '',
                    vtr_61: '',
                    qap_61: '',
                    gu_62: '',
                    vtr_62: '',
                    gu_71: '',
                    vtr_71: '',
                    qap_71: '',
                    gu_72: '',
                    vtr_72: '',
                    gu_81: '',
                    vtr_81: '',
                    qap_81: '',
                    gu_82: '',
                    vtr_82: '',
                    gu_91: '',
                    vtr_91: '',
                    qap_91: '',
                    gu_92: '',
                    vtr_92: '',
                    gu_c1: '',
                    vtr_c1: '',
                    qap_c1: '',
                    gu_c2: '',
                    vtr_c2: '',
                    gu_c3: '',
                    vtr_c3: '',
                    gu_c4: '',
                    vtr_c4: '',
                    gu_c5: '',
                    vtr_c5: '',
                    gu_c6: '',
                    vtr_c6: '',
                    gu_c7: '',
                    vtr_c7: '',
                    gu_c8: '',
                    vtr_c8: '',
                    gu_c9: '',
                    vtr_c9: '',
                    gu_r1: '',
                    vtr_r1: '',
                    qap_r1: '',
                    gu_r2: '',
                    vtr_r2: '',
                    gu_r3: '',
                    vtr_r3: '',
                    gu_r4: '',
                    vtr_r4: '',
                    gu_r5: '',
                    vtr_r5: '',
                    gu_r6: '',
                    vtr_r6: '',
                    gu_p1: '',
                    vtr_p1: '',
                    qap_p1: '',
                    gso_romu: '',
                    gsp_romu: '',
                    gp_romu: '',
                    portaria_romu: '',
                    gsp_centro: '',
                    gp_centro: '',
                    portaria_centro: '',
                    denuncias_153: '',
                    denuncias_cad_eptc: '',
                    denuncias_whats: '',
                    fiscalizados: '',
                    orientados: '',
                    autuados: '',
                    interditados: '',
                    trotes: '',
                    informações: '',
                    total_de_cads: '',
                    fechados: '',
                    total_de_ligações: '',
                    não_atendidas: '',
                    apoio_samu: '',
                    demandas_não_atendidas: '',
                    relato: ''
                };
                localStorage.setItem('resumo_relatorio', JSON.stringify(relatorio));
            };

            //reseta preferências diárias do relatório
            if (!localStorage.getItem('minuta_relatorio_preferencias_hoje') || !localStorage.getItem('minuta_relatorio_preferencias_hoje').includes(new Date().getDate() + '-' + (new Date().getMonth() + 1))) {
                localStorage.setItem('minuta_relatorio_preferencias_hoje', new Date().getDate() + '-' + (new Date().getMonth() + 1));
            }

            //fica constantemente atualizando o bd local com os dados dos campos do formulário, futuramente implementar um eventlistener
            campos.forEach((campo) => {
                atualiza_bd(campo);
            });
            //insere a minuto do relatório na última página
            if (document.querySelector('div[data-params*="E-MAILS"]') && localStorage.getItem('resumo_relatorio') && !document.querySelector('#resumo_relatorio')) {
                let relatorio = JSON.parse(localStorage.getItem('resumo_relatorio'));
                let resumo_relatorio = document.createElement("div");
                resumo_relatorio.setAttribute('class', 'vfQisd Q8wTDd OIC90c');
                resumo_relatorio.setAttribute("id", "resumo_relatorio");
                let innerHTML_resumo = '<strong>MINUTA DO RELATÓRIO</strong><br><br><strong>DATA DE INÍCIO DO PLANTÃO:</strong>' + relatorio.data + '<br><strong>TURNO:</strong>' + relatorio.turno + '<br><strong>GS:</strong>' + relatorio.gs + '<br><strong>ORDEM DE SERVIÇO:</strong>' + relatorio.os + '<br><br><strong>CAD 1 NORTE:</strong>' + relatorio.cogm['CAD 1 NORTE'] + '<br><strong>CAD 2 SUL:</strong>' + relatorio.cogm['CAD 2 SUL'] + '<br><strong>CAD 3 CENTRO:</strong>' + relatorio.cogm['CAD 3 CENTRO'] + '<br><strong>CAD 4 ROMU:</strong>' + relatorio.cogm['CAD 4 ROMU'] + '<br><strong>SIGMA/RÁDIO:</strong>' + relatorio.cogm['SIGMA / RÁDIO'] + '<br><strong>DENÚNCIAS:</strong>' + relatorio.cogm['DENÚNCIAS'] + '<br><strong>VIDEOMONITORAMENTO 1:</strong>' + relatorio.cogm['VIDEO MONIT. 1'] + '<br><strong>VIDEOMONITORAMENTO 2:</strong>' + relatorio.cogm['VIDEO MONIT. 2'] + '<br><strong>153 TOTEM 1:</strong>' + relatorio.cogm['153/TOTEM 01'] + '<br><strong>TOTEM 2:</strong>' + relatorio.cogm['TOTEM 02'] + '<br><strong>COPOM:</strong>' + relatorio.cogm.COPOM + '<br><strong>CONSULTAS:</strong>' + relatorio.cogm.CONSULTAS + '<br><strong>DENÚNCIAS 156POA & 153:</strong>' + relatorio.denuncias_153 + '<br><strong>DENÚNCIAS CAD / EPTC:</strong>' + relatorio.denuncias_cad_eptc + '<br><strong>DENÚNCIAS WHATSAPP:</strong>' + relatorio.denuncias_whats + '<br><strong>FISCALIZADOS:</strong>' + relatorio.fiscalizados + '<br><strong>ORIENTADOS:</strong>' + relatorio.orientados + '<br><strong>AUTUADOS:</strong>' + relatorio.autuados + '<br><strong>INTERDITADOS:</strong>' + relatorio.interditados + '<br><strong>TROTES:</strong>' + relatorio.trotes + '<br><strong>INFORMAÇÕES:</strong>' + relatorio.informações + '<br><strong>CADS ABERTOS:</strong>' + relatorio.total_de_cads + '<br><strong>FECHADO APÓS ORIENTAÇÃO:</strong>' + relatorio.fechados + '<br><strong>TOTAL DE LIGAÇÕES:</strong>' + relatorio.total_de_ligações + '<br><strong>NÃO ATENDIDAS:</strong>' + relatorio.não_atendidas + '<br><strong>APOIO SAMU:</strong>' + relatorio.apoio_samu + '<br><strong>GU 21:</strong>' + relatorio.gu_21 + '<br><strong>VTR DA GU 21:</strong>' + relatorio.vtr_21 + '<br><strong>QAP/CIENTE DA OS DA GU 21:</strong>' + relatorio.qap_21 + '<br><strong>GU 22:</strong>' + relatorio.gu_22 + '<br><strong>VTR DA GU 22:</strong>' + relatorio.vtr_22 + '<br><strong>GU 31:</strong>' + relatorio.gu_31 + '<br><strong>VTR DA GU 31:</strong>' + relatorio.vtr_31 + '<br><strong>QAP/CIENTE DA OS DA GU 31:</strong>' + relatorio.qap_31 + '<br><strong>GU 32:</strong>' + relatorio.gu_32 + '<br><strong>VTR DA GU 32:</strong>' + relatorio.vtr_32 + '<br><strong>GU 41:</strong>' + relatorio.gu_41 + '<br><strong>VTR DA GU 41:</strong>' + relatorio.vtr_41 + '<br><strong>QAP/CIENTE DA OS DA GU 41:</strong>' + relatorio.qap_41 + '<br><strong>GU 42:</strong>' + relatorio.gu_42 + '<br><strong>VTR DA GU 42:</strong>' + relatorio.vtr_42 + '<br><strong>GU 51:</strong>' + relatorio.gu_51 + '<br><strong>VTR DA GU 51:</strong>' + relatorio.vtr_51 + '<br><strong>QAP/CIENTE DA OS DA GU 51:</strong>' + relatorio.qap_51 + '<br><strong>GU 52:</strong>' + relatorio.gu_52 + '<br><strong>VTR DA GU 52:</strong>' + relatorio.vtr_52 + '<br><strong>GU 61:</strong>' + relatorio.gu_61 + '<br><strong>VTR DA GU 61:</strong>' + relatorio.vtr_61 + '<br><strong>QAP/CIENTE DA OS DA GU 61:</strong>' + relatorio.qap_61 + '<br><strong>GU 62:</strong>' + relatorio.gu_62 + '<br><strong>VTR DA GU 62:</strong>' + relatorio.vtr_62 + '<br><strong>GU 71:</strong>' + relatorio.gu_71 + '<br><strong>VTR DA GU 71:</strong>' + relatorio.vtr_71 + '<br><strong>QAP/CIENTE DA OS DA GU 71:</strong>' + relatorio.qap_71 + '<br><strong>GU 72:</strong>' + relatorio.gu_72 + '<br><strong>VTR DA GU 72:</strong>' + relatorio.vtr_72 + '<br><strong>GU 81:</strong>' + relatorio.gu_81 + '<br><strong>VTR DA GU 81:</strong>' + relatorio.vtr_81 + '<br><strong>QAP/CIENTE DA OS DA GU 81:</strong>' + relatorio.qap_81 + '<br><strong>GU 82:</strong>' + relatorio.gu_82 + '<br><strong>VTR DA GU 82:</strong>' + relatorio.vtr_82 + '<br><strong>GU 91:</strong>' + relatorio.gu_91 + '<br><strong>VTR DA GU 91:</strong>' + relatorio.vtr_91 + '<br><strong>QAP/CIENTE DA OS DA GU 91:</strong>' + relatorio.qap_91 + '<br><strong>GU 92:</strong>' + relatorio.gu_92 + '<br><strong>VTR DA GU 92:</strong>' + relatorio.vtr_92 + '<br><strong>GSO ROMU:</strong>' + relatorio.gso_romu + '<br><strong>GSP ROMU:</strong>' + relatorio.gsp_romu + '<br><strong>PLANTÃO ROMU:</strong>' + relatorio.gp_romu + '<br><strong>PORTARIA ROMU:</strong>' + relatorio.portaria_romu + '<br><strong>ROMU 1:</strong>' + relatorio.gu_r1 + '<br><strong>VTR(S) DA R1:</strong>' + relatorio.vtr_r1 + '<br><strong>QAP/CIENTE DA OS DA R1:</strong>' + relatorio.qap_r1 + '<br><strong>ROMU 2:</strong>' + relatorio.gu_r2 + '<br><strong>VTR(S) DA R2:</strong>' + relatorio.vtr_r2 + '<br><strong>ROMU 3:</strong>' + relatorio.gu_r3 + '<br><strong>VTR(S) DA R3:</strong>' + relatorio.vtr_r3 + '<br><strong>ROMU 4:</strong>' + relatorio.gu_r4 + '<br><strong>VTR(S) DA R4:</strong>' + relatorio.vtr_r4 + '<br><strong>ROMU 5:</strong>' + relatorio.gu_r5 + '<br><strong>VTR(S) DA R5:</strong>' + relatorio.vtr_r5 + '<br><strong>ROMU 6:</strong>' + relatorio.gu_r6 + '<br><strong>VTR(S) DA R6:</strong>' + relatorio.vtr_r6 + '<br><strong>GSP CENTRO:</strong>' + relatorio.gsp_centro + '<br><strong>PLANTÃO CENTRO:</strong>' + relatorio.gp_centro + '<br><strong>PORTARIA CENTRO:</strong>' + relatorio.portaria_centro + '<br><strong>C1:</strong>' + relatorio.gu_c1 + '<br><strong>VTR(S) DA C1:</strong>' + relatorio.vtr_c1 + '<br><strong>QAP/CIENTE DA OS DA C1:</strong>' + relatorio.qap_c1 + '<br><strong>C2:</strong>' + relatorio.gu_c2 + '<br><strong>VTR(S) DA C2:</strong>' + relatorio.vtr_c2 + '<br><strong>C3:</strong>' + relatorio.gu_c3 + '<br><strong>VTR(S) DA C3:</strong>' + relatorio.vtr_c3 + '<br><strong>C4:</strong>' + relatorio.gu_c4 + '<br><strong>VTR(S) DA C4:</strong>' + relatorio.vtr_c4 + '<br><strong>C5:</strong>' + relatorio.gu_c5 + '<br><strong>VTR(S) DA C5:</strong>' + relatorio.vtr_c5 + '<br><strong>C6:</strong>' + relatorio.gu_c6 + '<br><strong>VTR(S) DA C6:</strong>' + relatorio.vtr_c6 + '<br><strong>C7:</strong>' + relatorio.gu_c7 + '<br><strong>VTR(S) DA C7:</strong>' + relatorio.vtr_c7 + '<br><strong>C8:</strong>' + relatorio.gu_c8 + '<br><strong>VTR(S) DA C8:</strong>' + relatorio.vtr_c8 + '<br><strong>P1:</strong>' + relatorio.gu_p1 + '<br><strong>VTR(S) DA P1:</strong>' + relatorio.vtr_p1 + '<br><strong>QAP/CIENTE DA OS DA PATAM:</strong>' + relatorio.qap_p1 + '<br><strong>P2:</strong>' + relatorio.gu_p2 + '<br><strong>VTR(S) DA P2:</strong>' + relatorio.vtr_p2 + '<br><strong>DEMANDAS NÃO ATENDIDAS:</strong>' + relatorio.demandas_não_atendidas + '<br><strong>OCORRÊNCIA(S) DE VULTO / ALTERAÇÕES NO PLANTÃO / OUTROS:</strong>' + relatorio.relato.replaceAll('\n', '<br>');
                innerHTML_resumo = innerHTML_resumo.replaceAll('undefined', '');
                resumo_relatorio.innerHTML = window.trustedTypes.defaultPolicy.createHTML(innerHTML_resumo);
                document.querySelector('div[data-params*="E-MAILS"]').parentNode.insertBefore(resumo_relatorio, document.querySelector('div[data-params*="E-MAILS"]'));
            }
            //gera a lista de pendências
            if (document.querySelector('#resumo_relatorio') && !document.querySelector('#resumo_relatorio').innerHTML.includes('⚠️') && !document.querySelector('#resumo_relatorio').innerHTML.includes('PENDÊNCIA')) {
                let relatorio = '';
                let campos = document.querySelector('#resumo_relatorio').innerHTML.split('<br>');
                const preferencias = (localStorage.getItem('minuta_relatorio_preferencias') || '') + (localStorage.getItem('minuta_relatorio_preferencias_hoje') || '');
                campos.forEach((campo) => {
                    if (campo != '' && !campo.includes('MINUTA DO RELATÓRIO') && !campo.includes('PENDÊNCIA') && !preferencias.includes(campo.split('<strong>')[1]?.split('</strong>')[0]) && (campo.split('</strong>')[1] == '' || campo.split('</strong>')[1] == '0' || campo.split('</strong>')[1] == ':')) {
                        relatorio += '<div>Não lembrar<button>Hoje</button><button>Nunca</button><span>⚠️</span>' + campo + '<br></div>';
                    } else {
                        relatorio += campo + '<br>';
                    }
                });
                document.querySelector('#resumo_relatorio').innerHTML = relatorio;
                if (Array.from(document.querySelectorAll('button')).filter(item => item.innerHTML.includes('Hoje')).length > 0) {
                    document.querySelector('#resumo_relatorio').innerHTML = document.querySelector('#resumo_relatorio').innerHTML.replace('<strong>MINUTA DO RELATÓRIO</strong><br><br>', '<strong>MINUTA DO RELATÓRIO</strong><br><br><strong>⚠️ VOCÊ TEM ' + Array.from(document.querySelectorAll('button')).filter(item => item.innerHTML.includes('Hoje')).length + ' PENDÊNCIA(S)! ⚠️</strong><br><br>');
                } else if (Array.from(document.querySelectorAll('strong')).filter(item => item.innerHTML.includes('PENDÊNCIA'))[0]) {
                    Array.from(document.querySelectorAll('strong')).filter(item => item.innerHTML.includes('PENDÊNCIA'))[0].innerHTML = '✅ VOCÊ NÃO POSSUI PENDÊNCIA(S). ✅';
                } else {
                    document.querySelector('#resumo_relatorio').innerHTML = document.querySelector('#resumo_relatorio').innerHTML.replace('<strong>MINUTA DO RELATÓRIO</strong><br><br>', '<strong>MINUTA DO RELATÓRIO</strong><br><br><strong>✅ VOCÊ NÃO POSSUI PENDÊNCIA(S). ✅</strong><br><br>');
                }
                //insere as funcionalidades nos botões Não me lembrar "hoje" e "nunca" que vai colocar aquele campo numa whitelist caso o usuário desejar
                document.querySelectorAll('#resumo_relatorio button').forEach((botao) => {
                    botao.addEventListener('click', () => {
                        if (botao.innerHTML == 'Hoje') {
                            localStorage.setItem('minuta_relatorio_preferencias_hoje', (localStorage.getItem('minuta_relatorio_preferencias_hoje') || new Date().getDate() + '-' + (new Date().getMonth() + 1)) + botao.parentNode.querySelector('strong').innerHTML);
                        } else {
                            localStorage.setItem('minuta_relatorio_preferencias', (localStorage.getItem('minuta_relatorio_preferencias') || '') + botao.parentNode.querySelector('strong').innerHTML);
                        }
                        botao.parentNode.innerHTML = botao.parentNode.innerHTML.split('</span>')[1];
                        if (Array.from(document.querySelectorAll('button')).filter(item => item.innerHTML.includes('Hoje')).length > 0) {
                            Array.from(document.querySelectorAll('strong')).filter(item => item.innerHTML.includes('PENDÊNCIA'))[0].innerHTML = '⚠️ VOCÊ TEM ' + Array.from(document.querySelectorAll('button')).filter(item => item.innerHTML.includes('Hoje')).length + ' PENDÊNCIA(S)! ⚠️';
                        } else if (Array.from(document.querySelectorAll('strong')).filter(item => item.innerHTML.includes('PENDÊNCIA'))[0]) {
                            Array.from(document.querySelectorAll('strong')).filter(item => item.innerHTML.includes('PENDÊNCIA'))[0].innerHTML = '✅ VOCÊ NÃO POSSUI PENDÊNCIA(S). ✅';
                        }
                    });
                });
            }


            //Duplica os botões de Avançar Página e Voltar para o topo da tela para facilitar a navegação
            if (Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Avançar').length == 1) {
                document.querySelector('form').insertAdjacentHTML('afterbegin', Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Avançar')[0].cloneNode(true).outerHTML);
                Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Avançar')[0].addEventListener('click', function () {
                    Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Avançar')[1].click();
                });
            }
            if (Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Voltar').length == 1) {
                document.querySelector('form').insertAdjacentHTML('afterbegin', Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Voltar')[0].cloneNode(true).outerHTML);
                Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Voltar')[0].addEventListener('click', function () {
                    Array.from(document.querySelectorAll('div[role=button]')).filter(item => item.innerText == 'Voltar')[1].click();
                });
            }
            if (document.querySelector('div[data-params*="PORTARIA CENTRO"]')) {
                if (document.getElementById('naorepete_form_gs')) {
                } else {
                    var naorepete_form_gs = document.createElement("div");
                    naorepete_form_gs.setAttribute("id", "naorepete_form_gs");
                    document.querySelector('div[data-params*="COGM"]').parentNode.insertBefore(naorepete_form_gs, document.querySelector('div[data-params*="COGM"]'));
                    //Insere Equipe COGM
                    var campo_insere_cogm = document.createElement("textarea");
                    campo_insere_cogm.setAttribute("id", "campo_insere_cogm");
                    document.querySelector('div[data-params*="COGM"]').parentNode.insertBefore(campo_insere_cogm, document.querySelector('div[data-params*="COGM"]'));
                    var cogm_gm_nr = ['098', '110', '139', '155', '231', '336', '512', '520', '521', '523', '556', '558', '591', '621', '641', '643', '652', '660', '807', '813', '815', '831', '832', '833', '834', '839', '842', '848', '858', '867', '869'];
                    var cogm_gm_nome = ['GETÚLIO MARCOS OLIVEIRA ROLIANO', 'NIAMAR DE SOUZA SIQUEIRA', 'CLAUDENIR DA SILVA NUNES', 'MARIO FERNANDO DORNELES DE BARCELOS', 'MARA ELISABETE RODRIGUES DE BRUM', 'CLAUDIA MARTINELI BARROS FERREIRA', 'VICENTE DE PAULA GENTIL', 'JOSÉ PAULO DE OLIVEIRA CAMPOS', 'PEDRO CARDOSO', 'JOÃO LUIZ FARIAS VASCONCELOS', 'LAURO GIOVANI ALVES DO VAL', 'GILNEI INÁCIO GUIMARÃES', 'LUIS EDUARDO CARVALHO DOS SANTOS', 'SERGIO OLIVEIRA DE SOUZA', 'JOSÉ PAULO BARBOSA', 'LUIS RICARDO BANDEIRA FLORES', 'SILVIO LUIS MENDES FERREIRA', 'LUIS ALBERTO REIS PINTO', 'GELSON DA CONCEIÇÃO GASPARY', 'DANIEL DE AGUIAR PIVETTA', 'GIOVANI BENITES LOPES', 'WESLEY ERREIRA COUTO', 'ANDERSON CAMPOS DUARTE JUNIOR ', 'FELIPE DA SILVA MACKOSKI', 'RUAN SOLRAC RODRIGUES BRITO', 'ARTHUR ZAPATA DA SILVA', 'CALEBE RUIVO DA SILVA', 'LEONARDO GARCIA DA FONSECA', 'DOUGLAS JAQUES ALVES', 'MARCO AURÉLIO SANTOS DA SILVA FILHO', 'AMANDA NAIBERT SILVA']
                    var cogm_funcoes = ['', '', 'SIGMA / RÁDIO', 'SIGMA / RÁDIO', 'CAD 1 NORTE', 'CAD 2 SUL', 'CAD 3 CENTRO', 'CAD 4 ROMU', '153/TOTEM 01', 'TOTEM 02', 'VIDEO MONIT. 1', 'VIDEO MONIT. 2', 'COPOM', 'COPOM'];
                    campo_insere_cogm.addEventListener('input', function () {
                        var guardas = campo_insere_cogm.value.split('\n');
                        for (var i = 0; i < guardas.length; i++) {
                            var check_guarda = document.querySelector('div[aria-label="' + cogm_gm_nome[cogm_gm_nr.indexOf(guardas[i].substring(0, 3))] + ', resposta para ' + cogm_funcoes[i] + '"]');
                            if (check_guarda && check_guarda.ariaChecked == 'false') {
                                check_guarda.click();
                            }
                        }
                    });
                    //Filtros
                    var filtros = document.createElement("div");
                    filtros.setAttribute("id", "filtros");
                    filtros.setAttribute("style", "position: fixed; left: 0; top: 0; background-color: white;margin:5px;padding:5px");
                    var innerHTMLText = 'Filtros:<br><table><tbody><tr><td><input checked type=checkbox data-qual_filtro="cogm" />COGM</td><td><input checked type=checkbox data-qual_filtro="areas" />Áreas</td><td><input checked type=checkbox data-qual_filtro="secoes" />Seções</td><td><input type=checkbox data-qual_filtro="marcados" />Marcados</td></tr><tr><td></td><td><input checked type=checkbox data-qual_filtro="200" />200 Área Cruzeiro<br><input checked type=checkbox data-qual_filtro="300" />300 Área Partenon<br><input checked type=checkbox data-qual_filtro="400" />400 Área Leste<br><input checked type=checkbox data-qual_filtro="500" />500 Área Restinga<br><input checked type=checkbox data-qual_filtro="600" />600 Área Norte<br><input checked type=checkbox data-qual_filtro="700" />700 Área Eixo Baltazar<br><input checked type=checkbox data-qual_filtro="800" />800 Área Pinheiro<br><input checked type=checkbox data-qual_filtro="900" />900 Área Eixo Sul<br><input checked type=checkbox data-qual_filtro="1000" />1000 Área Romu<br><input checked type=checkbox data-qual_filtro="1100" />1100 Área Patam<br><input checked type=checkbox data-qual_filtro="1200" />1200 Área Centro<br></td><td><input checked type=checkbox data-qual_filtro="pessoas" />Pessoas<br><input checked type=checkbox data-qual_filtro="vtr" />Viaturas<br><input checked type=checkbox data-qual_filtro="QAP" />QAP<br><input checked type=checkbox data-qual_filtro="GSO" />GSO<br><input checked type=checkbox data-qual_filtro="GSP" />GSP<br><input checked type=checkbox data-qual_filtro="Plantao" />Plantão<br><input checked type=checkbox data-qual_filtro="Portaria" />Portaria</td></tr></tbody></table>';
                    'use strict';
                    filtros.innerHTML = window.trustedTypes.defaultPolicy.createHTML(innerHTMLText);
                    document.querySelector('div[data-params*="COGM"]').parentNode.insertBefore(filtros, document.querySelector('div[data-params*="COGM"]'));

                    document.getElementById('filtros').querySelectorAll('input').forEach(function (item) {
                        var input = item;
                        var qual_filtro = item.dataset.qual_filtro;
                        item.addEventListener('change', function () {
                            if (input.checked == true) {
                                if (qual_filtro == 'cogm') {
                                    document.querySelector('div[data-params*=COGM]').style.display = '';
                                    document.querySelector('div[data-params*=OUTROS]').style.display = '';
                                    document.getElementById('campo_insere_cogm').style.display = '';
                                }
                                if (qual_filtro == 'areas') {
                                    document.getElementById('filtros').querySelectorAll('tr')[1].querySelectorAll('td')[1].querySelectorAll('input').forEach(function (inpt) {
                                        inpt.checked = true;
                                        inpt.dispatchEvent(new Event('change', { bubbles: true }));
                                    });
                                }
                                if (qual_filtro == 'secoes') {
                                    document.getElementById('filtros').querySelectorAll('tr')[1].querySelectorAll('td')[2].querySelectorAll('input').forEach(function (inpt) {
                                        inpt.checked = true;
                                        inpt.dispatchEvent(new Event('change', { bubbles: true }));
                                    });
                                }
                                if (qual_filtro == '200') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 21"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 22"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 21"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 22"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 21"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 22"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 21"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 22"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 21"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 21"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '300') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 31"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 32"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 31"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 32"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 31"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 32"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 31"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 32"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 31"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 31"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '400') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 41"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 42"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 41"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 42"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 41"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 42"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 41"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 42"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 41"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 41"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '500') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 51"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 52"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 51"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 52"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 51"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 52"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 51"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 52"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 51"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 51"]').style.display = 'none';
                                    }

                                }
                                if (qual_filtro == '600') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 61"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 62"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 61"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 62"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 61"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 62"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 61"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 62"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 61"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 61"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '700') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 71"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 72"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 71"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 72"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 71"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 72"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 71"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 72"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 71"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 71"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '800') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 81"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 82"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 81"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 82"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 81"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 82"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 81"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 82"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 81"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 81"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '900') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="GU 91"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="GU 92"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GU 91"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="GU 92"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA GU 91"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA GU 92"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA GU 91"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA GU 92"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 91"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 91"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '1000') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="R1"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="R2"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="R3"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="R4"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="R5"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="R6"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="R1"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="R2"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="R3"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="R4"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="R5"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="R6"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA R1"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA R2"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA R3"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA R4"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA R5"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA R6"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA R1"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA R2"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA R3"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA R4"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA R5"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA R6"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA R1"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA R1"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=GSO]').checked == true) {
                                        document.querySelector('div[data-params*="GSO ROMU"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GSO ROMU"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=GSP]').checked == true) {
                                        document.querySelector('div[data-params*="GSP ROMU"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GSP ROMU"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=Plantao]').checked == true) {
                                        document.querySelector('div[data-params*="PLANTÃO ROMU"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="PLANTÃO ROMU"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=Portaria]').checked == true) {
                                        document.querySelector('div[data-params*="PORTARIA ROMU"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="PORTARIA ROMU"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '1100') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="P1"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="P2"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="P1"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="P2"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA P1"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA P2"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA P1"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA P2"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA PATAM').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA PATAM"]').style.display = 'none';
                                    }
                                }
                                if (qual_filtro == '1200') {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true) {
                                        document.querySelector('div[data-params*="C1"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C2"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C3"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C4"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C5"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C6"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C7"]:not([data-params*="VTR"])').style.display = '';
                                        document.querySelector('div[data-params*="C8"]:not([data-params*="VTR"])').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="C1"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C2"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C3"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C4"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C5"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C6"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C7"]:not([data-params*="VTR"])').style.display = 'none';
                                        document.querySelector('div[data-params*="C8"]:not([data-params*="VTR"])').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.querySelector('div[data-params*="VTR DA C1"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C2"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C3"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C4"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C5"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C6"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C7"]').style.display = '';
                                        document.querySelector('div[data-params*="VTR DA C8"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="VTR DA C1"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C2"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C3"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C4"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C5"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C6"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C7"]').style.display = 'none';
                                        document.querySelector('div[data-params*="VTR DA C8"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA C1"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA C1"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=GSP]').checked == true) {
                                        document.querySelector('div[data-params*="GSP CENTRO"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="GSP CENTRO"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=Plantao]').checked == true) {
                                        document.querySelector('div[data-params*="PLANTÃO CENTRO"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="PLANTÃO CENTRO"]').style.display = 'none';
                                    }
                                    if (document.querySelector('input[data-qual_filtro=Portaria]').checked == true) {
                                        document.querySelector('div[data-params*="PORTARIA CENTRO"]').style.display = '';
                                    } else {
                                        document.querySelector('div[data-params*="PORTARIA CENTRO"]').style.display = 'none';
                                    }

                                }
                                if (qual_filtro == 'marcados') {
                                    document.querySelectorAll('div[aria-checked="false"]').forEach(function (n_marcado) {
                                        if (n_marcado.parentNode.parentNode.parentNode.role == 'listitem') {
                                            n_marcado.parentNode.parentNode.parentNode.style.display = 'none';
                                        } else {
                                            n_marcado.parentNode.parentNode.style.display = 'none';
                                        }
                                    });
                                    document.querySelector('div[data-params*=COGM]').querySelectorAll('div[role=group]').forEach(function (cogm_linha) {
                                        if (cogm_linha.querySelectorAll('div[aria-checked=true]').length == 0) {
                                            cogm_linha.style.display = 'none';
                                        }
                                    });

                                }
                            } else {
                                if (qual_filtro == 'cogm') {
                                    document.querySelector('div[data-params*=COGM]').style.display = 'none';
                                    document.querySelector('div[data-params*=OUTROS]').style.display = 'none';
                                    document.getElementById('campo_insere_cogm').style.display = 'none';
                                }
                                if (qual_filtro == 'areas') {
                                    document.getElementById('filtros').querySelectorAll('tr')[1].querySelectorAll('td')[1].querySelectorAll('input').forEach(function (inpt) {
                                        inpt.checked = false;
                                        inpt.dispatchEvent(new Event('change', { bubbles: true }));
                                    });
                                }
                                if (qual_filtro == 'secoes') {
                                    document.getElementById('filtros').querySelectorAll('tr')[1].querySelectorAll('td')[2].querySelectorAll('input').forEach(function (inpt) {
                                        inpt.checked = false;
                                        inpt.dispatchEvent(new Event('change', { bubbles: true }));
                                    });
                                }
                                if (qual_filtro == '200') {
                                    document.querySelector('div[data-params*="GU 21"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 22"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 21"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 22"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 21"]').style.display = 'none';
                                }
                                if (qual_filtro == '300') {
                                    document.querySelector('div[data-params*="GU 31"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 32"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 31"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 32"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 31"]').style.display = 'none';
                                }
                                if (qual_filtro == '400') {
                                    document.querySelector('div[data-params*="GU 41"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 42"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 41"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 42"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 41"]').style.display = 'none';
                                }
                                if (qual_filtro == '500') {
                                    document.querySelector('div[data-params*="GU 51"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 52"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 51"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 52"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 51"]').style.display = 'none';
                                }
                                if (qual_filtro == '600') {
                                    document.querySelector('div[data-params*="GU 61"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 62"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 61"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 62"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 61"]').style.display = 'none';
                                }
                                if (qual_filtro == '700') {
                                    document.querySelector('div[data-params*="GU 71"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 72"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 71"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 72"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 71"]').style.display = 'none';
                                }
                                if (qual_filtro == '800') {
                                    document.querySelector('div[data-params*="GU 81"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 82"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 81"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 82"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 81"]').style.display = 'none';
                                }
                                if (qual_filtro == '900') {
                                    document.querySelector('div[data-params*="GU 91"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="GU 92"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 91"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA GU 92"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 91"]').style.display = 'none';
                                }
                                if (qual_filtro == '1100') {
                                    document.querySelector('div[data-params*="P1"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="P2"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA P1"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA P2"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA PATAM"]').style.display = 'none';
                                }
                                if (qual_filtro == '1000') {
                                    document.querySelector('div[data-params*="R1"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="R2"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="R3"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="R4"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="R5"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="R6"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R1"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R2"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R3"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R4"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R5"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA R6"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA R1"]').style.display = 'none';
                                    document.querySelector('div[data-params*="GSO ROMU"]').style.display = 'none';
                                    document.querySelector('div[data-params*="GSP ROMU"]').style.display = 'none';
                                    document.querySelector('div[data-params*="PLANTÃO ROMU"]').style.display = 'none';
                                    document.querySelector('div[data-params*="PORTARIA ROMU"]').style.display = 'none';
                                }
                                if (qual_filtro == '1200') {
                                    document.querySelector('div[data-params*="C1"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C2"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C3"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C4"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C5"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C6"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C7"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="C8"]:not([data-params*="VTR"])').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C1"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C2"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C3"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C4"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C5"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C6"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C7"]').style.display = 'none';
                                    document.querySelector('div[data-params*="VTR DA C8"]').style.display = 'none';
                                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA C1"]').style.display = 'none';
                                    document.querySelector('div[data-params*="GSP CENTRO"]').style.display = 'none';
                                    document.querySelector('div[data-params*="PLANTÃO CENTRO"]').style.display = 'none';
                                    document.querySelector('div[data-params*="PORTARIA CENTRO"]').style.display = 'none';
                                }
                                if (qual_filtro == 'marcados') {
                                    document.querySelectorAll('div[aria-checked="false"]').forEach(function (n_marcado) {
                                        if (n_marcado.parentNode.parentNode.parentNode.role == 'listitem') {
                                            n_marcado.parentNode.parentNode.parentNode.style.display = '';
                                        } else {
                                            n_marcado.parentNode.parentNode.style.display = '';
                                        }
                                    });
                                    document.querySelector('div[data-params*=COGM]').querySelectorAll('div[role=group]').forEach(function (cogm_linha) {
                                        cogm_linha.style.display = '';
                                    });
                                }
                            }
                            if (qual_filtro == 'pessoas' || qual_filtro == 'vtr' || qual_filtro == 'QAP' || qual_filtro == 'GSO' || qual_filtro == 'GSP' || qual_filtro == 'Plantao' || qual_filtro == 'Portaria') {
                                document.getElementById('filtros').querySelectorAll('tr')[1].querySelectorAll('td')[1].querySelectorAll('input').forEach(function (inpt) {
                                    inpt.dispatchEvent(new Event('change', { bubbles: true }));
                                });
                                if (document.getElementById('campo_insere_equipes')) {
                                    if (document.querySelector('input[data-qual_filtro=pessoas]').checked == true && document.querySelector('input[data-qual_filtro=vtr]').checked == true) {
                                        document.getElementById('campo_insere_equipes').style.display = '';
                                    } else {
                                        document.getElementById('campo_insere_equipes').style.display = 'none';
                                    }
                                }
                                if (document.getElementById('campo_insere_qap')) {
                                    if (document.querySelector('input[data-qual_filtro=QAP]').checked == true) {
                                        document.getElementById('campo_insere_qap').style.display = '';
                                    } else {
                                        document.getElementById('campo_insere_qap').style.display = 'none';
                                    }
                                }
                            }
                        });
                    });
                    document.querySelectorAll('div[data-params]').forEach(function (campo) {
                        campo.style.display = 'none';
                    });
                    document.getElementById('filtros').querySelectorAll('input').forEach(function (item) {
                        item.dispatchEvent(new Event('change', { bubbles: true }));
                    });


                    //Insere campo e function para inserir equipes e equipamentos
                    var campo_insere_equipes = document.createElement("textarea");
                    campo_insere_equipes.setAttribute("id", "campo_insere_equipes");
                    var formulario_21 = Array.from(document.querySelectorAll('u')).filter(item => item.innerText == 'GU 21')[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    formulario_21.parentNode.insertBefore(campo_insere_equipes, formulario_21);
                    campo_insere_equipes.addEventListener('input', function () {
                        var equipes = campo_insere_equipes.value.replaceAll('\nC0', '\nC').split('\n');
                        equipes.forEach(function (item) {
                            if (item != '') {
                                if (item.split(' - ')[0].includes('C') || item.split(' - ')[0].includes('R') || item.split(' - ')[0].includes('P')) {
                                    var campo_da_equipe = document.querySelector('div[data-params*="' + item.split(' - ')[0] + '"]');
                                } else {
                                    campo_da_equipe = document.querySelector('div[data-params*="GU ' + item.split(' - ')[0].trim() + '"]');
                                }
                                if (campo_da_equipe) {
                                    var check_componente = campo_da_equipe.querySelector('div[data-answer-value*="' + item.split('\t')[1] + '"]');
                                    if (check_componente && check_componente.ariaChecked == 'false') {
                                        check_componente.click();
                                    } else if (!check_componente) {
                                        campo_da_equipe.querySelector('div[aria-label="Outro:"]').click();
                                        campo_da_equipe.querySelectorAll('input')[1].value = item.split('\t')[1] + ' ' + item.split('\t')[2];
                                        campo_da_equipe.querySelectorAll('input')[1].dispatchEvent(new Event('input', { bubbles: true }));
                                    }
                                }
                                var campo_da_vtr_da_equipe = document.querySelector('div[data-params*="VTR"][data-params*=" ' + item.split(' - ')[0] + '"]');
                                if (campo_da_vtr_da_equipe) {
                                    var check_vtr = campo_da_vtr_da_equipe.querySelector('div[data-answer-value*="' + item.split('\t')[4].substring(item.split('\t')[4].length - 4, item.split('\t')[4].length) + '"]');
                                    if (check_vtr && check_vtr.ariaChecked == 'false') {
                                        check_vtr.click();
                                    } else if (!check_vtr) {
                                        campo_da_vtr_da_equipe.querySelector('div[data-answer-value="__other_option__"]').click();
                                        campo_da_vtr_da_equipe.querySelectorAll('input')[1].value = item.split('\t')[4];
                                        campo_da_vtr_da_equipe.querySelectorAll('input')[1].dispatchEvent(new Event('input', { bubbles: true }));
                                    }
                                }
                            }
                        });
                    });
                    var campo_insere_qap = document.createElement("textarea");
                    campo_insere_qap.setAttribute("id", "campo_insere_qap");
                    document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 21"]').parentNode.insertBefore(campo_insere_qap, document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA 21"]'));
                    campo_insere_qap.addEventListener('input', function () {
                        let gus_extenso = ['CRUZEIRO', 'PARTENON', 'LESTE', 'RESTINGA', 'NORTE', 'BALTAZAR', 'PINHEIRO', 'SUL', 'CENTRO', 'ROMU', 'PATAM'];
                        let gus_numero = ['21', '31', '41', '51', '61', '71', '81', '91', 'C1', 'R1', 'PATAM'];
                        campo_insere_qap.value.split('\n').forEach(function (item) {
                            if (item.includes('-')) {
                                let hora = item.substring(0, 2);
                                let min = item.substring(3, 5);
                                let gu = item.split('-')[1].trim();
                                if (gus_extenso.includes(gu)) {
                                    gu = gus_numero[gus_extenso.indexOf(gu)];
                                }
                                document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA ' + gu + '"] input[aria-label="Hora"]').value = hora;
                                document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA ' + gu + '"] input[aria-label="Minuto"]').value = min;
                                document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA ' + gu + '"] input[aria-label="Hora"]').dispatchEvent(new Event('input', { bubbles: true }));
                                document.querySelector('div[data-params*="QAP(CIENTE DA OS) DA ' + gu + '"] input[aria-label="Minuto"]').dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    });
                }
            }
            //Insere automaticamente o valor zero nos campos em branco no balanço de fiscalização
            if (Array.from(document.querySelectorAll('div[role=list]')).filter(item => item.innerText.includes('BALANÇO DE FISCALIZAÇÃO'))[0] && Array.from(Array.from(document.querySelectorAll('div[role=list]')).filter(item => item.innerText.includes('BALANÇO DE FISCALIZAÇÃO'))[0].querySelectorAll('input')).filter(item => item.value == '').length > 0) {
                var input = Array.from(Array.from(document.querySelectorAll('div[role=list]')).filter(item => item.innerText.includes('BALANÇO DE FISCALIZAÇÃO'))[0].querySelectorAll('input')).filter(item => item.value == '')[0];
                input.value = '0';
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
            //Insere botao de selecionar todos na aba de e-mails
            if (Array.from(document.querySelectorAll('div[role=list]')).filter(item => item.innerText.includes('E-MAILS'))[0]) {
                Array.from(document.querySelectorAll('div[role=checkbox]')).filter(item => item.ariaChecked == 'false').forEach(function (item) {
                    item.click();
                });
                /*
                a.addEventListener('click',function(){
                    if(document.querySelector('#selecionatodos').checked == true){
                        Array.from(document.querySelectorAll('div[role=checkbox]')).filter(item => item.ariaChecked == 'false').forEach(function(item){
                            item.click();
                        });
                    } else if(document.querySelector('#selecionatodos').checked == false) {
                        Array.from(document.querySelectorAll('div[role=checkbox]')).filter(item => item.ariaChecked == 'true').forEach(function(item){
                            item.click();
                        });
                    }
                });*/
            }
        }, 100);

    });
});