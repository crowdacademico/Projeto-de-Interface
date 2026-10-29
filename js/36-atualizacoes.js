import { escaparHtml, htmlEscalaProgresso, htmlMigalhas } from './1-utilitarios.js';
import { CAMPANHA_ATUALIZACOES, POSTS_ATUALIZACOES } from '../dados-falsos/20-atualizacoes.js';

const ABAS_FILTRO = [
  { chave: 'todas', rotulo: 'Todas' },
  { chave: 'marco', rotulo: 'Marcos' },
  { chave: 'post', rotulo: 'Resultados' },
];
let filtroAtivo = 'todas';

function htmlPost(post) {
  const marcador = post.tipo === 'marco' ? 'linha-do-tempo__marcador linha-do-tempo__marcador--marco' : 'linha-do-tempo__marcador';
  const bloqueado = post.visibilidade === 'apoiador';

  const corpo = bloqueado
    ? `
      <div class="relative mt-2">
        <p class="text-sm texto-padrao leading-relaxed blur-sm select-none" aria-hidden="true">${escaparHtml(post.corpo)}</p>
        <div class="absolute inset-0 flex items-center justify-center">
          <button type="button" onclick="nav('campanha')" class="btn btn-primary text-xs py-2 px-4"><i class="fa-solid fa-lock"></i> Apoie para ler</button>
        </div>
      </div>
    `
    : `<p class="text-sm texto-padrao leading-relaxed mt-2">${escaparHtml(post.corpo)}</p>`;

  return `
    <div class="linha-do-tempo__item">
      <div class="${marcador}"></div>
      <p class="microrrotulo mb-1">${escaparHtml(post.data)}${post.autor ? ` · ${escaparHtml(post.autor)}` : ''}</p>
      <p class="font-bold texto-forte">${escaparHtml(post.titulo)}</p>
      ${corpo}
    </div>
  `;
}

function renderizarLista() {
  const container = document.getElementById('atualizacoes-lista');
  if (!container) return;
  const posts = filtroAtivo === 'todas' ? POSTS_ATUALIZACOES : POSTS_ATUALIZACOES.filter((p) => p.tipo === filtroAtivo);
  container.innerHTML = posts.map(htmlPost).join('');
}

function renderizarFiltro() {
  const container = document.getElementById('atualizacoes-filtro');
  if (!container) return;
  container.innerHTML = ABAS_FILTRO.map((aba) => `
    <button type="button" onclick="mudarFiltroAtualizacoes('${aba.chave}')" class="abas-simples__item ${aba.chave === filtroAtivo ? 'abas-simples__item--ativo' : ''}">${escaparHtml(aba.rotulo)}</button>
  `).join('');
}

export function mudarFiltroAtualizacoes(chave) {
  filtroAtivo = chave;
  renderizarFiltro();
  renderizarLista();
}

export function renderizarTelaAtualizacoes() {
  const cabecalho = document.getElementById('atualizacoes-cabecalho-progresso');
  if (!cabecalho) return;
  document.getElementById('migalhas-atualizacoes').innerHTML = htmlMigalhas([
    { rotulo: CAMPANHA_ATUALIZACOES.projeto, rota: 'campanha' },
    { rotulo: 'Atualizações' },
  ]);

  cabecalho.innerHTML = `
    <p class="font-bold texto-forte mb-3">${escaparHtml(CAMPANHA_ATUALIZACOES.projeto)}</p>
    ${htmlEscalaProgresso({
      percentual: CAMPANHA_ATUALIZACOES.percentualAtual,
      valorAtual: CAMPANHA_ATUALIZACOES.valorAtual,
      valorMeta: CAMPANHA_ATUALIZACOES.valorMeta,
      modelo: CAMPANHA_ATUALIZACOES.modelo,
      compacta: true,
    })}
  `;

  renderizarFiltro();
  renderizarLista();
}
