import { inicializarFormularioLogin } from './17-login.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';
import { renderHomeContent } from './18-home.js';
import { renderProjectTabs, renderProjectSupportInfo, setProjectTab, definirEstadoCampanha, renderApoiadoresRecentes, renderizarComentariosPublicos } from './19-campanha.js';
import { inicializarCheckout } from './20-checkout.js';
import { renderizarApoioConfirmado } from './28-apoio-confirmado.js';
import { renderizarTelaExplorar } from './29-explorar.js';
import { renderizarTelaComoFunciona } from './30-como-funciona.js';
import { renderizarTelaPerfilPesquisador } from './31-perfil-pesquisador.js';
import { renderizarTelaSobre } from './32-sobre.js';
import { renderizarTelaTransparencia } from './34-transparencia.js';
import { renderizarTelaAtualizacoes } from './36-atualizacoes.js';
import { renderizarTelaTermos } from './38-termos.js';
import { renderizarTelaNotificacoes } from './40-notificacoes.js';
import { renderizarTelaMinhaConta } from './10-minha-conta.js';
import { renderizarTelaMinhasCampanhas } from './10-minha-conta.js';
import { usuarioAtual } from './4-autenticacao-falsa.js';
import { mostrarAcao } from './1-utilitarios.js';
import { renderCreateFormContent } from './21-criar-campanha.js';
import { atualizarBotoesEscalaFonte } from './26-escala-fonte.js';
import { renderNavFlutuante } from './43-nav-flutuante.js';

export async function inicializarApp() {
  renderHomeContent();
  renderizarTelaExplorar();
  renderizarTelaComoFunciona();
  renderizarTelaPerfilPesquisador();
  renderizarTelaSobre();
  renderizarTelaTransparencia();
  renderizarTelaAtualizacoes();
  renderizarTelaTermos();
  renderizarTelaNotificacoes();
  renderizarTelaMinhaConta();
  renderizarApoioConfirmado();
  renderProjectTabs();
  renderProjectSupportInfo();
  renderApoiadoresRecentes();
  definirEstadoCampanha('em-captacao', { avisar: false });
  renderCreateFormContent();
  renderNavFlutuante();
  setProjectTab('sobre');

  inicializarFormularioLogin();
  inicializarCheckout();
  atualizarCabecalhoConta();
  atualizarBotoesEscalaFonte();
  nav('home');
}

function trocarViewAtiva(view) {
  document.querySelectorAll('.view-section').forEach((secao) => {
    secao.classList.toggle('active', secao.id === `view-${view}`);
  });
  document.querySelectorAll('[data-view-nav]').forEach((link) => {
    if (link.dataset.viewNav === view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const preferemMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

export function nav(view) {
  if (view === 'campanha') renderizarComentariosPublicos();
  if (view === 'minhas-campanhas') {
    const usuario = usuarioAtual();
    if (!usuario || !usuario.papeis.includes('pesquisador')) {
      if (usuario) mostrarAcao('A página Minhas campanhas está disponível para pesquisadores cadastrados.');
      view = 'minha-conta';
    } else {
      renderizarTelaMinhasCampanhas();
    }
  }
  if (document.startViewTransition && !preferemMenosMovimento.matches) {
    document.startViewTransition(() => trocarViewAtiva(view)).ready.catch(() => {});
  } else {
    trocarViewAtiva(view);
  }
}
