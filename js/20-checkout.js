import { mostrarAcao } from './1-utilitarios.js';
import { mostrarAviso } from './25-avisos.js';
import { definirUltimaContribuicao, renderizarApoioConfirmado } from './28-apoio-confirmado.js';
import { nav } from './24-roteador.js';

const DURACAO_PIX_SEGUNDOS = 15 * 60;

const PROJETO_EM_CHECKOUT = { nome: 'Microplásticos no Rio Paraná', arrecadadoAntes: 22750, meta: 35000 };

const VALORES_SUGERIDOS = [25, 50, 100, 150, 200];
const VALOR_SUGERIDO_PADRAO = 150;
let valorContribuicao = VALOR_SUGERIDO_PADRAO;

let idIntervaloContador = null;
let segundosRestantes = DURACAO_PIX_SEGUNDOS;

function formatarMMSS(totalSegundos) {
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

function pararContadorPix() {
  if (idIntervaloContador) {
    clearInterval(idIntervaloContador);
    idIntervaloContador = null;
  }
}

function mostrarContadorExpirado() {
  pararContadorPix();
  const bloco = document.getElementById('bloco-contador-pix');
  if (!bloco) return;
  bloco.classList.remove('fundo-aviso');
  bloco.classList.add('fundo-erro');
  bloco.innerHTML = `
    <i class="fa-solid fa-circle-exclamation texto-erro"></i>
    <span class="texto-erro">Código expirado.</span>
    <button type="button" onclick="gerarNovoCodigoPix()" class="btn btn-secondary py-1 px-3 text-xs">Gerar novo código</button>
  `;
}

function atualizarTextoContador() {
  const elemento = document.getElementById('contador-pix');
  if (!elemento) return;
  elemento.textContent = formatarMMSS(segundosRestantes);

  elemento.classList.toggle('texto-erro', segundosRestantes < 60);
}

export function iniciarContadorPix() {
  pararContadorPix();
  segundosRestantes = DURACAO_PIX_SEGUNDOS;
  atualizarTextoContador();
  idIntervaloContador = setInterval(() => {
    segundosRestantes -= 1;
    if (segundosRestantes <= 0) {
      mostrarContadorExpirado();
      return;
    }
    atualizarTextoContador();
  }, 1000);
}

export function gerarNovoCodigoPix() {
  const bloco = document.getElementById('bloco-contador-pix');
  if (!bloco) return;
  bloco.classList.remove('fundo-erro');
  bloco.classList.add('fundo-aviso');
  bloco.innerHTML = `
    <i class="fa-regular fa-clock"></i> Expira em: <span id="contador-pix" class="numero texto-erro">15:00</span>
  `;
  mostrarAviso('Novo código PIX gerado.');
  iniciarContadorPix();
}

function formatarReais(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function atualizarResumo() {
  const resumoValor = document.getElementById('checkout-resumo-valor');
  const resumoTotal = document.getElementById('checkout-resumo-total');
  if (resumoValor) resumoValor.textContent = formatarReais(valorContribuicao);
  if (resumoTotal) resumoTotal.textContent = formatarReais(valorContribuicao);
}

function definirValorContribuicao(valor) {
  valorContribuicao = Math.max(5, valor);
  atualizarResumo();
}

function renderizarPilulasValor() {
  const container = document.getElementById('checkout-valores-pilulas');
  const campoOutro = document.getElementById('checkout-valor-outro');
  if (!container) return;

  container.innerHTML = VALORES_SUGERIDOS.map((valor) => `
    <button type="button" data-valor="${valor}" class="pilula-valor ${valor === valorContribuicao ? 'pilula-valor--ativa' : ''} py-2.5 rounded-lg text-sm font-bold border-2 transition-colors">R$ ${valor}</button>
  `).join('') + `<button type="button" id="checkout-valor-outro-botao" class="pilula-valor py-2.5 rounded-lg text-sm font-bold border-2 transition-colors">Outro</button>`;

  container.querySelectorAll('[data-valor]').forEach((botao) => {
    botao.addEventListener('click', () => {
      campoOutro?.classList.add('hidden');
      definirValorContribuicao(Number(botao.dataset.valor));
      renderizarPilulasValor();
    });
  });
  document.getElementById('checkout-valor-outro-botao')?.addEventListener('click', () => {
    campoOutro?.classList.remove('hidden');
    campoOutro?.focus();
    container.querySelectorAll('.pilula-valor').forEach((b) => b.classList.remove('pilula-valor--ativa'));
    document.getElementById('checkout-valor-outro-botao').classList.add('pilula-valor--ativa');
  });
  campoOutro?.addEventListener('input', () => {
    const valor = Number(campoOutro.value);
    if (valor > 0) definirValorContribuicao(valor);
  });
}

export function inicializarCheckout() {
  const checkbox = document.getElementById('checkout-aceite-termos');
  const botao = document.getElementById('checkout-botao-confirmar');
  if (!checkbox || !botao || checkbox.dataset.inicializado) return;
  checkbox.dataset.inicializado = 'true';
  checkbox.addEventListener('change', () => {
    botao.disabled = !checkbox.checked;
  });
  valorContribuicao = VALOR_SUGERIDO_PADRAO;
  renderizarPilulasValor();
  atualizarResumo();
  iniciarContadorPix();
}

export function confirmarPagamento() {
  pararContadorPix();
  const arrecadadoDepois = PROJETO_EM_CHECKOUT.arrecadadoAntes + valorContribuicao;
  const protocolo = `2026-08-${String(Math.floor(1000 + Math.random() * 9000))}`;
  definirUltimaContribuicao({
    projeto: PROJETO_EM_CHECKOUT.nome,
    valor: formatarReais(valorContribuicao),
    protocolo,
    meio: 'PIX',
    progressoAntes: (PROJETO_EM_CHECKOUT.arrecadadoAntes / PROJETO_EM_CHECKOUT.meta) * 100,
    progressoDepois: (arrecadadoDepois / PROJETO_EM_CHECKOUT.meta) * 100,
  });
  renderizarApoioConfirmado();
  nav('apoio-confirmado');
}

export function copyPix() {
    const pixField = document.getElementById('pix-code');
    const botao = document.getElementById('botao-copiar-pix');
    if (!pixField) {
        mostrarAcao('Não foi possível copiar o código PIX.');
        return;
    }
    const value = pixField.value;
    const confirmarVisualmente = () => {
        if (!botao) return;
        const textoOriginal = botao.textContent;
        botao.textContent = 'Copiado ✓';
        setTimeout(() => { botao.textContent = textoOriginal; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(() => {
            confirmarVisualmente();
            mostrarAcao('Código PIX copiado para a área de transferência.');
        }).catch(() => {
            mostrarAcao('Cópia automática não disponível. Selecione e copie manualmente.');
        });
    } else {
        pixField.select();
        document.execCommand('copy');
        confirmarVisualmente();
        mostrarAcao('Código PIX copiado para a área de transferência.');
    }
}
