import { escaparHtml, htmlMigalhas } from './1-utilitarios.js';
import {
  MISSAO_PARAGRAFOS,
  ETAPAS_CURADORIA,
  METRICAS_CURADORIA,
  CONSELHO_CIENTIFICO,
  FICHA_TECNICA,
} from '../dados-falsos/16-sobre.js';

export function renderizarTelaSobre() {
  const missao = document.getElementById('sobre-missao');
  if (!missao) return;
  document.getElementById('migalhas-sobre').innerHTML = htmlMigalhas([{ rotulo: 'Sobre' }]);
  missao.innerHTML = MISSAO_PARAGRAFOS.map((p) => `<p class="paragrafo texto-padrao">${escaparHtml(p)}</p>`).join('');

  const etapas = document.getElementById('sobre-etapas-curadoria');
  etapas.innerHTML = ETAPAS_CURADORIA.map((etapa) => `
    <article class="ficha-catalogo">
      <span class="ficha-catalogo__indice">${String(etapa.numero).padStart(2, '0')}</span>
      <div class="ficha-catalogo__papel">Etapa ${etapa.numero} de ${ETAPAS_CURADORIA.length}</div>
      <h3 class="ficha-catalogo__titulo">${escaparHtml(etapa.titulo)}</h3>
      <p class="ficha-catalogo__texto">${escaparHtml(etapa.texto)}</p>
    </article>
  `).join('');

  const metricas = document.getElementById('sobre-metricas-curadoria');
  metricas.innerHTML = METRICAS_CURADORIA.map((m) => `
    <div class="metrica text-center">
      <div class="metrica__valor numero">${escaparHtml(m.valor)}</div>
      <div class="metrica__rotulo">${escaparHtml(m.rotulo)}</div>
    </div>
  `).join('');

  const conselho = document.getElementById('sobre-conselho');
  conselho.innerHTML = CONSELHO_CIENTIFICO.map((membro, indice) => `
    <article class="ficha-catalogo">
      <span class="ficha-catalogo__indice">${String(indice + 1).padStart(2, '0')}</span>
      <div class="ficha-catalogo__papel">${escaparHtml(membro.area)}</div>
      <h3 class="ficha-catalogo__titulo">${escaparHtml(membro.nome)}</h3>
      <p class="ficha-catalogo__texto">${escaparHtml(membro.instituicao)}</p>
    </article>
  `).join('');

  const ficha = document.getElementById('sobre-ficha-tecnica');
  ficha.innerHTML = `
    <p>${escaparHtml(FICHA_TECNICA.titulo)}</p>
    <p>${escaparHtml(FICHA_TECNICA.instituicao)}</p>
    <p>Autoria: ${FICHA_TECNICA.autores.map(escaparHtml).join(', ')} · Orientação: ${escaparHtml(FICHA_TECNICA.orientacao)} · ${escaparHtml(FICHA_TECNICA.ano)}</p>
  `;
}
