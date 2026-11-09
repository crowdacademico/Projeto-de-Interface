import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Campo } from '@restrita/components/input/campo';
import { TabelaGenerica } from '../src/components/crud/tabela-generica';
import { escaparHtml, renderizarCabecalhoPagina } from './1-utilitarios.js';
import {
  COMPOSICAO_TAXA,
  TABELA_MEIOS_PAGAMENTO,
  O_QUE_NAO_FAZEMOS,
  POLITICA_ESTORNO,
  TAXA_REPASSE_PADRAO_PERCENTUAL,
} from '../dados-falsos/18-transparencia.js';

const raizesReact = new WeakMap();

function renderizarComponente(container, componente) {
  let raiz = raizesReact.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizesReact.set(container, raiz);
  }
  flushSync(() => raiz.render(componente));
}

function formatarReais(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function atualizarSimulador() {
  const input = document.querySelector('#view-transparencia [name="valor-apoio"]');
  const resultado = document.getElementById('transparencia-simulador-resultado');
  const decomposicao = document.getElementById('transparencia-simulador-decomposicao');
  if (!input || !resultado) return;
  const valor = Math.max(0, Number(input.value) || 0);

  if (decomposicao) {
    decomposicao.innerHTML = COMPOSICAO_TAXA.map((parte) => `
      <div class="painel-leitura__linha">
        <span class="painel-leitura__linha-rotulo"><span class="painel-leitura__linha-marca" style="background-color: var(${parte.corVar});"></span>${escaparHtml(parte.parte)}</span>
        <span class="painel-leitura__linha-valor">${formatarReais(valor * (parte.percentual / 100))}</span>
      </div>
    `).join('');
  }

  const recebido = valor * (TAXA_REPASSE_PADRAO_PERCENTUAL / 100);
  resultado.textContent = formatarReais(recebido);
}

export function renderizarTelaTransparencia() {
  const barra = document.getElementById('transparencia-barra-composicao');
  if (!barra) return;
  renderizarCabecalhoPagina('cabecalho-pagina-transparencia', {
    migalhas: [{ rotulo: 'Transparência e taxas' }],
    titulo: 'Transparência e taxas',
    descricao: 'Para onde vai cada real que passa pela plataforma.',
  });

  barra.innerHTML = `
    <div class="escala-composicao__segmentos">
      ${COMPOSICAO_TAXA.map((parte) => `<span style="width: ${parte.percentual}%; background-color: var(${parte.corVar});" title="${escaparHtml(parte.parte)}: ${parte.percentual}%"></span>`).join('')}
    </div>
  `;

  document.getElementById('transparencia-legenda-composicao').innerHTML = COMPOSICAO_TAXA.map((parte) => `
    <span class="flex items-center gap-2 text-sm texto-padrao">
      <span class="w-3 h-3 rounded-sm shrink-0" style="background-color: var(${parte.corVar});"></span>
      ${escaparHtml(parte.parte)} <span class="paragrafo-denso">${parte.percentual}%</span>
    </span>
  `).join('');

  const tabela = document.getElementById('transparencia-tabela-meios');
  if (!tabela) throw new Error('Contêiner da tabela de prazos não encontrado.');
  const linhas = TABELA_MEIOS_PAGAMENTO.map((linha) => createElement(
    'tr',
    { key: linha.meio },
    createElement('td', { className: 'font-bold texto-forte', children: linha.meio }),
    createElement('td', { children: linha.prazoRepasse }),
    createElement('td', { children: linha.taxaAdicional }),
  ));
  renderizarComponente(tabela, createElement(TabelaGenerica, {
    colunas: ['Meio', 'Prazo de repasse', 'Taxa adicional'],
    legenda: 'Prazos e taxas por meio de pagamento',
    children: linhas,
  }));

  document.getElementById('transparencia-politica-estorno').textContent = POLITICA_ESTORNO;

  document.getElementById('transparencia-o-que-nao-fazemos').innerHTML = O_QUE_NAO_FAZEMOS.map((item) => `
    <li class="flex items-start gap-3 text-sm texto-padrao leading-relaxed">
      <span class="marcador-negativa" aria-hidden="true"><i class="fa-solid fa-xmark"></i></span>
      ${escaparHtml(item)}
    </li>
  `).join('');

  const campo = document.getElementById('transparencia-simulador-campo');
  if (!campo) throw new Error('Contêiner do campo de simulação não encontrado.');
  renderizarComponente(campo, createElement(Campo, {
    rotulo: 'Valor do apoio (R$)',
    children: ({ atributos, classeErro }) => createElement('input', {
      ...atributos,
      name: 'valor-apoio',
      type: 'number',
      min: 5,
      step: 5,
      defaultValue: 150,
      className: `input-padrao max-w-52${classeErro}`,
    }),
  }));
  const campoValor = document.querySelector('#view-transparencia [name="valor-apoio"]');
  if (campoValor && !campoValor.dataset.ligado) {
    campoValor.addEventListener('input', atualizarSimulador);
    campoValor.dataset.ligado = '1';
  }
  atualizarSimulador();
}
