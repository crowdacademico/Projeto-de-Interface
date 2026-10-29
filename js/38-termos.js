import { escaparHtml, escaparAtributo, mostrarAcao, htmlMigalhas } from './1-utilitarios.js';
import { SECOES_TERMOS } from '../dados-falsos/21-termos.js';

export function renderizarTelaTermos() {
  const indice = document.getElementById('termos-indice');
  const conteudo = document.getElementById('termos-conteudo');
  if (!indice || !conteudo) return;
  document.getElementById('migalhas-termos').innerHTML = htmlMigalhas([{ rotulo: 'Termos e privacidade' }]);

  indice.innerHTML = SECOES_TERMOS.map((secao) => `
    <a href="#${escaparAtributo(secao.id)}" class="text-sm texto-padrao hover:text-primary py-1.5 transition-colors">${escaparHtml(secao.titulo)}</a>
  `).join('');

  conteudo.innerHTML = SECOES_TERMOS.map((secao) => `
    <section id="${escaparAtributo(secao.id)}">
      <h2 class="titulo-secao mb-4">${escaparHtml(secao.titulo)}</h2>
      ${secao.paragrafos.map((p) => `<p class="paragrafo texto-padrao mb-4">${escaparHtml(p)}</p>`).join('')}
    </section>
  `).join('');
}

export function atualizarAceiteTermos(marcado) {
  const botao = document.getElementById('termos-botao-confirmar');
  if (botao) botao.disabled = !marcado;
}

export function confirmarAceiteTermos() {
  mostrarAcao('Aceite dos termos registrado (simulado).');
}
