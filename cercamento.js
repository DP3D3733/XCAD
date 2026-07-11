const configurarMonitoramentoInterval = setInterval(() => {
    const dropdownTipoMonitoramento = document.querySelector('cercamento-menu p-dropdown[optionlabel="nome"]');
    if (!dropdownTipoMonitoramento) return;

    if (document.querySelector('#pr_id_2_label').innerText != 'Outros') setDropdownValue('Outros', dropdownTipoMonitoramento);

    const dropdownTipoAlerta = document.querySelector('cercamento-menu-facial p-dropdown[optionlabel="nome"]');
    if (!dropdownTipoAlerta) return;

    const labelDropDownTipoAlerta = document.querySelector('#pr_id_17_label');
    if (!labelDropDownTipoAlerta) return;

    if (labelDropDownTipoAlerta.innerText != 'Todos (sem filtro)') setDropdownValue('Todos (sem filtro)', dropdownTipoAlerta);

    iniciarEscutaNovosAlertas();
    clearInterval(configurarMonitoramentoInterval);
}, 1000);

function setDropdownValue(label, dropdown) {
    if (window.ng?.getComponent) {
        const comp = ng.getComponent(dropdown);

        if (comp?.onModelChange) {
            comp.onModelChange(label);
            comp.writeValue(label);
            return;
        }
    }

    // fallback DOM
    dropdown.querySelector(".p-dropdown-label").click();

    setTimeout(() => {
        [...document.querySelectorAll(".p-dropdown-item")]
            .find(x => x.textContent.trim() === label)
            ?.click();
    }, 200);
}

function iniciarEscutaNovosAlertas() {
    const timestampInicial = new Date().getTime();

    const a = setInterval(() => {
        const novoAlerta = verificarNovoAlerta(timestampInicial);
    }, 1000);
}

function verificarNovoAlerta(timestamp) {
    const novoAlertaBotaoConfirmacao = document.querySelector('[styleclass="botao-confirmacao"]');
    if (!novoAlertaBotaoConfirmacao) return false;

    const novoAlerta = novoAlertaBotaoConfirmacao.closest('div[class="m-2 align-content-end ng-star-inserted"]');
    if (!novoAlerta) return false;

    const dataHoraNovoAlerta = novoAlerta.querySelector('[title=matricula]').nextElementSibling.innerText;
    const [d, m, y] = dataHoraNovoAlerta.split(" ")[0].split("-");
    const [h, min, s] = dataHoraNovoAlerta.split(" ")[1].split(":");

    const timestampNovoAlerta = new Date(y, m - 1, d, h, min, s).getTime();
    if (timestampNovoAlerta <= timestamp) return false;

    const dados = Array.from(novoAlerta.querySelectorAll('div')).map(div => div.innerText);
    const endereco = dados[2];
    const model = {
        createJanitorial: false,
        systemUpdate: null,
        start: dataHoraNovoAlerta.replaceAll('-', '/'),
        attendanceLinked: {},
        contactName: null,
        contactPhone: null,
        nature: "Averiguação de Disparo de Alarme",
        channel: "Cercamento",
        statusName: "ABERTO",
        status: true,
        anonymous: false,
        transcription: dados[5],
        factDistrict: "RS",
        sectors: [],
        attachment: []
    };

    window.postMessage({ type: "novoAlertaCercamento", data: model, endereco: endereco }, "*");
    return true;

}







