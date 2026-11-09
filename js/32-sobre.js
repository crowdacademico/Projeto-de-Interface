import { escaparHtml, renderizarCabecalhoPagina } from './1-utilitarios.js';
import {
  MISSAO_PARAGRAFOS,
  ETAPAS_CURADORIA,
  METRICAS_CURADORIA,
  FICHA_TECNICA,
} from '../dados-falsos/16-sobre.js';

export function renderizarTelaSobre() {
  const missao = document.getElementById('sobre-missao');
  if (!missao) return;
  renderizarCabecalhoPagina('cabecalho-pagina-sobre', {
    migalhas: [{ rotulo: 'Sobre' }],
    titulo: 'Sobre o CrowdAcadêmico',
    descricao: 'Conheça a missão, a curadoria e os princípios da plataforma.',
  });
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

  const ficha = document.getElementById('sobre-ficha-tecnica');
  ficha.innerHTML = `
    <p>${escaparHtml(FICHA_TECNICA.titulo)}</p>
    <p>${escaparHtml(FICHA_TECNICA.instituicao)}</p>
    <p>Autoria: ${FICHA_TECNICA.autores.map(escaparHtml).join(', ')} · Orientação: ${escaparHtml(FICHA_TECNICA.orientacao)} · ${escaparHtml(FICHA_TECNICA.ano)}</p>
  `;
}
