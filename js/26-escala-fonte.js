import { ESCALAS_FONTE } from '../dados-falsos/12-config-prototipo.js';
import { mostrarAviso } from './25-avisos.js';

const CHAVE_ESCALA_FONTE = 'crowdacademico-protótipo.escala-fonte';

function lerEscalaSalva() {
  const salvo = Number(localStorage.getItem(CHAVE_ESCALA_FONTE));
  return ESCALAS_FONTE.includes(salvo) ? salvo : 1;
}

function aplicarEscala(escala) {
  document.documentElement.style.setProperty('--escala-fonte', String(escala));
  localStorage.setItem(CHAVE_ESCALA_FONTE, String(escala));
  atualizarBotoesEscalaFonte();
}

export function atualizarBotoesEscalaFonte() {
  const escala = lerEscalaSalva();
  const indice = ESCALAS_FONTE.indexOf(escala);
  const botaoDiminuir = document.getElementById('botao-fonte-diminuir');
  const botaoAumentar = document.getElementById('botao-fonte-aumentar');
  if (botaoDiminuir) {
    botaoDiminuir.disabled = indice <= 0;
    botaoDiminuir.setAttribute('aria-label', `Diminuir tamanho do texto (atual: ${Math.round(escala * 100)}%)`);
  }
  if (botaoAumentar) {
    botaoAumentar.disabled = indice >= ESCALAS_FONTE.length - 1;
    botaoAumentar.setAttribute('aria-label', `Aumentar tamanho do texto (atual: ${Math.round(escala * 100)}%)`);
  }
}

export function aumentarFonte() {
  const indice = ESCALAS_FONTE.indexOf(lerEscalaSalva());
  if (indice >= ESCALAS_FONTE.length - 1) return;
  const nova = ESCALAS_FONTE[indice + 1];
  aplicarEscala(nova);
  mostrarAviso(`Tamanho do texto: ${Math.round(nova * 100)}%.`);
}

export function diminuirFonte() {
  const indice = ESCALAS_FONTE.indexOf(lerEscalaSalva());
  if (indice <= 0) return;
  const nova = ESCALAS_FONTE[indice - 1];
  aplicarEscala(nova);
  mostrarAviso(`Tamanho do texto: ${Math.round(nova * 100)}%.`);
}
