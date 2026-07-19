let inserindoHorario = false;
setInterval(() => {
    if (inserindoHorario) return;
    const horarioDados = localStorage.getItem('inserirHorariosDespacho'); //inicio, 13/07/2026 08:20
    if (!horarioDados) return;
    inserindoHorario = true;

    const [qualHorario, horario] = horarioDados.split(',');
    const qualCampo = {
        início: '[name="myModel.start"],[name="myModel.goingDate"]',
        chegada: '[name="myModel.arrivalDate"]',
        término: '[name="myModel.end"]'
    }

    document.querySelectorAll(qualCampo[qualHorario]).forEach(input => {
        input.value = horario;
        input.dispatchEvent(
            new Event('change', {
                bubbles: true
            }));
    });
    document.querySelector('#btnSubmitAndNewHome').click();
    localStorage.removeItem('inserirHorariosDespacho');
    inserindoHorario = false;
}, 100);