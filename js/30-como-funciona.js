import { escaparHtml, htmlMigalhas } from './1-utilitarios.js';
import {
  PASSOS_APOIAR,
  TABELA_MODELOS_FINANCIAMENTO,
  REQUISITOS_PESQUISADOR,
  PASSOS_INSTITUICAO,
  PERGUNTAS_FREQUENTES,
} from '../dados-falsos/14-como-funciona.js';

import { homeProfiles } from '../dados-falsos/7-home.js';

import { PROJETOS_FALSOS } from '../dados-falsos/13-projetos.js';
import { donorContributions } from '../dados-falsos/9-dash-doador.js';
import { PERFIL_PESQUISADOR_FALSO } from '../dados-falsos/15-perfil-pesquisador.js';
import { APROVACOES_PENDENTES_FALSAS } from '../dados-falsos/14-como-funciona.js';

function htmlTituloComDestaque(heading, destaque) {
  const partes = heading.split(destaque).map((parte) => escaparHtml(parte));
  if (partes.length < 2) return escaparHtml(heading);
  return partes.join(`<span class="texto-marca">${escaparHtml(destaque)}</span>`);
}

function htmlMockupPorIndice(indice) {
  if (indice === 0) {

    return `
      <span class="microrrotulo texto-fraco mb-3 block">Explorar projetos</span>
      ${PROJETOS_FALSOS.slice(0, 3).map((p) => `
        <div class="perfil-vitrine__mockup-linha">
          <div class="w-10 h-10 rounded-lg shrink-0 overflow-hidden bg-[var(--cor-tinta-900)]">
            <img src="${p.image}" alt="" class="w-full h-full object-cover opacity-80">
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-corpo-pequeno font-bold texto-forte truncate">${escaparHtml(p.title)}</div>
            <div class="legenda">${escaparHtml(p.institution)}</div>
          </div>
          <span class="numero text-corpo-pequeno font-bold texto-marca shrink-0">${Math.round((p.valorArrecadado / p.meta) * 100)}%</span>
        </div>
      `).join('')}
    `;
  }
  if (indice === 1) {

    return `
      <span class="microrrotulo texto-fraco mb-3 block">Suas contribuições</span>
      ${donorContributions.map((c) => `
        <div class="perfil-vitrine__mockup-linha">
          <div class="min-w-0 flex-1">
            <div class="text-corpo-pequeno font-bold texto-forte truncate">${escaparHtml(c.project)}</div>
            <div class="legenda">${escaparHtml(c.date)} · ${escaparHtml(c.payment)}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="numero text-corpo-pequeno font-bold texto-forte">${escaparHtml(c.value)}</div>
            <span class="badge ${c.statusTone === 'sucesso' ? 'badge-sucesso' : 'badge-neutro'}">${escaparHtml(c.status)}</span>
          </div>
        </div>
      `).join('')}
    `;
  }
  if (indice === 2) {

    return `
      <span class="microrrotulo texto-fraco mb-4 block">Painel do pesquisador</span>
      <div class="grid grid-cols-2 gap-4">
        ${PERFIL_PESQUISADOR_FALSO.metricas.map((m) => `
          <div class="metrica text-center">
            <div class="metrica__valor numero">${escaparHtml(m.valor)}</div>
            <div class="metrica__rotulo">${escaparHtml(m.rotulo)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <span class="microrrotulo texto-fraco mb-3 block">Aprovar campanhas</span>
    ${APROVACOES_PENDENTES_FALSAS.map((a) => `
      <div class="perfil-vitrine__mockup-linha">
        <div class="min-w-0 flex-1">
          <div class="text-corpo-pequeno font-bold texto-forte truncate">${escaparHtml(a.projeto)}</div>
          <div class="legenda">${escaparHtml(a.pesquisador)}</div>
        </div>
        <span class="badge ${a.classeModelo}">${escaparHtml(a.modelo)}</span>
      </div>
    `).join('')}
  `;
}

function renderizarPerfis() {
  const container = document.getElementById('como-funciona-perfis');
  if (!container) return;
  container.innerHTML = homeProfiles.map((profile, indice) => `
    <div class="perfil-vitrine ${indice % 2 === 1 ? 'perfil-vitrine--invertido' : ''}">
      <div class="perfil-vitrine__painel relative overflow-hidden">
        <div class="absolute inset-0 grade-medicao"></div>
        <span class="perfil-vitrine__chip"><i class="fa-solid ${profile.icon}"></i> ${escaparHtml(profile.title)}</span>
        <div class="perfil-vitrine__mockup">
          ${htmlMockupPorIndice(indice)}
        </div>
      </div>
      <div class="perfil-vitrine__conteudo">
        <span class="cabecalho-catalogo__rotulo">Perfil ${String(indice + 1).padStart(2, '0')} de ${homeProfiles.length}</span>
        <h3 class="titulo-secao mb-0">${htmlTituloComDestaque(profile.heading, profile.destaque)}</h3>
        <ul class="perfil-vitrine__lista">
          ${profile.beneficios.map((beneficio) => `
            <li>
              <span class="perfil-vitrine__icone"><i class="fa-solid fa-check"></i></span>
              <span class="paragrafo texto-padrao">${escaparHtml(beneficio)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

const ABAS = [
  { chave: 'apoiar', rotulo: 'Quero apoiar' },
  { chave: 'pesquisador', rotulo: 'Sou pesquisador' },
  { chave: 'instituicao', rotulo: 'Sou instituição' },
];
let abaAtiva = 'apoiar';

function htmlPassosApoiar() {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
      ${PASSOS_APOIAR.map((passo) => `
        <div class="cartao">
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-full fundo-marca-sutil texto-marca font-black flex items-center justify-center text-sm">${passo.numero}</span>
            <h3 class="subtitulo">${escaparHtml(passo.titulo)}</h3>
          </div>
          <p class="text-sm texto-padrao leading-relaxed">${escaparHtml(passo.texto)}</p>
        </div>
      `).join('')}
    </div>

    <h3 class="subtitulo mb-4">Tudo ou Nada × Flexível</h3>
    <div class="overflow-x-auto cartao" style="padding: 0;">
      <table class="tabela-simples">
        <thead>
          <tr>
            <th>Critério</th>
            <th>Tudo ou Nada</th>
            <th>Flexível</th>
          </tr>
        </thead>
        <tbody>
          ${TABELA_MODELOS_FINANCIAMENTO.map((linha) => `
            <tr>
              <td class="font-bold texto-forte">${escaparHtml(linha.criterio)}</td>
              <td>${escaparHtml(linha.tudoOuNada)}</td>
              <td>${escaparHtml(linha.flexivel)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function htmlPesquisador() {
  return `
    <p class="text-sm texto-padrao leading-relaxed mb-6">Para submeter uma campanha, você precisa atender a estes requisitos, todos verificados automaticamente ou avaliados pela curadoria antes da publicação:</p>
    <div class="space-y-4 mb-8">
      ${REQUISITOS_PESQUISADOR.map((req) => `
        <div class="flex gap-4 cartao">
          <div class="w-10 h-10 rounded-lg fundo-institucional-sutil texto-institucional flex items-center justify-center shrink-0"><i class="fa-solid ${req.icone}"></i></div>
          <div>
            <h3 class="subtitulo texto-forte mb-1">${escaparHtml(req.titulo)}</h3>
            <p class="text-sm texto-padrao leading-relaxed">${escaparHtml(req.texto)}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="aviso-caixa aviso-caixa--info">
      <i class="fa-solid fa-circle-info aviso-caixa__icone"></i>
      <div>Depois da aprovação, a plataforma cobra uma taxa percentual sobre o valor líquido repassado. O valor exato aparece no resumo antes da submissão final.</div>
    </div>
  `;
}

function htmlInstituicao() {
  return `
    <div class="space-y-4">
      ${PASSOS_INSTITUICAO.map((item) => `
        <div class="cartao">
          <h3 class="subtitulo texto-forte mb-2">${escaparHtml(item.titulo)}</h3>
          <p class="text-sm texto-padrao leading-relaxed">${escaparHtml(item.texto)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderizarConteudoAba() {
  const container = document.getElementById('como-funciona-conteudo');
  if (!container) return;
  const rotuloAba = ABAS.find((aba) => aba.chave === abaAtiva)?.rotulo || '';
  const cabecalhoAba = `<h2 class="sr-only">${escaparHtml(rotuloAba)}</h2>`;
  if (abaAtiva === 'apoiar') container.innerHTML = cabecalhoAba + htmlPassosApoiar();
  else if (abaAtiva === 'pesquisador') container.innerHTML = cabecalhoAba + htmlPesquisador();
  else container.innerHTML = cabecalhoAba + htmlInstituicao();
}

function renderizarAbas() {
  const container = document.getElementById('como-funciona-abas');
  if (!container) return;
  container.innerHTML = ABAS.map((aba) => `
    <button type="button" onclick="mudarAbaComoFunciona('${aba.chave}')" class="abas-simples__item ${aba.chave === abaAtiva ? 'abas-simples__item--ativo' : ''}">${escaparHtml(aba.rotulo)}</button>
  `).join('');
}

export function mudarAbaComoFunciona(chave) {
  abaAtiva = chave;
  renderizarAbas();
  renderizarConteudoAba();
}

function renderizarFaq() {
  const container = document.getElementById('como-funciona-faq');
  if (!container) return;
  const categorias = [...new Set(PERGUNTAS_FREQUENTES.map((p) => p.categoria))];
  container.innerHTML = categorias.map((categoria) => `
    <div class="mb-6">
      <p class="rotulo mb-3">${escaparHtml(categoria)}</p>
      <div class="space-y-2">
        ${PERGUNTAS_FREQUENTES.filter((p) => p.categoria === categoria).map((p) => `
          <details class="cartao">
            <summary class="font-bold texto-forte cursor-pointer">${escaparHtml(p.pergunta)}</summary>
            <p class="text-sm texto-padrao leading-relaxed mt-3">${escaparHtml(p.resposta)}</p>
          </details>
        `).join('')}
      </div>
    </div>
  `).join('');
}

export function renderizarTelaComoFunciona() {
  if (!document.getElementById('como-funciona-abas')) return;
  document.getElementById('migalhas-como-funciona').innerHTML = htmlMigalhas([{ rotulo: 'Como funciona' }]);
  renderizarPerfis();
  renderizarAbas();
  renderizarConteudoAba();
  renderizarFaq();
}
