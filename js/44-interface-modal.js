// Peças de interface em JavaScript puro, no desenho da restrita (ModalFicha, Campo, SecaoFicha, CampoFicha).
// Baseado no trabalho da Alexia (modal-base, use-foco-dialogo, perfil-conta-publica, gerenciador-campanhas),
// reescrito sem React. As classes de CSS vêm da restrita (4-componentes-restrita.css); a estrutura do modal
// (.modal-ficha*) está em 9-CSS-do-projeto-de-interface.css.
import { escaparHtml } from './1-utilitarios.js';

let contadorIds = 0;
export const novoId = (prefixo = 'campo') => `${prefixo}-${++contadorIds}`;

// ---------- Campo de formulário (rótulo + controle + dica ou erro) ----------
// `controle` recebe a string de atributos (id, aria-invalid, aria-describedby) para espalhar no input/select/textarea.
export function htmlCampo({ rotulo, dica = '', erro = '', classe = '', controle }) {
  const id = novoId();
  const idMensagem = `${id}-msg`;
  const temMensagem = Boolean(erro || dica);
  const atributos = `id="${id}" aria-invalid="${Boolean(erro)}"${temMensagem ? ` aria-describedby="${idMensagem}"` : ''}`;
  return `
    <div class="${classe}">
      <label for="${id}" class="rotulo-campo">${escaparHtml(rotulo)}</label>
      ${controle(atributos)}
      ${erro
        ? `<p id="${idMensagem}" class="legenda enfase erro-campo">${escaparHtml(erro)}</p>`
        : dica ? `<p id="${idMensagem}" class="legenda texto-fraco mt-1">${escaparHtml(dica)}</p>` : ''}
    </div>`;
}

export function htmlSelect({ rotulo, nome, valor, opcoes, dica = '' }) {
  return htmlCampo({
    rotulo, dica,
    controle: (a) => `<select ${a} name="${nome}" class="input-padrao">
      ${opcoes.map((o) => `<option value="${escaparHtml(o.valor)}"${String(o.valor) === String(valor) ? ' selected' : ''}>${escaparHtml(o.rotulo)}</option>`).join('')}
    </select>`,
  });
}

export function htmlMensagemErro() {
  return '<p class="erro-campo" role="alert" data-erro hidden></p>';
}

export function mostrarErro(raiz, texto) {
  const alvo = raiz.querySelector('[data-erro]');
  if (!alvo) return;
  alvo.textContent = texto;
  alvo.hidden = !texto;
}

// ---------- Ficha de leitura (SecaoFicha / CampoFicha) ----------
export function htmlSecaoFicha(titulo, conteudo, { colunas = 2, nivel = 3, destaque = false } = {}) {
  const tag = nivel === 2 ? 'h2' : 'h3';
  const grade = colunas === 1 ? 'grid-cols-1' : colunas === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';
  return `
    <div>
      <${tag} class="${destaque ? 'subtitulo' : 'titulo-bloco'} titulo-bloco--linha">${escaparHtml(titulo)}</${tag}>
      <div class="grid gap-x-6 gap-y-4 ${grade}">${conteudo}</div>
    </div>`;
}

export function htmlCampoFicha(rotulo, valor, { cheia = false } = {}) {
  const temValor = valor !== null && valor !== undefined && valor !== '';
  return `
    <div class="campo-ficha${cheia ? ' sm:col-span-2' : ''}">
      <div class="rotulo-leitura mb-1">${escaparHtml(rotulo)}</div>
      <div class="campo-ficha__valor">
        <span class="paragrafo min-w-0 break-words texto-herdado ${temValor ? 'texto-forte' : 'texto-fraco opacity-50'}">${temValor ? escaparHtml(String(valor)) : '-'}</span>
      </div>
    </div>`;
}

// ---------- Modal de ficha ----------
// Só o modal de cima reage ao Esc e ao Tab; ao fechar, o foco volta para quem abriu.
const pilha = [];
const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function aoPressionarTecla(evento) {
  const atual = pilha[pilha.length - 1];
  if (!atual) return;
  if (evento.key === 'Escape') {
    evento.preventDefault();
    atual.pedirFechar();
    return;
  }
  if (evento.key !== 'Tab') return;
  const itens = [...atual.janela.querySelectorAll(FOCAVEIS)].filter((i) => i.getClientRects().length > 0);
  if (!itens.length) { evento.preventDefault(); atual.janela.focus(); return; }
  const primeiro = itens[0];
  const ultimo = itens[itens.length - 1];
  const dentro = itens.includes(document.activeElement);
  if (evento.shiftKey && (document.activeElement === primeiro || !dentro)) { evento.preventDefault(); ultimo.focus(); }
  else if (!evento.shiftKey && (document.activeElement === ultimo || !dentro)) { evento.preventDefault(); primeiro.focus(); }
}

export function abrirModalFicha({ titulo, subtitulo = '', corpoHtml = '', rodapeHtml = '', aoFechar, aoMontar, fecharAoClicarFora = true }) {
  const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const idTitulo = novoId('modal-titulo');
  const camada = document.createElement('div');
  camada.className = 'modal-ficha-camada fundo-escurecido';
  camada.innerHTML = `
    <div class="modal-ficha" role="dialog" aria-modal="true" aria-labelledby="${idTitulo}" tabindex="-1">
      <div class="modal-ficha__cabecalho">
        <div class="min-w-0">
          <h2 id="${idTitulo}" class="titulo-secao truncate">${escaparHtml(titulo)}</h2>
          ${subtitulo ? `<p class="paragrafo texto-fraco mt-1 break-words">${escaparHtml(subtitulo)}</p>` : ''}
        </div>
        <button type="button" data-fechar-modal aria-label="Fechar" class="texto-fraco hover-texto-forte shrink-0">
          <i class="fa-solid fa-xmark icone-grande" aria-hidden="true"></i>
        </button>
      </div>
      <div class="modal-ficha__corpo rolagem-estavel">${corpoHtml}</div>
      ${rodapeHtml ? `<div class="modal-ficha__rodape">${rodapeHtml}</div>` : ''}
    </div>`;
  const janela = camada.firstElementChild;
  let fechado = false;

  const controle = {
    raiz: camada,
    janela,
    fechar() {
      if (fechado) return;
      fechado = true;
      const indice = pilha.indexOf(controle);
      if (indice >= 0) pilha.splice(indice, 1);
      if (!pilha.length) document.removeEventListener('keydown', aoPressionarTecla);
      camada.remove();
      focoAnterior?.focus();
      aoFechar?.();
    },
    // Esc, X e clique fora passam por aqui: quem abriu pode barrar o fechamento (ex.: alteração não salva).
    pedirFechar() { controle.fechar(); },
  };

  janela.querySelector('[data-fechar-modal]').addEventListener('click', () => controle.pedirFechar());
  janela.querySelectorAll('[data-cancelar-modal]').forEach((b) => b.addEventListener('click', () => controle.pedirFechar()));
  if (fecharAoClicarFora) {
    camada.addEventListener('mousedown', (evento) => { if (evento.target === camada) controle.pedirFechar(); });
  }

  document.body.appendChild(camada);
  if (!pilha.length) document.addEventListener('keydown', aoPressionarTecla);
  pilha.push(controle);
  aoMontar?.(controle);
  janela.focus();
  return controle;
}

// Rodapé padrão: Cancelar à esquerda, ação principal à direita (o botão de enviar fica ligado ao formulário pelo atributo form).
export function htmlRodapeAcoes({ formulario = '', rotuloAcao, rotuloCancelar = 'Cancelar', idAcao = '' }) {
  return `
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" class="btn btn-secondary" data-cancelar-modal>${escaparHtml(rotuloCancelar)}</button>
      ${rotuloAcao ? `<button type="${formulario ? 'submit' : 'button'}" ${formulario ? `form="${formulario}"` : ''} ${idAcao ? `id="${idAcao}"` : ''} class="btn btn-primary">${escaparHtml(rotuloAcao)}</button>` : ''}
    </div>`;
}
