deixarSoOMapaVisivel();
tratarModelos();
ajusteMascaraTelefone();
function deixarSoOMapaVisivel() {
    if (!url.includes('/despacho/attendance') || !sessionStorage.getItem('associarLocal')) return;
    const blocoMapa = document
        .querySelector('#map-btn')
        .closest('div.card-body');

    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('#root div[class="card mb-2"]')[0].style.display = 'none';
    document.querySelectorAll('#root div[class="card mb-2"]')[2].style.display = 'none';
    document.querySelectorAll('#root div[class="card mb-2"]')[3].style.display = 'none';
    document.querySelectorAll('#root div[class="card mb-2"]')[4].style.display = 'none';
    document.querySelectorAll('#root div[class="card mb-2"]')[6].style.display = 'none';
    const buttonAssociar = document.createElement('span');
    buttonAssociar.setAttribute('class', "btn btn-primary w-100");
    document.querySelector('#copy-btn').insertAdjacentElement('beforeBegin', buttonAssociar);
    buttonAssociar.innerText = 'Associar';

    const buttonCancelar = document.querySelector('#copy-btn').cloneNode('true');
    buttonCancelar.removeAttribute('id');
    document.querySelector('#copy-btn').insertAdjacentElement('beforeBegin', buttonCancelar);
    buttonCancelar.innerText = 'Cancelar';
    buttonAssociar.addEventListener('click', () => finalizarAssociarLocal())

    document.querySelector('#copy-btn').remove();

}

function finalizarAssociarLocal() {
    const localASerAssociado = sessionStorage.getItem('associarLocal');
    const associacao = {};
    associacao[localASerAssociado] = {
        "district": document.querySelector('#select2-factDistrict-container').innerText,
        "city": document.querySelector('#select2-factCity-container').innerText,
        "placeType": document.querySelector('#select2-factType-container').innerText,
        "place": document.querySelector('#select2-factPlace-container').innerText,
        "neighborhood": document.querySelector('#select2-factNeighborhood-container').innerText,
        "street": document.querySelector('#select2-factStreet-container').innerText,
        "number": document.querySelector('#factNumber').value,
        "latitude": document.querySelector('#factLatitude').value,
        "longitude": document.querySelector('#factLongitude').value,
        "sectors": [
            document.querySelector("#factSectors").selectedOptions[0]?.value || ''
        ]
    }
    sessionStorage.setItem('associarLocal', JSON.stringify(associacao));
    sessionStorage.setItem('associacao', 'pronta');
}

inserirSelectSolicitante();
async function inserirSelectSolicitante() {
    const inputSolicitante = document.querySelector("#contactName");
    if (!inputSolicitante) return;
    const inputNaturezas = document.querySelector("#nature").parentNode.parentNode;
    const novoInput = inputNaturezas.cloneNode(true);
    const pessoas = await atualizarEfetivo('apenasSistema');
    const inputSolicitanteAtivo = inputSolicitante.value != '' ? 'active' : '';
    var novoSelectHTML = `
    <div class="form-outline-custom ${inputSolicitanteAtivo}">
        <select class="select2 linked-values" name="selectSolicitante" id="selectSolicitante">
            <option selected value="${inputSolicitante.value}">${inputSolicitante.value}</option>
            <option value="Comando-geral">Comando-geral</option>
            ${pessoas.map(pessoa => `<option value="Agente ${pessoa.nomeFuncional}">Agente ${pessoa.nomeFuncional}</option>`)
            .join('')}
        </select>
        <label class="form-label select-label" for="selectSolicitante">Solicitante</label>
    </div>
`;

    inputSolicitante.parentNode.insertAdjacentHTML('afterEnd', novoSelectHTML);

    $('#selectSolicitante').select2({ allowClear: true, tags: true });

    $('#selectSolicitante').on('change', function () {
        $(this).closest('.form-outline-custom').toggleClass('active', !!$(this).val());
        inputSolicitante.value = $(this).val();
    });

    inputSolicitante.parentNode.style.display = 'none';
}

function ajusteMascaraTelefone() {
    $('#contactPhone')
        // Quando o usuário entra no campo, remove a máscara para facilitar a edição
        .on('focus', function () {
            $(this).unmask();
        })
        // Quando sai do campo (blur), limpa o +55 e relica a máscara
        .on('blur', function () {
            // 1. Remove o +55 inicial (se existir) e extrai apenas os números
            let val = $(this).val().replace(/^\+55\s*/, '').replace(/\D/g, '');

            // 2. Se for um celular de 11 dígitos ou fixo de 10 dígitos, atualiza o campo e aplica a máscara
            if (val.length > 0) {
                // Define o valor sem o +55 antes de mascarar
                $(this).val(val);

                // Aplica a máscara dinâmica (suporta 10 e 11 dígitos)
                const maskPattern = val.length > 10 ? '(00) 00000-0000' : '(00) 0000-0000';
                $(this).mask(maskPattern);
            }
        });
}



async function tratarModelos() {
    const [modelos, dados_bd_modelos] = await buscarModelos();
    inserirBotaoSalvarModelo(modelos, dados_bd_modelos);
    if (!modelos || !Object.keys(modelos).length) return;
    inserirSelectModelos(modelos);

}

async function inserirSelectModelos(modelos) {
    const inputData = document.querySelector("#start");
    if (!inputData) return;
    const novoSelectHTML = `
        <div class="col-3">
            <div class="form-outline-custom">
                <select class="select2 linked-values" name="selectModelo" id="selectModelo">
                    <option value=""></option>
                    ${Object.keys(modelos).map(modelo => `<option value="${modelo}">${modelo}</option>`).join('')}
                </select>
                <label class="form-label select-label" for="selectModelo">Modelo</label>
            </div>
        </div>
    `;

    inputData.parentNode.parentNode.insertAdjacentHTML('beforeBegin', novoSelectHTML);

    $('#selectModelo').select2({ allowClear: true, tags: true });

    $('#selectModelo').on('change', function () {
        $(this).closest('.form-outline-custom').toggleClass('active', !!$(this).val());
        selecionarModelo(modelos[$(this).val()]);
    });
}




function inserirBotaoSalvarModelo(modelos, dados) {
    const botaoSalvarModelo = document.createElement('button');
    botaoSalvarModelo.setAttribute('class', 'btn btn-default btn-new float-end ms-1');
    botaoSalvarModelo.innerHTML = `<i class="fa fa-star"></i><span>  Salvar modelo</span>`;
    botaoSalvarModelo.addEventListener('click', () => montarObjetoModelo(modelos, dados, botaoSalvarModelo), { once: true });

    const linhaCabecalho = document.querySelector('#page-wrapper div.row');
    const botaoImprimir = linhaCabecalho.querySelector('button');
    if (botaoImprimir) return botaoImprimir.insertAdjacentElement('beforebegin', botaoSalvarModelo);
    const novaColuna = linhaCabecalho.querySelector('div').cloneNode();
    linhaCabecalho.insertAdjacentElement('beforeend', novaColuna);
    novaColuna.insertAdjacentElement('afterbegin', botaoSalvarModelo);
}

async function montarObjetoModelo(modelos, dados, botao) {
    const form = document.querySelector("#form");
    const formData = new FormData(form);

    const dadosFormulario = Object.fromEntries(formData.entries());
    const dadosFormularioLimpo = limparObjetoModelo(dadosFormulario);
    let nome;
    while (!nome || nome == '') {
        nome = prompt('Insira um nome para o modelo: ');
    }
    modelos[nome] = dadosFormularioLimpo;
    modelos[nome].transcription = modelos[nome].transcription.trim();

    const modeloSalvo = await salvarModelo(modelos, dados);
    if (!modeloSalvo) return;
    botao.innerHTML = 'Modelo salvo!';

}

function limparObjetoModelo(objeto) {
    const camposProibidos = ['attendanceLinked', 'selectModelo', 'selectSolicitante', 'start', 'end', 'statusName', 'systemUpdate'];

    const limpo = Object.fromEntries(
        Object.entries(objeto)
            .filter(([chave, valor]) => !camposProibidos.includes(chave) && Boolean(valor))
    );

    return limpo;
}

async function buscarModelos() {

    const response = await fetch(
        `https://sentry.procempa.com.br/despacho/activity/9`,
        {
            credentials: "include"
        }
    );

    const dados = await response.json();
    if (!dados) return [,];
    const modelos = dados?.activity?.activityObservation || '{}';
    return [JSON.parse(modelos), dados];
}

async function salvarModelo(modelos, dados) {
    const activityObservation = JSON.stringify(modelos);

    const atividade = dados.activity;

    const payload = {
        onDuty: atividade.onDuty.split('-').reverse().join('/'),
        activityObservation: activityObservation,
        bossInspector: String(atividade.bossInspector),
        garrison: atividade.garrison,
        bos: atividade.bos,
        systemUpdate: atividade.systemUpdate
    };

    const response = await fetch(
        'https://sentry.procempa.com.br/despacho/activity/9',
        {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
    );

    if (!response) return false;

    const texto = await response.text();

    return texto;
}

function selecionarModelo(modelo) {
    const form = document.querySelector("#form");
    if (!form) return;

    Object.entries(modelo).forEach(([nomeCampo, valor]) => {
        const campo = form.querySelector(`[name="${nomeCampo}"]`);
        if (!campo) return;
        if (!valor || valor == '') return;

        const $campo = $(campo);
        const $wrapper = $campo.closest('.form-outline, .form-outline-custom, .form-group');

        // 1. REHABILITA O CAMPO (Remove a propriedade e o atributo disabled)
        campo.disabled = false;
        $campo.prop('disabled', false).removeAttr('disabled');

        // Se for um Select2, notifica a biblioteca para reabilitar o dropdown visualmente
        if ($campo.hasClass('select2-hidden-accessible') || $campo.hasClass('select2')) {
            $campo.prop('disabled', false).trigger('change.select2');
        }

        // 2. Se a opção não existir no <select>, cria ela dinamicamente
        if ($campo.is('select') && valor && !$campo.find(`option[value="${valor}"]`).length) {
            const novaOpcao = new Option(valor, valor, true, true);
            $campo.append(novaOpcao);
        } else {
            $campo.val(valor);
        }

        $campo.addClass('active');

        // 3. Atualiza os eventos e a interface do Select2
        $campo.trigger('change');

        $wrapper.addClass('active');
    });
}