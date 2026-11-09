import { escaparHtml, mostrarAcao, filtrarEOrdenarProjetos, inicializarCarrossel } from './1-utilitarios.js';
import { homeStats, HOME_CONFIANCA, HOME_PASSOS_APOIO, HOME_PERGUNTAS } from '../dados-falsos/7-home.js';
import { nav } from './24-roteador.js';
import { TAXA_PLATAFORMA_PERCENTUAL } from '../dados-falsos/12-config-prototipo.js';
import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';
import { renderizarCardsCampanha } from '../src/renderizadores/cartoes-campanha';
import { renderizarEstadoVazio } from '../src/renderizadores/estado-vazio';

const estadoFiltrosHome = {
    status: new Set(['em-captacao']),
    areas: new Set(),
    modelo: 'todos',
    ordenacao: 'recentes',
};

const COMUNIDADES_HOME = [
    { area: 'biologicas', rotulo: 'Ciências Biológicas', icone: 'fa-dna' },
    { area: 'exatas', rotulo: 'Exatas e Engenharias', icone: 'fa-atom' },
    { area: 'saude', rotulo: 'Ciências da Saúde', icone: 'fa-heart-pulse' },
    { area: 'humanas', rotulo: 'Ciências Humanas', icone: 'fa-people-group' },
];

function renderComunidades() {
    const container = document.getElementById('home-comunidades');
    if (!container) return;
    container.innerHTML = COMUNIDADES_HOME.map((c) => `
        <a href="#" onclick="navegarExplorarPorArea('${c.area}'); return false;" class="inline-flex items-center gap-3 fundo-cartao border borda-padrao rounded-full pl-2 pr-5 py-2 hover-borda-forte transition-colors">
            <span class="w-9 h-9 rounded-full fundo-marca-sutil texto-marca flex items-center justify-center shrink-0"><i class="fa-solid ${c.icone}"></i></span>
            <span class="font-bold text-sm texto-padrao">${escaparHtml(c.rotulo)}</span>
        </a>
    `).join('');
}

const estadoUltimosDias = {
    status: new Set(['em-captacao']),
    areas: new Set(),
    modelo: 'todos',
    ordenacao: 'prazo',
};

function renderUltimosDias() {
    const container = document.getElementById('home-ultimos-dias');
    if (!container) return;
    const visiveis = filtrarEOrdenarProjetos(PROJETOS_FALSOS, estadoUltimosDias).slice(0, 4);
    renderizarCardsProjeto(container, visiveis);
    inicializarCarrossel({
        wrapper: document.getElementById('ultimos-dias-carrossel'),
        trilho: container,
        anterior: document.getElementById('ultimos-dias-anterior'),
        proximo: document.getElementById('ultimos-dias-proximo'),
    });
}

const estadoEmBreve = {
    status: new Set(['em-breve']),
    areas: new Set(),
    modelo: 'todos',
    ordenacao: 'recentes',
};

function renderEmBreve() {
    const secao = document.getElementById('home-secao-em-breve');
    const container = document.getElementById('home-em-breve');
    if (!secao || !container) return;
    const visiveis = filtrarEOrdenarProjetos(PROJETOS_FALSOS, estadoEmBreve).slice(0, 4);
    secao.classList.toggle('hidden', visiveis.length === 0);
    renderizarCardsProjeto(container, visiveis);
    inicializarCarrossel({
        wrapper: document.getElementById('em-breve-carrossel'),
        trilho: container,
        anterior: document.getElementById('em-breve-anterior'),
        proximo: document.getElementById('em-breve-proximo'),
    });
}

function renderHomeStats() {
    const container = document.getElementById('home-stats');
    if (!container) return;
    container.innerHTML = homeStats.map(stat => `
        <div class="home-stat"><div class="numero numero--vitrine mb-2 ${stat.valueClass}">${escaparHtml(stat.value)}</div><div class="rotulo">${escaparHtml(stat.label)}</div></div>
    `).join('');
}

const projetosSeguidos = new Set();

export function alternarSeguirProjeto(evento, id) {
    evento.stopPropagation();
    const jaSegue = projetosSeguidos.has(id);
    if (jaSegue) {
        projetosSeguidos.delete(id);
    } else {
        projetosSeguidos.add(id);
    }
    const botao = evento.currentTarget;
    const agoraSegue = !jaSegue;
    botao.classList.toggle('botao-seguir--ativo', agoraSegue);
    botao.setAttribute('aria-pressed', String(agoraSegue));
    botao.setAttribute('aria-label', agoraSegue ? 'Deixar de seguir este projeto' : 'Seguir este projeto');
    const icone = botao.querySelector('i');
    icone.classList.toggle('fa-regular', !agoraSegue);
    icone.classList.toggle('fa-solid', agoraSegue);
    mostrarAcao(agoraSegue ? 'Você passou a seguir este projeto.' : 'Você deixou de seguir este projeto.');
}

export function renderizarCardsProjeto(container, projetos, opcoes = {}) {
    renderizarCardsCampanha(container, projetos, {
        ...opcoes,
        onAbrir: () => nav('campanha'),
        onAlternarSeguir: alternarSeguirProjeto,
    });
}

function renderFeaturedProjects() {
    const grade = document.getElementById('project-cards');
    const vazio = document.getElementById('home-projetos-vazio');
    const contagem = document.getElementById('home-contagem-projetos');
    if (!grade) return;

    const filtrados = filtrarEOrdenarProjetos(PROJETOS_FALSOS, estadoFiltrosHome);

    const visiveis = filtrados.slice(0, 8);

    if (contagem) {
        contagem.textContent = filtrados.length === visiveis.length
            ? `${filtrados.length} projeto${filtrados.length === 1 ? '' : 's'}`
            : `Mostrando ${visiveis.length} de ${filtrados.length} projetos`;
    }

    const carrossel = {
        wrapper: document.getElementById('em-alta-carrossel'),
        trilho: grade,
        anterior: document.getElementById('em-alta-anterior'),
        proximo: document.getElementById('em-alta-proximo'),
    };

    if (visiveis.length === 0) {
        renderizarCardsProjeto(grade, []);
        if (vazio) {
            vazio.classList.remove('hidden');

            renderizarEstadoVazio(vazio, {
                icone: 'fa-flask',
                titulo: 'Nenhum projeto em captação no momento.',
                texto: 'Volte em breve ou veja o catálogo completo no Explorar.',
            });
        }
        inicializarCarrossel(carrossel);
        return;
    }

    if (vazio) vazio.classList.add('hidden');
    renderizarCardsProjeto(grade, visiveis);
    inicializarCarrossel(carrossel);
}

function inicializarOrdenacaoHome() {
    const painel = document.getElementById('projetos');
    if (!painel || painel.dataset.ordenacaoInicializada) return;
    painel.dataset.ordenacaoInicializada = 'true';

    document.getElementById('home-ordenacao-destaque').addEventListener('change', (e) => {
        estadoFiltrosHome.ordenacao = e.target.value;
        renderFeaturedProjects();
    });
}

function renderSecoesHome() {
    const confianca = document.getElementById('home-confianca');
    if (!confianca) return;
    confianca.innerHTML = HOME_CONFIANCA.map((item) => `
        <div class="home-confianca__item">
            <span class="home-icone"><i class="${item.icone}"></i></span>
            <h3 class="ficha-catalogo__titulo">${escaparHtml(item.titulo)}</h3>
            <p class="legenda">${escaparHtml(item.texto)}</p>
        </div>
    `).join('');
    document.getElementById('home-passos').innerHTML = HOME_PASSOS_APOIO.map((passo, indice) => `
        <li class="home-passos__item">
            <span class="home-passos__numero">${indice + 1}</span>
            <div>
                <h3 class="ficha-catalogo__titulo">${escaparHtml(passo.titulo)}</h3>
                <p class="legenda">${escaparHtml(passo.texto)}</p>
            </div>
        </li>
    `).join('');
    document.getElementById('home-perguntas').innerHTML = HOME_PERGUNTAS.map((item) => `
        <details class="home-perguntas__item">
            <summary class="home-perguntas__pergunta">${escaparHtml(item.pergunta)}<i class="fa-solid fa-plus" aria-hidden="true"></i></summary>
            <p class="paragrafo texto-padrao">${escaparHtml(item.resposta(TAXA_PLATAFORMA_PERCENTUAL))}</p>
        </details>
    `).join('');
}

export function verTodasPerguntas() {
    nav('como-funciona');
    setTimeout(() => document.getElementById('perguntas-frequentes')?.scrollIntoView({ behavior: 'smooth' }), 400);
}

export function renderHomeContent() {
    renderSecoesHome();
    renderComunidades();
    renderHomeStats();
    inicializarOrdenacaoHome();
    renderFeaturedProjects();
    renderUltimosDias();
    renderEmBreve();
}
