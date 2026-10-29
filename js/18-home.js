import { escaparHtml, mostrarAcao, htmlEscalaProgresso, htmlEstadoVazio, filtrarEOrdenarProjetos, inicializarCarrossel } from './1-utilitarios.js';
import { homeStats, HOME_CONFIANCA, HOME_PASSOS_APOIO, HOME_PERGUNTAS } from '../dados-falsos/7-home.js';
import { nav } from './24-roteador.js';
import { TAXA_PLATAFORMA_PERCENTUAL } from '../dados-falsos/12-config-prototipo.js';
import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';

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
    container.innerHTML = visiveis.map(htmlCardProjeto).join('');
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
    container.innerHTML = visiveis.map(htmlCardProjeto).join('');
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

export function htmlCardProjeto(project) {
    const emBreve = project.status === 'em-breve';
    const segueEsteProjeto = projetosSeguidos.has(project.id);
    return `
        <div onclick="nav('campanha')" class="fundo-cartao rounded-xl border borda-padrao overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col group h-full hover:-translate-y-1">
            <div class="h-24 relative overflow-hidden bg-[var(--cor-tinta-900)]">
                <img src="${project.image}" alt="${escaparHtml(project.title)}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:saturate-125 group-hover:opacity-100 transition-all duration-700">
                <button type="button" onclick="alternarSeguirProjeto(event, ${project.id})" aria-pressed="${segueEsteProjeto}" aria-label="${segueEsteProjeto ? 'Deixar de seguir este projeto' : 'Seguir este projeto'}" class="botao-seguir ${segueEsteProjeto ? 'botao-seguir--ativo' : ''}">
                    <i class="${segueEsteProjeto ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <span class="absolute top-3 right-3 badge-flutuante backdrop-blur-sm ${project.badgeClasses} microrrotulo px-3 py-1.5 rounded-full border-2">${escaparHtml(project.badge)}</span>
                <div class="escala-bar-cientifica">${escaparHtml(project.institution)}</div>
            </div>
            <div class="p-4 flex-1 flex flex-col">
                <span class="microrrotulo texto-fraco mb-1.5 block">${escaparHtml(project.institution)} · ${escaparHtml(project.uf)}</span>
                <h3 class="subtitulo texto-forte leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">${escaparHtml(project.title)}</h3>
                <p class="legenda mb-3 line-clamp-1">${escaparHtml(project.description)}</p>
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center legenda font-bold border ${project.avatarClasses}">${escaparHtml(project.avatar)}</div>
                    <div>
                        <div class="text-corpo-pequeno font-bold texto-padrao flex items-center gap-1">${escaparHtml(project.researcher)} <i class="fa-solid fa-circle-check text-primary text-microrrotulo"></i></div>
                        <div class="legenda">${escaparHtml(project.category)}</div>
                    </div>
                </div>
                <div class="mt-auto">
                    ${emBreve ? `
                        <div class="flex items-center gap-3 rounded-lg fundo-institucional-sutil texto-institucional p-3">
                            <i class="fa-regular fa-clock text-lg shrink-0"></i>
                            <div class="min-w-0">
                                <span class="font-bold text-sm block">Início em ${project.diasParaInicio} dia${project.diasParaInicio === 1 ? '' : 's'}</span>
                                <span class="paragrafo-denso">Meta: R$ ${project.meta.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                    ` : `
                        <div class="flex justify-between items-end mb-1.5">
                            <span class="numero numero--kpi texto-forte">${escaparHtml(project.value)}</span>
                            <span class="paragrafo-denso texto-fraco">${escaparHtml(project.progressLabel)}</span>
                        </div>
                        <div class="mb-3">
                            ${htmlEscalaProgresso({ percentual: (project.valorArrecadado / project.meta) * 100, valorAtual: project.value, valorMeta: `R$ ${project.meta.toLocaleString('pt-BR')}`, modelo: project.modelo, compacta: true })}
                        </div>
                        <div class="flex justify-between items-center legenda">
                            <span class="fundo-realce px-2 py-1 rounded-md"><i class="fa-solid fa-users mr-1"></i> ${escaparHtml(project.supportLabel)}</span>
                            <span class="fundo-realce px-2 py-1 rounded-md"><i class="fa-regular fa-clock mr-1"></i> ${escaparHtml(project.timeLabel)}</span>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
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
        grade.innerHTML = '';
        if (vazio) {
            vazio.classList.remove('hidden');

            vazio.innerHTML = htmlEstadoVazio({
                icone: 'fa-flask',
                titulo: 'Nenhum projeto em captação no momento.',
                mensagem: 'Volte em breve ou veja o catálogo completo no Explorar.',
            });
        }
        inicializarCarrossel(carrossel);
        return;
    }

    if (vazio) vazio.classList.add('hidden');
    grade.innerHTML = visiveis.map(htmlCardProjeto).join('');
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
