// Minhas campanhas: campanhas, recompensas, atualizações, comentários e contribuições do pesquisador, em tabelas.
// Baseado no GerenciadorCampanhas da Alexia (src/components/crud/gerenciador-campanhas.tsx, branch main), reescrito em
// JavaScript puro sobre js/44-interface-modal.js. Mesmas regras: no máximo 4 endossos ativos por campanha, meta mínima
// de R$ 500, recompensa com link especial (GitHub) para acesso antecipado e conteúdo digital.
import { escaparHtml, htmlEstadoVazio } from './1-utilitarios.js';
import {
  abrirModalFicha, htmlCampo, htmlSelect, htmlSecaoFicha, htmlCampoFicha, htmlRodapeAcoes, htmlMensagemErro, mostrarErro,
} from './44-interface-modal.js';

const ITENS_MENU = [
  { id: 'campanhas', rotulo: 'Campanhas', icone: 'fa-flask' },
  { id: 'recompensas', rotulo: 'Recompensas', icone: 'fa-gift' },
  { id: 'atualizacoes', rotulo: 'Atualizações', icone: 'fa-arrows-rotate' },
  { id: 'comentarios', rotulo: 'Comentários', icone: 'fa-comments' },
  { id: 'contribuicoes', rotulo: 'Contribuições', icone: 'fa-hand-holding-heart' },
];
const ROTULO_RECOMPENSA = { reconhecimento: 'Reconhecimento', acesso_antecipado: 'Acesso antecipado', digital: 'Conteúdo digital' };
const ROTULO_FASE = { andamento: 'Em andamento', resultado_preliminar: 'Resultado preliminar', resultado_final: 'Resultado final' };
const ROTULO_TIPO_ATUALIZACAO = { texto: 'Texto', imagem: 'Imagem', pdf: 'PDF', linkexterno: 'Link externo' };
const ROTULO_MODALIDADE = { 'all-or-nothing': 'Tudo ou Nada', flexivel: 'Flexível' };
const ROTULO_STATUS = { 'Em captação': 'Ativa', Finalizada: 'Encerrada', Rascunho: 'Rascunho', 'Aguardando aprovação': 'Aguardando aprovação', Rejeitada: 'Rejeitada' };
const ROTULO_STATUS_CONTRIBUICAO = {
  pendente: 'Pendente', confirmado: 'Confirmado', repassado: 'Repassado', a_devolver: 'A devolver', devolvido: 'Devolvido',
  reembolsado: 'Reembolsado', erro: 'Erro', expirado: 'Expirado', reembolso_manual: 'Reembolso manual',
};
const ROTULO_PAGAMENTO = { pix: 'PIX', cartao_credito: 'Cartão de crédito', cartao_debito: 'Cartão de débito', boleto: 'Boleto' };
const LIMITE_ENDOSSOS_CAMPANHA = 4;
const LIMITE_CARACTERES_ATUALIZACAO = 5000;
const TIPOS_MIME_ANEXO = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// A seção aberta sobrevive ao redesenho que acontece depois de cada alteração.
let secaoAtual = 'campanhas';

function dataLegivel(data) {
  if (!data) return '—';
  const valor = new Date(`${String(data).slice(0, 10)}T12:00:00`);
  return Number.isNaN(valor.getTime()) ? data : valor.toLocaleDateString('pt-BR');
}
function valorLegivel(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';
}
function tipoAtualizacao(anexos, url) {
  if (anexos.some((a) => a.mime === 'application/pdf')) return 'pdf';
  if (anexos.some((a) => a.mime.startsWith('image/'))) return 'imagem';
  return url.trim() ? 'linkexterno' : 'texto';
}
const criarId = (prefixo) => `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const endossosAtivos = (campanha) => campanha.comentarios.filter((c) => c.endossado && c.ativo !== false);
const textoAnexos = (a) => [...(a.anexos ?? []).map((x) => x.nome), ...(a.url ? [a.url] : [])].join(', ') || 'Nenhum';

function htmlTabela(rotulo, colunas, linhas) {
  return `
    <div class="overflow-x-auto rounded-xl border borda-padrao fundo-cartao" role="region" aria-label="${escaparHtml(rotulo)}" tabindex="0">
      <table class="tabela-simples">
        <caption class="sr-only">${escaparHtml(rotulo)}</caption>
        <thead><tr>${colunas.map((c) => `<th scope="col">${escaparHtml(c)}</th>`).join('')}</tr></thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>`;
}
function botao(rotulo, acao, dados = {}, { desabilitado = false, titulo = '' } = {}) {
  const attrs = Object.entries(dados).map(([k, v]) => `data-${k}="${escaparHtml(String(v))}"`).join(' ');
  return `<button type="button" class="btn btn-secondary btn-pequeno whitespace-nowrap" data-acao="${acao}" ${attrs}${desabilitado ? ' disabled' : ''}${titulo ? ` title="${escaparHtml(titulo)}"` : ''}>${escaparHtml(rotulo)}</button>`;
}
function cabecalhoSecao(titulo, texto, botaoHtml = '') {
  return `
    <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="subtitulo texto-forte">${escaparHtml(titulo)}</h2>
        <p class="mt-1 text-sm texto-fraco">${escaparHtml(texto)}</p>
      </div>
      ${botaoHtml}
    </div>`;
}
const botaoNovo = (rotulo, acao) => `<button type="button" class="btn btn-primary" data-acao="${acao}"><i class="fa-solid fa-plus mr-2" aria-hidden="true"></i>${rotulo}</button>`;

export function montarGerenciadorCampanhas(host, { campanhas, aoAlterar, aoCriarCampanha }) {
  const todas = (chave, nomeItem) => campanhas.flatMap((campanha) => campanha[chave].map((item) => ({ campanha, [nomeItem]: item })));
  const recompensas = todas('recompensas', 'recompensa');
  const atualizacoes = todas('atualizacoes', 'atualizacao');
  const comentarios = todas('comentarios', 'comentario');
  const contribuicoes = todas('contribuicoes', 'contribuicao');
  const pendentes = comentarios.filter(({ comentario }) => !comentario.endossado).length;

  const achar = (id) => campanhas.find((c) => c.id === id);
  const substituirCampanha = (nova) => aoAlterar(campanhas.map((c) => (c.id === nova.id ? nova : c)));
  const alterarLista = (campanhaId, chave, item) => aoAlterar(campanhas.map((c) => (c.id !== campanhaId ? c : { ...c, [chave]: [...c[chave].filter((x) => x.id !== item.id), item] })));
  const alternarAtivo = (campanha, chave, id) => substituirCampanha({ ...campanha, [chave]: campanha[chave].map((x) => (x.id === id ? { ...x, ativo: !x.ativo } : x)) });

  function alternarEndosso(campanha, comentario) {
    const ativos = endossosAtivos(campanha);
    if (!comentario.endossado && ativos.length >= LIMITE_ENDOSSOS_CAMPANHA) return;
    const ordem = comentario.endossado ? undefined : Math.max(0, ...ativos.map((c) => c.ordemEndosso ?? 0)) + 1;
    substituirCampanha({
      ...campanha,
      comentarios: campanha.comentarios.map((c) => (c.id !== comentario.id ? c : { ...c, endossado: !c.endossado, ordemEndosso: ordem })),
    });
  }

  // ---------- seções ----------
  const secoes = {
    campanhas: () => `
      ${cabecalhoSecao('Campanhas', 'Consulte e gerencie os projetos que você cadastrou.', botaoNovo('Nova campanha', 'nova-campanha'))}
      ${campanhas.length === 0
        ? htmlEstadoVazio({ icone: 'fa-flask', titulo: 'Nenhuma campanha cadastrada.', mensagem: 'Crie uma campanha para começar a compartilhar sua pesquisa.' })
        : htmlTabela('Campanhas cadastradas', ['Capa', 'Campanha', 'Estado', 'Lançamento', 'Encerramento', 'Modalidade', 'Meta', 'Ações'], campanhas.map((c) => `
          <tr>
            <td><div class="relative h-14 w-20 overflow-hidden rounded-lg fundo-sutil">
              <img src="${escaparHtml(c.capaUrl)}" alt="Capa de ${escaparHtml(c.titulo)}" class="h-full w-full object-cover">
              ${c.videoUrl ? '<span class="absolute inset-0 flex items-center justify-center texto-sobre-escuro" aria-label="Campanha com vídeo"><i class="fa-solid fa-circle-play" aria-hidden="true"></i></span>' : ''}
            </div></td>
            <td class="font-semibold texto-forte">${escaparHtml(c.titulo)}</td>
            <td><span class="badge badge-neutro">${escaparHtml(ROTULO_STATUS[c.estado] ?? c.estado)}</span></td>
            <td>${dataLegivel(c.dataInicio)}</td>
            <td>${dataLegivel(c.dataFim)}</td>
            <td>${escaparHtml(ROTULO_MODALIDADE[c.modalidade] ?? c.modalidade)}</td>
            <td class="whitespace-nowrap">${valorLegivel(c.meta)}</td>
            <td><div class="flex flex-wrap gap-2">
              ${botao('Consultar', 'consultar-campanha', { campanha: c.id })}
              ${c.estado !== 'Em captação' ? botao('Editar', 'editar-campanha', { campanha: c.id }) : ''}
            </div></td>
          </tr>`).join(''))}`,

    recompensas: () => `
      ${cabecalhoSecao('Recompensas', 'Ofereça reconhecimento, acesso antecipado ou conteúdo digital, sempre a partir de uma contribuição mínima.', campanhas.length ? botaoNovo('Nova recompensa', 'nova-recompensa') : '')}
      ${recompensas.length === 0
        ? htmlEstadoVazio({ icone: 'fa-gift', titulo: 'Nenhuma recompensa cadastrada.', mensagem: 'Cadastre uma recompensa vinculada a uma de suas campanhas.' })
        : htmlTabela('Recompensas das campanhas', ['Campanha', 'Título', 'Tipo', 'A partir de', 'Escolhidas', 'Disponibilidade', 'Situação', 'Ações'], recompensas.map(({ campanha, recompensa: r }) => `
          <tr>
            <td>${escaparHtml(campanha.titulo)}</td>
            <td class="font-semibold texto-forte">${escaparHtml(r.titulo)}</td>
            <td>${ROTULO_RECOMPENSA[r.tipo]}</td>
            <td class="whitespace-nowrap">${valorLegivel(r.valorMinimo)}</td>
            <td>${r.escolhidas}</td>
            <td>${r.quantidadeDisponivel === null ? 'Ilimitada' : `${r.quantidadeDisponivel} unidades`}</td>
            <td><span class="badge ${r.ativo ? 'badge-sucesso' : 'badge-neutro'}">${r.ativo ? 'Ativa' : 'Desativada'}</span></td>
            <td><div class="flex flex-wrap gap-2">
              ${botao('Alterar', 'alterar-recompensa', { campanha: campanha.id, item: r.id })}
              ${botao(r.ativo ? 'Desativar' : 'Reativar', 'alternar-recompensa', { campanha: campanha.id, item: r.id })}
            </div></td>
          </tr>`).join(''))}`,

    atualizacoes: () => `
      ${cabecalhoSecao('Atualizações', 'Publique o andamento da pesquisa e registre os resultados.', campanhas.length ? botaoNovo('Nova atualização', 'nova-atualizacao') : '')}
      ${atualizacoes.length === 0
        ? htmlEstadoVazio({ icone: 'fa-arrows-rotate', titulo: 'Nenhuma atualização publicada.', mensagem: 'Adicione atualizações para compartilhar o progresso das campanhas.' })
        : htmlTabela('Atualizações das campanhas', ['Campanha', 'Título', 'Fase', 'Formato', 'Publicada em', 'Situação', 'Ações'], atualizacoes.map(({ campanha, atualizacao: a }) => `
          <tr>
            <td>${escaparHtml(campanha.titulo)}</td>
            <td class="font-semibold texto-forte">${escaparHtml(a.titulo)}</td>
            <td>${ROTULO_FASE[a.fase]}</td>
            <td>${ROTULO_TIPO_ATUALIZACAO[a.tipo]}</td>
            <td>${dataLegivel(a.data)}</td>
            <td><span class="badge ${a.ativo ? 'badge-sucesso' : 'badge-neutro'}">${a.ativo ? 'Publicada' : 'Ocultada'}</span></td>
            <td><div class="flex flex-wrap gap-2">
              ${botao('Alterar', 'alterar-atualizacao', { campanha: campanha.id, item: a.id })}
              ${botao('Consultar', 'consultar-atualizacao', { campanha: campanha.id, item: a.id })}
              ${botao(a.ativo ? 'Ocultar' : 'Reativar', 'alternar-atualizacao', { campanha: campanha.id, item: a.id })}
            </div></td>
          </tr>`).join(''))}`,

    comentarios: () => `
      ${cabecalhoSecao('Comentários', `Consulte o conteúdo e endosse no máximo ${LIMITE_ENDOSSOS_CAMPANHA} comentários ativos por campanha.`)}
      ${comentarios.length === 0
        ? htmlEstadoVazio({ icone: 'fa-comments', titulo: 'Nenhum comentário recebido.', mensagem: 'Os comentários das campanhas aparecerão aqui.' })
        : htmlTabela('Comentários recebidos nas campanhas', ['Campanha', 'Apoiador', 'Data', 'Comentário', 'Endosso', 'Ações'], comentarios.map(({ campanha, comentario: c }) => {
          const bloqueado = !c.endossado && endossosAtivos(campanha).length >= LIMITE_ENDOSSOS_CAMPANHA;
          return `
          <tr>
            <td>${escaparHtml(campanha.titulo)}</td>
            <td>${escaparHtml(c.autor)}</td>
            <td>${dataLegivel(c.criadoEm)}</td>
            <td>${escaparHtml(c.texto.length > 90 ? `${c.texto.slice(0, 90)}…` : c.texto)}</td>
            <td>${c.endossado ? `<span class="badge badge-sucesso">#${c.ordemEndosso ?? '—'}</span>` : '<span class="badge badge-aviso">Pendente</span>'}</td>
            <td><div class="flex flex-wrap gap-2">
              ${botao('Consultar', 'consultar-comentario', { campanha: campanha.id, item: c.id })}
              ${botao(c.endossado ? 'Remover endosso' : 'Endossar', 'endossar-comentario', { campanha: campanha.id, item: c.id }, { desabilitado: bloqueado, titulo: bloqueado ? `Limite de ${LIMITE_ENDOSSOS_CAMPANHA} endossos ativos atingido nesta campanha.` : '' })}
            </div></td>
          </tr>`;
        }).join(''))}`,

    contribuicoes: () => `
      ${cabecalhoSecao('Contribuições', 'Acompanhe os apoios e a situação dos pagamentos das suas campanhas.')}
      ${contribuicoes.length === 0
        ? htmlEstadoVazio({ icone: 'fa-hand-holding-heart', titulo: 'Nenhuma contribuição recebida.', mensagem: 'Os apoios das suas campanhas aparecerão aqui.' })
        : htmlTabela('Contribuições recebidas nas campanhas', ['Data', 'Apoiador', 'Valor', 'Status do pagamento', 'Forma de pagamento', 'Campanha / recompensa'], contribuicoes.map(({ campanha, contribuicao: c }) => {
          const recompensa = campanha.recompensas.find((r) => r.id === c.recompensaId);
          const tom = c.status === 'confirmado' || c.status === 'repassado' ? 'badge-sucesso' : c.status === 'pendente' ? 'badge-aviso' : 'badge-neutro';
          return `
          <tr>
            <td>${dataLegivel(c.criadoEm)}</td>
            <td>${escaparHtml(c.apoiador)}</td>
            <td class="whitespace-nowrap font-semibold texto-forte">${valorLegivel(c.valor)}</td>
            <td><span class="badge ${tom}">${escaparHtml(ROTULO_STATUS_CONTRIBUICAO[c.status] ?? c.status)}</span></td>
            <td>${escaparHtml(ROTULO_PAGAMENTO[c.pagamento] ?? c.pagamento)}</td>
            <td>${escaparHtml(campanha.titulo)}<span class="block text-sm texto-fraco">${escaparHtml(recompensa?.titulo ?? 'Sem recompensa')}</span></td>
          </tr>`;
        }).join(''))}`,
  };

  host.innerHTML = `
    <div data-gerenciador>
      <div class="mb-6">
        <h1 class="titulo-pagina texto-forte">Minhas campanhas</h1>
        <p class="mt-2 text-sm texto-fraco">Gerencie seus projetos, recompensas, atualizações e contribuições.</p>
      </div>
      <div class="painel-conta-shell">
        <aside class="painel-conta-sidebar" aria-label="Menu de gerenciamento de campanhas">
          <nav class="space-y-2">
            ${ITENS_MENU.map((item) => `
              <button type="button" class="painel-conta-item ${secaoAtual === item.id ? 'painel-conta-item--ativo' : ''}" data-secao="${item.id}" ${secaoAtual === item.id ? 'aria-current="page"' : ''}>
                <span class="flex items-center gap-3"><i class="fa-solid ${item.icone}" aria-hidden="true"></i>${item.rotulo}</span>
                ${item.id === 'comentarios' && pendentes > 0 ? `<span class="badge badge-aviso">${pendentes}</span>` : ''}
              </button>`).join('')}
          </nav>
        </aside>
        <section class="painel-conta-area min-w-0" aria-labelledby="titulo-secao-gerenciador">
          <h2 id="titulo-secao-gerenciador" class="sr-only">${ITENS_MENU.find((i) => i.id === secaoAtual).rotulo}</h2>
          ${secoes[secaoAtual]()}
        </section>
      </div>
    </div>`;

  const raiz = host.querySelector('[data-gerenciador]');
  raiz.addEventListener('click', (evento) => {
    const menu = evento.target.closest('[data-secao]');
    if (menu) { secaoAtual = menu.dataset.secao; montarGerenciadorCampanhas(host, { campanhas, aoAlterar, aoCriarCampanha }); return; }
    const alvo = evento.target.closest('[data-acao]');
    if (!alvo || alvo.disabled) return;
    const campanha = achar(alvo.dataset.campanha);
    const item = (chave) => campanha?.[chave].find((x) => x.id === alvo.dataset.item);
    switch (alvo.dataset.acao) {
      case 'nova-campanha': aoCriarCampanha(); break;
      case 'consultar-campanha': modalConsultarCampanha(campanha); break;
      case 'editar-campanha': modalEditarCampanha(campanha); break;
      case 'nova-recompensa': modalRecompensa(campanhas[0].id); break;
      case 'alterar-recompensa': modalRecompensa(campanha.id, item('recompensas')); break;
      case 'alternar-recompensa': alternarAtivo(campanha, 'recompensas', alvo.dataset.item); break;
      case 'nova-atualizacao': modalAtualizacao(campanhas[0].id); break;
      case 'alterar-atualizacao': modalAtualizacao(campanha.id, item('atualizacoes')); break;
      case 'consultar-atualizacao': modalConsultarAtualizacao(campanha, item('atualizacoes')); break;
      case 'alternar-atualizacao': alternarAtivo(campanha, 'atualizacoes', alvo.dataset.item); break;
      case 'consultar-comentario': modalConsultarComentario(campanha, item('comentarios')); break;
      case 'endossar-comentario': alternarEndosso(campanha, item('comentarios')); break;
      default: break;
    }
  });

  // ---------- modais ----------
  const opcoesCampanhas = () => campanhas.map((c) => ({ valor: c.id, rotulo: c.titulo }));
  const entrada = (nome, valor, extra = '') => (a) => `<input ${a} name="${nome}" value="${escaparHtml(valor ?? '')}" ${extra} class="input-padrao">`;
  const dinheiro = (nome, valor, extra = '') => (a) => `<input ${a} name="${nome}" type="number" min="0" step="0.01" inputmode="decimal" value="${escaparHtml(valor ?? '')}" ${extra} class="input-padrao">`;

  function modalConsultarCampanha(c) {
    abrirModalFicha({
      titulo: 'Consultar campanha', subtitulo: c.titulo,
      corpoHtml: htmlSecaoFicha('Dados da campanha', [
        htmlCampoFicha('Estado', ROTULO_STATUS[c.estado] ?? c.estado),
        htmlCampoFicha('Modalidade', ROTULO_MODALIDADE[c.modalidade] ?? c.modalidade),
        htmlCampoFicha('Lançamento', dataLegivel(c.dataInicio)),
        htmlCampoFicha('Encerramento', dataLegivel(c.dataFim)),
        htmlCampoFicha('Meta', valorLegivel(c.meta)),
        htmlCampoFicha('Arrecadado', c.arrecadado),
        htmlCampoFicha('Vídeo de apresentação', c.videoUrl || 'Não informado', { cheia: true }),
        htmlCampoFicha('Resumo', c.resumo, { cheia: true }),
      ].join('')),
    });
  }

  function modalEditarCampanha(c) {
    abrirModalFicha({
      titulo: 'Editar campanha', subtitulo: c.titulo,
      corpoHtml: `
        <form id="form-editar-campanha-gerenciador" class="space-y-4" novalidate>
          ${htmlCampo({ rotulo: 'Nome da campanha', controle: entrada('titulo', c.titulo, 'required maxlength="255"') })}
          ${htmlCampo({ rotulo: 'Resumo', controle: (a) => `<textarea ${a} name="resumo" rows="3" class="input-padrao">${escaparHtml(c.resumo)}</textarea>` })}
          ${htmlCampo({ rotulo: 'Meta (R$)', dica: 'A meta mínima deste protótipo é R$ 500,00.', controle: dinheiro('meta', c.meta) })}
          <div class="grid gap-4 sm:grid-cols-2">
            ${htmlCampo({ rotulo: 'Lançamento', controle: (a) => `<input ${a} name="dataInicio" type="date" required value="${escaparHtml(c.dataInicio)}" class="input-padrao">` })}
            ${htmlCampo({ rotulo: 'Encerramento', controle: (a) => `<input ${a} name="dataFim" type="date" required value="${escaparHtml(c.dataFim)}" class="input-padrao">` })}
          </div>
          ${htmlSelect({ rotulo: 'Modalidade', nome: 'modalidade', valor: c.modalidade, opcoes: [{ valor: 'all-or-nothing', rotulo: 'Tudo ou Nada' }, { valor: 'flexivel', rotulo: 'Flexível' }] })}
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-editar-campanha-gerenciador', rotuloAcao: 'Salvar alterações' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const d = Object.fromEntries(new FormData(form));
          if (String(d.titulo).trim().length < 3 || !(Number(d.meta) >= 500) || !d.dataInicio || !d.dataFim || d.dataFim < d.dataInicio) {
            mostrarErro(modal.janela, 'Informe título, meta mínima de R$ 500,00 e um período de encerramento posterior ao lançamento.');
            return;
          }
          modal.fechar();
          substituirCampanha({ ...c, titulo: String(d.titulo).trim(), resumo: String(d.resumo).trim(), meta: String(d.meta), dataInicio: d.dataInicio, dataFim: d.dataFim, modalidade: d.modalidade });
        });
      },
    });
  }

  function modalRecompensa(campanhaInicial, r) {
    const selecionada = (r?.escolhidas ?? 0) > 0;
    abrirModalFicha({
      titulo: r ? 'Alterar recompensa' : 'Nova recompensa',
      subtitulo: 'Recompensas simbólicas, sem estoque ou entrega física.',
      corpoHtml: `
        <form id="form-recompensa-campanha" class="space-y-4" novalidate>
          ${r ? '' : htmlSelect({ rotulo: 'Campanha', nome: 'campanha', valor: campanhaInicial, opcoes: opcoesCampanhas() })}
          ${htmlCampo({ rotulo: 'Título', controle: entrada('titulo', r?.titulo, 'required maxlength="150"') })}
          ${htmlCampo({ rotulo: 'Valor mínimo para receber (R$)', dica: 'Precisa ser maior que zero.', controle: dinheiro('valorMinimo', r?.valorMinimo, selecionada ? 'disabled' : '') })}
          ${htmlSelect({ rotulo: 'Tipo', nome: 'tipo', valor: r?.tipo ?? 'reconhecimento', opcoes: Object.entries(ROTULO_RECOMPENSA).map(([valor, rotulo]) => ({ valor, rotulo })), dica: 'Acesso antecipado e conteúdo digital precisam de link especial.' })}
          ${selecionada ? '<p class="text-sm texto-fraco" role="note">O tipo e o valor mínimo não podem ser alterados após uma contribuição escolher esta recompensa.</p>' : ''}
          ${htmlCampo({ rotulo: 'Descrição (opcional)', controle: (a) => `<textarea ${a} name="descricao" maxlength="10000" rows="2" class="input-padrao">${escaparHtml(r?.descricao ?? '')}</textarea>` })}
          ${htmlCampo({ rotulo: 'Quantidade disponível (opcional)', dica: 'Deixe vazio para quantidade ilimitada.', controle: (a) => `<input ${a} name="quantidade" type="number" min="${r?.escolhidas ?? 0}" step="1" value="${r?.quantidadeDisponivel ?? ''}" class="input-padrao">` })}
          <div data-bloco-link hidden>
            ${htmlCampo({ rotulo: 'Link especial (GitHub)', dica: 'O acesso fica disponível somente para quem adquirir a recompensa.', controle: (a) => `<input ${a} name="url" type="url" maxlength="500" placeholder="https://github.com/..." value="${escaparHtml(r?.url ?? '')}" class="input-padrao">` })}
          </div>
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-recompensa-campanha', rotuloAcao: r ? 'Salvar' : 'Cadastrar recompensa' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        const bloco = form.querySelector('[data-bloco-link]');
        const exigeLink = () => form.elements.tipo.value !== 'reconhecimento';
        const atualizarLink = () => { bloco.hidden = !exigeLink(); };
        form.elements.tipo.addEventListener('change', atualizarLink);
        atualizarLink();
        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const d = Object.fromEntries(new FormData(form));
          const requerLink = d.tipo !== 'reconhecimento';
          const valorMinimo = selecionada ? r.valorMinimo : d.valorMinimo;
          const quantidade = d.quantidade === '' ? null : Number(d.quantidade);
          let urlValida = true;
          if (requerLink) {
            try {
              const u = new URL(d.url);
              urlValida = u.protocol === 'https:' && ['github.com', 'www.github.com'].includes(u.hostname) && u.pathname.length > 1;
            } catch { urlValida = false; }
          }
          if (!String(d.titulo).trim() || String(d.titulo).length > 150 || !(Number(valorMinimo) > 0) || !urlValida
            || (d.quantidade !== '' && (!Number.isInteger(quantidade) || quantidade < (r?.escolhidas ?? 0)))) {
            mostrarErro(modal.janela, requerLink
              ? 'Confira o título, o valor mínimo, a disponibilidade e informe um link HTTPS válido do GitHub.'
              : 'Confira o título, o valor mínimo e a disponibilidade. Deixe a disponibilidade vazia para não limitar unidades.');
            return;
          }
          const campanhaId = r ? campanhaInicial : d.campanha;
          modal.fechar();
          alterarLista(campanhaId, 'recompensas', {
            id: r?.id ?? criarId('recompensa'),
            titulo: String(d.titulo).trim(),
            descricao: String(d.descricao).trim(),
            tipo: d.tipo,
            valorMinimo: Number(valorMinimo).toFixed(2),
            quantidadeDisponivel: quantidade,
            escolhidas: r?.escolhidas ?? 0,
            ativo: r?.ativo ?? true,
            url: requerLink ? String(d.url).trim() : '',
            tipoLink: requerLink ? 'GitHub' : '',
          });
        });
      },
    });
  }

  function modalAtualizacao(campanhaInicial, a) {
    let anexos = [...(a?.anexos ?? [])];
    abrirModalFicha({
      titulo: a ? 'Alterar atualização' : 'Nova atualização',
      subtitulo: 'Registre o andamento ou os resultados da pesquisa.',
      corpoHtml: `
        <form id="form-atualizacao-campanha" class="space-y-4" novalidate>
          ${a ? '' : htmlSelect({ rotulo: 'Campanha', nome: 'campanha', valor: campanhaInicial, opcoes: opcoesCampanhas() })}
          ${htmlCampo({ rotulo: 'Título', controle: entrada('titulo', a?.titulo, 'required maxlength="150"') })}
          <div class="grid gap-4 sm:grid-cols-2">
            ${htmlSelect({ rotulo: 'Fase', nome: 'fase', valor: a?.fase ?? 'andamento', opcoes: Object.entries(ROTULO_FASE).map(([valor, rotulo]) => ({ valor, rotulo })) })}
            ${htmlCampo({ rotulo: a ? 'Formato' : 'Formato determinado pelos anexos', controle: () => `<p class="input-padrao" data-formato>${ROTULO_TIPO_ATUALIZACAO[a?.tipo ?? 'texto']}</p>` })}
          </div>
          ${htmlCampo({ rotulo: 'Mensagem', controle: (id) => `<textarea ${id} name="mensagem" required maxlength="${LIMITE_CARACTERES_ATUALIZACAO}" rows="5" class="input-padrao">${escaparHtml(a?.mensagem ?? '')}</textarea>
            <p class="legenda texto-fraco mt-1 text-right" data-contador></p>` })}
          ${a
            ? htmlSecaoFicha('Anexos', htmlCampoFicha('Arquivos e links', textoAnexos(a), { cheia: true }))
            : htmlSecaoFicha('Anexos', `
              <div class="space-y-4 sm:col-span-2">
                ${htmlCampo({ rotulo: 'Arquivos (imagem ou PDF, opcional)', controle: (id) => `<input ${id} name="arquivos" type="file" multiple accept="${TIPOS_MIME_ANEXO.join(',')}" class="input-padrao">` })}
                <ul class="space-y-2" aria-label="Arquivos selecionados" data-lista-anexos></ul>
                ${htmlCampo({ rotulo: 'Endereço do link (opcional)', controle: entrada('url', a?.url, 'type="url" maxlength="500"') })}
              </div>`, { colunas: 1 })}
          ${htmlMensagemErro()}
        </form>`,
      rodapeHtml: htmlRodapeAcoes({ formulario: 'form-atualizacao-campanha', rotuloAcao: a ? 'Salvar' : 'Publicar atualização' }),
      aoMontar(modal) {
        const form = modal.janela.querySelector('form');
        const contador = form.querySelector('[data-contador]');
        const atualizarContador = () => { contador.textContent = `${form.elements.mensagem.value.length}/${LIMITE_CARACTERES_ATUALIZACAO}`; };
        form.elements.mensagem.addEventListener('input', atualizarContador);
        atualizarContador();

        const desenharAnexos = () => {
          const lista = form.querySelector('[data-lista-anexos]');
          if (lista) {
            lista.innerHTML = anexos.map((x, i) => `
              <li class="flex items-center justify-between gap-3 text-sm texto-fraco"><span>${escaparHtml(x.nome)}</span>
                <button type="button" class="btn btn-secondary btn-pequeno" data-remover-anexo="${i}">Remover</button></li>`).join('');
          }
          if (!a) form.querySelector('[data-formato]').textContent = ROTULO_TIPO_ATUALIZACAO[tipoAtualizacao(anexos, form.elements.url?.value ?? '')];
        };
        form.elements.arquivos?.addEventListener('change', (evento) => {
          const novos = [...evento.target.files];
          if (novos.some((arquivo) => !TIPOS_MIME_ANEXO.includes(arquivo.type))) {
            mostrarErro(modal.janela, 'Anexe somente imagens JPEG, PNG, WebP ou arquivos PDF.');
            evento.target.value = '';
            return;
          }
          anexos = [...anexos, ...novos.map((arquivo) => ({ nome: arquivo.name, mime: arquivo.type }))];
          mostrarErro(modal.janela, '');
          evento.target.value = '';
          desenharAnexos();
        });
        form.elements.url?.addEventListener('input', desenharAnexos);
        form.addEventListener('click', (evento) => {
          const remover = evento.target.closest('[data-remover-anexo]');
          if (remover) { anexos = anexos.filter((_, i) => i !== Number(remover.dataset.removerAnexo)); desenharAnexos(); }
        });
        desenharAnexos();

        form.addEventListener('submit', (evento) => {
          evento.preventDefault();
          const d = Object.fromEntries(new FormData(form));
          const url = String(d.url ?? '').trim();
          let urlValida = true;
          if (url) {
            try { const u = new URL(url); urlValida = (u.protocol === 'https:' || u.protocol === 'http:') && Boolean(u.hostname); } catch { urlValida = false; }
          }
          if (!String(d.titulo).trim() || String(d.titulo).length > 150 || !String(d.mensagem).trim() || String(d.mensagem).length > LIMITE_CARACTERES_ATUALIZACAO || !urlValida) {
            mostrarErro(modal.janela, 'Informe um título, conteúdo de até 5.000 caracteres e um link válido, se houver.');
            return;
          }
          const campanhaId = a ? campanhaInicial : d.campanha;
          modal.fechar();
          alterarLista(campanhaId, 'atualizacoes', {
            id: a?.id ?? criarId('atualizacao'),
            titulo: String(d.titulo).trim(),
            mensagem: String(d.mensagem).trim(),
            data: a?.data ?? new Date().toISOString().slice(0, 10),
            fase: d.fase,
            tipo: a ? a.tipo : tipoAtualizacao(anexos, url),
            anexos,
            url,
            ativo: a?.ativo ?? true,
          });
        });
      },
    });
  }

  function modalConsultarAtualizacao(campanha, a) {
    abrirModalFicha({
      titulo: 'Consultar atualização', subtitulo: campanha.titulo,
      corpoHtml: htmlSecaoFicha('Publicação', [
        htmlCampoFicha('Título', a.titulo),
        htmlCampoFicha('Publicada em', dataLegivel(a.data)),
        htmlCampoFicha('Fase', ROTULO_FASE[a.fase]),
        htmlCampoFicha('Formato', ROTULO_TIPO_ATUALIZACAO[a.tipo]),
        htmlCampoFicha('Anexos e links', textoAnexos(a), { cheia: true }),
        htmlCampoFicha('Mensagem completa', a.mensagem, { cheia: true }),
      ].join('')),
    });
  }

  function modalConsultarComentario(campanha, c) {
    const podeEndossar = endossosAtivos(campanha).length < LIMITE_ENDOSSOS_CAMPANHA;
    abrirModalFicha({
      titulo: 'Consultar comentário', subtitulo: campanha.titulo,
      corpoHtml: htmlSecaoFicha('Comentário', [
        htmlCampoFicha('Autor', c.autor),
        htmlCampoFicha('Enviado em', dataLegivel(c.criadoEm)),
        htmlCampoFicha('Situação', c.endossado ? `Endossado (#${c.ordemEndosso ?? '—'})` : 'Aguardando endosso'),
        htmlCampoFicha('Texto completo', c.texto, { cheia: true }),
        !c.endossado && !podeEndossar ? `<p class="text-sm texto-fraco sm:col-span-2" role="status">O limite de ${LIMITE_ENDOSSOS_CAMPANHA} endossos ativos desta campanha foi atingido.</p>` : '',
      ].join('')),
      rodapeHtml: `
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" class="btn btn-secondary" data-cancelar-modal>Fechar</button>
          <button type="button" class="btn btn-primary" data-endossar ${!c.endossado && !podeEndossar ? 'disabled' : ''}>${c.endossado ? 'Remover endosso' : 'Endossar comentário'}</button>
        </div>`,
      aoMontar(modal) {
        modal.janela.querySelector('[data-endossar]').addEventListener('click', () => { modal.fechar(); alternarEndosso(campanha, c); });
      },
    });
  }
}
