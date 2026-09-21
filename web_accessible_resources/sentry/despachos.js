baixarIDsDespachosPendentes();
function baixarIDsDespachosPendentes() {
    const params = new URLSearchParams(window.location.search);
    const pendentes = params.get("pendentes");
    if (!pendentes) return;
    filtrarTabela(pendentes.split('_'));
}

function filtrarTabela(despachosId) {
    if (!table) return;
    const filtrados = table.getData().filter(r => despachosId.includes(r.id));
    table.setData(filtrados);
}