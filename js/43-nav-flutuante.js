import { TELAS_PROTOTIPO } from '../dados-falsos/25-telas-prototipo.js';
import { USUARIOS_FALSOS } from '../dados-falsos/1-usuarios.js';
import { entrarComo, sair } from './4-autenticacao-falsa.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';
import { renderizarTelaMinhaConta } from './10-minha-conta.js';
import { mostrarAcao } from './1-utilitarios.js';

const ORDEM_GRUPOS = ['Navegação pública', 'Conta', 'Fluxo de apoio', 'Painéis internos', 'Outras'];

export function renderNavFlutuante() {
  const container = document.getElementById('grupos-telas-prototipo');
  if (!container) return;
  container.innerHTML = ORDEM_GRUPOS.map((grupo) => {
    const telas = TELAS_PROTOTIPO.filter((tela) => tela.grupo === grupo);
    if (!telas.length) return '';
    return `
      <div class="microrrotulo texto-sobre-escuro-fraco mb-1.5">${grupo}</div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        ${telas.map((tela) => `<button onclick="nav('${tela.rota}')" class="bg-slate-800 hover:bg-primary px-3 py-2 rounded text-left transition-colors">${tela.rotulo}</button>`).join('')}
      </div>
    `;
  }).join('');
}

export function alternarPainelTelas() {
  const painel = document.getElementById('painel-telas-prototipo');
  const botao = document.getElementById('botao-painel-telas');
  if (!painel || !botao) return;
  const abrindo = painel.classList.contains('hidden');
  painel.classList.toggle('hidden', !abrindo);
  botao.setAttribute('aria-expanded', String(abrindo));
}

export function fecharPainelTelas() {
  document.getElementById('painel-telas-prototipo')?.classList.add('hidden');
  document.getElementById('botao-painel-telas')?.setAttribute('aria-expanded', 'false');
}

function atualizarTelasDaConta() {
  atualizarCabecalhoConta();
  renderizarTelaMinhaConta();
}

export function entrarComoUsuarioTeste(idUsuario) {
  const usuario = USUARIOS_FALSOS.find((u) => u.idUsuario === idUsuario);
  entrarComo(usuario.idUsuario);
  atualizarTelasDaConta();
  mostrarAcao(`Logado como ${usuario.nome}.`);
}

export function sairUsuarioTeste() {
  sair();
  atualizarTelasDaConta();
  mostrarAcao('Saiu da conta de teste.');
}
