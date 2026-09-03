# XCAD GCM-POA

Extensão voltada para automatizar tarefas de diversos sistemas utilizados pela GCM-POA


## Sistemas alcançados

* **Sinesp CAD:** Criação de chamados pré-preenchidos, modelos de relatos e personalização de telas.
* **Consultas Integradas:** Fluxo de consulta automatizado e criação de formulário de resposta resumido.
* **Sentry:** Criação de chamados pré-preenchidos, assistente de correção de boletins, inserção de atividade programadas.



## Como Instalar

### Via Loja Oficial
* [Link para a Chrome Web Store](https://chromewebstore.google.com/detail/fdbjciigbhgllkgplmhmpilgigkdeghg?utm_source=item-share-cb)

### Instalação Manual (Modo Desenvolvedor)
1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/DP3D3733/XCAD.git
2. Abra o navegador e acesse a página de extensões:

    - Chrome: chrome://extensions/

3. Ative o Modo do desenvolvedor (no canto superior direito).

4. Clique em Carregar sem compactação (Load unpacked) e selecione a pasta da extensão.

## Tecnologias Utilizadas
- HTML5 / CSS3 / JavaScript
- Manifest V3

## Estrutura
<details>
<summary><b>Ver estrutura de arquivos:</b></summary>

```text
XCAD/
├── assets/                     # Assets utilizados
│   └── icon.png
|
├── popup/                      # Interface de ativação/desativação de scripts
│   ├── popup.html
│   └── popup.js
|
├── background/                 # Scripts em background
│   ├── background.js               # Service Worker
│   └── modules/                    # Módulos de background
│       └── consultas.js                # Fluxo de Consultas Integradas
|
├── content/                    # Scripts da camada de janela
│   ├── content.js                  # Gerencia a injeção de scripts
│   ├── cercamento/                 # Cercamento Eletrônico
│   |   └── loginAutoProcempa.js 
│   |       
│   ├── consultas/                  # Consultas Integradas
│   |   ├── abas_acoes.js               # Acessa os botões nas abas
│   |   ├── cnj.js                      # Recebe e consulta o mandado
│   |   ├── dados_basicos.js            # Lê os dados básicos
│   |   ├── img.js                      # Busca a foto do indiv. e monta a resposta
│   |   ├── inicio.js                   # Pula a tela inicial e retorna ao infoseg
│   |   ├── menu_lateral.js             # Acessa os botões do menu
│   |   ├── ocorrencias.js              # Lê os dados de ocorrências
│   |   ├── pega_nome.js                # Seleciona o indivíduo correto na lista
│   |   ├── pesquisa_nome.js            # Pesquisa o indivíduo
│   |   └── veiculos.js                 # Lê e monta a resposta
│   |   
│   ├── psg_servico/                # Forms de Pass. de Sv do Ch. da Sala
│   |   └── formulario_psg_gs.js        # Preench. rápido e rel. antes de enviar
│   |   
│   ├── sinesp/                     # Sinesp CAD e Infoseg
│   |   ├── discover.js                 # Ajuste em algumas informações
│   |   ├── edicao.js                   # Col. de dados do Sentry e rel. padr.
│   |   ├── equipes.js                  # Preench. rápido de equipes e relatório
│   |   ├── infoseg.js                  # Busca, recebe e monta a resp. consultas
│   |   └── ocorrencias.js              # Funções no CAD Ocorrências
│   |   
│   ├── whatsapp/                   # WhatsApp Web
│   |   └── whatsapp.js    
│   |   
│   └── whu/                        # WHU
│       └── whu.js                      # Notificação de novos chamados
|
├── libs/                       # Bibliotecas externas
│   ├── firebase-app-compat.js      
│   ├── firebase-firestore-compat.js
│   ├── jszip.js
│   └── versiculos.json
|
├── web_accessible_resources/   # Scripts injetados na página
│   ├── atendimento.js              # Sentry - Modelos na pág. de atendimento
│   ├── ba.js                       # Sentry - Assist. Corr. BA
│   ├── cad.js                      # Sentry - Tela do CAD
│   ├── despacho.js                 # Sentry - Copiar Desp. P/ CAD e Ajuste de Hor.
│   ├── despachos.js                # Sentry - Cópia de info padronizadas
│   ├── efetivo.js                  # Sentry - Coleta de efetivo atualizado
│   ├── guarnicoes.js               # Sentry - Cópia de info padronizadas
│   ├── individuo.js                # Sentry - Preench. rápido
│   ├── os.js                       # Sentry - Preench. rápido atividades prog.
│   ├── relatorioPrometa.js         # Sentry - Rel. personalizado
│   └── sentry.js                   # Sentry - Inserção funções compartilhadas
|
└── manifest.json               # Configuração da extensão
```
</details>

## Funções
### Sentry
<details>
<summary>Atualizar Efetivo no Firestore</summary>

1. Usuário faz login no Sentry
2. A função atualizarEfetivo() em sentry.js baixa o efetivo atualizado e envia ao  Firestore via Background

```mermaid
graph LR
    subgraph Secao1[web_accessible_resources/sentry.js]
        A("atualizarEfetivo()")
    end

    subgraph Secao2[background/background.js]
        B(message.action == 'atualizar_efetivo')
    end

    subgraph Secao3[Banco de Dados]
        C(Gravação do Efetivo)
    end

    A --> B --> C
```
</details>

<details>
<summary>Buscar OS</summary>

1. Usuário acessa a tela da Central de Atendimento e Despacho do Sentry
2. A função `criarBotaoVisualizarOS()`:
    <ol type="a">
        <li>Cria o botão que exibe o modal da Ordem de Serviço</li>
        <li>Cria o modal propriamente dito</li>
        <li>Chama a função <code>criarTabelaOS()</code> que cria a tabela que receberá as demandas</li>
        <li>Popula o seletor de números de OS com <code>buscarNumerosOSCadastradas()</code></li>
    </ol>
3. O usuário clica no botão criado pela função `criarBotaoVisualizarOS()` e seleciona uma OS no seletor
3. A função `montarOS(numOS)` recebe o número da OS que o usuário selecionou e:
    <ol type="a">
        <li>Busca a lista de atividades programadas com <code>buscarOS(numOS)</code></li>
        <li>Detalha cada atividade programada com <code>buscarAtividadeProgramada(id)</code></li>
        <li>Busca a lista de guarnições ativas com <code>buscarGuarnicoes(dataInicial, DataFinal)</code></li>
        <li>Verifica quais guarnições assumiram/cumpriram cada demanda com <code>buscarGuarnicoes(dataInicial, DataFinal)</code></li>
        <li>Insere as demandas já com as informação de cumprimento na tabela de OS</li>
    </ol>

```mermaid
graph LR
    subgraph Secao1[web_accessible_resources/cad.js]
        A("criarBotaoVisualizarOS()")
        B("criarTabelaOS()")
        C("buscarNumerosOSCadastradas()")
    end

    A --> B --> C
```
```mermaid
graph LR
    subgraph Secao1[web_accessible_resources/cad.js]
        A("montarOS(numOS)")
        B("buscarOS(numOS)")
        C("buscarAtividadeProgramada(id)")
        D("buscarGuarnicoes(dataInicial, DataFinal)")
    end

    A --> B --> C --> D
```
</details>

