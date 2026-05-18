chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("CAD Equipes", (d) => {
        if (d['CAD Equipes'] == 'desativado') return;

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

        var unidade_servico = '';
        sessionStorage.setItem('concluir_encarramento_uniade_sv', '');
        localStorage.removeItem('editar_equipe');





        setInterval(function () {
            if (!document.querySelector('#limpar_dados') && document.querySelector('#menu_sinesp')) {
                const button = document.createElement('button');
                button.setAttribute('id', 'limpar_dados');
                button.innerText = 'Desbugar';
                document.querySelector('#menu_sinesp').append(button);
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

            if (Array.from(document.querySelectorAll('button[botaosecundario]')).filter(botao => botao.innerText == 'Nova Unidade de Serviço')[0]) {
                Array.from(document.querySelectorAll('button[botaosecundario]')).filter(botao => botao.innerText == 'Nova Unidade de Serviço')[0].style.display = 'none';
            }
            if (document.querySelector('app-manter-unidade-servico button[type="submit"]')) {
                document.querySelector('app-manter-unidade-servico button[type="submit"]').style.display = 'none';
            }
            document.querySelectorAll('button[title="Incluir Equipe"]').forEach(button => {
                button.style.display = 'none';
            })


            if (document.querySelectorAll('app-modal-editar-equipamentos').length > 1) {
                document.querySelectorAll('app-modal-editar-equipamentos')[1].querySelector('button[fecharmodal]').click();
            }

            if (document.querySelectorAll('app-modal-editar-equipe').length > 1) {
                document.querySelectorAll('app-modal-editar-equipe')[1].querySelector('button[fecharmodal]').click();
            }


            if (versao && document.querySelector('cad-breadcrumb div') && !document.querySelector('cad-breadcrumb div').innerHTML.includes(versao)) {
                document.querySelector('cad-breadcrumb div').innerHTML += versao;
            }
            if (document.querySelector('mat-option')) {
                document.querySelectorAll('mat-option').forEach(function (item) {
                    if (item.innerHTML.includes('Chefe de Gabinete') || item.innerHTML.includes('Chefe de Serviço') || item.innerHTML.includes('Comandante') || item.innerHTML.includes('Guarda Setor') || item.innerHTML.includes('Operador Drone') || item.innerHTML.includes('Plantão') || item.innerHTML.includes('Subcomandante')) {
                        item.style.display = 'none';
                    }
                });
            }
            if (localStorage.getItem('cards_selecionados')) {
                if (document.querySelector("div[id='naorepete-card']")) {
                } else {
                    var valor = localStorage.getItem('cards_selecionados');
                    if (document.querySelector('#checkbox')) {
                        document.querySelector('#checkbox').querySelector('select').value = localStorage.getItem('cards_selecionados');
                    }
                    localStorage.setItem('cards_selecionados', valor);
                    var cards = document.querySelectorAll('app-unidade-servico-card');
                    if (valor == 'Todas') {
                        cards.forEach(function (item) {
                            item.style.display = '';
                        });
                    } else {
                        cards.forEach(function (item) {
                            if (item.querySelector('span').innerHTML.includes(valor)) {
                                item.style.display = '';
                            } else {
                                item.style.display = 'none';
                            }

                        });

                    }
                }
            }

            if (localStorage.getItem('encerra_sv') && document.querySelector('button[title="Encerrar Serviço"]')) {
                if (document.querySelector("div[id='naorepete-encerrasv']")) {
                } else {
                    var c = document.createElement("div");
                    document.querySelector('body').append(c);
                    c.setAttribute("id", "naorepete-encerrasv");
                    document.querySelector('button[title="Encerrar Serviço"]').click();
                }
            }

            if (localStorage.getItem('encerra_sv') && document.querySelector('app-modal-wrapper')) {
                if (document.querySelector("div[id='naorepete_encerra_sv_botao_sim']")) {
                } else {
                    c = document.createElement("div");
                    c.setAttribute("id", "naorepete_encerra_sv_botao_sim");
                    document.querySelector('app-modal-wrapper').append(c);
                    if (document.querySelector('app-modal-wrapper').innerHTML.includes('Encerrar o Serviço ?')) {
                        document.querySelector('app-modal-wrapper').querySelectorAll('button')[1].click();
                    }

                }
            }

            if (localStorage.getItem('editar_equipe')) {
                document.querySelectorAll('button').forEach(function (botao) {
                    if (botao.style.display == '') {
                        botao.style.display = 'none';
                    }
                });
            }
            if (!localStorage.getItem('editar_equipe')) {
                document.querySelectorAll('button').forEach(function (botao) {
                    if (botao.style.display == 'none' && botao.innerHTML != 'Nova Unidade de Serviço' && botao.innerHTML != 'Alterar' && botao.title != 'Incluir Equipe') {
                        botao.style.display = '';
                    }
                });
            }
            if (localStorage.getItem('editar_equipe') && document.querySelector('app-modal-wrapper')) {
                if (document.querySelector("div[id='naorepete_inicia_sv_botao_sim']")) {
                } else {
                    c = document.createElement("div");
                    c.setAttribute("id", "naorepete_inicia_sv_botao_sim");
                    document.querySelector('app-modal-wrapper').append(c);
                    if (document.querySelector('app-modal-wrapper').innerHTML.includes('Iniciar Serviço')) {
                        localStorage.removeItem('editar_equipe');
                        document.querySelector('app-modal-wrapper').querySelectorAll('button')[1].click();
                        if (localStorage.getItem('inserir_multiplas_equipes') && parseInt(localStorage.getItem('inserir_multiplas_equipes')) > -1) {
                            document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button')[parseInt(localStorage.getItem('inserir_multiplas_equipes'))].click();
                            localStorage.setItem('inserir_multiplas_equipes', parseInt(localStorage.getItem('inserir_multiplas_equipes')) - 1);
                        } else {
                            localStorage.removeItem('inserir_multiplas_equipes');
                        }
                    }
                }
            }

            if (localStorage.getItem('encerra_sv') && document.querySelector('div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]')) {
                if (document.querySelector("div[id='naorepete_mat-simple-snack-bar-content']")) {
                } else {
                    c = document.createElement("div");
                    c.setAttribute("id", "naorepete_mat-simple-snack-bar-content");
                    document.querySelector('body').append(c);
                    if (document.querySelector('div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]').innerHTML.includes('serviço encerrado com sucesso.')) {
                        location.reload();
                    }

                }
            }

            if (localStorage.getItem('encerra_sv') && document.querySelector('app-unidade-servico-card') && !document.querySelector('button[title="Encerrar Serviço"]')) {
                //localStorage.removeItem('encerra_sv');
            }
            /*  if(document.querySelectorAll('span[class="mat-button-wrapper"]').length > 30 && document.querySelectorAll('span[class="mat-button-wrapper"]')[30].innerHTML == 'Novo Equipamento') {
                document.querySelectorAll('span[class="mat-button-wrapper"]')[30].click();
            }*/
            if (localStorage.getItem('camera') && document.getElementById('agencia')) {
                if (localStorage.getItem('camera') && !document.getElementById('agencia').innerHTML.includes('Guarda Municipal de Porto Alegre') && !document.querySelector('span[class="mat-option-text"]')) {
                    document.getElementById('agencia').click();
                } else if (localStorage.getItem('camera') && document.querySelector('span[class="mat-option-text"]') && document.querySelector('span[class="mat-option-text"]').innerHTML.includes('Guarda Municipal de Porto Alegre')) {
                    document.querySelector('span[class="mat-option-text"]').click();
                } else if (localStorage.getItem('camera') && !document.getElementById('tipoEquipamento').innerHTML.includes('Câmera Corporal') && !document.querySelector('span[class="mat-option-text"]')) {
                    document.getElementById('tipoEquipamento').click();
                } else if (localStorage.getItem('camera') && document.querySelectorAll('mat-option').length > 2) {
                    document.querySelectorAll('mat-option')[1].click();
                } else if (localStorage.getItem('camera')) {
                    var prefixo = localStorage.getItem('camera').split('-');
                    document.querySelector('input[formcontrolname="prefixo"]').value = prefixo.shift();
                    document.querySelector('input[formcontrolname="prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    if (prefixo.length > -1) {
                        var a = '';
                        prefixo.forEach(function (item) {
                            a += item + '-';
                        });
                        localStorage.setItem('camera', a);
                    } else {
                        localStorage.removeItem('camera');
                    }

                    document.querySelectorAll('button')[2].click();
                }
            }

            if (localStorage.getItem('trava_encerra_sv') && !document.querySelector('mat-dialog-container')) {
                localStorage.setItem('trava_encerra_sv', 'nao');
            }
            if (localStorage.getItem('edita_equipe_pega_equipe') && document.querySelector('app-modal-detalhar-equipe')) {
                var selects = document.querySelector('#checkbox').querySelectorAll('select');
                var componentes = document.querySelectorAll('app-modal-detalhar-equipe div:has(> div.modal-material-subtitulo)');
                var gmo = [];
                var ptr = [];
                var operador = [];
                selects[4].querySelectorAll('option')[0].selected = true;
                selects[5].querySelectorAll('option')[0].selected = true;
                selects[6].querySelectorAll('option')[0].selected = true;
                selects[7].querySelectorAll('option')[0].selected = true;
                selects[8].querySelectorAll('option')[0].selected = true;
                selects[9].querySelectorAll('option')[0].selected = true;
                selects[10].querySelectorAll('option')[0].selected = true;
                componentes.forEach(function (pessoa) {
                    const numeroGuarda = Array.from(pessoa.querySelectorAll('strong')).find(dado => dado.innerText == "Nome Funcional:").parentNode.innerText.replace(/\D/g, "");
                    if (pessoa.parentNode.innerHTML.includes('Patrulheiro')) {
                        ptr.push(numeroGuarda);
                    } else if (pessoa.parentNode.innerHTML.includes('Motorista')) {
                        gmo.push(numeroGuarda);
                    } else if (pessoa.parentNode.innerHTML.includes('Operador')) {
                        operador.push(numeroGuarda);
                    } else {
                        selects[4].querySelectorAll('option').forEach(function (op) {
                            if (op.value == numeroGuarda) {
                                op.selected = true;
                            }
                        })
                    }
                });
                for (let i = 0; i < gmo.length; i++) {
                    selects[i + 5].querySelectorAll('option').forEach(function (op) {
                        if (op.value == gmo[i]) {
                            op.selected = true;
                        }
                    })
                }
                for (let i = 0; i < ptr.length; i++) {
                    selects[i + 8].querySelectorAll('option').forEach(function (op) {
                        if (op.value == ptr[i]) {
                            op.selected = true;
                        }
                    })
                }
                for (let i = 0; i < operador.length; i++) {
                    selects[i + 5].querySelectorAll('option').forEach(function (option) {
                        if (option.value == operador[i]) {
                            option.selected = true;
                        }
                    })
                }
                document.querySelector('app-modal-detalhar-equipe').querySelector('button').click();
                if (!document.querySelectorAll('app-unidade-servico-card')[parseInt(document.querySelector('#sel_equipe_edit_equip').value)].innerHTML.includes('Sem equipamentos cadastrados') && document.querySelector("#sel_area_edit_equip").value != 'COGM') {
                    document.querySelectorAll('app-unidade-servico-card')[parseInt(document.querySelector('#sel_equipe_edit_equip').value)].querySelector('app-equipamentos-mini-card').querySelector('button').click();
                } else {
                    localStorage.removeItem('edita_equipe_pega_equipe');
                }

            }
            if (localStorage.getItem('editar_equipe') && document.querySelector('app-modal-editar-equipe') && document.querySelector('app-modal-editar-equipe').querySelector('ul')) {
                setTimeout(() => {
                    if (localStorage.getItem('processo_edicao') == 'excluir_pessoas') {
                        if (document.querySelector('app-modal-editar-equipe').querySelectorAll('button[title="Excluir"]').length > 0) {
                            document.querySelector('app-modal-editar-equipe').querySelectorAll('button[title="Excluir"]').forEach(function (a) {
                                a.click();
                                localStorage.setItem('processo_edicao', 'inserir_pessoas');
                            });
                        }
                    }
                }, "1000");

            }
            if (localStorage.getItem('processo_edicao') == 'excluir_pessoas' && document.querySelector('app-modal-wrapper') && document.querySelector('app-modal-wrapper').innerHTML.includes('Encerrar o Serviço ?')) {
                if (document.querySelector("div[id='naorepete_encerra_sv_botao_sim']")) {
                } else {
                    c = document.createElement("div");
                    c.setAttribute("id", "naorepete_encerra_sv_botao_sim");
                    document.querySelector('app-modal-wrapper').append(c);
                    if (document.querySelector('app-modal-wrapper').innerHTML.includes('Encerrar o Serviço ?')) {
                        document.querySelector('app-modal-wrapper').querySelectorAll('button')[1].click();
                    }

                }
            }
            if (localStorage.getItem('processo_edicao') == 'excluir_pessoas' && document.querySelector('div[matsnackbarlabel]') && document.querySelector('div[matsnackbarlabel]').innerText.includes('encerrado com sucesso') && document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])] && sessionStorage.getItem('concluir_encarramento_uniade_sv') != 'sim') {
                for (let i = 0; i < document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card').length; i++) {
                    if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card')[i].querySelector('span').innerHTML.includes(document.querySelectorAll('select')[3].value)) {
                        document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card')[i].querySelectorAll('button')[1].click();
                        setTimeout(() => {
                            sessionStorage.setItem('concluir_encarramento_uniade_sv', 'nao');
                        }, 2000);
                        sessionStorage.setItem('concluir_encarramento_uniade_sv', 'sim');
                    }
                };
            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && !document.querySelector('cad-table')) {
                if (document.querySelector('app-modal-editar-equipe').querySelector('div[class="acoes-card ng-star-inserted"]').innerHTML.includes('Vincular Pessoas')) {
                    document.querySelector('app-modal-editar-equipe').querySelector('div[class="acoes-card ng-star-inserted"]').click();
                    if (document.querySelector('app-modal-editar-equipe').querySelector('div[class="row-actions"]')) {
                        document.querySelector('app-modal-editar-equipe').querySelector('div[class="row-actions"]').querySelector('button').click();
                        sessionStorage.setItem('concluir_encarramento_uniade_sv', 'nao');
                    }
                }

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value == '') {
                if (document.querySelector('app-modal-editar-equipe').querySelector('ul')) {
                    if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[3])) && localStorage.getItem('editar_equipe').split('-')[3] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[3];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[4])) && localStorage.getItem('editar_equipe').split('-')[4] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[4];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[5])) && localStorage.getItem('editar_equipe').split('-')[5] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[5];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[6])) && localStorage.getItem('editar_equipe').split('-')[6] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[6];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[7])) && localStorage.getItem('editar_equipe').split('-')[7] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[7];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[8])) && localStorage.getItem('editar_equipe').split('-')[8] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[8];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[9])) && localStorage.getItem('editar_equipe').split('-')[9] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[9];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[10])) && localStorage.getItem('editar_equipe').split('-')[10] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[11])) && localStorage.getItem('editar_equipe').split('-')[11] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[12])) && localStorage.getItem('editar_equipe').split('-')[12] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[13])) && localStorage.getItem('editar_equipe').split('-')[13] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[13];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[14])) && localStorage.getItem('editar_equipe').split('-')[14] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[14];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[15])) && localStorage.getItem('editar_equipe').split('-')[15] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[15];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !Array.from(document.querySelectorAll('app-modal-editar-equipe ul li span.titulo')).find(pessoa => pessoa.innerText.includes(localStorage.getItem('editar_equipe').split('-')[16])) && localStorage.getItem('editar_equipe').split('-')[16] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[16];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        localStorage.setItem('processo_edicao', 'inserir_funcoes');
                        localStorage.setItem('clicando_na_funcao', 'nao');
                        localStorage.setItem('qual_gm', '0');
                    }
                } else if (localStorage.getItem('editar_equipe').split('-')[3] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[3];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[4] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[4];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[5] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[5];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[6] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[6];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[7] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[7];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[8] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[8];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[9] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = localStorage.getItem('editar_equipe').split('-')[9];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').dispatchEvent(new Event('input', { bubbles: true }));
                }

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value != '' && document.querySelector('cad-table').querySelectorAll('tr').length < 5) {
                if (!document.querySelector('app-modal-editar-equipe').querySelector('div[class*="fx-group"]').innerHTML.includes(' ' + document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value + ' ')) {
                    if (document.querySelector('app-modal-editar-equipe').querySelector('button[title="Vincular"]')) {
                        document.querySelector('app-modal-editar-equipe').querySelector('button[title="Vincular"]').click();
                        document.querySelector('app-modal-editar-equipe').querySelector('div[class*="fx-group"]').innerHTML += ' ' + document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value + ' ';
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = '';
                    }
                } else {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nomeFuncional"]').value = '';
                }
            }
            if (localStorage.getItem('processo_edicao') == 'inserir_funcoes' && localStorage.getItem('clicando_na_funcao') && document.querySelector('app-modal-editar-equipe') && document.querySelector('app-modal-editar-equipe').querySelectorAll("li:not([data-feito])").length > 0 && !document.querySelector('mat-option')) {
                var equipe = localStorage.getItem('editar_equipe').split('-');
                var item = document.querySelector('app-modal-editar-equipe').querySelector("li:not([data-feito])");
                item.dataset.feito = 'feito';
                if (item.querySelector('button[aria-label="Limpar"]')) {
                    item.querySelector('button[aria-label="Limpar"]').click();
                } else {
                    item.querySelector('input').click();
                }
                if (equipe.indexOf(item.querySelectorAll('span.titulo')[1].innerText.split(' ')[0]) == 3) {
                    item.querySelector('input').click();
                    localStorage.setItem('clicando_na_funcao', 'Supervisor');
                } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM') {
                    for (let i = 4; i < equipe.length; i++) {
                        item.querySelector('input').click();
                        localStorage.setItem('clicando_na_funcao', 'Operador');
                    }
                } else if (equipe.indexOf(item.querySelectorAll('span.titulo')[1].innerText.split(' ')[0]) == 4 || equipe.indexOf(item.querySelectorAll('span.titulo')[1].innerText.split(' ')[0]) == 5 || equipe.indexOf(item.querySelectorAll('span.titulo')[1].innerText.split(' ')[0]) == 6) {
                    item.querySelector('input').click();
                    localStorage.setItem('clicando_na_funcao', 'Motorista');
                } else {
                    item.querySelector('input').click();
                    localStorage.setItem('clicando_na_funcao', 'Patrulheiro');
                }
            }
            if (localStorage.getItem('processo_edicao') == 'inserir_funcoes' && localStorage.getItem('clicando_na_funcao') && document.querySelector('mat-option')) {
                var funcao_xpath = document.evaluate("//mat-option[contains(.,'" + localStorage.getItem('clicando_na_funcao') + "')]", document, null, XPathResult.ANY_TYPE, null);
                var funcao_opt = funcao_xpath.iterateNext();
                if (funcao_opt) {
                    funcao_opt.click();
                }
            }
            if (localStorage.getItem('processo_edicao') == 'inserir_funcoes' && localStorage.getItem('clicando_na_funcao') && document.querySelector('app-modal-editar-equipe') && document.querySelector('app-modal-editar-equipe').querySelectorAll("li:not([data-feito])").length == 0 && !document.querySelector('mat-option')) {
                localStorage.removeItem('clicando_na_funcao');
                if (document.querySelector("#sel_area_edit_equip").value == 'COGM') {
                    localStorage.setItem('processo_edicao', 'encerrar_edicao');
                    document.querySelector('app-modal-editar-equipe').querySelector('button.confirm-btn').click();
                } else {
                    localStorage.setItem('processo_edicao', 'excluir_equipamentos');
                    document.querySelector('app-modal-editar-equipe').querySelector('button.confirm-btn').click();

                    if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])]) {
                        if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].innerHTML.includes('Sem equipamentos cadastrados')) {
                            document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelector('button[title="Incluir Equipamentos"]').click();
                        } else {
                            document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelector('app-equipamentos-mini-card').querySelector('button[title="Editar"]').click();
                        }
                    }
                }
            }
            if (localStorage.getItem('processo_edicao') == 'excluir_equipamentos' && !document.querySelector('app-modal-editar-equipe') && !document.querySelector('app-modal-editar-equipamentos') && (!equipamentos || equipamentos != 'a')) {
                var equipamentos = 'a';
                if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])]) {
                    if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].innerHTML.includes('Sem equipamentos cadastrados')) {
                        document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelector('button[title="Incluir Equipamentos"]').click();
                    } else {
                        document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelector('app-equipamentos-mini-card').querySelector('button[title="Editar"]').click();
                    }
                }
            }
            if (localStorage.getItem('editar_equipe') && document.querySelector('app-modal-editar-equipamentos') && localStorage.getItem('processo_edicao') == 'excluir_equipamentos') {
                setTimeout(() => {
                    if (localStorage.getItem('processo_edicao') == 'excluir_equipamentos') {
                        if (document.querySelector('app-modal-editar-equipamentos').querySelectorAll('em[title="Excluir"]').length > 0) {
                            localStorage.setItem('processo_edicao', 'inserir_equipamentos');
                            document.querySelector('app-modal-editar-equipamentos').querySelectorAll('em[title="Excluir"]').forEach(function (a) {
                                a.click();
                            });
                        } else {
                            localStorage.setItem('processo_edicao', 'inserir_equipamentos');
                        }
                    }
                }, "1000");

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_equipamentos' && document.querySelector('app-modal-editar-equipamentos') && !document.querySelector('cad-table')) {
                if (document.querySelector('app-modal-editar-equipamentos').innerHTML.includes('Fechar Pesquisa')) {
                    document.querySelector('app-modal-editar-equipamentos').querySelectorAll('button')[3].click();
                } else {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('button[botaoconfirmar]').click();
                }
            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_equipamentos' && document.querySelector('app-modal-editar-equipamentos') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]') && document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value == '') {
                document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'a';
                document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                if (document.querySelector('app-modal-editar-equipamentos').querySelector('ul')) {
                    if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[10].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[10] != ' ') {
                        if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[10])) {
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[11].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[11] != ' ') {
                        if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[11])) {
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[12].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[12] != ' ') {
                        if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[12])) {
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                            document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes('00' + localStorage.getItem('editar_equipe').split('-')[13].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[13] != ' ') {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[13];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[13];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes('00' + localStorage.getItem('editar_equipe').split('-')[14].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[14] != ' ') {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[14];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[14];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes('00' + localStorage.getItem('editar_equipe').split('-')[15].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[15] != ' ') {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[15];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[15];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipamentos').querySelector('ul').innerHTML.includes('00' + localStorage.getItem('editar_equipe').split('-')[16].toLowerCase()) && localStorage.getItem('editar_equipe').split('-')[16] != ' ') {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[16];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[16];
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        localStorage.setItem('processo_edicao', 'encerrar_edicao');
                        document.querySelector('app-modal-editar-equipamentos').querySelector('button[class="confirm-btn"]').click();
                    }
                } else if (localStorage.getItem('editar_equipe').split('-')[10] != ' ') {
                    if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[10])) {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[11] != ' ') {
                    if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[11])) {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[12] != ' ') {
                    if (!/[a-zA-Z]/.test(localStorage.getItem('editar_equipe').split('-')[12])) {
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Automóvel';
                        document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[13] != ' ') {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[13];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[13];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[14] != ' ') {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[14];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[14];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[15] != ' ') {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[15];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[15];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[16] != ' ') {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').value = 'Câmera Corporal';
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-nomeTipoEquipamento"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[16];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '00' + localStorage.getItem('editar_equipe').split('-')[16];
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').dispatchEvent(new Event('input', { bubbles: true }));
                }

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_equipamentos' && document.querySelector('app-modal-editar-equipamentos') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]') && document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value != '' && document.querySelector('cad-table').querySelectorAll('tr').length < 5) {
                if (!document.querySelector('app-modal-editar-equipamentos').querySelector('div[class*="fx-group"]').innerHTML.includes(' ' + document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value + ' ')) {
                    if (document.querySelector('app-modal-editar-equipamentos').querySelector('button[title="Vincular"]')) {
                        document.querySelectorAll('cad-table tbody tr').forEach(function (linha) {
                            if (linha.querySelectorAll('td')[1].innerText == document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value) {
                                document.querySelector('app-modal-editar-equipamentos').querySelector('button[title="Vincular"]').click();
                                document.querySelector('app-modal-editar-equipamentos').querySelector('div[class*="fx-group"]').innerHTML += ' ' + document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value + ' ';
                                document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '';
                            }
                        });
                    }
                } else {
                    document.querySelector('app-modal-editar-equipamentos').querySelector('input[name="column-filter-prefixo"]').value = '';
                }
            }
            function triggerMouseEvent(node, eventType) {
                var clickEvent = new Event(eventType, { bubbles: true, cancelable: true });
                node.dispatchEvent(clickEvent);
            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'encerrar_edicao' && document.querySelector('div[class="mat-mdc-snack-bar-label mdc-snackbar__label"]') && document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])]) {
                document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card').forEach(function (item) {
                    if (item.innerHTML.includes(localStorage.getItem('editar_equipe').split('-')[2])) {
                        var targetNode = item.querySelector('svg');
                        triggerMouseEvent(targetNode, "mouseover");
                        triggerMouseEvent(targetNode, "mousedown");
                        triggerMouseEvent(targetNode, "mouseup");
                        triggerMouseEvent(targetNode, "click");
                        item.parentNode.parentNode.parentNode.querySelector('button[title="Iniciar Serviço"]').click();
                    }
                });
            }

            if (localStorage.getItem('edita_equipe_pega_equipe') && document.querySelector('app-modal-detalhar-equipamentos')) {
                selects = document.querySelector('#checkbox').querySelectorAll('select');
                equipamentos = document.querySelector('app-modal-detalhar-equipamentos').querySelectorAll('div[class="modal-material-subtitulo"]');
                var vtr = [];
                var cam = [];
                selects[11].querySelectorAll('option')[0].selected = true;
                selects[12].querySelectorAll('option')[0].selected = true;
                selects[13].querySelectorAll('option')[0].selected = true;
                selects[14].querySelectorAll('option')[0].selected = true;
                selects[15].querySelectorAll('option')[0].selected = true;
                selects[16].querySelectorAll('option')[0].selected = true;
                selects[17].querySelectorAll('option')[0].selected = true;
                equipamentos.forEach(function (eqp) {
                    if (eqp.parentNode.innerHTML.includes('Câmera Corporal')) {
                        cam.push(eqp.innerHTML.trim().slice(2));
                    } else {
                        vtr.push(eqp.innerHTML.trim());
                    }
                });
                for (let i = 0; i < vtr.length; i++) {
                    selects[i + 11].querySelectorAll('option').forEach(function (op) {
                        if (op.value == vtr[i]) {
                            op.selected = true;
                        }
                    })
                }
                for (let i = 0; i < cam.length; i++) {
                    selects[i + 14].querySelectorAll('option').forEach(function (op) {
                        if (op.value == cam[i]) {
                            op.selected = true;
                        }
                    })
                }
                document.querySelector('app-modal-detalhar-equipamentos').querySelector('button').click();
                localStorage.removeItem('edita_equipe_pega_equipe');
            }
            if (document.querySelectorAll('app-unidade-servico-card').length > 20 && parseInt(localStorage.getItem('encerra_sv')) > -1 && localStorage.getItem('trava_encerra_sv') == 'nao') {
                var but_encerrar_sv = parseInt(localStorage.getItem('encerra_sv')) - 1;
                document.querySelectorAll('button[title="Encerrar Serviço"]')[0].click();
                localStorage.setItem('encerra_sv', but_encerrar_sv);
                localStorage.setItem('trava_encerra_sv', 'sim');
            }
            if (document.querySelector('app-consultar-unidade-servico') && document.querySelector("mat-select[formcontrolname=registrosPorPagina]")) {
                if (document.querySelector("div[id='naorepete']")) {
                } else {
                    a = document.createElement("div");
                    a.setAttribute("id", "naorepete");
                    document.querySelector('app-consultar-unidade-servico').append(a);
                    document.querySelector("mat-select[formcontrolname=registrosPorPagina]").click();
                    setTimeout(() => {
                        document.querySelectorAll('mat-option')[4].click();
                        document.querySelector("#sel_area_edit_equip").focus();
                    }, "1000");
                }
            };

            if (document.querySelector('input[name=column-filter-nomeFuncional]')) {
                if (document.querySelector("div[id='naorepete_editar_equipe']")) {
                } else {
                    var b = document.createElement("div");
                    b.setAttribute("id", "naorepete_editar_equipe");
                    document.querySelector('app-modal-editar-equipe').append(b);

                    document.querySelector('input[name=column-filter-nomeFuncional]').addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' && document.querySelector('input[name=column-filter-nomeFuncional]').value.length == 3) {
                            document.querySelectorAll('button[title=Vincular]')[0].click();
                            var n_gm = document.querySelector('input[name=column-filter-nomeFuncional]').value;
                            setTimeout(() => {
                                var pessoas_equipe = document.querySelectorAll('.titulo');
                                pessoas_equipe.forEach(function (pessoa) {
                                    if (pessoa.innerHTML.includes(n_gm)) {
                                        pessoa.parentNode.parentNode.querySelector('mat-select').click();
                                        document.querySelectorAll('mat-option')[8].click();
                                        document.querySelector('input[name=column-filter-nomeFuncional]').focus();
                                        document.querySelector('input[name=column-filter-nomeFuncional]').value = '';
                                    }
                                });
                            }, "1000");

                        }
                    });

                }
            };
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
                        //navigator.clipboard.writeText(range);
                        range.blur();
                    } catch (error) {
                        // Exceção aqui
                    }
                }
            }
            if (document.querySelector('#download_excel')) {
                if (document.querySelector("div[id='naorepete-ord_tab_lista_equipes']")) {
                } else {
                    c = document.createElement("div");
                    c.setAttribute("id", "naorepete-ord_tab_lista_equipes");
                    document.querySelector('app-consultar-unidade-servico').append(c);
                    const asc = true; // ordem: ascendente ou descendente
                    const index = 0; // coluna pela qual se quer ordenar
                    const tabela = document.getElementById('tabela_lista_de_equipes');

                    const arr = Array.from(tabela.querySelectorAll('tbody tr'));
                    const th_elem = tabela.querySelectorAll('th');

                    arr.sort((a, b) => {
                        const a_val = a.children[index].innerText
                        const b_val = b.children[index].innerText
                        return (asc) ? a_val.localeCompare(b_val) : b_val.localeCompare(a_val)
                    })
                    arr.forEach(elem => {
                        tabela.appendChild(elem)
                    });
                }
            }
            if (document.querySelector('app-modal-editar-equipe') && !document.querySelector('app-modal-editar-equipe #atualizaEquipeFirebase')) {
                const buttonConfirmarOriginal = document.querySelector('app-modal-editar-equipe button[botaoconfirmar]');

                const buttonConfirmarAlterado = buttonConfirmarOriginal.cloneNode(true);

                buttonConfirmarAlterado.setAttribute('id', 'atualizaEquipeFirebase');
                buttonConfirmarOriginal.style.display = 'none';
                buttonConfirmarOriginal.after(buttonConfirmarAlterado);

                buttonConfirmarAlterado.addEventListener('click', () => {
                    let gu = document.querySelector('app-modal-editar-equipe input[formcontrolname="nome"]').value;
                    let membros = Array.from(document.querySelectorAll('app-modal-editar-equipe ul li')).map(li => `${li.querySelectorAll('span.titulo')[1].innerText.split(' -')[0].trim()}-++-${li.querySelector('input').value}`);
                    if (membros.length > 0) {
                        const dados = `${(new Date()).getTime()}|${gu}-()-${document.querySelector('#nomeUsuario').innerText}-()-${membros}`;
                        chrome.runtime.sendMessage({ action: "atualizar_equipes", payload: dados }, response => {
                            if (chrome.runtime.lastError) {
                                console.error("Erro na mensagem:", chrome.runtime.lastError.message);
                            } else {
                                console.log("Resposta do background:", response);
                                buttonConfirmarOriginal.click();
                            }
                        });
                    }
                });
            }
            if (document.querySelector('app-modal-editar-equipamentos')) {
                let area = document.querySelector('app-modal-editar-equipamentos strong').innerText.split('#')[0].trim();
                let equipamentos = Array.from(document.querySelectorAll('app-modal-editar-equipamentos ul li')).map(li => `${li.querySelector('span.titulo').innerText.trim()}`);
                sessionStorage.setItem('equipamentos_firebase', `${(new Date()).getTime()}|${area}-()-${document.querySelector('#nomeUsuario').innerText}-()-${equipamentos}`);
            }
            if (!document.querySelector('app-modal-editar-equipamentos') && sessionStorage.getItem('equipamentos_firebase')) {
                chrome.runtime.sendMessage({ action: "atualizar_equipamentos", payload: sessionStorage.getItem('equipamentos_firebase') }, response => {
                    if (chrome.runtime.lastError) {
                        console.error("Erro na mensagem:", chrome.runtime.lastError.message);
                    } else {
                        console.log("Resposta do background:", response);
                    }
                });
                sessionStorage.removeItem('equipamentos_firebase');
            }
            setTimeout(() => {
                if (document.querySelector('app-equipe-mini-card')) {
                    if (document.querySelector("div[id='naorepete-empenhada']")) {
                    } else {
                        var equipamentos = '';
                        var c = document.createElement("div");
                        c.setAttribute("id", "naorepete-empenhada");
                        document.querySelector('app-consultar-unidade-servico').append(c);
                        var checkbox = document.createElement("div");
                        checkbox.setAttribute("id", "checkbox");
                        var botao_gerar_lista_de_equipes = document.createElement("div");
                        botao_gerar_lista_de_equipes.setAttribute("id", "botao_gerar_lista_de_equipes");
                        botao_gerar_lista_de_equipes.setAttribute('class', 'cancel-btn');
                        botao_gerar_lista_de_equipes.setAttribute('style', "margin-right:1%;display:inline-block");
                        document.querySelector('app-consultar-unidade-servico').insertBefore(botao_gerar_lista_de_equipes, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.getElementById('botao_gerar_lista_de_equipes').innerHTML = 'Gerar Lista de Equipes';
                        var botao_gerar_encerrar_todos_os_servicos = document.createElement("div");
                        botao_gerar_encerrar_todos_os_servicos.setAttribute("id", "botao_gerar_encerrar_todos_os_servicos");
                        botao_gerar_encerrar_todos_os_servicos.setAttribute('class', 'cancel-btn');
                        botao_gerar_encerrar_todos_os_servicos.setAttribute('style', "margin-right:1%;display:inline-block");
                        var botao_atualizar_banco = document.createElement("div");
                        botao_atualizar_banco.setAttribute("id", "botao_atualizar_banco");
                        botao_atualizar_banco.setAttribute('class', 'cancel-btn');
                        botao_atualizar_banco.setAttribute('style', "margin-right:1%;display:inline-block");
                        document.querySelector('app-consultar-unidade-servico').insertBefore(botao_gerar_encerrar_todos_os_servicos, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.querySelector('app-consultar-unidade-servico').insertBefore(botao_atualizar_banco, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.querySelector('app-consultar-unidade-servico').insertBefore(checkbox, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.getElementById('checkbox').innerHTML = '<select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option>Todas</option><option value=1000>ROMU</option><option value=1100>PATAM</option><option value=1200>Centro</option><option value="200 Área Cruzeiro">21 - Cruzeiro</option><option value=300>31 - Partenon</option><option value=400>41 - Leste</option><option value=500>51 - Restinga</option><option value=600>61 - Norte</option><option value=700>71 - Eixo Baltazar</option><option value=800>81 - Pinheiro</option><option value=900>91 - Sul</option><option value="Cogm">COGM</option><option value="Cmd">Comando</option><option value="- A">Apoio</option></select>';
                        document.querySelector('#checkbox').innerHTML += '<table><tbody><tr style="text-align:center"><td>Área</td><td>Equipe</td><td>Turno</td><td>GSP</td><td>GMO 1</td><td>GMO 2</td><td>GMO 3</td><td>PTR 1</td><td>PTR 2</td><td>PTR 3</td><td>VTR 1</td><td>VTR 2</td><td>VTR 3</td><td>Cam 1</td><td>Cam 2</td><td>Cam 3</td><td>Cam 4</td><td></td></tr><tr><td><select id=sel_area_edit_equip style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option value=1000>1000 - ROMU</option><option value=1100>1100 - Patam</option><option value=1200>1200 - Centro</option><option value="200">21 - Cruzeiro</option><option value="300">31 - Partenon</option><option value="400">41 - Leste</option><option value="500">51 - Restinga</option><option value="600">61 - Norte</option><option value="700">71 - Eixo Baltazar</option><option value="800">81 - Pinheiro</option><option value="900">91 - Sul</option><option value="COGM">COGM</option><option value="A">Apoio</option></select></td><td><select id=sel_equipe_edit_equip style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option value="Dia">Dia</option><option value="Noite">Noite</option></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><button id=editar_equipe_but class=cancel-btn>Inserir</button></td></tr></tbody></table>';
                        document.getElementById('botao_gerar_encerrar_todos_os_servicos').innerHTML = 'Encerrar Todos os Serviços';
                        document.getElementById('botao_atualizar_banco').innerHTML = 'Atualizar Banco';
                        document.getElementById('botao_gerar_encerrar_todos_os_servicos').addEventListener('click', function () {
                            document.querySelectorAll('button[title="Encerrar Serviço"]').forEach(function (item) {
                                item.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('svg').parentNode.click();
                            });
                            document.querySelector("body > app-root > div > div > div.page > app-consultar-unidade-servico > form > div.fx-container-fluid.fx-mt-2 > div > cad-button-bar > div > div.box-regular > div > div > button.cancel-btn.ng-star-inserted").click();
                        });
                        document.getElementById('botao_atualizar_banco').addEventListener('click', function () {
                            localStorage.removeItem('atualizacao_pessoas');
                            window.location.reload();
                        });
                        var eqps = ['A1', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'R1', 'R2', 'R3', 'R4', 'R5', 'P1', 'P2', '21', '22', '31', '32', '41', '42', '51', '52', '61', '62', '71', '72', '81', '82', '91', '92', 'COGM'];
                        var vtrs_placa = new Map();
                        vtrs_placa.set('4B35', '0125'); vtrs_placa.set('3I25', '0225'); vtrs_placa.set('3I15', '0325'); vtrs_placa.set('1470', '0118'); vtrs_placa.set('4G47', '0122'); vtrs_placa.set('4B58', '0124'); vtrs_placa.set('1468', '0218'); vtrs_placa.set('4E96', '0222'); vtrs_placa.set('3D36', '0224'); vtrs_placa.set('0283', '0283'); vtrs_placa.set('0301', '0301'); vtrs_placa.set('0305', '0305'); vtrs_placa.set('1469', '0318'); vtrs_placa.set('4E69', '0322'); vtrs_placa.set('3D37', '0324'); vtrs_placa.set('1471', '0418'); vtrs_placa.set('4E64', '0422'); vtrs_placa.set('3D50', '0424'); vtrs_placa.set('1473', '0518'); vtrs_placa.set('4G77', '0522'); vtrs_placa.set('2F38', '0524'); vtrs_placa.set('1467', '0618'); vtrs_placa.set('4E77', '0622'); vtrs_placa.set('4E57', '0722'); vtrs_placa.set('8J14', '0819'); vtrs_placa.set('4G14', '0822'); vtrs_placa.set('0906', '0906'); vtrs_placa.set('8J11', '0919'); vtrs_placa.set('4E85', '0922'); vtrs_placa.set('0F11', '0f11'); vtrs_placa.set('8J26', '1019'); vtrs_placa.set('4F34', '1022'); vtrs_placa.set('9A14', '1119'); vtrs_placa.set('4E88', '1122'); vtrs_placa.set('4G49', '1222'); vtrs_placa.set('1B67', '1267'); vtrs_placa.set('8J15', '1319'); vtrs_placa.set('4G36', '1322'); vtrs_placa.set('2J01', '1419'); vtrs_placa.set('4F48', '1422'); vtrs_placa.set('2J13', '1519'); vtrs_placa.set('4F75', '1522'); vtrs_placa.set('2J14', '1619'); vtrs_placa.set('4F19', '1622'); vtrs_placa.set('1667', '1667'); vtrs_placa.set('2J15', '1719'); vtrs_placa.set('4E76', '1722'); vtrs_placa.set('2J10', '1819'); vtrs_placa.set('4G61', '1822'); vtrs_placa.set('2J11', '1919'); vtrs_placa.set('4E61', '1922'); vtrs_placa.set('1G13', '1g13'); vtrs_placa.set('1I54', '1i54'); vtrs_placa.set('1I84', '1i84'); vtrs_placa.set('1J04', '1j04'); vtrs_placa.set('2J07', '2019'); vtrs_placa.set('4F60', '2022'); vtrs_placa.set('2048', '2048'); vtrs_placa.set('2J03', '2119'); vtrs_placa.set('2J05', '2219'); vtrs_placa.set('2240', '2240'); vtrs_placa.set('2241', '2241'); vtrs_placa.set('2253', '2253'); vtrs_placa.set('2254', '2254'); vtrs_placa.set('2J08', '2319'); vtrs_placa.set('2J12', '2419'); vtrs_placa.set('2420', '2420'); vtrs_placa.set('2J09', '2519'); vtrs_placa.set('2J02', '2619'); vtrs_placa.set('2747', '2747'); vtrs_placa.set('0287', '287'); vtrs_placa.set('0294', '294'); vtrs_placa.set('2975', '2975'); vtrs_placa.set('2A47', '2a47'); vtrs_placa.set('2A58', '2a58'); vtrs_placa.set('2A67', '2a67'); vtrs_placa.set('2A76', '2a76'); vtrs_placa.set('2B31', '2b31'); vtrs_placa.set('2B44', '2b44'); vtrs_placa.set('2B49', '2b49'); vtrs_placa.set('2B67', '2b67'); vtrs_placa.set('2B72', '2b72'); vtrs_placa.set('2B76', '2b76'); vtrs_placa.set('2B85', '2b85'); vtrs_placa.set('2B93', '2b93'); vtrs_placa.set('2B94', '2b94'); vtrs_placa.set('3376', '3376'); vtrs_placa.set('3377', '3377'); vtrs_placa.set('3378', '3378'); vtrs_placa.set('3379', '3379'); vtrs_placa.set('3380', '3380'); vtrs_placa.set('3742', '3742'); vtrs_placa.set('3753', '3753'); vtrs_placa.set('3761', '3761'); vtrs_placa.set('3766', '3766'); vtrs_placa.set('3770', '3770'); vtrs_placa.set('3932', '3932'); vtrs_placa.set('3942', '3942'); vtrs_placa.set('3948', '3948'); vtrs_placa.set('3953', '3953'); vtrs_placa.set('3955', '3955'); vtrs_placa.set('4267', '4267'); vtrs_placa.set('4339', '4339'); vtrs_placa.set('5255', '5255'); vtrs_placa.set('5G09', '5g09'); vtrs_placa.set('6017', '6017'); vtrs_placa.set('6046', '6046'); vtrs_placa.set('6077', '6077'); vtrs_placa.set('6085', '6085'); vtrs_placa.set('6094', '6094'); vtrs_placa.set('6103', '6103'); vtrs_placa.set('6108', '6108'); vtrs_placa.set('6121', '6121'); vtrs_placa.set('6126', '6126'); vtrs_placa.set('6915', '6915'); vtrs_placa.set('6950', '6950'); vtrs_placa.set('6959', '6959'); vtrs_placa.set('6965', '6965'); vtrs_placa.set('6972', '6972'); vtrs_placa.set('1466', '0718'); vtrs_placa.set('7259', '7259'); vtrs_placa.set('7280', '7280'); vtrs_placa.set('7285', '7285'); vtrs_placa.set('7337', '7337'); vtrs_placa.set('0734', '734'); vtrs_placa.set('7429', '7429'); vtrs_placa.set('7554', '7554'); vtrs_placa.set('7D34', '7d34'); vtrs_placa.set('7H22', '7h22'); vtrs_placa.set('7H23', '7h23'); vtrs_placa.set('7H25', '7h25'); vtrs_placa.set('7H29', '7h29'); vtrs_placa.set('7H32', '7h32'); vtrs_placa.set('7H38', '7h38'); vtrs_placa.set('8163', '8163'); vtrs_placa.set('8299', '8299'); vtrs_placa.set('8401', '8401'); vtrs_placa.set('8408', '8408'); vtrs_placa.set('8970', '8970'); vtrs_placa.set('9028', '9028'); vtrs_placa.set('9051', '9051'); vtrs_placa.set('9077', '9077'); vtrs_placa.set('9132', '9132'); vtrs_placa.set('9133', '9133'); vtrs_placa.set('9134', '9134'); vtrs_placa.set('9135', '9135'); vtrs_placa.set('9473', '9473'); vtrs_placa.set('9882', '9882'); vtrs_placa.set('9894', '9894'); vtrs_placa.set('9908', '9908'); vtrs_placa.set('9J14', 'Izf9j14'); vtrs_placa.set('9E63', 'Micro'); vtrs_placa.set('ICRO', 'Micro 03');
                        var vtrs = ['1000', ['0125', '0225', '0325', '0819', '0524', '0911', '0919', 1019, 1119, 1919, '2b31', '2a47', '1319'], '1100', ['0224', '0324'], '1200', ['0122', '1022', '1122', '1222', '1419', '1422', '2b49', '2b76', '2b67', '1919', '1622', '1522', '1322', '1i54', '2a76', '2b44', '2b85', '2b93', '2a57', '2a67', '2a58', '2319'], '200', ['0222', 2519], '300', [2119, '0322'], '400', ['0422', 2219], '500', ['0522', 1619], '600', ['0418', '0718', '2019', '2J07', '0622'], '700', ['0722', 2019], '800', [1719, '0822'], '900', ['1922', '0922', '1519', '4E85']];
                        var cameras = ['Dia', ['1000', [1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1341, 1342, 1343, 1346, 1344, 1345, 1347, 1348, 1349, 1350], '1100', [1417, 1222, 1227, 1226, 1221], '1200', [1241, 1242, 1243, 1244, 1245, 1246, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1365], '200', [1389, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404], '300', [1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240], '400', [1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1458, 1460], '500', [1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396], '600', [1454, 1455, 1456, 1457, 1459, 1460, 1469], '700', [1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452], '800', [1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388], '900', [1405, 1406, 1407, 1409, 1408, 1409, 1410, 1411, 1412]]];
                        var gms;
                        if (!localStorage.getItem('atualizacao_pessoas') || localStorage.getItem('atualizacao_pessoas') != new Date().getDate()) {
                            let dados = [[], [], [], [], [], [], [], [], [], [], [], []];
                            let areas = ['Subintendência Regional Cruzeiro', 'Subintendência Regional Partenon', 'Subintendência Regional Leste', 'Subintendência Regional Restinga', 'Subintendência Regional Norte', 'Subintendência Regional Eixo Baltazar', 'Subintendência Regional Lomba do Pinheiro', 'Subintendência Regional Eixo Sul', 'Subintendência da Ronda Ostensiva Municipal', 'Subintendência Regional Centro', 'Patrulha de Atendimento à Mulher', 'Central de Operações da Guarda Civil Metropolitana'];
                            chrome.runtime.sendMessage({ action: "atualizar_banco_local_efetivo" }, response => {
                                if (chrome.runtime.lastError) {
                                    console.error("Erro na mensagem:", chrome.runtime.lastError.message);
                                } else {
                                    response.dados.forEach(element => {
                                        console.log(element["lotacao"]);
                                        for (let index = 0; index < areas.length; index++) {
                                            if (areas[index] == element["lotacao"]) {
                                                const gm = element.nomeFuncional.replace(/\D/g, "");
                                                dados[index].push(gm);
                                            }
                                        }
                                    });
                                    gms = ['Dia', ['1000', dados[8], '1100', dados[10], '1200', dados[9], '200', dados[0], '300', dados[1], '400', dados[2], '500', dados[3], '600', dados[4], '700', dados[5], '800', dados[6], '900', dados[7], 'COGM', dados[11]]];
                                    localStorage.setItem('gms', JSON.stringify(gms));
                                    localStorage.setItem('atualizacao_pessoas', new Date().getDate());
                                    gms = JSON.parse(localStorage.getItem('gms'));
                                    atualizarUuid();
                                }
                            });


                        } else {
                            gms = JSON.parse(localStorage.getItem('gms'));
                        }
                        if (gms) {
                            var selects = document.getElementById('checkbox').querySelector('table').querySelectorAll('select');
                            document.querySelector("#sel_area_edit_equip").focus();
                            document.getElementById('sel_area_edit_equip').addEventListener('change', function () {
                                document.getElementById('sel_equipe_edit_equip').innerHTML = '';
                                var equipes = document.querySelectorAll('app-unidade-servico-card');
                                var area = document.getElementById('sel_area_edit_equip').value;
                                if (area != 'COGM') {
                                    document.querySelectorAll('td')[4].innerHTML = 'GMO 1';
                                    document.querySelectorAll('td')[5].innerHTML = 'GMO 2';
                                    document.querySelectorAll('td')[6].innerHTML = 'GMO 3';
                                    document.querySelectorAll('td')[7].innerHTML = 'PTR 1';
                                    document.querySelectorAll('td')[8].innerHTML = 'PTR 2';
                                    document.querySelectorAll('td')[9].innerHTML = 'PTR 3';
                                    document.querySelectorAll('td')[10].innerHTML = 'VTR 1';
                                    document.querySelectorAll('td')[11].innerHTML = 'VTR 2';
                                    document.querySelectorAll('td')[12].innerHTML = 'VTR 3';
                                    document.querySelectorAll('td')[13].innerHTML = 'Cam 1';
                                    document.querySelectorAll('td')[14].innerHTML = 'Cam 2';
                                    document.querySelectorAll('td')[15].innerHTML = 'Cam 3';
                                    document.querySelectorAll('td')[16].innerHTML = 'Cam 4';
                                    for (let i = 0; i < equipes.length; i++) {
                                        if (equipes[i].querySelector('span').innerHTML.split(' ')[0] == area) {
                                            document.getElementById('sel_equipe_edit_equip').innerHTML += '<option value=' + i + '>' + equipes[i].querySelector('span').innerHTML.split('- ')[1] + '</option>';
                                        }
                                    }
                                } else {
                                    for (let i = 4; i < 17; i++) {
                                        document.querySelectorAll('td')[i].innerHTML = 'Op';
                                    }
                                    for (let i = 0; i < equipes.length; i++) {
                                        if (equipes[i].querySelector('span').innerHTML.includes('Cogm')) {
                                            document.getElementById('sel_equipe_edit_equip').innerHTML += '<option value=' + i + '>COGM</option>';
                                        }
                                    }
                                }

                                var guardas = gms[gms.indexOf(selects[2].value) + 1][gms[gms.indexOf(selects[2].value) + 1].indexOf(selects[0].value) + 1].sort();
                                var op = '<option value=" "></option>';
                                guardas.forEach(function (item) {
                                    op += '<option value=' + item + '>' + item + '</option>';
                                });
                                if (area != 'COGM') {
                                    selects[3].innerHTML = op;
                                    selects[4].innerHTML = op;
                                    selects[5].innerHTML = op;
                                    selects[6].innerHTML = op;
                                    selects[7].innerHTML = op;
                                    selects[8].innerHTML = op;
                                    selects[9].innerHTML = op;
                                    var viaturas = vtrs[vtrs.indexOf(selects[0].value) + 1].sort();
                                    var opvtr = '<option value=" "></option>';
                                    viaturas.forEach(function (item) {
                                        opvtr += '<option value=' + item + '>' + item + '</option>';
                                    });
                                    selects[10].innerHTML = opvtr;
                                    selects[11].innerHTML = opvtr;
                                    selects[12].innerHTML = opvtr;
                                    var camrs = cameras[cameras.indexOf(selects[2].value) + 1][cameras[cameras.indexOf(selects[2].value) + 1].indexOf(selects[0].value) + 1].sort();
                                    var opcams = '<option value=" "></option>';
                                    camrs.forEach(function (item) {
                                        opcams += '<option value=' + item + '>' + item + '</option>';
                                    });
                                    selects[13].innerHTML = opcams;
                                    selects[14].innerHTML = opcams;
                                    selects[15].innerHTML = opcams;
                                    selects[16].innerHTML = opcams;
                                } else {
                                    for (let i = 3; i < 17; i++) {
                                        selects[i].innerHTML = op;
                                    }
                                }
                                document.getElementById('sel_equipe_edit_equip').dispatchEvent(new Event('change', { bubbles: true }));
                            });
                            document.getElementById('sel_equipe_edit_equip').addEventListener('change', function () {
                                localStorage.setItem('edita_equipe_pega_equipe', 'equipe');
                                var eqps = document.querySelectorAll('app-unidade-servico-card')[parseInt(document.querySelector('#sel_equipe_edit_equip').value)].querySelectorAll('app-equipe-mini-card');
                                for (let i = 0; i < eqps.length; i++) {
                                    if (eqps[i].querySelector('span').innerHTML.includes(document.querySelectorAll('select')[3].value)) {
                                        eqps[i].querySelector('button').click();
                                        break;
                                    }
                                };
                            });
                            selects[2].addEventListener('change', function () {
                                document.getElementById('sel_equipe_edit_equip').dispatchEvent(new Event('change', { bubbles: true }));
                            });
                            document.querySelector('#editar_equipe_but').addEventListener('click', function () {
                                localStorage.setItem('processo_edicao', 'excluir_pessoas');
                                localStorage.setItem('editar_equipe', selects[0].value + '-' + selects[1].value + '-' + selects[2].value + '-' + selects[3].value + '-' + selects[4].value + '-' + selects[5].value + '-' + selects[6].value + '-' + selects[7].value + '-' + selects[8].value + '-' + selects[9].value + '-' + selects[10].value + '-' + selects[11].value + '-' + selects[12].value + '-' + selects[13].value + '-' + selects[14].value + '-' + selects[15].value + '-' + selects[16].value)
                                unidade_servico = document.querySelectorAll('app-unidade-servico-card')[parseInt(document.querySelector('#sel_equipe_edit_equip').value)];
                                if (unidade_servico.querySelector('button[title="Encerrar Serviço"]')) {
                                    unidade_servico.querySelector('button[title="Encerrar Serviço"]').click();
                                } else {
                                    for (let i = 0; i < unidade_servico.querySelectorAll('app-equipe-mini-card').length; i++) {
                                        if (unidade_servico.querySelectorAll('app-equipe-mini-card')[i].querySelector('span').innerHTML.includes(document.querySelectorAll('select')[3].value)) {
                                            unidade_servico.querySelectorAll('app-equipe-mini-card')[i].querySelectorAll('button')[1].click();
                                            break;
                                        }
                                    };
                                }
                            });

                            document.getElementById('sel_area_edit_equip').dispatchEvent(new Event('change', { bubbles: true }));

                            document.getElementById('botao_gerar_lista_de_equipes').addEventListener('click', async function () {
                                var tabela_lista_de_equipes = document.createElement("table");
                                tabela_lista_de_equipes.setAttribute("id", "tabela_lista_de_equipes");
                                tabela_lista_de_equipes.setAttribute("class", "mat-focus-indicator mat-raised-button mat-button-base mat-botao-secundario");
                                document.getElementById('botao_gerar_lista_de_equipes').parentNode.insertBefore(tabela_lista_de_equipes, document.getElementById('botao_gerar_lista_de_equipes').nextSibling);
                                var botao_copiar_lista_equipes = document.createElement("div");
                                botao_copiar_lista_equipes.setAttribute("id", "botao_copiar_lista_equipes");
                                botao_copiar_lista_equipes.setAttribute('class', 'cancel-btn');
                                botao_copiar_lista_equipes.setAttribute('style', "margin-right:1%;display:inline-block");
                                document.getElementById('botao_gerar_lista_de_equipes').parentNode.insertBefore(botao_copiar_lista_equipes, document.getElementById('botao_gerar_lista_de_equipes').nextSibling);
                                document.getElementById('botao_copiar_lista_equipes').innerHTML = 'Copiar Lista de Equipes';
                                document.getElementById('tabela_lista_de_equipes').innerHTML = '<thead><tr><th>Guarnição</th><th>GM Nº</th><th>Nome</th><th>Função</th><th>Vtr</th><th>Câmeras</th></tr></thead><tbody>';
                                document.getElementById('botao_copiar_lista_equipes').addEventListener('click', function () {
                                    Tabela.selecionarTabela(document.getElementById('tabela_lista_de_equipes'));
                                });
                                try {
                                    const response = await fetch(
                                        "https://cadweb.sinesp.gov.br/cad-equipe-servico/unidade-servico/listar?numPagina=1&registrosPorPagina=50&propriedadeOrdenacao=nome&direcaoOrdenacao=ASC&propriedadeOrdenacaoGrupo=naoAgrupar&direcaoOrdenacaoGrupo=ASC&situacao=IN&situacao=ES&situacao=EP&situacao=PO",
                                        {
                                            credentials: "include"
                                        }
                                    );

                                    if (!response.ok) {
                                        throw new Error(`Erro HTTP: ${response.status}`);
                                    }

                                    const dados = await response.json();

                                    dados.resultados.forEach(unidade => {
                                        unidade.equipeEmServico.pessoas.forEach(pessoa => {
                                            const equipe = unidade.equipeEmServico.nome;
                                            const nrFuncional = pessoa.nomeFuncional.split(' ')[0];
                                            const nomeFuncional = pessoa.nomeFuncional.replace(nrFuncional + ' ', '');
                                            const funcao = pessoa.nomeFuncao;
                                            const vtrs = unidade.equipamentos
                                                .filter(equipamento => equipamento.tipoEquipamento.descricaoClasse == 'Viatura')
                                                .map(equipamento => `${equipamento.prefixo} - ${equipamento.placa}`)
                                                .join(' - ');
                                            const cameras = unidade.equipamentos
                                                .filter(equipamento => equipamento.tipoEquipamento.descricaoClasse == 'Material')
                                                .map(equipamento => `${equipamento.prefixo}`)
                                                .join(' - ');
                                            document.querySelector('#tabela_lista_de_equipes tbody').innerHTML += `<tr><td>${equipe}</td><td>${nrFuncional}</td><td>${nomeFuncional}</td><td>${funcao}</td><td>${vtrs}</td><td>${cameras}</td>`;
                                        })
                                    })
                                }
                                catch (erro) {
                                    console.error("Erro ao buscar unidades:", erro);
                                }
                            });
                            document.getElementById('checkbox').querySelector('select').addEventListener('change', function () {
                                var valor = this.value;
                                localStorage.setItem('cards_selecionados', valor);
                                var cards = document.querySelectorAll('app-unidade-servico-card');
                                if (valor == 'Todas') {
                                    cards.forEach(function (item) {
                                        item.style.display = '';
                                    });
                                } else {
                                    cards.forEach(function (item) {
                                        if (item.querySelector('span').innerHTML.includes(valor)) {
                                            item.style.display = '';
                                        } else {
                                            item.style.display = 'none';
                                        }

                                    });

                                }
                            });

                            c = document.createElement("textarea");
                            c.setAttribute("id", "txt_separador_equipes");
                            document.querySelector('app-consultar-unidade-servico').insertBefore(c, document.querySelector('app-consultar-unidade-servico').querySelector('form'));

                            c = document.createElement("div");
                            c.setAttribute("id", "div_separador_equipes");
                            document.querySelector('app-consultar-unidade-servico').insertBefore(c, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                            document.getElementById('txt_separador_equipes').addEventListener('input', function () {
                                var tbody = '';
                                var equipes = document.getElementById('txt_separador_equipes').value.toUpperCase().replaceAll('GU', ' ').replaceAll(';', ' ').replaceAll(':', ' ').replaceAll('.', ' ').replaceAll('(', ' ').replaceAll(')', ' ').replaceAll('-', ' ').replaceAll(',', ' ').replaceAll('/', ' ').replaceAll('JBL', ' ').replaceAll('CAM', ' ').replaceAll('CAMERAS', ' ').replaceAll('CÂMERAS', ' ').replaceAll('\n', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ').split(' ');
                                var e = [];
                                var n = [];
                                for (let index = 0; index < equipes.length; index++) {
                                    if (eqps.includes(equipes[index])) {
                                        e.push(index);
                                    }
                                }
                                if (e.length == 1) {
                                    n.push(equipes.join(' '));
                                } else if (e.length > 1) {
                                    n.push(equipes.slice(0, e[1]).join(' '));
                                    for (let i = 1; i < e.length - 1; i++) {
                                        n.push(equipes.slice(e[i], e[i + 1]).join(' '));
                                    }
                                    n.push(equipes.slice(e[e.length - 1], equipes.length).join(' '));
                                }
                                n.forEach(function (indx) {
                                    var equipe = '';
                                    var guardas = [];
                                    var vtr = [];
                                    var cam = [];
                                    indx.split(' ').forEach(function (i) {
                                        i = i.slice(-4);
                                        if (i.slice(0, 1).toUpperCase() == 'C' && eqps.includes(i)) {
                                            if (i.length == 2) {
                                                equipe = '<td><input value="' + i.slice(0, 1) + i.slice(i.length - 1, i.length) + '" /></td>';
                                            } else {
                                                equipe = '<td><input value="' + i + '" /></td>';
                                            }
                                        } else if (i.length == 2 && eqps.includes(i)) {
                                            equipe = '<td><input value="' + i + '" /></td>';
                                        } else if (i.replace(/\D/g, '').length == 3 && gms.toString().includes(i)) {
                                            guardas.push(i);
                                        } else if (i.length == 4) {
                                            if (vtrs_placa.has(i)) {
                                                vtr.push(vtrs_placa.get(i));
                                            } else if (vtrs.toString().toLowerCase().includes(i.toLowerCase())) {
                                                vtr.push(i);
                                            } else if (cameras.toString().includes((i))) {
                                                cam.push(i);
                                            }
                                        }
                                    });
                                    tbody += '<tr>' + equipe + '<td><select>';
                                    const d = new Date();
                                    let hour = d.getHours();
                                    if (6 <= hour <= 18) {
                                        tbody += '<option selected>Dia</option><option>Noite</option>';
                                    } else {
                                        tbody += '<option>Dia</option><option selected>Noite</option>';
                                    }
                                    tbody += '</select>';
                                    let gsp;
                                    let gmo;
                                    let ptr;
                                    const eqpStr = equipes.join(' ');
                                    guardas.forEach(function (guarda) {
                                        if (eqpStr.includes('GSP ' + guarda) || eqpStr.includes('GSP' + guarda) || eqpStr.includes(guarda + ' GSP') || eqpStr.includes(guarda + 'GSP')) {
                                            gsp = '<td><input value="' + guarda + '" /></td>';
                                        } else if (eqpStr.includes('GMO ' + guarda) || eqpStr.includes('GMO' + guarda) || eqpStr.includes(guarda + ' GMO') || eqpStr.includes(guarda + 'GMO')) {
                                            gmo = '<td><input value="' + guarda + '" /></td>';
                                        } else {
                                            ptr = '<td><input value="' + guarda + '" /></td>';
                                        }
                                    });
                                    if (gsp || gmo) {
                                        tbody += gsp || '<td><input value=" " /></td>';
                                        tbody += gmo || '<td><input value=" " /></td>';
                                        tbody += '<td><input value=" " /></td>';
                                        tbody += '<td><input value=" " /></td>';
                                        guardas.forEach(function (guarda) {
                                            if (!tbody.includes(guarda)) {
                                                tbody += '<td><input value="' + guarda + '" /></td>';
                                            }
                                        });
                                        const regex = new RegExp('<td>', 'g');
                                        let qtd_celulas = 9 - (tbody.split('<tr>')[tbody.split('<tr>').length - 1].match(regex)).length;
                                        for (let i = 0; i < qtd_celulas; i++) {
                                            tbody += '<td><input value=" " /></td>';
                                        }
                                    } else {
                                        tbody += '<td><input value=" " /></td>';
                                        if (vtr.toString().toLowerCase().includes('2b49') || vtr.toString().toLowerCase().includes('2b49') || vtr.toString().toLowerCase().includes('2b76') || vtr.toString().toLowerCase().includes('2b67') || vtr.toString().toLowerCase().includes('1i54') || vtr.toString().toLowerCase().includes('2b85') || vtr.toString().toLowerCase().includes('2b93') || vtr.toString().toLowerCase().includes('2a58') || vtr.toString().toLowerCase().includes('2b31') || vtr.toString().toLowerCase().includes('2a47') || vtr.toString().toLowerCase().includes('2a76') || vtr.toString().toLowerCase().includes('2b44')) {
                                            for (let i = 0; i < 6; i++) {
                                                if (guardas[i]) {
                                                    tbody += '<td><input value="' + guardas[i] + '" /></td>';
                                                } else {
                                                    tbody += '<td><input value=" " /></td>';
                                                }
                                            }
                                        } else if (guardas.length == 1) {
                                            tbody += '<td><input value="' + guardas[0] + '" /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value=" " /></td>';
                                        } else if (guardas.length == 2) {
                                            tbody += '<td><input value="' + guardas[0] + '" /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value="' + guardas[1] + '" /></td><td><input value=" " /></td><td><input value=" " /></td>';
                                        } else if (guardas.length == 3) {
                                            tbody += '<td><input value="' + guardas[0] + '" /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value="' + guardas[1] + '" /></td><td><input value="' + guardas[2] + '" /></td><td><input value=" " /></td>';
                                        } else if (guardas.length == 4) {
                                            tbody += '<td><input value="' + guardas[0] + '" /></td><td><input value=" " /></td><td><input value=" " /></td><td><input value="' + guardas[1] + '" /></td><td><input value="' + guardas[2] + '" /></td><td><input value="' + guardas[3] + '" /></td>';
                                        }
                                    }
                                    for (let i = 0; i < 4; i++) {
                                        if (vtr[i]) {
                                            tbody += '<td><input value="' + vtr[i] + '" /></td>';
                                        } else {
                                            tbody += '<td><input value=" " /></td>';
                                        }
                                    }
                                    for (let i = 0; i < 4; i++) {
                                        if (cam[i]) {
                                            tbody += '<td><input value="' + cam[i] + '" /></td>';
                                        } else {
                                            tbody += '<td><input value=" " /></td>';
                                        }
                                    }
                                    tbody += '<td><button>Inserir</button></td></tr>';
                                });
                                var tb = document.getElementById('div_separador_equipes');
                                tb.innerHTML = '<table><thead><th>Equipe</th><th>Turno</th><th>GSP</th><th>GMO 1</th><th>GMO 2</th><th>GMO 3</th><th>PTR 1</th><th>PTR 2</th><th>PTR 3</th><th>VTR 1</th><th>VTR 2</th><th>VTR 2</th><th>VTR 3</th><th>Cam 1</th><th>Cam 2</th><th>Cam 3</th><th>Cam 4</th><th><button>Inserir Tudo</button></th></thead><tbody>' + tbody + '</tbody></table>';
                                tb.querySelectorAll('input').forEach(function (item) {
                                    item.setAttribute('placeholder', '        ');
                                    item.setAttribute('style', 'field-sizing:content');
                                });
                                document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button').forEach(function (item) {
                                    item.addEventListener('click', async function () {

                                        const dados = Array.from(item.closest('tr').querySelectorAll('input,select')).map(campo => campo.value);
                                        const nomeEquipe = `${dados[0]} - ${dados[1]}`;
                                        const uuidUnidades = localStorage.getItem('unidadeServico-uuid').split(';');
                                        const uuidFuncoes = localStorage.getItem('funcoes-uuid').split(';');
                                        const uuidGms = localStorage.getItem('gms-uuid').split(';');
                                        const uuidEquipamentos = localStorage.getItem('equipamentos-uuid').split(';');
                                        const uuidEquipes = localStorage.getItem('equipes-uuid').split(';');
                                        const dadosDaEquipe = {};
                                        dadosDaEquipe["nomeEquipe"] = `${dados[0]} - ${dados[1]}`;
                                        dadosDaEquipe["uuidUnidadeServico"] = uuidUnidades.find(unidade => unidade.split(',')[0] == dados[0]).split(',')[1];
                                        dadosDaEquipe["uuidEquipe"] = uuidEquipes.find(equipe => equipe.split(',')[0] == nomeEquipe).split(',')[1];
                                        const pessoas = [];
                                        for (let index = 2; index < 9; index++) {
                                            if (dados[index].trim() != '') {
                                                const pessoaUuid = uuidGms.find(pessoa => pessoa.split(',')[0] == dados[index].trim()).split(',')[1];
                                                let funcaoUuid;
                                                if (index == 2) {
                                                    funcaoUuid = uuidFuncoes.find(pessoa => pessoa.split(',')[0] == 'Supervisor').split(',')[1];
                                                }
                                                if (index >= 3 && index <= 5) {
                                                    funcaoUuid = uuidFuncoes.find(pessoa => pessoa.split(',')[0] == 'Motorista').split(',')[1];
                                                }
                                                if (index > 5) {
                                                    funcaoUuid = uuidFuncoes.find(pessoa => pessoa.split(',')[0] == 'Patrulheiro').split(',')[1];
                                                }
                                                pessoas.push({
                                                    uuid: pessoaUuid,
                                                    pessoa: pessoaUuid,
                                                    funcao: funcaoUuid
                                                })
                                            }

                                        }
                                        dadosDaEquipe["pessoas"] = pessoas;
                                        const equipeEditada = await editarEquipe(dadosDaEquipe);
                                        if (!equipeEditada) return;

                                        const dadosDosEquipamentos = {
                                            uuidUnidadeServico: dadosDaEquipe["uuidUnidadeServico"]
                                        }
                                        const equipamentos = [];
                                        for (let index = 9; index < 13; index++) {
                                            if (dados[index].trim() != '') {
                                                const equipamentoUuid = uuidEquipamentos.find(equipamento => equipamento.split(',')[0] == dados[index].trim()).split(',')[1];
                                                equipamentos.push(equipamentoUuid);
                                            }

                                        }
                                        for (let index = 13; index < dados.length; index++) {
                                            if (dados[index].trim() != '') {
                                                const equipamentoUuid = uuidEquipamentos.find(equipamento => equipamento.split(',')[0] == '00' + dados[index].trim()).split(',')[1];
                                                equipamentos.push(equipamentoUuid);
                                            }

                                        }
                                        dadosDosEquipamentos.equipamentos = equipamentos;
                                        let equipamentosEditados;
                                        if (equipamentos.length > 0) {
                                            equipamentosEditados = await editarEquipamentos(dadosDosEquipamentos);
                                        }
                                        if (!equipamentosEditados) return;
                                        const equipeIniciada = await iniciarServico(dadosDaEquipe["uuidUnidadeServico"], dadosDaEquipe["uuidEquipe"]);

                                        if (!equipeIniciada) return;

                                        const pesquisarButton = document.querySelector('app-botao-acao-pesquisar button');
                                        if (!pesquisarButton) {
                                            document.querySelector("app-filtros-selecionados em").click();
                                            const pesquisarButtonExisteInterval = setInterval(() => {
                                                const pesquisarButton = document.querySelector('app-botao-acao-pesquisar button');
                                                if (pesquisarButton) {
                                                    clearInterval(pesquisarButtonExisteInterval);
                                                    pesquisarButton.click();
                                                }
                                            }, 100);
                                        } else {
                                            pesquisarButton.click();
                                        }

                                        /*
     dadosDosEquipamentos = {
        uuidUnidadeServico:onwefonwefon-wepfkbwefkjwbef-wekfjbnwekfjwebnf,
        equipamentos: ["e6aa2f44-a2bd-4157-b105-99caf979f5ae", uuid: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65"]
     }
     */


                                        /*
                                         dadosDaEquipe = {
                                            uuidUnidadeServico:onwefonwefon-wepfkbwefkjwbef-wekfjbnwekfjwebnf,
                                            uuidEquipe:wergnerkgnerçknlerg-ekgrjberklgbekrgb-ergjnergjkerg,
                                            nomeEquipe: 'A1 - Dia',
                                            pessoas: [
                                                {
                                                    uuid: "e6aa2f44-a2bd-4157-b105-99caf979f5ae",
                                                    pessoa: "e6aa2f44-a2bd-4157-b105-99caf979f5ae",
                                                    funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
                                                },
                                                {
                                                    uuid: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65",
                                                    pessoa: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65",
                                                    funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
                                                },
                                                {
                                                    uuid: "385b6ad0-3ab8-4059-81d7-f887197a1c75",
                                                    pessoa: "385b6ad0-3ab8-4059-81d7-f887197a1c75",
                                                    funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
                                                }
                                            ]
                                         }
                                         */

                                        /* localStorage.setItem('processo_edicao', 'excluir_pessoas');
                                         var unidade_servico = '';
                                         var editar_equipe_modal = '';
                                         document.querySelectorAll('app-equipe-mini-card').forEach(function (it) {
                                             if (it.querySelector('span').innerHTML == item.parentNode.parentNode.querySelectorAll('input')[0].value + ' - ' + item.parentNode.parentNode.querySelector('select').value) {
                                                 unidade_servico = it.parentNode.parentNode.parentNode.parentNode;
                                                 editar_equipe_modal = it;
                                             }
                                         });
                                         var selects = item.parentNode.parentNode.querySelectorAll('input, select');
                                         localStorage.setItem('editar_equipe', selects[0].value + '-' + Array.from(document.querySelectorAll('app-unidade-servico-card')).indexOf(unidade_servico) + '-' + selects[1].value + '-' + selects[2].value + '-' + selects[3].value + '-' + selects[4].value + '-' + selects[5].value + '-' + selects[6].value + '-' + selects[7].value + '-' + selects[8].value + '-' + selects[9].value + '-' + selects[10].value + '-' + selects[11].value + '-' + selects[12].value + '-' + selects[13].value + '-' + selects[14].value + '-' + selects[15].value)
 
                                         if (unidade_servico.querySelector('button[title="Iniciar Serviço"]')) {
                                             editar_equipe_modal.querySelectorAll('button')[1].click();
                                         } else if (unidade_servico.querySelector('button[title="Encerrar Serviço"]')) {
                                             unidade_servico.querySelector('button[title="Encerrar Serviço"]').click();
                                         } else {
                                             if (localStorage.getItem('inserir_multiplas_equipes') && parseInt(localStorage.getItem('inserir_multiplas_equipes')) > -1) {
                                                 localStorage.setItem('inserir_multiplas_equipes', parseInt(localStorage.getItem('inserir_multiplas_equipes')) - 1);
                                                 document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button')[parseInt(localStorage.getItem('inserir_multiplas_equipes'))].click();
                                             } else {
                                                 localStorage.removeItem('inserir_multiplas_equipes');
                                                 localStorage.removeItem('editar_equipe');
                                             }
                                         }
 */
                                    });

                                });
                                document.querySelector('#div_separador_equipes').querySelector('thead').querySelector('button').addEventListener('click', function () {
                                    localStorage.setItem('inserir_multiplas_equipes', document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button').length - 2);
                                    document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button')[parseInt(document.querySelector('#div_separador_equipes').querySelector('tbody').querySelectorAll('button').length) - 1].click();
                                });

                                if (document.getElementById('txt_separador_equipes').value.includes('R1')) {
                                    let linhas = document.getElementById('txt_separador_equipes').value.replaceAll('GU', ' ').replaceAll('CAM', ' ').replaceAll('CAMERAS', ' ').replaceAll('CÂMERAS', ' ').split('\n');
                                    for (let i = 1; i < linhas.length; i++) {
                                        let dados = linhas[i].split(/[ .,;:()]\s*/);
                                        let gm = '';
                                        let cam = '';
                                        if (!eqps.filter(i => dados.includes(i))[0] && dados.filter(i => gms.toString().includes(i) && i != '')[0] && dados.filter(i => cameras.toString().includes(i) && i != '')[0]) {
                                            gm = dados.filter(i => gms.toString().includes(i) && i != '')[0];
                                            cam = dados.filter(i => cameras.toString().includes(i) && i != '')[0];
                                            document.getElementById('txt_separador_equipes').value = document.getElementById('txt_separador_equipes').value.replace(linhas[i], '');
                                            document.getElementById('txt_separador_equipes').value = document.getElementById('txt_separador_equipes').value.replace(gm, gm + ' ' + cam);
                                        }
                                    }
                                    document.getElementById('txt_separador_equipes').dispatchEvent(new Event('input', { bubbles: true }));
                                }
                                if (document.getElementById('txt_separador_equipes').value.toUpperCase().includes('GMO')) {
                                    let d = document.getElementById('txt_separador_equipes').value.toUpperCase().split('\n');
                                    let gu = '';
                                    let gmo = '';
                                    let resto = '';
                                    d.forEach(function (item) {
                                        if (item.includes('GMO')) {
                                            if (item.includes(',')) {
                                                let a = '';
                                                let b = '';
                                                item.split(',').forEach(function (i) {
                                                    if (i.includes('GMO')) {
                                                        a = i;
                                                    } else {
                                                        b += i;
                                                    }
                                                });
                                                gmo = a + b;
                                            }

                                        }
                                        if (item.includes('GMO')) {
                                            if (item.includes(',')) {
                                                let a = '';
                                                let b = '';
                                                item.split(',').forEach(function (i) {
                                                    if (i.includes('GMO')) {
                                                        a = i;
                                                    } else {
                                                        b += i;
                                                    }
                                                });
                                                gmo = a + b;
                                            }

                                        }
                                    });

                                }
                            });
                        }





                        //document.getElementById('checkbox').click();
                    }
                }
            }, "1000");

        }, 100);
    });
});

async function atualizarUuid() {
    const pessoasRequisicao = await fetch( //atualiza Uuidpessoas
        "https://cadweb.sinesp.gov.br/cad-equipe-servico/pessoa/listarPaginado?numPagina=1&registrosPorPagina=1000&propriedadeOrdenacao=nome&direcaoOrdenacao=ASC&situacao=A",
        {
            credentials: "include"
        }
    );

    if (!pessoasRequisicao.ok) {
        throw new Error(`Erro HTTP: ${pessoasRequisicao.status}`);
        return;
    }
    const pessoasResultado = await pessoasRequisicao.json();
    localStorage.setItem('gms-uuid', pessoasResultado.resultados.map(pessoa => pessoa.nomeFuncional.replace(/\D/g, "") + ',' + pessoa.uuid).join(';'))

    const funcoesRequisicao = await fetch( //atualiza Uuidfuncoes
        "https://cadweb.sinesp.gov.br/cad-equipe-servico/funcao/listar?agencias=ff6a74e0-22ee-4abb-b057-4552307d013e&situacao=A&numPagina=1&registrosPorPagina=999",
        {
            credentials: "include"
        }
    );

    if (!funcoesRequisicao.ok) {
        throw new Error(`Erro HTTP: ${funcoesRequisicao.status}`);
        return;
    }
    const funcoesResposta = await funcoesRequisicao.json();
    localStorage.setItem('funcoes-uuid', funcoesResposta.resultados.map(funcao => funcao.nome + ',' + funcao.uuid).join(';'))

    const unidadeServicoRequisicao = await fetch(
        "https://cadweb.sinesp.gov.br/cad-equipe-servico/unidade-servico/listar?numPagina=1&registrosPorPagina=50&propriedadeOrdenacao=nome&direcaoOrdenacao=ASC&propriedadeOrdenacaoGrupo=naoAgrupar&direcaoOrdenacaoGrupo=ASC&situacao=AT&situacao=IN&situacao=ES&situacao=EP&situacao=PO",
        {
            credentials: "include"
        }
    );

    if (!unidadeServicoRequisicao.ok) {
        throw new Error(`Erro HTTP: ${unidadeServicoRequisicao.status}`);
        return;
    }
    const unidadeServicoResposta = await unidadeServicoRequisicao.json();
    localStorage.setItem('unidadeServico-uuid', unidadeServicoResposta.resultados.map(unidade => unidade.nome.split(' - ')[1] + ',' + unidade.uuid).join(';'));
    localStorage.setItem('equipes-uuid', unidadeServicoResposta.resultados.map(unidade => unidade.equipes.map(equipe => `${equipe.nome},${equipe.uuid}`).join(';')).join(';'));

    const equipamentosRequisicao = await fetch( //atualiza Uuidequipamentos
        "https://cadweb.sinesp.gov.br/cad-equipe-servico/equipamento/listar?numPagina=1&registrosPorPagina=500&propriedadeOrdenacao=prefixo&direcaoOrdenacao=ASC&situacao=A",
        {
            credentials: "include"
        }
    );

    if (!equipamentosRequisicao.ok) {
        throw new Error(`Erro HTTP: ${equipamentosRequisicao.status}`);
        return;
    }
    const equipamentosResposta = await equipamentosRequisicao.json();
    localStorage.setItem('equipamentos-uuid', equipamentosResposta.resultados.map(equipamento => equipamento.prefixo + ',' + equipamento.uuid).join(';'))


    window.location.reload();
}

async function editarEquipe(dadosDaEquipe) {
    /*
     dadosDaEquipe = {
        uuidUnidadeServico:onwefonwefon-wepfkbwefkjwbef-wekfjbnwekfjwebnf,
        nomeEquipe: 'A1 - Dia',
        pessoas: [
            {
                uuid: "e6aa2f44-a2bd-4157-b105-99caf979f5ae",
                pessoa: "e6aa2f44-a2bd-4157-b105-99caf979f5ae",
                funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
            },
            {
                uuid: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65",
                pessoa: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65",
                funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
            },
            {
                uuid: "385b6ad0-3ab8-4059-81d7-f887197a1c75",
                pessoa: "385b6ad0-3ab8-4059-81d7-f887197a1c75",
                funcao: "820f1b74-4345-43ce-aa76-86df3d3317dd"
            }
        ]
     }
     */
    const body = {
        uuid: dadosDaEquipe.uuidEquipe,
        nome: dadosDaEquipe.nomeEquipe,
        telefone: "",
        pessoas: dadosDaEquipe.pessoas,

    };

    const response = await fetch(
        `https://cadweb.sinesp.gov.br/cad-equipe-servico/unidade-servico/${dadosDaEquipe.uuidUnidadeServico}/equipe/alterar`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {

        const texto = await response.text();

        console.error(texto);

        throw new Error(
            `Erro HTTP: ${response.status}`
        );
        return false;
    }

    return true;
}

async function editarEquipamentos(dadosDosEquipamentos) {
    /*
     dadosDosEquipamentos = {
        uuidUnidadeServico:onwefonwefon-wepfkbwefkjwbef-wekfjbnwekfjwebnf,
        equipamentos: ["e6aa2f44-a2bd-4157-b105-99caf979f5ae", uuid: "d580c7dd-7546-49c8-bab0-bb8d2c01bb65"]
     }
     */
    const body = dadosDosEquipamentos.equipamentos;

    const response = await fetch(
        `https://cadweb.sinesp.gov.br/cad-equipe-servico/unidade-servico/${dadosDosEquipamentos.uuidUnidadeServico}/equipamentos/alterar`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {

        const texto = await response.text();

        console.error(texto);

        throw new Error(
            `Erro HTTP: ${response.status}`
        );
        return false;

    }

    return true;
}

async function iniciarServico(unidadeSv, equipeSv) {
    const iniciarSvRequisicao = await fetch( //atualiza Uuidequipamentos
        `https://cadweb.sinesp.gov.br/cad-equipe-servico/unidade-servico/${unidadeSv}/iniciar-servico/${equipeSv}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }
    );

    if (!iniciarSvRequisicao.ok) {
        throw new Error(`Erro HTTP: ${iniciarSvRequisicao.status}`);
        return false;
    }

    return true;
}
