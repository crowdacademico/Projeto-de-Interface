// Filtro de grande área / subárea do conhecimento, em JavaScript puro.
// Baseado no GrupoFiltroExpansivel e no FiltrosConhecimento da Alexia (branch main), sem React.
//
// Cada grupo é um bloco que abre e fecha, com busca, caixas de seleção e "fichas" das opções marcadas.
// O estado de abrir/fechar e o texto da busca ficam no próprio grupo; quem usa só diz quais opções
// existem e quais estão marcadas (atualizar) e é avisado quando o usuário muda a seleção (aoAlterar).
import { escaparHtml } from './1-utilitarios.js';
import { GRANDES_AREAS_CONHECIMENTO, obterSubareas } from '../dados-falsos/29-areas-conhecimento.js';

let contador = 0;

function normalizarTexto(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function criarGrupoFiltroExpansivel(container, { titulo, aoAlterar, mensagemDesabilitado = '' }) {
  const id = `filtro-grupo-${++contador}`;
  const estado = { opcoes: [], selecionados: [], desabilitado: false, expandido: false, busca: '' };

  container.innerHTML = `
    <section class="relative rounded-lg border borda-padrao fundo-cartao">
      <button type="button" data-alternar aria-expanded="false" aria-controls="${id}-lista"
        class="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors hover-fundo-sutil">
        <span class="text-sm font-semibold texto-forte">${escaparHtml(titulo)}</span>
        <span class="flex shrink-0 items-center gap-2">
          <span data-contagem class="hidden h-6 min-w-6 items-center justify-center rounded-full fundo-marca-sutil px-2 text-xs font-medium texto-marca"></span>
          <i data-seta aria-hidden="true" class="fa-solid fa-chevron-down text-xs texto-fraco transition-transform"></i>
        </span>
      </button>
      <p data-dica id="${id}-dica" class="hidden px-4 pb-3 text-xs texto-fraco">${escaparHtml(mensagemDesabilitado)}</p>
      <ul data-selecionados class="hidden flex-wrap gap-2 px-4 pb-3" aria-label="Selecionados em ${escaparHtml(titulo)}"></ul>
      <div id="${id}-lista" data-painel class="hidden flex-col gap-3 px-4 pb-4">
        <label class="relative flex w-full items-center">
          <i class="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 texto-fraco" aria-hidden="true"></i>
          <input type="search" data-busca placeholder="Buscar opção..." aria-label="Buscar opções de ${escaparHtml(titulo)}" class="input-padrao h-9 py-2 pl-9">
        </label>
        <div data-opcoes class="max-h-44 overflow-y-auto pr-2"></div>
        <div data-limpar-caixa class="hidden justify-end border-t borda-padrao pt-2">
          <button type="button" data-limpar class="text-xs font-medium texto-fraco transition-colors hover-texto-forte">Limpar seleção</button>
        </div>
      </div>
    </section>
  `;

  const $ = (seletor) => container.querySelector(seletor);
  const botao = $('[data-alternar]');
  const painel = $('[data-painel]');
  const dica = $('[data-dica]');

  function alternarOpcao(valor) {
    aoAlterar(
      estado.selecionados.includes(valor)
        ? estado.selecionados.filter((item) => item !== valor)
        : [...estado.selecionados, valor],
    );
  }

  function mostrar(elemento, visivel, exibicao = 'flex') {
    elemento.classList.toggle('hidden', !visivel);
    elemento.classList.toggle(exibicao, visivel);
  }

  function desenhar() {
    // quem tinha o foco (caixa ou ficha) o recebe de volta depois de redesenhar a lista
    const focado = document.activeElement && container.contains(document.activeElement) ? document.activeElement : null;
    const foco = focado ? { valor: focado.dataset.valor, remover: focado.dataset.remover } : null;

    const aberto = estado.expandido && !estado.desabilitado;
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-disabled', String(estado.desabilitado));
    if (estado.desabilitado && mensagemDesabilitado) botao.setAttribute('aria-describedby', `${id}-dica`);
    else botao.removeAttribute('aria-describedby');
    botao.classList.toggle('cursor-not-allowed', estado.desabilitado);
    botao.classList.toggle('opacity-50', estado.desabilitado);
    botao.classList.toggle('hover-fundo-sutil', !estado.desabilitado);
    $('[data-seta]').classList.toggle('rotate-180', aberto);
    mostrar(dica, estado.desabilitado && Boolean(mensagemDesabilitado), 'block');
    mostrar(painel, aberto);

    const contagem = $('[data-contagem]');
    contagem.textContent = String(estado.selecionados.length);
    contagem.setAttribute('aria-label', `${estado.selecionados.length} selecionado(s)`);
    mostrar(contagem, estado.selecionados.length > 0);

    const marcadas = estado.opcoes.filter((opcao) => estado.selecionados.includes(opcao.value));
    const fichas = $('[data-selecionados]');
    mostrar(fichas, marcadas.length > 0);
    fichas.innerHTML = marcadas.map((opcao) => `
      <li class="inline-flex max-w-full items-center gap-1 rounded-full border borda-marca fundo-marca-sutil py-1 pl-3 pr-1 text-xs texto-padrao">
        <span class="max-w-44 truncate" title="${escaparHtml(opcao.label)}">${escaparHtml(opcao.label)}</span>
        <button type="button" data-remover="${escaparHtml(opcao.value)}" aria-label="Remover ${escaparHtml(opcao.label)}"
          class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full texto-fraco transition-colors hover-fundo-sutil hover:text-primary">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </li>
    `).join('');

    const termo = normalizarTexto(estado.busca);
    const visiveis = termo ? estado.opcoes.filter((opcao) => normalizarTexto(opcao.label).includes(termo)) : estado.opcoes;
    $('[data-opcoes]').innerHTML = visiveis.length > 0
      ? visiveis.map((opcao) => `
        <label class="group flex cursor-pointer select-none items-center gap-2.5 py-1.5 text-sm">
          <input type="checkbox" data-valor="${escaparHtml(opcao.value)}" ${estado.selecionados.includes(opcao.value) ? 'checked' : ''}
            class="h-4 w-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span class="texto-padrao transition-colors group-hover:text-primary">${escaparHtml(opcao.label)}</span>
        </label>
      `).join('')
      : '<p class="py-3 text-center text-sm texto-fraco">Nenhuma opção encontrada.</p>';
    mostrar($('[data-limpar-caixa]'), estado.selecionados.length > 0);

    if (foco) {
      const seletor = foco.valor !== undefined ? `[data-valor="${foco.valor}"]` : foco.remover !== undefined ? `[data-remover="${foco.remover}"]` : null;
      const alvo = seletor ? container.querySelector(seletor) : null;
      if (alvo) alvo.focus();
    }
  }

  botao.addEventListener('click', () => {
    if (estado.desabilitado) return;
    estado.expandido = !estado.expandido;
    desenhar();
  });
  container.addEventListener('click', (evento) => {
    const remover = evento.target.closest('[data-remover]');
    if (remover) { alternarOpcao(remover.dataset.remover); return; }
    if (evento.target.closest('[data-limpar]')) aoAlterar([]);
  });
  container.addEventListener('change', (evento) => {
    const caixa = evento.target.closest('[data-valor]');
    if (caixa) alternarOpcao(caixa.dataset.valor);
  });
  $('[data-busca]').addEventListener('input', (evento) => {
    estado.busca = evento.target.value;
    desenhar();
  });

  return {
    atualizar({ opcoes, selecionados, desabilitado = false }) {
      estado.opcoes = opcoes;
      estado.selecionados = selecionados;
      estado.desabilitado = desabilitado;
      desenhar();
    },
  };
}

// Os dois grupos juntos: grandes áreas e, abaixo, as subáreas das grandes áreas marcadas.
export function criarFiltrosConhecimento(container, { aoAlterarGrandesAreas, aoAlterarSubareas }) {
  container.innerHTML = '<div data-grupo="grandes"></div><div data-grupo="subareas"></div>';
  const grandes = criarGrupoFiltroExpansivel(container.querySelector('[data-grupo="grandes"]'), {
    titulo: 'Grandes áreas do conhecimento',
    aoAlterar: aoAlterarGrandesAreas,
  });
  const subareas = criarGrupoFiltroExpansivel(container.querySelector('[data-grupo="subareas"]'), {
    titulo: 'Subáreas do conhecimento',
    aoAlterar: aoAlterarSubareas,
    mensagemDesabilitado: 'Selecione uma grande área para filtrar por subárea.',
  });
  const opcoesGrandes = GRANDES_AREAS_CONHECIMENTO.map(({ value, label }) => ({ value, label }));

  return {
    atualizar(grandesSelecionadas, subareasSelecionadas) {
      grandes.atualizar({ opcoes: opcoesGrandes, selecionados: grandesSelecionadas });
      subareas.atualizar({
        opcoes: obterSubareas(grandesSelecionadas),
        selecionados: subareasSelecionadas,
        desabilitado: grandesSelecionadas.length === 0,
      });
    },
  };
}
