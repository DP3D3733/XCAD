main();

function verificarLocalExecucao() {
    const url = window.location.href;
    if (!url.includes('editar-ocorrencia')) return false;
    return true;
}

function main() {
    const scriptRodandoNoLugarCerto = verificarLocalExecucao();
    if (!scriptRodandoNoLugarCerto) return;

    inserirBotaoColaBA();
}

function inserirBotaoColaBA() {
    const botaoColarBA = document.createElement('button');
    botaoColarBA.setAttribute('botaosecundario', '');
    botaoColarBA.classList.add('confirm-btb');
    botaoColarBA.innerHTML = `<i class="fa fa-paste"></i><span>  Colar BA</span>`;
    botaoColarBA.addEventListener('click', () => colarBA(botaoColarBA));
    const intervalAguardaCarregarForm = setInterval(() => {
        const form = document.querySelector('form');
        if (!form) return;
        form.insertAdjacentElement('afterbegin', botaoColarBA);
        clearInterval(intervalAguardaCarregarForm);
    }, 1000);

}

async function colarBA() {
    const ba = await lerClipboard();
    if (!ba) return;
    if (ba.ba && ba.ba != '') inserirNumBA(ba.ba);
    if (ba.relato && ba.relato != '') inserirRelato(ba.relato);
    if (ba.individuos && ba.individuos.length) inserirIndividuos(ba.individuos);

    /*{"ba":"BA GCM 1195/2026","relato":"Guarnição Restinga 51 compareceu em apoio a guarnição Pinheiro, no viveiro Municipal de Porto Alegre, local 808, Pois houve invasão de indígenas no local. Ficamos aguardando a chegada dos representantes dos indígenas. Nesse momento a rendição da área Restinga pela área Leste, encerrando participação dessa guarnição no apoio, relatório será feito pelo Patrulheiro da área, Molina."}*/
}

async function lerClipboard() {
    try {
        const texto = await navigator.clipboard.readText();
        const textoObj = JSON.parse(texto);
        console.log("Texto copiado:", texto);
        return textoObj;
    } catch (err) {
        console.error("Falha ao ler a área de transferência:", err);
        return false;
    }
}

function inserirNumBA(numero) {
    const inputNumBA = document.querySelector('input[formcontrolname="boletimOcorrencia"]');
    inputNumBA.value = numero;
    inputNumBA.dispatchEvent(new Event('input', { bubbles: true }));
    const buttonAdicionar = document.querySelector('button[mattooltip="Adicionar Boletim"]');
    buttonAdicionar.click();
}

function inserirRelato(relato) {
    const textareaRelato = document.querySelector('textarea[formcontrolname="relato"]');
    textareaRelato.value = relato;
    textareaRelato.dispatchEvent(new Event('input', { bubbles: true }));
}

// Função auxiliar para esperar o tempo necessário entre as ações
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function inserirIndividuos(individuos) {
    const botaoAbaEnvolvidos = document.querySelector('mat-icon[data-mat-icon-name="fa-users"]');
    botaoAbaEnvolvidos.click();
    await delay(800);
    // Trabalha em uma cópia para não alterar o array original diretamente
    const lista = [...individuos];

    for (const individuo of lista) {
        // 1. Procura e clica no botão 'Novo'
        const botaoNovo = Array.from(document.querySelectorAll('app-listagem-envolvidos button'))
            .find(b => b.innerText.trim() === 'Novo');

        if (botaoNovo) {
            botaoNovo.click();
            // Aguarda o formulário carregar e renderizar na tela
            await delay(800);
        }

        // 2. Busca o select de participação
        const selectParticipacao = document.querySelector('mat-select[formcontrolname="participacao"]');

        if (!selectParticipacao) console.warn('Campo participacao não foi encontrado a tempo.');

        // Executa a seleção do valor desejado
        await selecionarOpcaoMatSelect('mat-select[formcontrolname="participacao"]', 'Averiguado');
        await delay(500);

        if (individuo.nome) digitarEmInput('input[formcontrolname="nome"]', individuo.nome);

        if (individuo.sexo) {
            await selecionarOpcaoMatSelect('mat-select[formcontrolname="sexo"]', individuo.sexo);
            await delay(500);
        }

        if (individuo.cor) {
            await selecionarOpcaoMatSelect('mat-select[formcontrolname="racaCor"]', individuo.cor);
            await delay(500);
        }

        if (individuo.nacionalidade && individuo.nacionalidade != 'BRASIL') selecionarMatAutocomplete('cad-select-autocomplete[formcontrolname="nacionalidade"]', individuo.nacionalidade);

        if (individuo.naturalidade) digitarEmInput('input[formcontrolname="naturalidade"]', individuo.naturalidade);

        if (individuo.nascimento) digitarEmInput('input[formcontrolname="dataNascimento"]', individuo.nascimento);

        if (individuo.mae) digitarEmInput('input[formcontrolname="nomeMae"]', individuo.mae);

        if (individuo.pai) digitarEmInput('input[formcontrolname="nomePai"]', individuo.pai);

        if (individuo.cpf) {
            await selecionarOpcaoMatSelect('mat-select[formcontrolname="idTipoDocumento"]', 'CPF');
            await delay(500);
            digitarEmInput('input[formcontrolname="numeroDocumento"]', individuo.cpf);

            const botaoAdicionarDoc = document.querySelector('cad-select-autocomplete[formcontrolname="ufDocumento"]').nextElementSibling;
            botaoAdicionarDoc.click();
            await delay(500);
        }

        const botaoSalvar = Array.from(document.querySelectorAll('app-formulario-envolvidos button'))
            .find(b => b.innerText.trim() === 'Salvar');
        botaoSalvar?.click();
        await delay(800);

    }

    console.log("Inserção de indivíduos concluída!");
}

async function selecionarOpcaoMatSelect(select, textoOpcao) {
    const selectElement = document.querySelector(select);
    if (!selectElement) {
        console.error('Campo mat-select não encontrado');
        return;
    }

    // 2. Clica no mat-select para abrir o painel com as opções
    selectElement.click();

    // 3. Aguarda o painel ser renderizado no DOM (Renderiza em overlay fora do componente)
    await new Promise(resolve => setTimeout(resolve, 200));

    // 4. Busca a opção desejada pelo texto visível no painel global
    const opcoes = Array.from(document.querySelectorAll('mat-option'));
    const opcaoAlvo = opcoes.find(opt => opt.textContent.trim().toUpperCase().includes(textoOpcao.toUpperCase()));

    if (opcaoAlvo) {
        opcaoAlvo.click();
        console.log(`Opção "${textoOpcao}" selecionada com sucesso!`);
    } else {
        console.error(`Opção com texto "${textoOpcao}" não foi encontrada.`);
    }
}

async function selecionarMatAutocomplete(formControlName, textoBusca) {
    // 1. Localiza o input do autocomplete pelo atributo 'formcontrolname' do componente pai
    const container = document.querySelector(formControlName);
    const input = container?.querySelector('input');

    if (!input) {
        console.error(`Campo autocomplete '${formControlName}' não encontrado.`);
        return;
    }

    // 2. Foca no campo
    input.focus();

    // 3. Usa o setter do protótipo do HTMLInputElement para atualizar o valor no Angular
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, textoBusca);

    // 4. Dispara os eventos de digitação para o Angular filtrar a lista
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('keydown', { bubbles: true }));

    // 5. Aguarda o tempo do menu/overlay ser renderizado na tela
    await new Promise(resolve => setTimeout(resolve, 400));

    // 6. Busca a opção correta no overlay do Material (mat-option)
    const opcoes = Array.from(document.querySelectorAll('mat-option'));
    const opcaoAlvo = opcoes.find(opt => opt.textContent.trim().toLowerCase().includes(textoBusca.toLowerCase()));

    if (opcaoAlvo) {
        opcaoAlvo.click();
        console.log(`Nacionalidade "${textoBusca}" selecionada com sucesso!`);
    } else {
        console.warn(`Opção "${textoBusca}" não encontrada na lista. Verifique a digitação.`);
    }
}

function digitarEmInput(input, texto) {
    const inputElement = document.querySelector(input);
    inputElement.value = texto;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
}


