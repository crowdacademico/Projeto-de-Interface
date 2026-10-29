import { escaparHtml, htmlEstadoVazio, htmlMigalhas } from './1-utilitarios.js';
import { NOTIFICACOES_FALSAS } from '../dados-falsos/23-notificacoes.js';

function atualizarBadgeCabecalho() {
  const badge = document.getElementById('badge-notificacoes');
  if (!badge) return;
  const naoLidas = NOTIFICACOES_FALSAS.filter((n) => !n.lida).length;
  if (naoLidas > 0) {
    badge.textContent = naoLidas > 9 ? '9+' : String(naoLidas);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

export function renderizarTelaNotificacoes() {
  const container = document.getElementById('notificacoes-lista');
  if (!container) {
    atualizarBadgeCabecalho();
    return;
  }
  document.getElementById('migalhas-notificacoes').innerHTML = htmlMigalhas([{ rotulo: 'Notificações' }]);

  if (NOTIFICACOES_FALSAS.length === 0) {
    container.innerHTML = htmlEstadoVazio({
      icone: 'fa-bell-slash',
      titulo: 'Nenhuma notificação por aqui.',
      mensagem: 'Avisos sobre suas campanhas e apoios aparecem nesta lista.',
    });
    atualizarBadgeCabecalho();
    return;
  }

  container.innerHTML = NOTIFICACOES_FALSAS.map((n) => `
    <div class="cartao flex items-start gap-4 ${n.lida ? '' : 'borda-marca'}" style="${n.lida ? '' : 'border-color: var(--cor-marca-borda); background-color: var(--cor-marca-sutil);'}">
      <div class="w-10 h-10 rounded-lg fundo-marca-sutil texto-marca flex items-center justify-center shrink-0"><i class="fa-solid ${escaparHtml(n.icone)}"></i></div>
      <div class="flex-1 min-w-0">
        <p class="font-bold texto-forte">${escaparHtml(n.titulo)}</p>
        <p class="text-sm texto-padrao mt-0.5">${escaparHtml(n.corpo)}</p>
        <p class="microrrotulo texto-fraco mt-1.5">${escaparHtml(n.data)}</p>
      </div>
      ${n.lida ? '' : '<span class="w-2 h-2 rounded-full shrink-0 mt-2" style="background-color: var(--cor-marca);" aria-label="Não lida"></span>'}
    </div>
  `).join('');

  atualizarBadgeCabecalho();
}

export function marcarTodasNotificacoesLidas() {
  NOTIFICACOES_FALSAS.forEach((n) => { n.lida = true; });
  renderizarTelaNotificacoes();
}
