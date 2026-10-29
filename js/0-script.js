// Funções chamadas por onclick="" no HTML precisam existir em window: módulo ES não expõe nada global.
import { nav } from './24-roteador.js';
import { mostrarAcao } from './1-utilitarios.js';
import { alternarTema } from './3-tema.js';
import { sair } from './4-autenticacao-falsa.js';
import { alternarMenuConta, fecharMenuConta, atualizarCabecalhoConta } from './7-cabecalho.js';
import { renderizarTelaMinhaConta } from './10-minha-conta.js';
import { setProjectTab, definirEstadoCampanha } from './19-campanha.js';
import { copyPix, confirmarPagamento, gerarNovoCodigoPix } from './20-checkout.js';
import { navegarExplorarPorArea } from './29-explorar.js';
import { alternarSeguirProjeto, verTodasPerguntas } from './18-home.js';
import { aumentarFonte, diminuirFonte } from './26-escala-fonte.js';
import { mudarAbaComoFunciona } from './30-como-funciona.js';
import {
  selecionarTipoContaCadastro,
  atualizarCampoCadastro,
  atualizarCpfCadastro,
  atualizarAceiteCadastro,
  validarLattesCadastro,
  voltarPassoCadastro,
  avancarPassoCadastro,
} from './35-cadastro.js';
import { mudarFiltroAtualizacoes } from './36-atualizacoes.js';
import { abrirMenuMovel, fecharMenuMovel } from './37-menu-movel.js';
import { atualizarAceiteTermos, confirmarAceiteTermos } from './38-termos.js';
import { marcarTodasNotificacoesLidas } from './40-notificacoes.js';
import { alternarPainelTelas, fecharPainelTelas, entrarComoUsuarioTeste, sairUsuarioTeste } from './43-nav-flutuante.js';
import { submeterCriarCampanha } from './21-criar-campanha.js';

Object.assign(window, {
  nav,
  mostrarAcao,
  alternarTema,
  sair,
  alternarMenuConta,
  fecharMenuConta,
  atualizarCabecalhoConta,
  renderizarTelaMinhaConta,
  setProjectTab,
  definirEstadoCampanha,
  navegarExplorarPorArea,
  alternarSeguirProjeto,
  verTodasPerguntas,
  copyPix,
  confirmarPagamento,
  gerarNovoCodigoPix,
  aumentarFonte,
  diminuirFonte,
  mudarAbaComoFunciona,
  selecionarTipoContaCadastro,
  atualizarCampoCadastro,
  atualizarCpfCadastro,
  atualizarAceiteCadastro,
  validarLattesCadastro,
  voltarPassoCadastro,
  avancarPassoCadastro,
  mudarFiltroAtualizacoes,
  abrirMenuMovel,
  fecharMenuMovel,
  atualizarAceiteTermos,
  confirmarAceiteTermos,
  marcarTodasNotificacoesLidas,
  alternarPainelTelas,
  fecharPainelTelas,
  entrarComoUsuarioTeste,
  sairUsuarioTeste,
  submeterCriarCampanha,
});
