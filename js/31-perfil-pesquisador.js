import { escaparHtml, htmlAvatar, htmlSeloReputacao } from './1-utilitarios.js';
import { PERFIL_PESQUISADOR_FALSO } from '../dados-falsos/15-perfil-pesquisador.js';
import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';
import { htmlCardProjeto } from './18-home.js';

function semTitulo(nome) {
  let resultado = nome;
  while (/^(Dra?|Profa?)\.?\s+/i.test(resultado)) {
    resultado = resultado.replace(/^(Dra?|Profa?)\.?\s+/i, '');
  }
  return resultado;
}

export function renderizarTelaPerfilPesquisador() {
  const p = PERFIL_PESQUISADOR_FALSO;

  const capa = document.getElementById('perfil-pesquisador-capa');
  if (capa) {

    capa.innerHTML = `
      <div class="absolute inset-0 grade-medicao"></div>
      <div class="relative max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
        <div class="p-1 rounded-full veu-claro shrink-0">${htmlAvatar(semTitulo(p.nome), { tamanho: 'xxl' })}</div>
        <div class="flex-1 min-w-0">
          <span class="cabecalho-catalogo__rotulo cabecalho-catalogo__rotulo--sobre-escuro">Perfil de pesquisador</span>
          <h1 class="titulo-pagina texto-sobre-escuro-forte">${escaparHtml(p.nome)}</h1>
          <p class="texto-sobre-escuro mt-1">${escaparHtml(p.cargo)}</p>
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-3 text-sm texto-sobre-escuro">
            <span class="inline-flex items-center gap-1.5 texto-sobre-escuro-forte font-bold"><i class="fa-solid fa-circle-check texto-marca-sobre-escuro"></i> Pesquisador desde ${escaparHtml(p.dataValidacao)}</span>
            <span><i class="fa-solid fa-location-dot mr-1"></i>${escaparHtml(p.cidade)}</span>
            <a href="${escaparHtml(p.lattes)}" onclick="mostrarAcao('Link Lattes aberto.'); return false;" class="hover:underline"><i class="fa-solid fa-link mr-1"></i>Lattes</a>
            <span><i class="fa-brands fa-orcid mr-1"></i>ORCID ${escaparHtml(p.orcid)}</span>
          </div>
        </div>
      </div>
    `;
  }

  const bio = document.getElementById('perfil-pesquisador-bio');
  if (bio) {

    bio.innerHTML = `
      <div class="mb-6">${htmlSeloReputacao(p.pontuacaoReputacao)}</div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        ${p.metricas.map((m) => `
          <div class="metrica text-center">
            <div class="metrica__valor numero">${escaparHtml(m.valor)}</div>
            <div class="metrica__rotulo">${escaparHtml(m.rotulo)}</div>
          </div>
        `).join('')}
      </div>
      <p class="paragrafo texto-padrao">${escaparHtml(p.bio)}</p>
    `;
  }

  const campanhas = document.getElementById('perfil-pesquisador-campanhas');
  if (campanhas) {
    const projetosDoPesquisador = PROJETOS_FALSOS.filter((proj) => proj.researcher === p.nome);
    campanhas.innerHTML = projetosDoPesquisador.length > 0
      ? projetosDoPesquisador.map(htmlCardProjeto).join('')
      : '<p class="texto-fraco text-sm sm:col-span-2">Nenhuma campanha pública no momento.</p>';
  }

  const formacao = document.getElementById('perfil-pesquisador-formacao');
  if (formacao) {

    formacao.innerHTML = p.formacao.map((item) => `
      <div class="linha-do-tempo__item">
        <div class="linha-do-tempo__marcador"></div>
        <p class="linha-do-tempo__ano mb-1">${escaparHtml(item.ano)}</p>
        <p class="font-bold texto-forte">${escaparHtml(item.titulo)}</p>
        <p class="text-sm texto-fraco">${escaparHtml(item.local)}</p>
      </div>
    `).join('');
  }

  const publicacoes = document.getElementById('perfil-pesquisador-publicacoes');
  if (publicacoes) {

    publicacoes.innerHTML = p.publicacoes.map((pub) => `
      <div class="cartao flex items-start gap-3">
        <i class="fa-solid fa-file-lines texto-fraco mt-1"></i>
        <div>
          <p class="font-semibold texto-forte leading-snug">${escaparHtml(pub.titulo)}</p>
          <p class="paragrafo-denso mt-1">${escaparHtml(pub.veiculo)} · ${escaparHtml(pub.ano)}</p>
        </div>
      </div>
    `).join('');
  }

  const cta = document.getElementById('perfil-pesquisador-cta');
  if (cta) {
    cta.innerHTML = `
      <h3 class="subtitulo texto-forte mb-4">Acompanhar este pesquisador</h3>
      <button type="button" onclick="mostrarAcao('Você passou a seguir Dra. Marina Souza.')" class="btn btn-primary w-full mb-3"><i class="fa-solid fa-star"></i> Seguir pesquisador</button>
      <button type="button" onclick="nav('campanha')" class="btn btn-secondary w-full"><i class="fa-solid fa-flask"></i> Ver campanha ativa</button>
    `;
  }
}
