chrome.storage.local.get("ativa", (data) => {
    if (data.ativa === false) return;
    chrome.storage.local.get("CAD Equipes", (d) => {
        if (d['CAD Equipes'] == 'desativado') return;

        var versao = '<span style="margin-right:30px;color: #d3d4d9">XCAD <strong>vv1.4.5</strong>, por GM 842 Calebe. Deus é socorro bem presente!</span>';
        var unidade_servico = '';
        var concluir_encarramento_uniade_sv = '';
        localStorage.removeItem('editar_equipe');
        setInterval(function () {
            if (document.querySelectorAll('app-modal-editar-equipamentos').length > 1) {
                document.querySelectorAll('app-modal-editar-equipamentos')[1].querySelector('button[fecharmodal]').click();
            }

            if (document.querySelectorAll('app-modal-editar-equipe').length > 1) {
                document.querySelectorAll('app-modal-editar-equipe')[1].querySelector('button[fecharmodal]').click();
            }


            if (document.querySelector('cad-breadcrumb div') && !document.querySelector('cad-breadcrumb div').innerHTML.includes(versao)) {
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
                    if (botao.style.display == 'none') {
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
                var componentes = document.querySelector('app-modal-detalhar-equipe').querySelectorAll('div[class="modal-material-subtitulo"]');
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
                    if (pessoa.parentNode.innerHTML.includes('Patrulheiro')) {
                        ptr.push(pessoa.innerHTML.trim().split(' ')[1]);
                    } else if (pessoa.parentNode.innerHTML.includes('Motorista')) {
                        gmo.push(pessoa.innerHTML.trim().split(' ')[1]);
                    } else if (pessoa.parentNode.innerHTML.includes('Operador')) {
                        operador.push(pessoa.innerHTML.trim().split(' ')[1]);
                    } else {
                        selects[4].querySelectorAll('option').forEach(function (op) {
                            if (op.value == pessoa.innerHTML.trim().split(' ')[1]) {
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
            if (localStorage.getItem('processo_edicao') == 'excluir_pessoas' && document.querySelector('div[matsnackbarlabel]') && document.querySelector('div[matsnackbarlabel]').innerText.includes('encerrado com sucesso') && document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])] && concluir_encarramento_uniade_sv != 'sim') {
                for (let i = 0; i < document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card').length; i++) {
                    if (document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card')[i].querySelector('span').innerHTML.includes(document.querySelectorAll('select')[3].value)) {
                        document.querySelectorAll('app-unidade-servico-card')[parseInt(localStorage.getItem('editar_equipe').split('-')[1])].querySelectorAll('app-equipe-mini-card')[i].querySelectorAll('button')[1].click();
                        concluir_encarramento_uniade_sv = 'sim';
                    }
                };
            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && !document.querySelector('cad-table')) {
                if (document.querySelector('app-modal-editar-equipe').querySelector('div[class="acoes-card ng-star-inserted"]').innerHTML.includes('Vincular Pessoas')) {
                    document.querySelector('app-modal-editar-equipe').querySelector('div[class="acoes-card ng-star-inserted"]').click();
                    if (document.querySelector('app-modal-editar-equipe').querySelector('div[class="row-actions"]')) {
                        document.querySelector('app-modal-editar-equipe').querySelector('div[class="row-actions"]').querySelector('button').click();
                        concluir_encarramento_uniade_sv = 'nao';
                    }
                }

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value == '') {
                if (document.querySelector('app-modal-editar-equipe').querySelector('ul')) {
                    if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[3] + ' ') && localStorage.getItem('editar_equipe').split('-')[3] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[3];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[4] + ' ') && localStorage.getItem('editar_equipe').split('-')[4] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[4];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[5] + ' ') && localStorage.getItem('editar_equipe').split('-')[5] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[5];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[6] + ' ') && localStorage.getItem('editar_equipe').split('-')[6] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[6];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[7] + ' ') && localStorage.getItem('editar_equipe').split('-')[7] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[7];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[8] + ' ') && localStorage.getItem('editar_equipe').split('-')[8] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[8];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (!document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[9] + ' ') && localStorage.getItem('editar_equipe').split('-')[9] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[9];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[10] + ' ') && localStorage.getItem('editar_equipe').split('-')[10] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[10];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[11] + ' ') && localStorage.getItem('editar_equipe').split('-')[11] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[11];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[12] + ' ') && localStorage.getItem('editar_equipe').split('-')[12] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[12];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[14] + ' ') && localStorage.getItem('editar_equipe').split('-')[13] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[13];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[15] + ' ') && localStorage.getItem('editar_equipe').split('-')[14] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[14];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[15] + ' ') && localStorage.getItem('editar_equipe').split('-')[15] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[15];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM' && !document.querySelector('app-modal-editar-equipe').querySelector('ul').innerHTML.includes(' ' + localStorage.getItem('editar_equipe').split('-')[16] + ' ') && localStorage.getItem('editar_equipe').split('-')[16] != ' ') {
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[16];
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        localStorage.setItem('processo_edicao', 'inserir_funcoes');
                        localStorage.setItem('clicando_na_funcao', 'nao');
                        localStorage.setItem('qual_gm', '0');
                    }
                } else if (localStorage.getItem('editar_equipe').split('-')[3] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[3];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[4] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[4];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[5] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[5];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[6] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[6];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[7] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[7];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[8] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[8];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                } else if (localStorage.getItem('editar_equipe').split('-')[9] != ' ') {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = localStorage.getItem('editar_equipe').split('-')[9];
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').dispatchEvent(new Event('input', { bubbles: true }));
                }

            }
            if (localStorage.getItem('editar_equipe') && localStorage.getItem('processo_edicao') == 'inserir_pessoas' && document.querySelector('app-modal-editar-equipe') && document.querySelector('cad-table') && document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value != '' && document.querySelector('cad-table').querySelectorAll('tr').length < 5) {
                if (!document.querySelector('app-modal-editar-equipe').querySelector('div[class*="fx-group"]').innerHTML.includes(' ' + document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value + ' ')) {
                    if (document.querySelector('app-modal-editar-equipe').querySelector('button[title="Vincular"]')) {
                        document.querySelector('app-modal-editar-equipe').querySelector('button[title="Vincular"]').click();
                        document.querySelector('app-modal-editar-equipe').querySelector('div[class*="fx-group"]').innerHTML += ' ' + document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value + ' ';
                        document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = '';
                    }
                } else {
                    document.querySelector('app-modal-editar-equipe').querySelector('input[name="column-filter-nome"]').value = '';
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
                if (equipe.indexOf(item.innerHTML.split('gm ')[1].split('-')[0].trim()) == 3) {
                    item.querySelector('input').click();
                    localStorage.setItem('clicando_na_funcao', 'Supervisor');
                } else if (document.querySelector("#sel_area_edit_equip").value == 'COGM') {
                    for (let i = 4; i < equipe.length; i++) {
                        item.querySelector('input').click();
                        localStorage.setItem('clicando_na_funcao', 'Operador');
                    }
                } else if (equipe.indexOf(item.innerHTML.split('gm ')[1].split('-')[0].trim()) == 4 || equipe.indexOf(item.innerHTML.split('gm ')[1].split('-')[0].trim()) == 5 || equipe.indexOf(item.innerHTML.split('gm ')[1].split('-')[0].trim()) == 6) {
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

            if (document.querySelector('input[name=column-filter-nome]')) {
                if (document.querySelector("div[id='naorepete_editar_equipe']")) {
                } else {
                    var b = document.createElement("div");
                    b.setAttribute("id", "naorepete_editar_equipe");
                    document.querySelector('app-modal-editar-equipe').append(b);

                    document.querySelector('input[name=column-filter-nome]').addEventListener('keydown', function (event) {
                        if (event.key === 'Enter' && document.querySelector('input[name=column-filter-nome]').value.length == 3) {
                            document.querySelectorAll('button[title=Vincular]')[0].click();
                            var n_gm = document.querySelector('input[name=column-filter-nome]').value;
                            setTimeout(() => {
                                var pessoas_equipe = document.querySelectorAll('.titulo');
                                pessoas_equipe.forEach(function (pessoa) {
                                    if (pessoa.innerHTML.includes(n_gm)) {
                                        pessoa.parentNode.parentNode.querySelector('mat-select').click();
                                        document.querySelectorAll('mat-option')[8].click();
                                        document.querySelector('input[name=column-filter-nome]').focus();
                                        document.querySelector('input[name=column-filter-nome]').value = '';
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
                        document.querySelector('app-consultar-unidade-servico').insertBefore(botao_gerar_encerrar_todos_os_servicos, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.querySelector('app-consultar-unidade-servico').insertBefore(checkbox, document.querySelector('app-consultar-unidade-servico').querySelector('form'));
                        document.getElementById('checkbox').innerHTML = '<select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option>Todas</option><option value=1000>ROMU</option><option value=1100>PATAM</option><option value=1200>Centro</option><option value="200 Área Cruzeiro">21 - Cruzeiro</option><option value=300>31 - Partenon</option><option value=400>41 - Leste</option><option value=500>51 - Restinga</option><option value=600>61 - Norte</option><option value=700>71 - Eixo Baltazar</option><option value=800>81 - Pinheiro</option><option value=900>91 - Sul</option><option value="Cogm">COGM</option><option value="Cmd">Comando</option><option value="- A">Apoio</option></select>';
                        document.querySelector('#checkbox').innerHTML += '<table><tbody><tr style="text-align:center"><td>Área</td><td>Equipe</td><td>Turno</td><td>GSP</td><td>GMO 1</td><td>GMO 2</td><td>GMO 3</td><td>PTR 1</td><td>PTR 2</td><td>PTR 3</td><td>VTR 1</td><td>VTR 2</td><td>VTR 3</td><td>Cam 1</td><td>Cam 2</td><td>Cam 3</td><td>Cam 4</td><td></td></tr><tr><td><select id=sel_area_edit_equip style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option value=1000>1000 - ROMU</option><option value=1100>1100 - Patam</option><option value=1200>1200 - Centro</option><option value="200">21 - Cruzeiro</option><option value="300">31 - Partenon</option><option value="400">41 - Leste</option><option value="500">51 - Restinga</option><option value="600">61 - Norte</option><option value="700">71 - Eixo Baltazar</option><option value="800">81 - Pinheiro</option><option value="900">91 - Sul</option><option value="COGM">COGM</option><option value="A">Apoio</option></select></td><td><select id=sel_equipe_edit_equip style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"><option value="Dia">Dia</option><option value="Noite">Noite</option></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><select style="padding:5px;border:0px;margin:5px;box-shadow:0px 1px 5px -1px rgba(0,0,0,0.75);font-weight: bold;border-radius:5px;cursor:pointer;font-size:15px"></select></td><td><button id=editar_equipe_but class=cancel-btn>Inserir</button></td></tr></tbody></table>';
                        document.getElementById('botao_gerar_encerrar_todos_os_servicos').innerHTML = 'Encerrar Todos os Serviços';
                        document.getElementById('botao_gerar_encerrar_todos_os_servicos').addEventListener('click', function () {
                            document.querySelectorAll('button[title="Encerrar Serviço"]').forEach(function (item) {
                                item.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('svg').parentNode.click();
                            });
                            document.querySelector("body > app-root > div > div > div.page > app-consultar-unidade-servico > form > div.fx-container-fluid.fx-mt-2 > div > cad-button-bar > div > div.box-regular > div > div > button.cancel-btn.ng-star-inserted").click();
                        });
                        var eqps = ['A1','C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'R1', 'R2', 'R3', 'R4', 'R5', 'P1', 'P2', '21', '22', '31', '32', '41', '42', '51', '52', '61', '62', '71', '72', '81', '82', '91', '92', 'COGM'];
                        var vtrs_placa = new Map();
                        vtrs_placa.set('1470', '0118'); vtrs_placa.set('4G47', '0122'); vtrs_placa.set('4B58', '0124'); vtrs_placa.set('1468', '0218'); vtrs_placa.set('4E96', '0222'); vtrs_placa.set('3D36', '0224'); vtrs_placa.set('0283', '0283'); vtrs_placa.set('0301', '0301'); vtrs_placa.set('0305', '0305'); vtrs_placa.set('1469', '0318'); vtrs_placa.set('4E69', '0322'); vtrs_placa.set('3D37', '0324'); vtrs_placa.set('1471', '0418'); vtrs_placa.set('4E64', '0422'); vtrs_placa.set('3D50', '0424'); vtrs_placa.set('1473', '0518'); vtrs_placa.set('4G77', '0522'); vtrs_placa.set('2F38', '0524'); vtrs_placa.set('1467', '0618'); vtrs_placa.set('4E77', '0622'); vtrs_placa.set('4E57', '0722'); vtrs_placa.set('8J14', '0819'); vtrs_placa.set('4G14', '0822'); vtrs_placa.set('0906', '0906'); vtrs_placa.set('8J11', '0919'); vtrs_placa.set('4E85', '0922'); vtrs_placa.set('0F11', '0f11'); vtrs_placa.set('8J26', '1019'); vtrs_placa.set('4F34', '1022'); vtrs_placa.set('9A14', '1119'); vtrs_placa.set('4E88', '1122'); vtrs_placa.set('4G49', '1222'); vtrs_placa.set('1B67', '1267'); vtrs_placa.set('8J15', '1319'); vtrs_placa.set('4G36', '1322'); vtrs_placa.set('2J01', '1419'); vtrs_placa.set('4F48', '1422'); vtrs_placa.set('2J13', '1519'); vtrs_placa.set('4F75', '1522'); vtrs_placa.set('2J14', '1619'); vtrs_placa.set('4F19', '1622'); vtrs_placa.set('1667', '1667'); vtrs_placa.set('2J15', '1719'); vtrs_placa.set('4E76', '1722'); vtrs_placa.set('2J10', '1819'); vtrs_placa.set('4G61', '1822'); vtrs_placa.set('2J11', '1919'); vtrs_placa.set('4E61', '1922'); vtrs_placa.set('1G13', '1g13'); vtrs_placa.set('1I54', '1i54'); vtrs_placa.set('1I84', '1i84'); vtrs_placa.set('1J04', '1j04'); vtrs_placa.set('2J07', '2019'); vtrs_placa.set('4F60', '2022'); vtrs_placa.set('2048', '2048'); vtrs_placa.set('2J03', '2119'); vtrs_placa.set('2J05', '2219'); vtrs_placa.set('2240', '2240'); vtrs_placa.set('2241', '2241'); vtrs_placa.set('2253', '2253'); vtrs_placa.set('2254', '2254'); vtrs_placa.set('2J08', '2319'); vtrs_placa.set('2J12', '2419'); vtrs_placa.set('2420', '2420'); vtrs_placa.set('2J09', '2519'); vtrs_placa.set('2J02', '2619'); vtrs_placa.set('2747', '2747'); vtrs_placa.set('0287', '287'); vtrs_placa.set('0294', '294'); vtrs_placa.set('2975', '2975'); vtrs_placa.set('2A47', '2a47'); vtrs_placa.set('2A58', '2a58'); vtrs_placa.set('2A67', '2a67'); vtrs_placa.set('2A76', '2a76'); vtrs_placa.set('2B31', '2b31'); vtrs_placa.set('2B44', '2b44'); vtrs_placa.set('2B49', '2b49'); vtrs_placa.set('2B67', '2b67'); vtrs_placa.set('2B72', '2b72'); vtrs_placa.set('2B76', '2b76'); vtrs_placa.set('2B85', '2b85'); vtrs_placa.set('2B93', '2b93'); vtrs_placa.set('2B94', '2b94'); vtrs_placa.set('3376', '3376'); vtrs_placa.set('3377', '3377'); vtrs_placa.set('3378', '3378'); vtrs_placa.set('3379', '3379'); vtrs_placa.set('3380', '3380'); vtrs_placa.set('3742', '3742'); vtrs_placa.set('3753', '3753'); vtrs_placa.set('3761', '3761'); vtrs_placa.set('3766', '3766'); vtrs_placa.set('3770', '3770'); vtrs_placa.set('3932', '3932'); vtrs_placa.set('3942', '3942'); vtrs_placa.set('3948', '3948'); vtrs_placa.set('3953', '3953'); vtrs_placa.set('3955', '3955'); vtrs_placa.set('4267', '4267'); vtrs_placa.set('4339', '4339'); vtrs_placa.set('5255', '5255'); vtrs_placa.set('5G09', '5g09'); vtrs_placa.set('6017', '6017'); vtrs_placa.set('6046', '6046'); vtrs_placa.set('6077', '6077'); vtrs_placa.set('6085', '6085'); vtrs_placa.set('6094', '6094'); vtrs_placa.set('6103', '6103'); vtrs_placa.set('6108', '6108'); vtrs_placa.set('6121', '6121'); vtrs_placa.set('6126', '6126'); vtrs_placa.set('6915', '6915'); vtrs_placa.set('6950', '6950'); vtrs_placa.set('6959', '6959'); vtrs_placa.set('6965', '6965'); vtrs_placa.set('6972', '6972'); vtrs_placa.set('1466', '0718'); vtrs_placa.set('7259', '7259'); vtrs_placa.set('7280', '7280'); vtrs_placa.set('7285', '7285'); vtrs_placa.set('7337', '7337'); vtrs_placa.set('0734', '734'); vtrs_placa.set('7429', '7429'); vtrs_placa.set('7554', '7554'); vtrs_placa.set('7D34', '7d34'); vtrs_placa.set('7H22', '7h22'); vtrs_placa.set('7H23', '7h23'); vtrs_placa.set('7H25', '7h25'); vtrs_placa.set('7H29', '7h29'); vtrs_placa.set('7H32', '7h32'); vtrs_placa.set('7H38', '7h38'); vtrs_placa.set('8163', '8163'); vtrs_placa.set('8299', '8299'); vtrs_placa.set('8401', '8401'); vtrs_placa.set('8408', '8408'); vtrs_placa.set('8970', '8970'); vtrs_placa.set('9028', '9028'); vtrs_placa.set('9051', '9051'); vtrs_placa.set('9077', '9077'); vtrs_placa.set('9132', '9132'); vtrs_placa.set('9133', '9133'); vtrs_placa.set('9134', '9134'); vtrs_placa.set('9135', '9135'); vtrs_placa.set('9473', '9473'); vtrs_placa.set('9882', '9882'); vtrs_placa.set('9894', '9894'); vtrs_placa.set('9908', '9908'); vtrs_placa.set('9J14', 'Izf9j14'); vtrs_placa.set('9E63', 'Micro'); vtrs_placa.set('ICRO', 'Micro 03');
                        var vtrs = ['1000', ['0819', '0524', '0911', '0919', 1019, 1119, 1919, '2b31', '2a47', '1319'], '1100', ['0224', '0324'], '1200', ['0122', '1022', '1122', '1222', '1419', '1422', '2b49', '2b76', '2b67', '1919', '1622', '1522', '1322', '1i54', '2a76', '2b44', '2b85', '2b93', '2a57', '2a67', '2a58', '2319'], '200', ['0222', 2519], '300', [2119, '0322'], '400', ['0422', 2219], '500', ['0522', 1619], '600', ['0418', '0718', '2019', '2J07', '0622'], '700', ['0722', 2019], '800', [1719, '0822'], '900', ['1922', '0922', '1519', '4E85']];
                        var cameras = ['Dia', ['1000', [1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1341, 1342, 1343, 1346, 1344, 1345, 1347, 1348, 1349, 1350], '1100', [1417, 1222, 1227, 1226, 1221], '1200', [1241, 1242, 1243, 1244, 1245, 1246, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1365], '200', [1389, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404], '300', [1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240], '400', [1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1458, 1460], '500', [1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396], '600', [1454, 1455, 1456, 1457, 1459, 1460, 1469], '700', [1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452], '800', [1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388], '900', [1405, 1406, 1407, 1409, 1408, 1409, 1410, 1411, 1412]]];
                        var gms = ['Dia', ['1000', ['100', '120', '124', '124', '137', '140', '188', '222', '229', '279', '299', '325', '361', '445', '449', '465', '473', '475', '494', '502', '525', '543', '549', '574', '577', '585', '586', '608', '609', '619', '630', '642', '648', '653', '666', '667', '676', '705', '713', '714', '722', '735', '740', '753', '765', '766', '775', '777', '783','795', '797', '799', '835', '836', '845', '874'], '1100', ['236', '841', '855', '856', '873'], '1200', ['086', '099', '101', '104', '105', '134', '138', '153', '162', '167', '204', '211', '212', '224', '227', '246', '247', '295', '331', '343', '354', '408', '427', '429', '435', '445', '449', '478', '483', '485', '487', '519', '522', '523', '528', '535', '538', '571', '572', '575', '576', '578', '600', '649', '651', '669', '672', '716', '728', '781', '788', '801', '803', '806', '811', '818', '819', '820', '821', '822', '823', '824', '825', '826', '827', '828', '829', '830', '834', '837', '838', '840', '841', '843', '844', '847', '848', '849', '851', '852', '853', '854', '855', '856', '857', '859', '860', '861', '863', '864', '865', '866', '868', '870', '873'], '200', ['020', '117', '124', '129', '277', '464', '466', '496', '570', '607', '644'], '300', ['041', '049', '076', '111', '219', '278', '307', '331', '460', '482', '505', '516', '610', '628', '664', '758', '768', '791', '793', '812', '814', '816'], '400', ['013', '046', '053', '214', '372', '411', '446', '447', '469', '481', '497', '544', '603', '611', '809', '810'], '500', ['023', '128', '147', '265', '508', '524', '560', '665', '667', '730', '770', '784', '804'], '600', ['225', '318', '456', '492', '493', '507', '551', '742', '809'], '700', ['029', '113', '172', '209', '373', '522', '597', '601', '731', '751', '844'], '800', ['090', '016', '114', '187', '192', '488', '486', '506', '514', '526', '529', '594', '622', '743', '803', '804', '806', '808'], '900', ['173', '315', '417', '467', '491', '559', '677', '767', '784', '788', '792', '800', '861', '968'], 'COGM', ['098', '110', '139', '155', '231', '315', '336', '512', '520', '521', '523', '556', '558', '591', '621', '641', '643', '652', '660', '807', '813', '815', '831', '833', '834', '842', '848', '869', '706', '670', '805', '786', '723', '646', '771', '711', '604', '762', '533', '717', '691', '758', '679', '774', '875']]];
                        if (!localStorage.getItem('atualizacao_pessoas') || localStorage.getItem('atualizacao_pessoas') != new Date().getDate()) {
                            const planilhaURL = "https://docs.google.com/spreadsheets/d/1xr8d6jwh70JBprPBHvZIHHfNdYJO-1UvEgAh9Jh5Ri4/gviz/tq?tqx=out:json&gid=1239289971"; // Substitua com seu ID e gid
                            let resultados = '';
                            let dados = [[], [], [], [], [], [], [], [], [], [], [], []];
                            let areas = ['CRUZEIRO', 'PARTENON', 'LESTE', 'RESTINGA', 'NORTE', 'EIXO BALTAZAR', 'PINHEIRO', 'EIXO SUL', 'ROMU', 'CENTRO', 'PATAM', 'COGM'];

                            fetch(planilhaURL)
                                .then(response => response.text())
                                .then(dataText => {
                                    // A resposta vem com texto JS, não JSON puro. Precisamos "limpar"
                                    const jsonData = JSON.parse(dataText.substring(47).slice(0, -2)); // Remove prefixo e sufixo da resposta
                                    const rows = jsonData.table.rows;
                                    resultados = rows.map(row => row.c.map(cell => cell ? cell.v : null));
                                    resultados.forEach(element => {
                                        for (let index = 0; index < areas.length; index++) {
                                            if (areas[index] == element[4]) {
                                                dados[index].push(element[0])
                                            }
                                        }
                                    });
                                    gms = ['Dia', ['1000', dados[8], '1100', dados[10], '1200', dados[9], '200', dados[0], '300', dados[1], '400', dados[2], '500', dados[3], '600', dados[4], '700', dados[5], '800', dados[6], '900', dados[7], 'COGM', dados[11]]];
                                    localStorage.setItem('gms',JSON.stringify(gms));
                                    localStorage.setItem('atualizacao_pessoas', new Date().getDate());
                                })
                                .catch(error => {
                                    console.error("Erro ao carregar dados da planilha:", error);
                                });
                        } else if(localStorage.getItem('atualizacao_pessoas') == new Date().getDate() && localStorage.getItem('gms') && localStorage.getItem('gms') != '') {
                            gms = JSON.parse(localStorage.getItem('gms'));
                        }

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

                        document.getElementById('botao_gerar_lista_de_equipes').addEventListener('click', function () {
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
                            localStorage.setItem('lista_equipes_número', document.querySelectorAll('svg[class="iconeServico ng-star-inserted"]').length);
                            localStorage.setItem('lista_equipes_empenhadas', document.querySelectorAll('svg[class="iconeEmpenhada ng-star-inserted"]').length);
                            localStorage.setItem('lista_equipamentos', parseInt(document.querySelectorAll('app-equipamentos-mini-card').length));
                            localStorage.setItem('lista_equipes_pronto', 'sim');
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
                            var equipes = document.getElementById('txt_separador_equipes').value.toUpperCase().replaceAll('GU', ' ').replaceAll(';', ' ').replaceAll(':', ' ').replaceAll('.', ' ').replaceAll('(', ' ').replaceAll(')', ' ').replaceAll('-', ' ').replaceAll(',', ' ').replaceAll('/', ' ').replaceAll('JBL', ' ').replaceAll('CAM', ' ').replaceAll('CAMERAS', ' ').replaceAll('CÂMERAS', ' ').replaceAll('\n', ' ').replaceAll('  ', ' ').replaceAll('  ', ' ');
                            var e = [];
                            var n = [];
                            equipes.split(' ').forEach(function (i) {
                                if (eqps.includes(i)) {
                                    e.push(equipes.indexOf(i));
                                }
                            });
                            if (e.length == 1) {
                                n.push(equipes);
                            } else if (e.length > 1) {
                                n.push(equipes.slice(0, e[1]));
                                for (let i = 1; i < e.length - 1; i++) {
                                    n.push(equipes.slice(e[i], e[i + 1]));
                                }
                                n.push(equipes.slice(e[e.length - 1], equipes.length));
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
                                console.log(equipes);
                                guardas.forEach(function (guarda) {
                                    if (equipes.includes('GSP ' + guarda) || equipes.includes('GSP' + guarda) || equipes.includes(guarda + ' GSP') || equipes.includes(guarda + 'GSP')) {
                                        gsp = '<td><input value="' + guarda + '" /></td>';
                                    } else if (equipes.includes('GMO ' + guarda) || equipes.includes('GMO' + guarda) || equipes.includes(guarda + ' GMO') || equipes.includes(guarda + 'GMO')) {
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
                                    console.log(qtd_celulas);
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
                                item.addEventListener('click', function () {
                                    localStorage.setItem('processo_edicao', 'excluir_pessoas');
                                    var unidade_servico = '';
                                    var editar_equipe_modal = '';
                                    document.querySelectorAll('app-equipe-mini-card').forEach(function (it) {
                                        if (it.querySelector('span').innerHTML == item.parentNode.parentNode.querySelectorAll('input')[0].value + ' - ' + item.parentNode.parentNode.querySelector('select').value) {
                                            unidade_servico = it.parentNode.parentNode.parentNode.parentNode;
                                            editar_equipe_modal = it;
                                        }
                                    });
                                    var selects = item.parentNode.parentNode.querySelectorAll('input, select');
                                    console.log(unidade_servico);
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
                                        console.log(linhas[i]);
                                        console.log(document.getElementById('txt_separador_equipes').value.indexOf(linhas[i]));
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



                        //document.getElementById('checkbox').click();
                    }
                }
            }, "1000");
            if (localStorage.getItem('lista_equipes_pronto') && localStorage.getItem('lista_equipes_pronto') == 'sim') {
                if (parseInt(localStorage.getItem('lista_equipes_número')) > -1) {
                    if (parseInt(localStorage.getItem('lista_equipes_número')) % 2 != 0) {
                        document.querySelectorAll('svg[class="iconeServico ng-star-inserted"]')[parseInt(localStorage.getItem('lista_equipes_número'))].parentNode.parentNode.parentNode.querySelector('button[title="Detalhar"]').click();
                        localStorage.setItem('lista_equipes_pronto', 'nao');
                    } else {
                        localStorage.setItem('lista_equipes_número', parseInt(localStorage.getItem('lista_equipes_número')) - 1);
                    }
                } else if (parseInt(localStorage.getItem('lista_equipes_empenhadas')) > -1) {
                    if (parseInt(localStorage.getItem('lista_equipes_empenhadas')) % 2 != 0) {
                        document.querySelectorAll('svg[class="iconeEmpenhada ng-star-inserted"]')[parseInt(localStorage.getItem('lista_equipes_empenhadas'))].parentNode.parentNode.parentNode.querySelector('button[title="Detalhar"]').click();
                        localStorage.setItem('lista_equipes_pronto', 'nao');
                    } else {
                        localStorage.setItem('lista_equipes_empenhadas', parseInt(localStorage.getItem('lista_equipes_empenhadas')) - 1);
                    }
                } else if (parseInt(localStorage.getItem('lista_equipamentos')) > -1) {
                    if (document.querySelectorAll('app-equipamentos-mini-card')[parseInt(localStorage.getItem('lista_equipamentos'))]) {
                        document.querySelectorAll('app-equipamentos-mini-card')[parseInt(localStorage.getItem('lista_equipamentos'))].querySelector('button[title="Detalhar"]').click();
                        localStorage.setItem('lista_equipes_pronto', 'nao');
                    }
                    localStorage.setItem('lista_equipamentos', parseInt(localStorage.getItem('lista_equipamentos')) - 1);
                } else {
                    var BOM = "\uFEFF";
                    var htmltabel = document.getElementById('tabela_lista_de_equipes');
                    var html = htmltabel.outerHTML;
                    var downbutton = document.createElement("div");
                    downbutton.setAttribute('id', 'download_excel');
                    downbutton.setAttribute('class', 'cancel-btn');
                    downbutton.setAttribute('style', "margin-right:1%;display:inline-block");
                    document.querySelector('#botao_copiar_lista_equipes').parentNode.insertBefore(downbutton, document.querySelector('#botao_copiar_lista_equipes'));
                    downbutton.innerHTML = 'Download em Excel';
                    document.querySelector('#download_excel').addEventListener('click', function () {
                        window.open('data:application/vnd.ms-excel,' + encodeURI(BOM + html));
                    });
                    localStorage.removeItem('lista_equipes_pronto');
                }
            }
            if (document.querySelector('app-modal-detalhar-equipe') && localStorage.getItem('lista_equipes_pronto') == 'nao') {
                equipe = document.querySelector('app-modal-detalhar-equipe').querySelectorAll('strong')[1].innerHTML;
                componentes = document.querySelector('app-modal-detalhar-equipe').querySelectorAll('div[class="p-card-body"]');
                for (let i = 0; i < componentes.length; i++) {
                    document.getElementById('tabela_lista_de_equipes').innerHTML += '<tr><td>' + equipe + '</td><td>' + componentes[i].parentNode.previousSibling.innerHTML.replace('gm ', '') + '</td><td>' + componentes[i].querySelectorAll('strong')[1].parentNode.innerHTML.split('</strong>')[1].trim() + '</td><td>' + componentes[i].querySelectorAll('strong')[4].parentNode.innerHTML.split('</strong>')[1].trim() + '</td><td></td><td></td></tr>';
                }
                componentes = '';
                if (parseInt(localStorage.getItem('lista_equipes_número')) != -1) {
                    localStorage.setItem('lista_equipes_número', parseInt(localStorage.getItem('lista_equipes_número')) - 1);
                } else {
                    localStorage.setItem('lista_equipes_empenhadas', parseInt(localStorage.getItem('lista_equipes_empenhadas')) - 1);
                }
                document.querySelector('app-modal-detalhar-equipe').querySelector('button').click();
                localStorage.setItem('lista_equipes_pronto', 'sim');
            }
            if (document.querySelector('app-modal-detalhar-equipamentos') && localStorage.getItem('lista_equipes_pronto') == 'nao') {
                var gu = document.querySelector('app-modal-detalhar-equipamentos').querySelector('strong').innerHTML.split('- ')[1].split(' ')[0];
                var dados = document.getElementById('tabela_lista_de_equipes').querySelectorAll('tr');
                equipamentos = document.querySelector('app-modal-detalhar-equipamentos').querySelectorAll('div[class="modal-material-subtitulo"]');
                vtr = '';
                cam = '';
                for (let i = 0; i < dados.length; i++) {
                    if (dados[i].querySelector('td') && dados[i].querySelector('td').innerHTML.includes(gu)) {
                        for (let idx = 0; idx < equipamentos.length; idx++) {
                            if (equipamentos[idx].innerHTML.trim().length > 4) {
                                cam += ' - ' + equipamentos[idx].innerHTML.trim();
                            } else {
                                vtr += ' - ' + equipamentos[idx].innerHTML.trim() + ' - ' + Array.from(equipamentos[idx].parentNode.querySelectorAll('strong')).filter(item => item.innerText == 'Placa:')[0].parentNode.innerText.split(' ')[1];
                            }
                        }

                        if (cam != '') {
                            dados[i].querySelectorAll('td')[5].innerHTML = cam.substring(3, cam.length);
                            cam = '';
                        }
                        if (vtr != '') {
                            dados[i].querySelectorAll('td')[4].innerHTML = vtr.substring(3, vtr.length);
                            vtr = '';
                        }
                    }
                }
                document.querySelector('app-modal-detalhar-equipamentos').querySelector('button').click();
                localStorage.setItem('lista_equipes_pronto', 'sim');
            }

        }, 100);
    });
});
