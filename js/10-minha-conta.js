import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { SeloStatusConta } from '../src/components/crud/selo-status-conta';
import { PerfilContaPublica } from '../src/components/crud/perfil-conta-publica';
import { ModalAlterarSenha } from '../src/components/crud/modal-alterar-senha';
import { GerenciadorCampanhas } from '../src/components/crud/gerenciador-campanhas';
import { usuarioAtual } from './4-autenticacao-falsa.js';
import { papeisDoUsuario } from '../dados-falsos/1-usuarios.js';
import {
  ATIVIDADE_CONTA_INICIAL,
  CAMPANHAS_PESQUISADORAS_INICIAIS,
  COMENTARIOS_PESQUISADOR_INICIAIS,
} from '../dados-falsos/26-minha-conta.js';
import { htmlAvatar, escaparHtml, formatarData, formatarDataHora, mostrarAcao, htmlMigalhas } from './1-utilitarios.js';
import { atualizarCabecalhoConta } from './7-cabecalho.js';
import { nav } from './24-roteador.js';

const CHAVE_ESTADO_CONTA = 'crowdacademico-prototipo.minha-conta';
const ROTULOS_ABA = {
  visao: 'Visão geral',
  perfil: 'Perfil',
  seguranca: 'Segurança',
  atividade: 'Minha atividade',
  comunidade: 'Comunidade',
  privacidade: 'Privacidade',
  administrador: 'Administração',
};
const TONS_ESTADO = {
  'Em captação': 'badge-sucesso',
  Finalizada: 'badge-neutro',
  Rascunho: 'badge-aviso',
  'Em análise': 'badge-aviso',
  Confirmada: 'badge-sucesso',
  Processando: 'badge-aviso',
  'Em análise pela moderação': 'badge-aviso',
};

let raizSeloStatusConta;
let raizPerfilConta;
let raizSenhaConta;
let raizGerenciadorCampanhas;
let estadoAtual;
let abaAtiva = 'visao';

function clonar(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function chaveEstado(usuario) {
  return `${CHAVE_ESTADO_CONTA}.${usuario.idUsuario}`;
}

function normalizarCampanha(campanha, inicial = {}) {
  const recompensasIniciais = Array.isArray(inicial.recompensas) ? inicial.recompensas : [];
  const atualizacoesIniciais = Array.isArray(inicial.atualizacoes) ? inicial.atualizacoes : [];
  const comentariosIniciais = Array.isArray(inicial.comentarios) ? inicial.comentarios : [];
  const contribuicoesIniciais = Array.isArray(inicial.contribuicoes) ? inicial.contribuicoes : [];
  const recompensas = Array.isArray(campanha.recompensas)
    ? campanha.recompensas.map((recompensa, indice) => {
      if (typeof recompensa !== 'string') return { ...recompensasIniciais[indice], ...recompensa };
      return recompensasIniciais.find((item) => item.titulo === recompensa) || {
        id: `migrada-${campanha.id}-${indice}`,
        titulo: recompensa,
        descricao: '',
        tipo: 'reconhecimento',
        valorMinimo: '1.00',
        quantidadeDisponivel: null,
        escolhidas: 0,
        ativo: true,
        url: '',
        tipoLink: '',
      };
    })
    : recompensasIniciais;
  const atualizacoes = Array.isArray(campanha.atualizacoes)
    ? campanha.atualizacoes.map((atualizacao, indice) => ({
      ...atualizacoesIniciais[indice],
      ...atualizacao,
      id: atualizacao.id || atualizacoesIniciais[indice]?.id || `migrada-${campanha.id}-atualizacao-${indice}`,
      mensagem: atualizacao.mensagem || '',
      fase: atualizacao.fase || 'andamento',
      tipo: atualizacao.tipo || 'texto',
      ativo: atualizacao.ativo !== false,
    }))
    : atualizacoesIniciais;
  const comentarios = Array.isArray(campanha.comentarios)
    ? campanha.comentarios.map((comentario, indice) => ({
      ...comentariosIniciais[indice],
      ...comentario,
      id: comentario.id || comentariosIniciais[indice]?.id || `migrada-${campanha.id}-comentario-${indice}`,
      criadoEm: comentario.criadoEm || '2026-08-01',
      ativo: comentario.ativo !== false,
    }))
    : comentariosIniciais;

  return {
    ...inicial,
    ...campanha,
    capaUrl: campanha.capaUrl || inicial.capaUrl || 'imagens/projeto-biologicas.jpg',
    videoUrl: campanha.videoUrl || '',
    dataInicio: campanha.dataInicio || '',
    dataFim: campanha.dataFim || '',
    modalidade: campanha.modalidade || 'all-or-nothing',
    recompensas,
    atualizacoes,
    comentarios,
    contribuicoes: Array.isArray(campanha.contribuicoes) ? campanha.contribuicoes : contribuicoesIniciais,
  };
}

function normalizarListaCampanhas(campanhasSalvas, campanhasIniciais) {
  const normalizadas = campanhasSalvas.map((campanha) =>
    normalizarCampanha(campanha, campanhasIniciais.find((item) => item.id === campanha.id)));
  const idsSalvos = new Set(normalizadas.map((campanha) => campanha.id));
  return [
    ...normalizadas,
    ...campanhasIniciais.filter((campanha) => !idsSalvos.has(campanha.id)),
  ];
}

function estadoInicial(usuario) {
  return {
    nome: usuario.nome,
    foto: '',
    atividade: clonar(ATIVIDADE_CONTA_INICIAL),
    pesquisador: {
      tipoVinculo: usuario.perfilPesquisador?.tipoVinculo || 'institucional',
      instituicao: usuario.perfilPesquisador?.instituicao || '',
      tituloAcademico: usuario.perfilPesquisador?.tituloAcademico || '',
      cpfMascarado: usuario.perfilPesquisador?.cpfMascarado || 'Não informado',
      statusPesquisador: usuario.perfilPesquisador?.statusPesquisador || 'Ativo',
      scoreAtual: usuario.perfilPesquisador?.scoreAtual || 0,
      chavePixMascarada: '**** **** ****',
      tipoChavePix: 'CPF',
    },
    campanhas: clonar(CAMPANHAS_PESQUISADORAS_INICIAIS),
    comentarios: clonar(COMENTARIOS_PESQUISADOR_INICIAIS),
  };
}

function lerEstado(usuario) {
  const inicial = estadoInicial(usuario);
  const salvo = localStorage.getItem(chaveEstado(usuario));
  if (!salvo) return inicial;

  try {
    const valor = JSON.parse(salvo);
    return {
      ...inicial,
      ...valor,
      atividade: { ...inicial.atividade, ...valor.atividade },
      pesquisador: { ...inicial.pesquisador, ...valor.pesquisador },
      campanhas: Array.isArray(valor.campanhas)
        ? normalizarListaCampanhas(valor.campanhas, inicial.campanhas)
        : inicial.campanhas,
      comentarios: Array.isArray(valor.comentarios) ? valor.comentarios : inicial.comentarios,
    };
  } catch {
    localStorage.removeItem(chaveEstado(usuario));
    mostrarAcao('Os dados locais da conta estavam inválidos e foram reiniciados.');
    return inicial;
  }
}

function salvarEstado() {
  const usuario = usuarioAtual();
  if (!usuario || !estadoAtual) return;
  localStorage.setItem(chaveEstado(usuario), JSON.stringify(estadoAtual));
}

function temPapel(usuario, papel) {
  return (usuario.papeis || []).includes(papel);
}

function htmlSelo(estado) {
  const classe = TONS_ESTADO[estado] || 'badge-neutro';
  return `<span class="badge ${classe}">${escaparHtml(estado)}</span>`;
}

function htmlBotaoAba(chave, icone, ativo = false) {
  return `
    <button type="button" role="tab" id="aba-conta-${chave}" aria-controls="painel-conta-${chave}"
      aria-selected="${ativo}" tabindex="${ativo ? 0 : -1}" data-aba-conta="${chave}"
      class="inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition-colors ${ativo ? 'borda-marca texto-marca' : 'border-transparent texto-fraco hover-texto-forte'}">
      <i class="fa-solid ${icone}" aria-hidden="true"></i>${ROTULOS_ABA[chave]}
    </button>
  `;
}

function htmlPainel(chave, conteudo) {
  return `<section id="painel-conta-${chave}" role="tabpanel" aria-labelledby="aba-conta-${chave}" data-painel-conta="${chave}" class="space-y-6 ${chave === abaAtiva ? '' : 'hidden'}">${conteudo}</section>`;
}

function htmlCartao(titulo, conteudo, classe = '') {
  return `
    <section class="rounded-xl border borda-padrao fundo-cartao p-5 sm:p-6 ${classe}">
      <h2 class="subtitulo texto-forte mb-4">${titulo}</h2>
      ${conteudo}
    </section>
  `;
}

function htmlFaixaIdentidade(usuario) {
  const papeis = papeisDoUsuario(usuario);
  const membroDesde = usuario.criadoEm
    ? new Date(usuario.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '';
  const foto = estadoAtual.foto || null;

  return `
    <header class="relative overflow-hidden rounded-t-2xl border-b borda-padrao fundo-sutil px-6 py-7 sm:px-8 sm:py-9">
      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div class="rounded-full fundo-cartao p-1 shadow-md">${htmlAvatar(estadoAtual.nome, { tamanho: 'xxl', foto })}</div>
        <div class="min-w-0 flex-1">
          <p class="microrrotulo texto-marca mb-1">Minha conta</p>
          <h1 class="titulo-pagina texto-forte break-words">${escaparHtml(estadoAtual.nome)}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm texto-fraco">
            <span class="break-all">${escaparHtml(usuario.email)}</span>
            <span id="selo-status-conta"></span>
            ${membroDesde ? `<span>Membro desde ${escaparHtml(membroDesde)}</span>` : ''}
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            ${papeis.map((papel) => `<span class="badge badge-neutro">${escaparHtml(papel.nome === 'usuario' ? 'Usuário' : papel.nome === 'administrador' ? 'Administrador' : 'Pesquisador')}</span>`).join('')}
          </div>
        </div>
        ${temPapel(usuario, 'administrador') ? '<span class="badge badge-info self-start"><i class="fa-solid fa-shield-halved mr-1"></i>Acesso administrativo</span>' : ''}
      </div>
    </header>
  `;
}

function htmlVisaoGeral(usuario) {
  const atividade = estadoAtual.atividade;
  const campanhas = temPapel(usuario, 'pesquisador') ? estadoAtual.campanhas : [];
  const totalContribuido = atividade.contribuicoes.length;
  const totalCampanhas = campanhas.length;
  const pendencias = campanhas.reduce((total, campanha) =>
    total + campanha.comentarios.filter((comentario) => !comentario.endossado).length, 0);

  return htmlPainel('visao', `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 ${temPapel(usuario, 'pesquisador') ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}">
      ${htmlCartao('Campanhas seguidas', `<p class="numero text-3xl font-bold texto-forte">${atividade.campanhasSeguidas.length}</p><p class="mt-1 text-sm texto-fraco">Acompanhe novidades e progresso.</p>`)}
      ${htmlCartao('Contribuições', `<p class="numero text-3xl font-bold texto-forte">${totalContribuido}</p><p class="mt-1 text-sm texto-fraco">Com recompensas vinculadas.</p>`)}
      ${temPapel(usuario, 'pesquisador') ? htmlCartao('Campanhas criadas', `<p class="numero text-3xl font-bold texto-forte">${totalCampanhas}</p><p class="mt-1 text-sm texto-fraco">Ativas, finalizadas e rascunhos.</p>`) : ''}
      ${temPapel(usuario, 'pesquisador') ? htmlCartao('Comentários pendentes', `<p class="numero text-3xl font-bold texto-forte">${pendencias}</p><p class="mt-1 text-sm texto-fraco">Aguardam seu endosso para ficarem públicos.</p>`) : ''}
    </div>
    ${htmlCartao('Atalhos', `
      <div class="flex flex-wrap gap-3">
        <button type="button" class="btn btn-secondary" data-ir-aba="atividade"><i class="fa-solid fa-heart mr-2"></i>Ver contribuições e listas</button>
        ${temPapel(usuario, 'pesquisador') ? '<button type="button" class="btn btn-secondary" data-acao="minhas-campanhas"><i class="fa-solid fa-flask mr-2"></i>Gerenciar campanhas</button><button type="button" class="btn btn-primary" data-acao="criar-campanha"><i class="fa-solid fa-plus mr-2"></i>Cadastrar campanha</button>' : ''}
        ${temPapel(usuario, 'administrador') ? '<button type="button" class="btn btn-secondary" data-ir-aba="administrador"><i class="fa-solid fa-shield-halved mr-2"></i>Acesso administrativo</button>' : ''}
      </div>
    `)}
    ${temPapel(usuario, 'administrador') ? htmlAvisoAdmin(temPapel(usuario, 'pesquisador')) : ''}
  `);
}

function htmlAvisoAdmin(temPerfilPesquisador) {
  return `
    <aside class="flex items-start gap-3 rounded-xl border borda-info fundo-info p-4" role="note">
      <i class="fa-solid fa-circle-info texto-info mt-1" aria-hidden="true"></i>
      <p class="text-sm texto-padrao">O papel de administrador soma permissões à conta comum. ${temPerfilPesquisador ? 'Seu perfil de pesquisador permanece nesta conta e suas campanhas ficam em uma página própria.' : 'Se você também for pesquisador, os recursos correspondentes estarão disponíveis.'}</p>
    </aside>
  `;
}

function htmlPerfil(usuario) {
  return htmlPainel('perfil', '<div id="perfil-conta-publico"></div>');
}

function htmlSeguranca(usuario) {
  return htmlPainel('seguranca', `
    ${htmlCartao('Senha', `
      <p class="mb-4 text-sm texto-fraco">A alteração da senha é feita em uma janela segura.</p>
      <div id="modal-alterar-senha-publica"></div>
    `)}
    ${htmlCartao('Verificação e sessões', `
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border borda-padrao p-4">
          <div><p class="font-semibold texto-forte">E-mail verificado</p><p class="text-sm texto-fraco">${escaparHtml(usuario.email)}</p></div>
          ${usuario.emailVerificado ? '<span class="badge badge-sucesso">Verificado</span>' : '<span class="badge badge-aviso">Pendente</span>'}
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border borda-padrao p-4">
          <div><p class="font-semibold texto-forte">Sessão atual</p><p class="text-sm texto-fraco">Windows · Navegador atual · ${escaparHtml(formatarDataHora(usuario.ultimoLoginEm || new Date()))}</p></div>
          <span class="badge badge-info">Ativa</span>
        </div>
      </div>
    `)}
  `);
}

function htmlAtividade() {
  const atividade = estadoAtual.atividade;
  return htmlPainel('atividade', `
    <div class="space-y-6">
      ${htmlCartao('Campanhas que sigo', `
        <ul class="divide-y divide-[var(--cor-borda)]">
          ${atividade.campanhasSeguidas.map((item) => `
            <li class="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><p class="font-semibold texto-forte">${escaparHtml(item.titulo)}</p><p class="text-sm texto-fraco">${escaparHtml(item.estado)}</p></div>
              <div class="flex gap-2">
                <button type="button" class="btn btn-secondary btn-pequeno" data-acao="abrir-campanha">Ver campanha</button>
                <button type="button" class="btn btn-secondary btn-pequeno" data-parar-seguir="campanhas" data-indice-seguindo="${atividade.campanhasSeguidas.indexOf(item)}">Deixar de seguir</button>
              </div>
            </li>
          `).join('') || '<li class="py-3 text-sm texto-fraco">Você ainda não segue campanhas.</li>'}
        </ul>
      `)}
      ${htmlCartao('Pesquisadores que sigo', `
        <ul class="divide-y divide-[var(--cor-borda)]">
          ${atividade.pesquisadoresSeguidos.map((item) => `
            <li class="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><p class="font-semibold texto-forte">${escaparHtml(item.nome)}</p><p class="text-sm texto-fraco">${escaparHtml(item.instituicao)}</p></div>
              <div class="flex gap-2">
                <button type="button" class="btn btn-secondary btn-pequeno" data-acao="ver-pesquisador">Ver perfil</button>
                <button type="button" class="btn btn-secondary btn-pequeno" data-parar-seguir="pesquisadores" data-indice-seguindo="${atividade.pesquisadoresSeguidos.indexOf(item)}">Deixar de seguir</button>
              </div>
            </li>
          `).join('') || '<li class="py-3 text-sm texto-fraco">Você ainda não segue pesquisadores.</li>'}
        </ul>
      `)}
    </div>
    ${htmlCartao('Minhas denúncias', `
      <p class="mb-3 text-sm texto-fraco">Acompanhe o estado das denúncias enviadas à moderação.</p>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[35rem] text-left text-sm">
          <thead><tr class="border-b borda-padrao texto-fraco"><th class="py-3 pr-4">Alvo</th><th class="py-3 pr-4">Motivo</th><th class="py-3">Estado</th></tr></thead>
          <tbody>${atividade.denuncias.map((item) => `<tr class="border-b borda-padrao"><td class="py-3 pr-4 font-semibold texto-forte">${escaparHtml(item.alvo)}</td><td class="py-3 pr-4 texto-padrao">${escaparHtml(item.motivo)}</td><td class="py-3">${htmlSelo(item.estado)}</td></tr>`).join('') || '<tr><td class="py-4 texto-fraco" colspan="3">Você ainda não enviou denúncias.</td></tr>'}</tbody>
        </table>
      </div>
    `)}
    ${htmlCartao('Contribuições e recompensas', `
      <p class="mb-3 text-sm texto-fraco">Veja os apoios realizados, o meio de pagamento e a recompensa correspondente.</p>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[50rem] text-left text-sm">
          <thead><tr class="border-b borda-padrao texto-fraco"><th class="py-3 pr-4">Campanha</th><th class="py-3 pr-4">Data</th><th class="py-3 pr-4">Valor</th><th class="py-3 pr-4">Pagamento</th><th class="py-3 pr-4">Recompensa</th><th class="py-3">Estado</th></tr></thead>
          <tbody>${atividade.contribuicoes.map((item) => `<tr class="border-b borda-padrao"><td class="py-3 pr-4 font-semibold texto-forte">${escaparHtml(item.campanha)}</td><td class="py-3 pr-4 texto-padrao">${escaparHtml(item.data)}</td><td class="py-3 pr-4 font-semibold texto-forte">${escaparHtml(item.valor)}</td><td class="py-3 pr-4 texto-padrao">${escaparHtml(item.pagamento)}</td><td class="py-3 pr-4 texto-padrao">${escaparHtml(item.recompensa || 'Sem recompensa selecionada')}</td><td class="py-3">${htmlSelo(item.estado)}</td></tr>`).join('') || '<tr><td class="py-4 texto-fraco" colspan="6">Suas contribuições aparecerão aqui.</td></tr>'}</tbody>
        </table>
      </div>
    `)}
  `);
}

function htmlComunidade() {
  return htmlPainel('comunidade', `
    ${htmlCartao('Comentários feitos em outras campanhas', `
      <p class="mb-4 text-sm texto-fraco">Seus comentários só ficam públicos depois que o pesquisador responsável os endossa.</p>
      <ul class="space-y-3">${estadoAtual.comentarios.map((comentario) => `
        <li class="rounded-lg border borda-padrao p-4">
          <div class="mb-2 flex flex-wrap items-center justify-between gap-2"><strong class="texto-forte">${escaparHtml(comentario.campanha)}</strong>${htmlSelo(comentario.estado)}</div>
          <p class="text-sm texto-padrao">${escaparHtml(comentario.texto)}</p>
        </li>
      `).join('') || '<li class="text-sm texto-fraco">Você ainda não comentou em campanhas.</li>'}</ul>
    `)}
  `);
}

function htmlPrivacidade() {
  return htmlPainel('privacidade', `
    ${htmlCartao('Seus dados', `
      <p class="text-sm texto-fraco">Você pode solicitar uma cópia dos dados da conta ou pedir o encerramento do cadastro.</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" class="btn btn-secondary" data-acao="exportar-dados">Solicitar exportação</button>
        <button type="button" class="btn btn-danger" data-acao="excluir-conta">Solicitar exclusão da conta</button>
      </div>
    `)}
  `);
}

function htmlAdministrador(temPerfilPesquisador) {
  return htmlPainel('administrador', `
    ${htmlCartao('Acesso administrativo', `
      <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full fundo-info texto-info"><i class="fa-solid fa-shield-halved text-xl" aria-hidden="true"></i></div>
        <div class="flex-1"><h3 class="font-bold texto-forte">Área restrita do CrowdAcadêmico</h3><p class="mt-1 text-sm texto-fraco">Use suas permissões administrativas para gerenciar usuários, campanhas e denúncias. O painel restrito é um aplicativo separado deste protótipo público.</p></div>
        <button type="button" class="btn btn-primary shrink-0" data-acao="area-restrita">Acessar área restrita</button>
      </div>
      <div class="mt-5 rounded-lg fundo-destaque p-4 text-sm texto-padrao">A conta também mantém as funcionalidades de usuário comum${temPerfilPesquisador ? ' e de pesquisador' : ''}. O acesso administrativo não substitui esses papéis.</div>
    `)}
  `);
}

function renderizarAbas(usuario) {
  const abas = [
    ['visao', 'fa-house'],
    ['perfil', 'fa-user'],
    ['seguranca', 'fa-shield-halved'],
    ['atividade', 'fa-heart'],
  ];
  if (temPapel(usuario, 'pesquisador')) {
    abas.push(['comunidade', 'fa-comments']);
  }
  abas.push(['privacidade', 'fa-lock']);
  if (temPapel(usuario, 'administrador')) abas.push(['administrador', 'fa-user-shield']);
  if (!abas.some(([chave]) => chave === abaAtiva)) abaAtiva = 'visao';

  const botoes = abas.map(([chave, icone]) => htmlBotaoAba(chave, icone, chave === abaAtiva)).join('');
  const paineis = [
    htmlVisaoGeral(usuario),
    htmlPerfil(usuario),
    htmlSeguranca(usuario),
    htmlAtividade(),
    temPapel(usuario, 'pesquisador') ? htmlComunidade() : '',
    htmlPrivacidade(),
    temPapel(usuario, 'administrador') ? htmlAdministrador(temPapel(usuario, 'pesquisador')) : '',
  ].join('');

  return `
    <div class="border-b borda-padrao px-4 sm:px-6">
      <div class="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Seções da conta">${botoes}</div>
    </div>
    <div class="space-y-6 p-4 sm:p-6 lg:p-8">${paineis}</div>
  `;
}

function abaPermitida(usuario, chave) {
  if (!Object.hasOwn(ROTULOS_ABA, chave)) return false;
  if (chave === 'comunidade') return temPapel(usuario, 'pesquisador');
  if (chave === 'administrador') return temPapel(usuario, 'administrador');
  return true;
}

function ativarAba(chave) {
  const usuario = usuarioAtual();
  if (!usuario || !abaPermitida(usuario, chave) || !document.querySelector(`[data-painel-conta="${chave}"]`)) return;
  abaAtiva = chave;
  document.querySelectorAll('[data-aba-conta]').forEach((botao) => {
    const ativo = botao.dataset.abaConta === chave;
    botao.setAttribute('aria-selected', String(ativo));
    botao.tabIndex = ativo ? 0 : -1;
    botao.classList.toggle('borda-marca', ativo);
    botao.classList.toggle('texto-marca', ativo);
    botao.classList.toggle('border-transparent', !ativo);
    botao.classList.toggle('texto-fraco', !ativo);
    botao.classList.toggle('hover-texto-forte', !ativo);
  });
  document.querySelectorAll('[data-painel-conta]').forEach((painel) => {
    painel.classList.toggle('hidden', painel.dataset.painelConta !== chave);
  });
}

export function selecionarAbaMinhaConta(chave) {
  ativarAba(chave);
}

function vincularBotoes() {
  document.querySelectorAll('[data-aba-conta]').forEach((botao) => {
    botao.addEventListener('click', () => ativarAba(botao.dataset.abaConta));
    botao.addEventListener('keydown', (evento) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
      evento.preventDefault();
      const botoes = [...document.querySelectorAll('[data-aba-conta]')];
      const indiceAtual = botoes.indexOf(botao);
      const indice = evento.key === 'Home' ? 0 : evento.key === 'End' ? botoes.length - 1
        : (indiceAtual + (evento.key === 'ArrowRight' ? 1 : -1) + botoes.length) % botoes.length;
      const proximo = botoes[indice];
      ativarAba(proximo.dataset.abaConta);
      proximo.focus();
    });
  });
  document.querySelectorAll('[data-ir-aba]').forEach((botao) => {
    botao.addEventListener('click', () => {
      ativarAba(botao.dataset.irAba);
      document.getElementById(`aba-conta-${botao.dataset.irAba}`)?.focus();
    });
  });
}

function vincularAcoesGerais(raiz = document) {
  raiz.querySelectorAll('[data-acao]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const acao = botao.dataset.acao;
      if (acao === 'criar-campanha') {
        nav('criar-campanha');
      } else if (acao === 'minhas-campanhas') {
        nav('minhas-campanhas');
      } else if (acao === 'abrir-campanha') {
        nav('campanha');
      } else if (acao === 'ver-pesquisador') {
        nav('perfil-pesquisador');
      } else if (acao === 'area-restrita') {
        mostrarAcao('A área restrita roda como aplicativo separado e precisa estar aberta para continuar.');
      } else if (acao === 'exportar-dados') {
        mostrarAcao('A solicitação de exportação foi registrada neste protótipo.');
      } else if (acao === 'excluir-conta') {
        mostrarAcao('A exclusão exige confirmação e atendimento; nenhum dado foi removido neste protótipo.');
      }
    });
  });
  raiz.querySelectorAll('[data-parar-seguir]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const lista = botao.dataset.pararSeguir;
      const indice = Number(botao.dataset.indiceSeguindo);
      if (!['campanhas', 'pesquisadores'].includes(lista) || !Number.isInteger(indice)) return;
      const propriedade = lista === 'campanhas' ? 'campanhasSeguidas' : 'pesquisadoresSeguidos';
      estadoAtual.atividade[propriedade].splice(indice, 1);
      salvarEstado();
      renderizarTelaMinhaConta();
      ativarAba('atividade');
      mostrarAcao('Você deixou de seguir este item.');
    });
  });
}

export function obterComentariosCampanha() {
  const usuario = usuarioAtual();
  if (!usuario) return [];
  estadoAtual = lerEstado(usuario);
  return estadoAtual.comentarios;
}

export function registrarComentarioCampanha(campanha, texto) {
  const usuario = usuarioAtual();
  if (!usuario || !temPapel(usuario, 'pesquisador')) {
    throw new Error('Somente pesquisadores autenticados podem comentar em campanhas.');
  }
  estadoAtual = lerEstado(usuario);
  estadoAtual.comentarios.unshift({
    campanha,
    texto,
    autor: usuario.nome,
    estado: 'Aguardando endosso do pesquisador',
  });
  salvarEstado();
}

export function renderizarTelaMinhaConta() {
  const faixa = document.getElementById('faixa-identidade-minha-conta');
  if (!faixa) return;
  const secoes = document.getElementById('secoes-minha-conta');
  const migalhas = document.getElementById('migalhas-minha-conta');
  if (migalhas) migalhas.innerHTML = htmlMigalhas([{ rotulo: 'Minha Conta' }]);

  const usuario = usuarioAtual();
  if (!usuario) {
    raizPerfilConta?.unmount();
    raizPerfilConta = undefined;
    raizSenhaConta?.unmount();
    raizSenhaConta = undefined;
    raizSeloStatusConta?.unmount();
    raizSeloStatusConta = undefined;
    faixa.innerHTML = '';
    secoes.innerHTML = `
      <div class="rounded-2xl border borda-padrao fundo-cartao p-8 text-center">
        <i class="fa-solid fa-user-lock text-3xl texto-fraco" aria-hidden="true"></i>
        <h1 class="subtitulo texto-forte mt-3">Entre para acessar sua conta</h1>
        <p class="mt-2 text-sm texto-fraco">Faça login para consultar seus dados, contribuições e atividades.</p>
        <button type="button" class="btn btn-primary mt-5" data-ir-login>Entrar</button>
      </div>
    `;
    secoes.querySelector('[data-ir-login]')?.addEventListener('click', () => nav('login'));
    return;
  }

  estadoAtual = lerEstado(usuario);
  raizSeloStatusConta?.unmount();
  raizSeloStatusConta = undefined;
  faixa.innerHTML = htmlFaixaIdentidade(usuario);
  const seloStatus = document.getElementById('selo-status-conta');
  if (!seloStatus) throw new Error('Contêiner de status da conta não encontrado.');
  if (!raizSeloStatusConta) {
    raizSeloStatusConta = createRoot(seloStatus);
  }
  flushSync(() => raizSeloStatusConta.render(createElement(SeloStatusConta, {
    emailVerificado: usuario.emailVerificado,
  })));

  raizPerfilConta?.unmount();
  raizPerfilConta = undefined;
  raizSenhaConta?.unmount();
  raizSenhaConta = undefined;
  secoes.innerHTML = renderizarAbas(usuario);
  const hostPerfil = document.getElementById('perfil-conta-publico');
  if (!hostPerfil) throw new Error('Contêiner do perfil público não encontrado.');
  raizPerfilConta = createRoot(hostPerfil);
  flushSync(() => raizPerfilConta.render(createElement(PerfilContaPublica, {
    dados: {
      nome: estadoAtual.nome,
      email: usuario.email,
      membroDesde: formatarData(usuario.criadoEm),
      foto: estadoAtual.foto,
      ...(temPapel(usuario, 'pesquisador') ? { pesquisador: estadoAtual.pesquisador } : {}),
    },
    aoSalvar: (dados) => {
      estadoAtual.nome = dados.nome;
      estadoAtual.foto = dados.foto;
      usuario.nome = dados.nome;
      if (dados.pesquisador) {
        Object.assign(estadoAtual.pesquisador, dados.pesquisador);
      }
      salvarEstado();
      atualizarCabecalhoConta();
      renderizarTelaMinhaConta();
      ativarAba('perfil');
      mostrarAcao('Perfil atualizado.');
    },
  })));
  const hostSenha = document.getElementById('modal-alterar-senha-publica');
  if (!hostSenha) throw new Error('Contêiner para alteração de senha não encontrado.');
  raizSenhaConta = createRoot(hostSenha);
  flushSync(() => raizSenhaConta.render(createElement(ModalAlterarSenha, {
    aoSalvar: () => mostrarAcao('A troca de senha está simulada neste protótipo público.'),
  })));
  vincularBotoes();
  vincularAcoesGerais(secoes);
  ativarAba(abaAtiva);
}

export function renderizarTelaMinhasCampanhas() {
  const host = document.getElementById('conteudo-minhas-campanhas');
  if (!host) return;
  const usuario = usuarioAtual();
  if (!usuario || !temPapel(usuario, 'pesquisador')) {
    nav('minha-conta');
    if (usuario) mostrarAcao('A página Minhas campanhas está disponível para pesquisadores cadastrados.');
    return;
  }
  estadoAtual = lerEstado(usuario);
  const migalhas = document.getElementById('migalhas-minhas-campanhas');
  if (migalhas) migalhas.innerHTML = htmlMigalhas([{ rotulo: 'Minhas campanhas' }]);
  if (!raizGerenciadorCampanhas) raizGerenciadorCampanhas = createRoot(host);
  flushSync(() => raizGerenciadorCampanhas.render(createElement(GerenciadorCampanhas, {
    campanhas: estadoAtual.campanhas,
    aoAlterar: (campanhas) => {
      estadoAtual.campanhas = campanhas;
      salvarEstado();
      renderizarTelaMinhasCampanhas();
    },
    aoCriarCampanha: () => nav('criar-campanha'),
  })));
}
