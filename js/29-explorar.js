import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';
import { renderizarCardsProjeto } from './18-home.js';
import { filtrarEOrdenarProjetos, renderizarCabecalhoPagina } from './1-utilitarios.js';
import { nav } from './24-roteador.js';
import { renderizarFiltrosConhecimento } from '../src/renderizadores/explorar-filtros';
import { renderizarEstadoVazio } from '../src/renderizadores/estado-vazio';
import { MaisResultados } from '../src/components/pagination/mais-resultados';
import { BarraBusca } from '../src/components/search/barra-busca';
import {
  CODIGOS_GRANDES_POR_AREA_LEGADA,
  obterSubareas,
  ROTULOS_AREA_POR_CODIGO,
} from '../src/data/areas-conhecimento';

const ITENS_POR_PAGINA = 9;
const raizesReact = new WeakMap();

const ROTULOS_STATUS = { 'em-captacao': 'Em captação', 'em-breve': 'Em breve', financiada: 'Financiados' };
const ROTULOS_MODELO = { 'tudo-ou-nada': 'Tudo ou Nada', flexivel: 'Flexível' };

const estado = {
  busca: '',
  status: 'todos',
  grandesAreas: new Set(),
  subareas: new Set(),
  modelo: 'todos',
  ordenacao: 'recentes',
  visiveis: ITENS_POR_PAGINA,
};

function projetosFiltrados() {
  return filtrarEOrdenarProjetos(PROJETOS_FALSOS, estado);
}

function contarFiltrosAtivos() {
  let n = 0;
  if (estado.busca.trim()) n += 1;
  if (estado.status !== 'todos') n += 1;
  n += estado.grandesAreas.size + estado.subareas.size;
  if (estado.modelo !== 'todos') n += 1;
  return n;
}

function atualizarGrandesAreas(values) {
  estado.grandesAreas = new Set(values);
  const subareasDisponiveis = new Set(obterSubareas(values).map((subarea) => subarea.value));
  estado.subareas = new Set([...estado.subareas].filter((subarea) => subareasDisponiveis.has(subarea)));
  estado.visiveis = ITENS_POR_PAGINA;
  renderizarResultados();
}

function atualizarSubareas(values) {
  estado.subareas = new Set(values);
  estado.visiveis = ITENS_POR_PAGINA;
  renderizarResultados();
}

function renderizarFiltrosAreasConhecimento() {
  renderizarFiltrosConhecimento(document.getElementById('explorar-filtros-conhecimento'), {
    grandesAreasSelecionadas: [...estado.grandesAreas],
    subareasSelecionadas: [...estado.subareas],
    aoAlterarGrandesAreas: atualizarGrandesAreas,
    aoAlterarSubareas: atualizarSubareas,
  });
}

function renderizarFichasFiltros() {
  const container = document.getElementById('explorar-fichas-filtros');
  if (!container) return;
  const fichas = [];

  if (estado.busca.trim()) {
    fichas.push({ rotulo: `"${estado.busca.trim()}"`, limpar: () => { estado.busca = ''; document.getElementById('explorar-busca').value = ''; } });
  }
  if (estado.status !== 'todos') {
    fichas.push({ rotulo: ROTULOS_STATUS[estado.status], limpar: () => {
      estado.status = 'todos';
      document.querySelector('input[name="explorar-status"][value="todos"]').checked = true;
    } });
  }
  estado.grandesAreas.forEach((area) => {
    fichas.push({ rotulo: ROTULOS_AREA_POR_CODIGO.get(area), limpar: () => {
      atualizarGrandesAreas([...estado.grandesAreas].filter((selecionada) => selecionada !== area));
    } });
  });
  estado.subareas.forEach((subarea) => {
    fichas.push({ rotulo: ROTULOS_AREA_POR_CODIGO.get(subarea), limpar: () => {
      atualizarSubareas([...estado.subareas].filter((selecionada) => selecionada !== subarea));
    } });
  });
  if (estado.modelo !== 'todos') {
    fichas.push({ rotulo: ROTULOS_MODELO[estado.modelo], limpar: () => {
      estado.modelo = 'todos';
      document.querySelector('input[name="explorar-modelo"][value="todos"]').checked = true;
    } });
  }

  container.innerHTML = fichas.map((ficha, indice) => `
    <button type="button" data-ficha="${indice}" class="inline-flex items-center gap-1.5 fundo-realce texto-padrao text-xs font-bold px-3 py-1.5 rounded-full hover-fundo-sutil transition-colors">
      ${ficha.rotulo} <span aria-hidden="true">&times;</span>
    </button>
  `).join('');

  container.querySelectorAll('[data-ficha]').forEach((botao, indice) => {
    botao.addEventListener('click', () => {
      fichas[indice].limpar();
      estado.visiveis = ITENS_POR_PAGINA;
      renderizarResultados();
    });
  });
}

function renderizarResultados() {
  const grade = document.getElementById('explorar-grade');
  const vazio = document.getElementById('explorar-vazio');
  const contagem = document.getElementById('explorar-contagem');
  const paginacao = document.getElementById('explorar-paginacao');
  if (!grade) return;

  renderizarFiltrosAreasConhecimento();
  const filtrados = projetosFiltrados();
  const totalAtivos = contarFiltrosAtivos();
  contagem.textContent = totalAtivos > 0
    ? `${filtrados.length} projeto${filtrados.length === 1 ? '' : 's'} · ${totalAtivos} filtro${totalAtivos === 1 ? '' : 's'} ativo${totalAtivos === 1 ? '' : 's'}`
    : `${filtrados.length} projeto${filtrados.length === 1 ? '' : 's'} em captação`;

  renderizarFichasFiltros();

  if (filtrados.length === 0) {
    renderizarCardsProjeto(grade, []);
    renderizarReact(paginacao, null);
    vazio.classList.remove('hidden');
    renderizarEstadoVazio(vazio, {
      icone: 'fa-magnifying-glass',
      titulo: 'Nenhum projeto com esses filtros.',
      texto: 'Tente ampliar a área ou o status.',
      acao: createElement('button', {
        type: 'button',
        id: 'explorar-vazio-limpar',
        className: 'btn btn-primary',
        onClick: limparTodosFiltros,
        children: 'Limpar filtros',
      }),
    });
    return;
  }

  vazio.classList.add('hidden');
  const visiveis = filtrados.slice(0, estado.visiveis);
  renderizarCardsProjeto(grade, visiveis);

  if (filtrados.length > estado.visiveis) {
    renderizarReact(paginacao, createElement(MaisResultados, {
      mostrando: visiveis.length,
      total: filtrados.length,
      idBotao: 'explorar-mostrar-mais',
      aoClicar: () => {
      estado.visiveis += ITENS_POR_PAGINA;
      renderizarResultados();
      },
    }));
  } else {
    renderizarReact(paginacao, null);
  }
}

function obterRaizReact(container) {
  let raiz = raizesReact.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizesReact.set(container, raiz);
  }
  return raiz;
}

function renderizarReact(container, elemento) {
  const raiz = obterRaizReact(container);
  flushSync(() => raiz.render(elemento));
}

export function definirFiltroAreaExplorar(area) {
  estado.grandesAreas = new Set(CODIGOS_GRANDES_POR_AREA_LEGADA[area] ?? []);
  estado.subareas.clear();
  estado.visiveis = ITENS_POR_PAGINA;
  renderizarResultados();
}

export function navegarExplorarPorArea(area) {
  definirFiltroAreaExplorar(area);
  nav('explorar');
}

function limparTodosFiltros() {
  estado.busca = '';
  estado.status = 'todos';
  estado.grandesAreas.clear();
  estado.subareas.clear();
  estado.modelo = 'todos';
  estado.visiveis = ITENS_POR_PAGINA;
  document.getElementById('explorar-busca').value = '';
  document.querySelector('input[name="explorar-status"][value="todos"]').checked = true;
  document.querySelector('input[name="explorar-modelo"][value="todos"]').checked = true;
  renderizarResultados();
}

export function renderizarTelaExplorar() {
  const container = document.getElementById('view-explorar');
  if (!container || container.dataset.inicializado) {
    renderizarResultados();
    return;
  }
  container.dataset.inicializado = 'true';
  const busca = document.getElementById('explorar-barra-busca');
  if (!busca) throw new Error('Contêiner da busca em Explorar não encontrado.');
  renderizarReact(busca, createElement(BarraBusca, {
    id: 'explorar-busca',
    rotulo: 'Buscar por título, pesquisador ou instituição',
    placeholder: 'Buscar por título, pesquisador ou instituição...',
    className: 'w-full',
  }));
  renderizarCabecalhoPagina('cabecalho-pagina-explorar', {
    migalhas: [{ rotulo: 'Explorar' }],
    titulo: 'Explorar projetos',
    descricao: 'Encontre projetos de pesquisa e acompanhe campanhas de diferentes áreas do conhecimento.',
  });

  document.getElementById('explorar-busca').addEventListener('input', (evento) => {
    estado.busca = evento.target.value;
    estado.visiveis = ITENS_POR_PAGINA;
    renderizarResultados();
  });

  document.querySelectorAll('input[name="explorar-status"]').forEach((campo) => {
    campo.addEventListener('change', () => {
      estado.status = campo.value;
      estado.visiveis = ITENS_POR_PAGINA;
      renderizarResultados();
    });
  });

  document.querySelectorAll('input[name="explorar-modelo"]').forEach((campo) => {
    campo.addEventListener('change', () => {
      estado.modelo = campo.value;
      estado.visiveis = ITENS_POR_PAGINA;
      renderizarResultados();
    });
  });

  document.getElementById('explorar-ordenacao').addEventListener('change', (evento) => {
    estado.ordenacao = evento.target.value;
    renderizarResultados();
  });

  document.getElementById('explorar-limpar-filtros').addEventListener('click', limparTodosFiltros);

  const botaoGrade = document.getElementById('explorar-modo-grade');
  const botaoLista = document.getElementById('explorar-modo-lista');
  const grade = document.getElementById('explorar-grade');
  botaoGrade?.addEventListener('click', () => {
    grade.classList.remove('explorar-grade--lista');
    botaoGrade.classList.add('fundo-realce', 'texto-forte');
    botaoGrade.classList.remove('texto-fraco');
    botaoLista.classList.remove('fundo-realce', 'texto-forte');
    botaoLista.classList.add('texto-fraco');
    botaoGrade.setAttribute('aria-pressed', 'true');
    botaoLista.setAttribute('aria-pressed', 'false');
  });
  botaoLista?.addEventListener('click', () => {
    grade.classList.add('explorar-grade--lista');
    botaoLista.classList.add('fundo-realce', 'texto-forte');
    botaoLista.classList.remove('texto-fraco');
    botaoGrade.classList.remove('fundo-realce', 'texto-forte');
    botaoGrade.classList.add('texto-fraco');
    botaoLista.setAttribute('aria-pressed', 'true');
    botaoGrade.setAttribute('aria-pressed', 'false');
  });

  renderizarResultados();
}
