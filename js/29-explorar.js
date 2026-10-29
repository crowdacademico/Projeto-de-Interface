import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';
import { htmlCardProjeto } from './18-home.js';
import { htmlEstadoVazio, filtrarEOrdenarProjetos } from './1-utilitarios.js';
import { nav } from './24-roteador.js';

const ITENS_POR_PAGINA = 9;

const ROTULOS_AREA = {
  biologicas: 'Ciências Biológicas',
  exatas: 'Exatas e Engenharias',
  saude: 'Ciências da Saúde',
  humanas: 'Ciências Humanas',
};
const ROTULOS_STATUS = { 'em-captacao': 'Em captação', 'em-breve': 'Em breve', financiada: 'Financiados' };
const ROTULOS_MODELO = { 'tudo-ou-nada': 'Tudo ou Nada', flexivel: 'Flexível' };

const estado = {
  busca: '',
  status: 'todos',
  areas: new Set(),
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
  n += estado.areas.size;
  if (estado.modelo !== 'todos') n += 1;
  return n;
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
  estado.areas.forEach((area) => {
    fichas.push({ rotulo: ROTULOS_AREA[area], limpar: () => {
      estado.areas.delete(area);
      const campo = document.querySelector(`.explorar-checkbox-area[value="${area}"]`);
      if (campo) campo.checked = false;
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

  const filtrados = projetosFiltrados();
  const totalAtivos = contarFiltrosAtivos();
  contagem.textContent = totalAtivos > 0
    ? `${filtrados.length} projeto${filtrados.length === 1 ? '' : 's'} · ${totalAtivos} filtro${totalAtivos === 1 ? '' : 's'} ativo${totalAtivos === 1 ? '' : 's'}`
    : `${filtrados.length} projeto${filtrados.length === 1 ? '' : 's'} em captação`;

  renderizarFichasFiltros();

  if (filtrados.length === 0) {
    grade.innerHTML = '';
    paginacao.innerHTML = '';
    vazio.classList.remove('hidden');
    vazio.innerHTML = htmlEstadoVazio({
      icone: 'fa-magnifying-glass',
      titulo: 'Nenhum projeto com esses filtros.',
      mensagem: 'Tente ampliar a área ou o status.',
      acaoHtml: '<button type="button" id="explorar-vazio-limpar" class="btn btn-primary">Limpar filtros</button>',
    });
    document.getElementById('explorar-vazio-limpar').addEventListener('click', limparTodosFiltros);
    return;
  }

  vazio.classList.add('hidden');
  const visiveis = filtrados.slice(0, estado.visiveis);
  grade.innerHTML = visiveis.map(htmlCardProjeto).join('');

  if (filtrados.length > estado.visiveis) {
    paginacao.innerHTML = `
      <p class="texto-fraco text-sm mb-3">Mostrando ${visiveis.length} de ${filtrados.length}</p>
      <button type="button" id="explorar-mostrar-mais" class="btn btn-secondary">Mostrar mais</button>
    `;
    document.getElementById('explorar-mostrar-mais').addEventListener('click', () => {
      estado.visiveis += ITENS_POR_PAGINA;
      renderizarResultados();
    });
  } else {
    paginacao.innerHTML = '';
  }
}

export function definirFiltroAreaExplorar(area) {
  estado.areas = new Set([area]);
  estado.visiveis = ITENS_POR_PAGINA;
  document.querySelectorAll('.explorar-checkbox-area').forEach((campo) => {
    campo.checked = campo.value === area;
  });
  renderizarResultados();
}

export function navegarExplorarPorArea(area) {
  definirFiltroAreaExplorar(area);
  nav('explorar');
}

function limparTodosFiltros() {
  estado.busca = '';
  estado.status = 'todos';
  estado.areas.clear();
  estado.modelo = 'todos';
  estado.visiveis = ITENS_POR_PAGINA;
  document.getElementById('explorar-busca').value = '';
  document.querySelector('input[name="explorar-status"][value="todos"]').checked = true;
  document.querySelector('input[name="explorar-modelo"][value="todos"]').checked = true;
  document.querySelectorAll('.explorar-checkbox-area').forEach((c) => { c.checked = false; });
  renderizarResultados();
}

export function renderizarTelaExplorar() {
  const container = document.getElementById('view-explorar');
  if (!container || container.dataset.inicializado) {
    renderizarResultados();
    return;
  }
  container.dataset.inicializado = 'true';

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

  document.querySelectorAll('.explorar-checkbox-area').forEach((campo) => {
    campo.addEventListener('change', () => {
      if (campo.checked) estado.areas.add(campo.value);
      else estado.areas.delete(campo.value);
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
