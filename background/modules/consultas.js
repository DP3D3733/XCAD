async function buscarConsulta(dados) {
    //const cpf = dados.cpf; //primeiro consulta pelo CPF, caso não ache, consulta por Nome, Mãe e Nascimento
    const cpf = '04291480032';
    const respCPF = await fetch(
        `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?TR=on&N_cpf=${cpf}&acao=cpf`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    let html = await respCPF.text();
    console.log(html);
    if (html.includes('value="login"')) return abrirAbaConsultas();
    if (html.includes('*CPF inv')) return false;

    if (html.includes('N�o existe indiv�duo com os crit�rios informados!</td>')) {
        const nome = dados.nome.replaceAll(' ', '+');
        const mae = dados.mae.replaceAll(' ', '+');
        const nascimento = dados.nascimento.replaceAll('/', '%2F');
        const respNome = await fetch(
            `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Lista_Nomes_NEW.jsp?TR=on&A66_nome=${nome}&A33_pai=&A33_mae=${mae}&A10_dn1=${nascimento}&A10_dn2=&acao=nome`,
            {
                method: "GET",
                credentials: "include"
            }

        );
        html = await respNome.text();
        if (html.includes('value="login"')) return abrirAbaConsultas();
        if (!html.includes("parent.oAcoes.escreveSubTitulo(' - Recuperou <b>")) return false;
        console.log(html);
    }

    const resultado = {};

    const nome = html.match(
        /<a href='\+ urlpesq \+'>([^<]+)<\/a>/
    );

    const filiacao = html.match(
        /<\/a>","([^"]+)"/
    );

    const sexo = html.match(
        /","([^"]+)","(\d{2}\/\d{2}\/\d{4})","([^"]+)"/
    );

    if (nome) {
        resultado.nome = nome[1].trim();
    }

    if (filiacao) {
        resultado.filiacao = filiacao[1]
            .replace(/<br>/gi, " ")
            .replace(/&nbsp;/gi, " ")
            .replace(/\s+/g, " ")
            .trim()
            .split(" ");
    }

    if (sexo) {
        resultado.sexo = sexo[1].trim();
        resultado.dataNascimento = sexo[2].trim();
        resultado.cpf = sexo[3]
            .replace(/\D/g, "");
    }

    // RG
    const rg = html.match(
        /N10_rg=(\d+)/
    );

    if (rg) {
        resultado.rg = rg[1];
    }

    // IG
    const ig = html.match(
        /N8_ig=(\d+)/
    );

    if (ig) {
        resultado.ig = ig[1];
    }

    console.log(resultado);
/*{
    "filiacao": [
        "MARCOS",
        "ANTONIO",
        "BERTOLINI",
        "RODRIGUES",
        "JAQUELINE",
        "PIRES",
        "DELGADO",
        "RODRIGUES"
    ],
    "sexo": "Feminino",
    "dataNascimento": "01/03/1997",
    "cpf": "6124493955",
    "rg": "6124493955",
    "ig": "13683719"
} */

}

async function buscarDadosBasicos(rg, cpf, ig, nome) {
    const resp = await fetch(
        `https://www.consultasintegradas.rs.gov.br/csi/csi/INTERFACE/jsp/Individuo_Consulta_DadosBasicos_NEW.jsp?N1_tp_cons_rgig=1&N10_rg=${rg}&N_cpf=&N_rgCpf=${cpf}&N8_ig=${ig}&A1_cond=N&A1_ocor=S&A1_pp=S&A66=${nome.replaceAll(' ','%20')}&N4_nropag=1`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    let html = await resp.text();
    console.log(html);
}

//buscarConsulta();

function abrirAbaConsultas() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const targetTab = tabs.find(tab => tab.title.includes('CSI - Consultas'));
        if (targetTab) {
            chrome.tabs.update(targetTab.id, { active: true }, () => {
                chrome.tabs.reload(targetTab.id); // Recarrega a aba após ativá-la
            });
        } else {
            chrome.tabs.create({ url: "https://www.consultasintegradas.rs.gov.br/csi/index.jsp" });
        }
    });
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action == "consultarIndividuo") {
        const dados = await buscarConsulta(message.dados);


        return true;
    }
});