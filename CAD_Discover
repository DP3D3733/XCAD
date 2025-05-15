// ==UserScript==
// @name         CAD_Discover
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @updateURL    https://raw.githubusercontent.com/DP3D3733/XCAD/main/CAD_Discover.js
// @downloadURL  https://raw.githubusercontent.com/DP3D3733/XCAD/main/CAD_Discover.js
// @description  Automações para o CAD Discover
// @author       You
// @match        https://cadweb.sinesp.gov.br/paineis-estatisticos/app/discover*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// ==/UserScript==

localStorage.setItem('planilha_registros','');
setInterval(function () {
    if(document.querySelector('div[title="nrProtocolo"]')) {
        let planilha = localStorage.getItem('planilha_registros') || '';
        let linhas = document.querySelectorAll('div[data-grid-row-index]');
        linhas.forEach(function(linha){
            console.log(linha.querySelector('div[data-gridcell-column-id="nrProtocolo"]').innerText)
            console.log(planilha.includes(linha.querySelector('div[data-gridcell-column-id="nrProtocolo"]').innerText));

            if(!planilha.includes(linha.querySelector('div[data-gridcell-column-id="nrProtocolo"]').innerText)) {
                let l = '';
                linha.querySelectorAll('div[role="gridcell"]').forEach(function(celula){
                    l+= celula.innerText+'§';
                });
                l+='|';
                planilha += l;
            }
        });
        localStorage.setItem('planilha_registros',planilha);
    }


    if(document.querySelector('div[data-gridcell-column-id=relatos]:not(:has(div[relatinho="sim"])) span')) {
        var dados_prontos = '';
        var dados_do_relato = document.querySelector('div[data-gridcell-column-id=relatos]:not(:has(div[relatinho="sim"])) span').innerText;
        dados_do_relato = JSON.parse(dados_do_relato);
        console.log(dados_do_relato);
        if(dados_do_relato && dados_do_relato.length) {
            dados_do_relato.forEach(documento => {
                dados_prontos += documento.nomeUsuario+' em '+documento.dataHoraEventoBrt+':<br>'+documento.relato+'<br>';
            });
            document.querySelector('div[data-gridcell-column-id=relatos]:not(:has(div[relatinho="sim"])) span').innerHTML = '<div relatinho="sim">'+dados_prontos+'</div>';
        } else {
            document.querySelector('div[data-gridcell-column-id=relatos]:not(:has(div[relatinho="sim"])) span').innerHTML = '<div relatinho="sim">'+dados_do_relato.nomeUsuario+' em '+dados_do_relato.dataHoraEventoBrt+':<br>'+dados_do_relato.relato+'</div>';
        }

    }
    if(document.querySelector('div[data-gridcell-column-id=envolvidos]:not(:has(div[relatinho="sim"])) span')) {
        var dados_dos_envolvidos = document.querySelector('div[data-gridcell-column-id=envolvidos]:not(:has(div[relatinho="sim"])) span').innerText;
        dados_dos_envolvidos = JSON.parse(dados_dos_envolvidos);
        dados_prontos = '';
        if(!dados_dos_envolvidos.length) {
            dados_prontos += 'Participação: '+dados_dos_envolvidos.participacaoDescricao+'<br>';
            dados_prontos += 'Nome: '+dados_dos_envolvidos.nome+'<br>';
            dados_prontos += 'Sexo: '+dados_dos_envolvidos.sexoDescricao+'<br>';
            dados_prontos += 'Raça: '+dados_dos_envolvidos.racaCorDescricao+'<br>';
            dados_prontos += 'Naturalidade: '+dados_dos_envolvidos.nacionalidadeDescricao+'<br>';
            if(dados_dos_envolvidos.dataNascimento) {
                dados_prontos += 'Data de Nascimento: '+JSON.stringify(dados_dos_envolvidos.dataNascimento).split('-')[2].split('T')[0]+'/'+JSON.stringify(dados_dos_envolvidos.dataNascimento).split('-')[1]+'/'+JSON.stringify(dados_dos_envolvidos.dataNascimento).split('-')[0].split('"')[1]+'<br>';
            }
            dados_prontos += 'Nome da Mãe: '+dados_dos_envolvidos.nomeMae+'<br>';
            dados_prontos += 'Nome do Pai: '+dados_dos_envolvidos.nomePai+'<br>';
            if(dados_dos_envolvidos.listaDocumentos && dados_dos_envolvidos.listaDocumentos.length) {
                dados_dos_envolvidos.listaDocumentos.forEach(documento => {
                    dados_prontos += documento.tipoDocumentoDescricao + ': '+documento.numeroDocumento+'<br>';
                });
            }
        } else {
            for (var i = 0; i < dados_dos_envolvidos.length; i++) {
                var n_envolvido = i+1;
                dados_prontos += '<strong>Envolvido '+n_envolvido+':</strong><br>';
                dados_prontos += 'Participação: '+dados_dos_envolvidos[i].participacaoDescricao+'<br>';
                dados_prontos += 'Nome: '+dados_dos_envolvidos[i].nome+'<br>';
                dados_prontos += 'Sexo: '+dados_dos_envolvidos[i].sexoDescricao+'<br>';
                dados_prontos += 'Raça: '+dados_dos_envolvidos[i].racaCorDescricao+'<br>';
                dados_prontos += 'Naturalidade: '+dados_dos_envolvidos[i].nacionalidadeDescricao+'<br>';
                if(dados_dos_envolvidos[i].dataNascimento) {
                    dados_prontos += 'Data de Nascimento: '+JSON.stringify(dados_dos_envolvidos[i].dataNascimento).split('-')[2].split('T')[0]+'/'+JSON.stringify(dados_dos_envolvidos[i].dataNascimento).split('-')[1]+'/'+JSON.stringify(dados_dos_envolvidos[i].dataNascimento).split('-')[0].split('"')[1]+'<br>';
                }
                dados_prontos += 'Nome da Mãe: '+dados_dos_envolvidos[i].nomeMae+'<br>';
                dados_prontos += 'Nome do Pai: '+dados_dos_envolvidos[i].nomePai+'<br>';
                if(dados_dos_envolvidos[i].listaDocumentos && dados_dos_envolvidos[i].listaDocumentos.length) {
                    dados_dos_envolvidos[i].listaDocumentos.forEach(documento => {
                        dados_prontos += documento.tipoDocumentoDescricao + ': '+documento.numeroDocumento+'<br>';
                    });
                }
                dados_prontos += '<br>';
            }
        }
        document.querySelector('div[data-gridcell-column-id=envolvidos]:not(:has(div[relatinho="sim"])) span').innerHTML = '<div relatinho="sim">'+dados_prontos.replaceAll('undefined','')+'</div>';
    }

    if(document.querySelector('div[title="equipesEmpenhadas"]')) {
        document.body.addEventListener('click',function(){
            if(document.querySelector('div[class="euiDataGridRow"]')){
                let data = new Date(document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="dataHoraFato"]').innerText);
                let dia = String(data.getDate()).padStart(2, '0');
                let mes = String(data.getMonth() + 1).padStart(2, '0');
                let ano = data.getFullYear();
                let hora = String(data.getHours()).padStart(2, '0');
                let minuto = String(data.getMinutes()).padStart(2, '0');
                let local = document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="logradouro"]').innerText+' '+document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="numero"]').innerText+', '+document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="bairro"]').innerText+' - '+document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="pontoReferencia"]').innerText;
                let equipe = document.querySelector('div[class="euiDataGridRow"] div[data-gridcell-column-id="equipesEmpenhadas"]').innerText;
                document.body.innerHTML = '';
                let ultima_abordagem = `\n\n*ÚLTIMA ABORDAGEM:*\nData: ${dia}/${mes}/${ano} ${hora}:${minuto}\nLocal: ${local}\nEquipe: ${equipe}`;
                (async () => {
                    const texto = await wait();
                    document.body.innerHTML = '<div id=resultado>'+texto + ultima_abordagem+'</div>';
                })();
                let copiar_resultados = document.createElement("button");
                copiar_resultados.setAttribute('id', 'copiar_resultados');
                copiar_resultados.setAttribute('style', 'height:150px;width:400px');
                copiar_resultados.innerHTML = 'Copiar Resultados';
                document.body.insertAdjacentElement('beforebegin', copiar_resultados);
                document.querySelector('#copiar_resultados').addEventListener('click', function() {
                    navigator.clipboard.writeText(document.querySelector('#resultado').innerHTML.replace('*DADOS BÁSICOS:*','\n\n*DADOS BÁSICOS:*').replace('*OCORRÊNCIAS:*','\n*OCORRÊNCIAS:*').replaceAll('&nbsp;',''));
                    const range = document.createRange();
                    const selection = window.getSelection();

                    // Apaga qualquer seleção anterior
                    selection.removeAllRanges();

                    // Cria uma faixa de seleção e seleciona o conteúdo
                    range.selectNodeContents(document.querySelector('#resultado'));

                    // Adiciona a seleção ao window.getSelection()
                    selection.addRange(range);
                });
            }
        });
    }
}, 100);

async function wait(){
    let a = await window.navigator.clipboard.readText();
    return a;
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
    } catch(error){
        // Exceção aqui
    }
}
