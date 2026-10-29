import { escaparHtml, htmlMigalhas } from './1-utilitarios.js';
import {
  COMPOSICAO_TAXA,
  TABELA_MEIOS_PAGAMENTO,
  O_QUE_NAO_FAZEMOS,
  POLITICA_ESTORNO,
  TAXA_REPASSE_PADRAO_PERCENTUAL,
} from '../dados-falsos/18-transparencia.js';

function formatarReais(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function atualizarSimulador() {
  const input = document.getElementById('transparencia-simulador-valor');
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
  document.getElementById('migalhas-transparencia').innerHTML = htmlMigalhas([{ rotulo: 'Transparência e taxas' }]);

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

  document.getElementById('transparencia-tabela-meios').innerHTML = TABELA_MEIOS_PAGAMENTO.map((linha) => `
    <tr>
      <td class="font-bold texto-forte">${escaparHtml(linha.meio)}</td>
      <td>${escaparHtml(linha.prazoRepasse)}</td>
      <td>${escaparHtml(linha.taxaAdicional)}</td>
    </tr>
  `).join('');

  document.getElementById('transparencia-politica-estorno').textContent = POLITICA_ESTORNO;

  document.getElementById('transparencia-o-que-nao-fazemos').innerHTML = O_QUE_NAO_FAZEMOS.map((item) => `
    <li class="flex items-start gap-3 text-sm texto-padrao leading-relaxed">
      <span class="marcador-negativa" aria-hidden="true"><i class="fa-solid fa-xmark"></i></span>
      ${escaparHtml(item)}
    </li>
  `).join('');

  const input = document.getElementById('transparencia-simulador-valor');
  if (input && !input.dataset.ligado) {
    input.addEventListener('input', atualizarSimulador);
    input.dataset.ligado = '1';
  }
  atualizarSimulador();
}
