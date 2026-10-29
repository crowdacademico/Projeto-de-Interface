import { inicializarFormularioLogin } from './17-login.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';
import { renderHomeContent } from './18-home.js';
import { renderProjectTabs, renderProjectSupportInfo, setProjectTab, definirEstadoCampanha, renderApoiadoresRecentes } from './19-campanha.js';
import { inicializarCheckout } from './20-checkout.js';
import { renderizarApoioConfirmado } from './28-apoio-confirmado.js';
import { renderizarTelaExplorar } from './29-explorar.js';
import { renderizarTelaComoFunciona } from './30-como-funciona.js';
import { renderizarTelaPerfilPesquisador } from './31-perfil-pesquisador.js';
import { renderizarTelaSobre } from './32-sobre.js';
import { renderizarTelaTransparencia } from './34-transparencia.js';
import { renderizarTelaCadastro } from './35-cadastro.js';
import { renderizarTelaAtualizacoes } from './36-atualizacoes.js';
import { renderizarTelaTermos } from './38-termos.js';
import { renderizarTelaNotificacoes } from './40-notificacoes.js';
import { renderizarTelaMinhaConta } from './10-minha-conta.js';
import { renderDonorDashboard } from './22-dash-doador.js';
import { renderResearcherDashboard } from './23-dash-pesquisador.js';
import { renderCreateFormContent } from './21-criar-campanha.js';
import { atualizarBotoesEscalaFonte } from './26-escala-fonte.js';
import { renderNavFlutuante } from './43-nav-flutuante.js';
import { ATRASO_SIMULADO_MS } from '../dados-falsos/12-config-prototipo.js';

async function carregarFragmento(caminho, idAlvo) {
  const alvo = document.getElementById(idAlvo);
  if (!alvo) return;
  alvo.innerHTML = '<div class="esqueleto w-full h-24"></div>';
  const espera = new Promise((resolver) => setTimeout(resolver, ATRASO_SIMULADO_MS));
  const [resposta] = await Promise.all([fetch(caminho), espera]);
  if (!resposta.ok) throw new Error(`Falha ao carregar ${caminho}`);
  alvo.innerHTML = await resposta.text();
}

const FRAGMENTOS = {
  'app-cabecalho': 'componentes/1-cabecalho.html',
  'app-rodape': 'componentes/2-rodape.html',
  'app-nav-flutuante': 'componentes/3-nav-flutuante.html',
  'view-home': 'telas/1-home.html',
  'view-explorar': 'telas/17-explorar.html',
  'view-como-funciona': 'telas/19-como-funciona.html',
  'view-perfil-pesquisador': 'telas/20-perfil-pesquisador.html',
  'view-sobre': 'telas/21-sobre.html',
  'view-transparencia': 'telas/23-transparencia.html',
  'view-cadastro': 'telas/24-cadastro.html',
  'view-atualizacoes': 'telas/25-atualizacoes.html',
  'view-termos': 'telas/27-termos.html',
  'view-notificacoes': 'telas/29-notificacoes.html',
  'view-minha-conta': 'telas/10-minha-conta.html',
  'view-campanha': 'telas/2-campanha.html',
  'view-checkout': 'telas/3-checkout.html',
  'view-apoio-confirmado': 'telas/18-apoio-confirmado.html',
  'view-login': 'telas/4-login.html',
  'view-dash-doador': 'telas/5-dash-doador.html',
  'view-dash-pesquisador': 'telas/6-dash-pesquisador.html',
  'view-criar-campanha': 'telas/7-criar-campanha.html',
};

async function inicializarApp() {
  await Promise.all(Object.entries(FRAGMENTOS).map(([idAlvo, caminho]) => carregarFragmento(caminho, idAlvo)));

  renderNavFlutuante();
  renderHomeContent();
  renderizarTelaExplorar();
  renderizarTelaComoFunciona();
  renderizarTelaPerfilPesquisador();
  renderizarTelaSobre();
  renderizarTelaTransparencia();
  renderizarTelaCadastro();
  renderizarTelaAtualizacoes();
  renderizarTelaTermos();
  renderizarTelaNotificacoes();
  renderizarTelaMinhaConta();
  renderizarApoioConfirmado();
  renderProjectTabs();
  renderProjectSupportInfo();
  renderApoiadoresRecentes();
  definirEstadoCampanha('em-captacao', { avisar: false });
  renderDonorDashboard();
  renderResearcherDashboard();
  renderCreateFormContent();
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
  if (document.startViewTransition && !preferemMenosMovimento.matches) {
    document.startViewTransition(() => trocarViewAtiva(view)).ready.catch(() => {});
  } else {
    trocarViewAtiva(view);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  inicializarApp().catch((erro) => {
    console.error(erro);
    document.getElementById('app').innerHTML =
      '<div class="p-8 text-center text-red-600">Falha ao carregar o protótipo. Ele precisa ser servido por um servidor local (não abrir o arquivo direto). Ver README.md.</div>';
  });
});
