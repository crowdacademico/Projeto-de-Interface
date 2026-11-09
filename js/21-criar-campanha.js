import { createElement, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Campo } from '@restrita/components/input/campo';
import { ContadorCaracteres } from '@restrita/components/input/contador-caracteres';
import { CaixaAviso } from '../src/components/crud/caixa-aviso';
import { CampoMetaCampanha } from '../src/components/input/campo-meta-campanha';
import { RodapeAcoes } from '../src/components/crud/rodape-acoes';
import { escaparHtml, mostrarAcao } from './1-utilitarios.js';
import { renderizarCardsProjeto } from './18-home.js';
import { nav } from './24-roteador.js';
import {
  createAreaOptions,
  createModelOptions,
  PASSOS_CRIAR_CAMPANHA,
} from '../dados-falsos/11-criar-campanha.js';

const CHAVE_RASCUNHO = 'crowdacademico-protótipo.rascunho-campanha';
const raizesReact = new WeakMap();

let passoAtual = 1;
let rubricas = [{ categoria: '', valor: '' }];
let marcos = [{ titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }];
let valorMetaAtual = '';

function normalizarValorMeta(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const texto = String(valor).trim();
  if (texto.includes(',') || texto.includes('R$')) {
    const digitos = texto.replace(/\D/g, '');
    return digitos ? (Number(digitos) / 100).toFixed(2) : '';
  }
  const numero = Number(texto);
  return Number.isFinite(numero) ? numero.toFixed(2) : '';
}

function renderizarComponente(container, componente) {
  let raiz = raizesReact.get(container);
  if (!raiz) {
    raiz = createRoot(container);
    raizesReact.set(container, raiz);
  }
  flushSync(() => raiz.render(componente));
}

function renderizarCampo(configuracao) {
  const container = document.getElementById(configuracao.container);
  if (!container) throw new Error(`Contêiner de campo não encontrado: ${configuracao.container}.`);

  const tipoElemento = configuracao.elemento || 'input';
  renderizarComponente(container, createElement(Campo, {
    rotulo: configuracao.rotulo,
    dica: configuracao.dica,
    className: configuracao.className || 'campo',
    children: ({ atributos, classeErro }) => createElement(
      tipoElemento,
      {
        ...atributos,
        name: configuracao.nome,
        type: tipoElemento === 'input' ? configuracao.tipo || 'text' : undefined,
        required: configuracao.obrigatorio || undefined,
        min: configuracao.min,
        max: configuracao.max,
        maxLength: configuracao.maxLength,
        step: configuracao.step,
        placeholder: configuracao.placeholder,
        rows: configuracao.rows,
        className: `input-padrao${configuracao.inputClassName ? ` ${configuracao.inputClassName}` : ''}${classeErro}`,
        children: configuracao.opcoes?.map((opcao) => createElement('option', {
          key: opcao.value,
          value: opcao.value,
          children: opcao.label,
        })),
      },
    ),
  }));
}

function renderizarCamposDados(valorMetaInicial = '') {
  const hoje = new Date();
  const hojeISO = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  renderizarCampo({
    container: 'criar-campanha-campo-titulo',
    rotulo: 'Título',
    nome: 'titulo',
    obrigatorio: true,
    placeholder: 'Título do projeto',
    inputClassName: 'font-bold texto-forte',
  });
  renderizarCampo({
    container: 'criar-campanha-campo-area',
    rotulo: 'Área do conhecimento',
    nome: 'area',
    elemento: 'select',
    obrigatorio: true,
    opcoes: [{ value: '', label: 'Selecione...' }, ...createAreaOptions],
  });
  const campoMeta = document.getElementById('criar-campanha-campo-meta');
  if (!campoMeta) throw new Error('Contêiner da meta da campanha não encontrado.');
  renderizarComponente(campoMeta, createElement(CampoMetaCampanha, {
    valorInicial: valorMetaInicial,
    aoMudarMeta: (valor) => {
      valorMetaAtual = valor;
      const meta = Number(valor) || 0;
      elementos().meta?.setCustomValidity(meta < 500 ? 'A meta mínima é R$ 500,00.' : '');
      atualizarSomaRubricas();
      if (passoAtual === 4) {
        renderPreview();
        renderChecklist();
      }
      salvarRascunho();
    },
  }));
  renderizarCampo({
    container: 'criar-campanha-campo-modelo',
    rotulo: 'Modelo de financiamento',
    nome: 'modelo',
    elemento: 'select',
    obrigatorio: true,
    opcoes: createModelOptions,
  });
  renderizarCampo({
    container: 'criar-campanha-campo-descricao',
    rotulo: 'Descrição (opcional)',
    nome: 'descricao',
    elemento: 'textarea',
    maxLength: 5000,
    rows: 4,
    placeholder: 'Descreva o projeto, seus objetivos e impacto científico.',
  });
  atualizarContadorDescricao();
  renderizarCampo({
    container: 'criar-campanha-campo-inicio',
    rotulo: 'Início',
    nome: 'dataInicio',
    tipo: 'date',
    min: hojeISO,
    obrigatorio: true,
  });
  renderizarCampo({
    container: 'criar-campanha-campo-fim',
    rotulo: 'Fim',
    nome: 'dataFim',
    tipo: 'date',
    min: hojeISO,
    obrigatorio: true,
  });
  renderizarCampo({
    container: 'criar-campanha-campo-video',
    rotulo: 'URL do vídeo de apresentação (opcional)',
    nome: 'videoApresentacaoUrl',
    tipo: 'url',
    placeholder: 'https://',
  });
}

function renderizarEstruturaFormulario() {
  const aviso = document.getElementById('criar-campanha-aviso-curadoria');
  const acoes = document.getElementById('criar-campanha-rodape-acoes');
  if (!aviso || !acoes) throw new Error('Contêineres de aviso e ações da campanha não encontrados.');

  renderizarComponente(aviso, createElement(CaixaAviso, {
    titulo: createElement(Fragment, null,
      'Análise de Curadoria ',
      createElement('span', { className: 'rf-inline', children: '(RF-016)' }),
    ),
    icone: 'fa-microscope',
    className: 'mb-10 border borda-info rounded-xl p-6 shadow-inner gap-4',
    children: createElement('p', {
      className: 'text-sm font-medium leading-relaxed',
      children: 'Todo projeto submetido passa por uma rigorosa avaliação do Conselho Científico da plataforma antes de ser publicado. Certifique-se de que o escopo e o orçamento estejam perfeitamente justificados.',
    }),
  }));

  renderizarComponente(acoes, createElement(RodapeAcoes, {
    className: 'mt-10 border-t-2 pt-8 gap-4',
    children: createElement(Fragment, null,
      createElement('button', {
        type: 'button',
        id: 'criar-campanha-descartar',
        className: 'px-8 py-4 rounded-xl font-bold texto-fraco hover-fundo-sutil hover-texto-forte transition-colors',
        children: 'Descartar Rascunho',
      }),
      createElement('div', {
        className: 'flex gap-3',
        children: [
          createElement('button', {
            key: 'voltar',
            type: 'button',
            id: 'criar-campanha-voltar',
            className: 'hidden px-8 py-4 rounded-xl font-bold texto-padrao border-2 borda-padrao hover-fundo-sutil transition-colors',
            children: 'Voltar',
          }),
          createElement('button', {
            key: 'avancar',
            type: 'button',
            id: 'criar-campanha-avancar',
            className: 'bg-dark hover:bg-black text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2',
            children: createElement(Fragment, null, 'Próximo ', createElement('i', { className: 'fa-solid fa-arrow-right', 'aria-hidden': 'true' })),
          }),
          createElement('button', {
            key: 'submeter',
            type: 'submit',
            id: 'criar-campanha-submeter',
            className: 'hidden bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-xl shadow-xl transition-all hover:-translate-y-0.5 items-center gap-2',
            children: createElement(Fragment, null, createElement('i', { className: 'fa-solid fa-paper-plane', 'aria-hidden': 'true' }), ' Submeter Projeto'),
          }),
        ],
      }),
    ),
  }));
}

function elementos() {
  const formulario = document.getElementById('form-criar-campanha');
  return {
    titulo: formulario?.querySelector('[name="titulo"]'),
    area: formulario?.querySelector('[name="area"]'),
    modelo: formulario?.querySelector('[name="modelo"]'),
    meta: formulario?.querySelector('[name="meta"]'),
    descricao: formulario?.querySelector('[name="descricao"]'),
    dataInicio: formulario?.querySelector('[name="dataInicio"]'),
    dataFim: formulario?.querySelector('[name="dataFim"]'),
    videoApresentacaoUrl: formulario?.querySelector('[name="videoApresentacaoUrl"]'),
  };
}

function atualizarContadorDescricao() {
  const container = document.getElementById('criar-campanha-contador-descricao');
  if (!container) return;
  const texto = elementos().descricao?.value || '';
  renderizarComponente(container, createElement(ContadorCaracteres, { texto, limite: 5000 }));
}

function modeloSelecionado() {
  return elementos().modelo?.value || createModelOptions[0].value;
}

function salvarRascunho() {
  const el = elementos();
  const rascunho = {
    titulo: el.titulo?.value || '',
    area: el.area?.value || '',
    modelo: modeloSelecionado(),
    meta: valorMetaAtual,
    descricao: el.descricao?.value || '',
    dataInicio: el.dataInicio?.value || '',
    dataFim: el.dataFim?.value || '',
    videoApresentacaoUrl: el.videoApresentacaoUrl?.value || '',
    rubricas,
    marcos,
    passoAtual,
  };
  localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho));
}

function carregarRascunho() {
  const bruto = localStorage.getItem(CHAVE_RASCUNHO);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto);
  } catch {
    return null;
  }
}

function limparRascunho() {
  localStorage.removeItem(CHAVE_RASCUNHO);
}

function renderPassosNav() {
  const container = document.getElementById('criar-campanha-passos');
  if (!container) return;
  container.innerHTML = PASSOS_CRIAR_CAMPANHA.map((passo, indice) => {
    const estado = passo.numero < passoAtual ? 'passo--concluido' : passo.numero === passoAtual ? 'passo--ativo' : '';
    const circulo = passo.numero < passoAtual ? '<i class="fa-solid fa-check"></i>' : passo.numero;
    const linha = indice < PASSOS_CRIAR_CAMPANHA.length - 1
      ? `<div class="passo__linha ${passo.numero < passoAtual ? 'passo--concluido' : ''}"></div>`
      : '';
    return `
      <div class="passo ${estado}">
        <span class="passo__circulo">${circulo}</span>
        <span class="passo__rotulo hidden sm:inline">${escaparHtml(passo.rotulo)}</span>
      </div>
      ${linha}
    `;
  }).join('');
}

function irParaPasso(numero) {
  passoAtual = numero;
  ['dados', 'orcamento', 'cronograma', 'revisao'].forEach((chave, indice) => {
    const painel = document.getElementById('passo-' + chave);
    if (painel) painel.classList.toggle('active', indice + 1 === numero);
  });
  renderPassosNav();

  const voltar = document.getElementById('criar-campanha-voltar');
  const avancar = document.getElementById('criar-campanha-avancar');
  const submeter = document.getElementById('criar-campanha-submeter');
  if (voltar) voltar.classList.toggle('hidden', numero === 1);
  if (avancar) avancar.classList.toggle('hidden', numero === PASSOS_CRIAR_CAMPANHA.length);
  if (submeter) {
    submeter.classList.toggle('hidden', numero !== PASSOS_CRIAR_CAMPANHA.length);
    submeter.classList.toggle('flex', numero === PASSOS_CRIAR_CAMPANHA.length);
  }

  if (numero === 4) {
    renderPreview();
    renderChecklist();
  }
  salvarRascunho();
  document.getElementById('form-criar-campanha')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function htmlLinhaRubrica(rubrica, indice) {
  return `
    <div class="flex gap-3 items-center" data-rubrica-linha="${indice}">
      <input type="text" data-rubrica-campo="categoria" data-indice="${indice}" value="${escaparHtml(rubrica.categoria)}" placeholder="Categoria" aria-label="Categoria do item" class="input-padrao flex-1">
      <div class="relative w-40 shrink-0">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold texto-fraco">R$</span>
        <input type="number" min="0" data-rubrica-campo="valor" data-indice="${indice}" value="${escaparHtml(rubrica.valor)}" placeholder="0" class="input-padrao pl-9">
      </div>
      <button type="button" data-rubrica-remover="${indice}" aria-label="Remover item" class="w-10 h-10 rounded-lg hover-fundo-sutil texto-fraco hover-texto-erro transition-colors shrink-0"><i class="fa-solid fa-trash"></i></button>
    </div>
  `;
}

function renderRubricas() {
  const container = document.getElementById('criar-campanha-rubricas');
  if (!container) return;
  container.innerHTML = rubricas.map(htmlLinhaRubrica).join('');

  container.querySelectorAll('[data-rubrica-campo]').forEach((campo) => {
    campo.addEventListener('input', () => {
      const indice = Number(campo.dataset.indice);
      rubricas[indice][campo.dataset.rubricaCampo] = campo.value;
      atualizarSomaRubricas();
      salvarRascunho();
    });
  });
  container.querySelectorAll('[data-rubrica-remover]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const indice = Number(botao.dataset.rubricaRemover);
      rubricas.splice(indice, 1);
      if (rubricas.length === 0) rubricas = [{ categoria: '', valor: '' }];
      renderRubricas();
      atualizarSomaRubricas();
      salvarRascunho();
    });
  });
}

function htmlLinhaMarco(marco, indice, dataInicio) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-center" data-marco-linha="${indice}">
      <input type="text" data-marco-campo="titulo" data-indice="${indice}" value="${escaparHtml(marco.titulo)}" placeholder="Ex.: Coleta de dados" aria-label="Título do marco ${indice + 1}" class="input-padrao">
      <input type="date" data-marco-campo="dataPrevista" data-indice="${indice}" value="${escaparHtml(marco.dataPrevista)}" min="${escaparHtml(dataInicio)}" aria-label="Data prevista do marco ${indice + 1}" class="input-padrao">
      <button type="button" data-marco-remover="${indice}" aria-label="Remover marco ${indice + 1}" class="w-10 h-10 rounded-lg hover-fundo-sutil texto-fraco hover-texto-erro transition-colors">
        <i class="fa-solid fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  `;
}

function renderMarcos() {
  const container = document.getElementById('criar-campanha-marcos');
  if (!container) return;
  const el = elementos();
  container.innerHTML = marcos.map((marco, indice) =>
    htmlLinhaMarco(marco, indice, el.dataInicio?.value || ''),
  ).join('');

  container.querySelectorAll('[data-marco-campo]').forEach((campo) => {
    campo.addEventListener('input', () => {
      const indice = Number(campo.dataset.indice);
      marcos[indice][campo.dataset.marcoCampo] = campo.value;
      salvarRascunho();
    });
  });
  container.querySelectorAll('[data-marco-remover]').forEach((botao) => {
    botao.addEventListener('click', () => {
      marcos.splice(Number(botao.dataset.marcoRemover), 1);
      renderMarcos();
      salvarRascunho();
    });
  });
}

function atualizarLimitesCronograma() {
  const el = elementos();
  const hoje = new Date();
  const hojeISO = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (el.dataFim) el.dataFim.min = el.dataInicio?.value || hojeISO;
  renderMarcos();
}

function validarDadosCampanha() {
  const el = elementos();
  window.dispatchEvent(new Event('criar-campanha:validar-meta'));
  if (!el.dataInicio || !el.dataFim) return false;
  const meta = Number(valorMetaAtual) || 0;
  el.meta?.setCustomValidity(meta < 500 ? 'A meta mínima é R$ 500,00.' : '');

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicio = el.dataInicio.value ? new Date(`${el.dataInicio.value}T00:00:00`) : null;
  const fim = el.dataFim.value ? new Date(`${el.dataFim.value}T00:00:00`) : null;
  const duracao = inicio && fim ? Math.round((fim - inicio) / 86400000) : 0;
  el.dataFim.setCustomValidity(
    !fim || !inicio || fim < inicio || duracao < 15 || duracao > 60
      ? 'A campanha precisa durar entre 15 e 60 dias, começando hoje ou depois.'
      : '',
  );
  const campos = [
    el.titulo,
    el.area,
    el.meta,
    el.modelo,
    el.dataInicio,
    el.dataFim,
    el.videoApresentacaoUrl,
  ].filter(Boolean);
  const invalido = campos.find((campo) => !campo.checkValidity());
  if (invalido) {
    invalido.reportValidity();
    return false;
  }
  if (inicio < hoje) {
    el.dataInicio.setCustomValidity('A data de início precisa ser hoje ou depois.');
    el.dataInicio.reportValidity();
    el.dataInicio.setCustomValidity('');
    return false;
  }
  return true;
}

function atualizarSomaRubricas() {
  const container = document.getElementById('criar-campanha-rubricas-soma');
  if (!container) return;
  const soma = rubricas.reduce((total, r) => total + (Number(r.valor) || 0), 0);
  const meta = Number(valorMetaAtual) || 0;
  const diferenca = meta - soma;

  let classe = 'fundo-destaque texto-padrao';
  let mensagem = `Itens somam R$ ${soma.toLocaleString('pt-BR')}. Informe a meta para comparar.`;
  if (meta > 0) {
    if (diferenca === 0) {
      classe = 'fundo-sucesso texto-sucesso';
      mensagem = `<i class="fa-solid fa-circle-check"></i> Itens somam exatamente a meta (R$ ${meta.toLocaleString('pt-BR')}).`;
    } else if (diferenca > 0) {
      classe = 'fundo-aviso texto-aviso';
      mensagem = `<i class="fa-solid fa-triangle-exclamation"></i> Faltam R$ ${diferenca.toLocaleString('pt-BR')} para bater a meta.`;
    } else {
      classe = 'fundo-erro texto-erro';
      mensagem = `<i class="fa-solid fa-circle-exclamation"></i> Itens somam R$ ${Math.abs(diferenca).toLocaleString('pt-BR')} a mais que a meta.`;
    }
  }
  container.className = `mt-4 rounded-xl p-4 text-sm font-bold flex justify-between items-center ${classe}`;
  container.innerHTML = `<span>${mensagem}</span><span class="numero">R$ ${soma.toLocaleString('pt-BR')}</span>`;
}

function renderPreview() {
  const container = document.getElementById('criar-campanha-preview');
  if (!container) return;
  const el = elementos();
  const areaRotulo = createAreaOptions.find((a) => a.value === el.area?.value)?.label || 'Área não selecionada';
  const meta = Number(valorMetaAtual) || 1;
  const modelo = modeloSelecionado() === 'flexivel' ? 'flexivel' : 'tudo-ou-nada';
  const dias = el.dataInicio?.value && el.dataFim?.value
    ? Math.round((new Date(`${el.dataFim.value}T12:00:00`).getTime() - new Date(`${el.dataInicio.value}T12:00:00`).getTime()) / 86400000)
    : 30;

  renderizarCardsProjeto(container, [{
    id: -1,
    image: 'imagens/projeto-computacao.jpg',
    title: el.titulo?.value || 'Título do projeto',
    description: el.descricao?.value || 'A descrição do projeto aparecerá aqui.',
    institution: 'IFSP (Via Lattes)',
    uf: '-',
    category: areaRotulo,
    researcher: 'Você',
    avatar: 'V',
    avatarClasses: 'fundo-institucional-sutil texto-institucional borda-padrao',
    badge: modelo === 'flexivel' ? 'Flexível' : 'Tudo ou Nada',
    badgeClasses: modelo === 'flexivel' ? 'texto-info borda-info' : 'texto-aviso borda-aviso',
    value: 'R$ 0',
    valorArrecadado: 0,
    meta,
    modelo,
    progressLabel: `0% de R$ ${meta.toLocaleString('pt-BR')}`,
    supportLabel: '0 apoios',
    timeLabel: `${dias} dias de campanha`,
  }]);
}

function renderChecklist() {
  const container = document.getElementById('criar-campanha-checklist');
  if (!container) return;
  const el = elementos();
  const soma = rubricas.reduce((total, r) => total + (Number(r.valor) || 0), 0);
  const meta = Number(valorMetaAtual) || 0;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataInicio = el.dataInicio?.value ? new Date(`${el.dataInicio.value}T00:00:00`) : null;
  const dataFim = el.dataFim?.value ? new Date(`${el.dataFim.value}T00:00:00`) : null;
  const duracao = dataInicio && dataFim ? Math.round((dataFim - dataInicio) / 86400000) : 0;
  const cronogramaValido = marcos.filter((marco) => {
    if (!marco.titulo.trim() || !marco.dataPrevista || !dataInicio) return false;
    const data = new Date(`${marco.dataPrevista}T00:00:00`);
    return data >= dataInicio;
  }).length >= 3;

  const itens = [
    { ok: Boolean((el.titulo?.value || '').trim()), texto: 'Título preenchido' },
    { ok: Boolean(el.area?.value), texto: 'Área do conhecimento selecionada' },
    { ok: meta >= 500, texto: 'Meta igual ou superior a R$ 500,00' },
    { ok: Boolean(el.dataInicio?.value) && dataInicio >= hoje, texto: 'Data de início hoje ou futura' },
    { ok: Boolean(el.dataFim?.value) && duracao >= 15 && duracao <= 60, texto: 'Duração entre 15 e 60 dias' },
    { ok: (el.descricao?.value || '').length <= 5000, texto: 'Descrição dentro do limite de 5.000 caracteres' },
    { ok: meta > 0 && soma === meta, texto: 'Itens do orçamento batem com a meta' },
    { ok: cronogramaValido, texto: 'Pelo menos três marcos a partir da data de início' },
  ];

  container.innerHTML = itens.map((item) => `
    <div class="flex items-center gap-3 text-sm ${item.ok ? 'texto-sucesso' : 'texto-fraco'}">
      <i class="fa-solid ${item.ok ? 'fa-circle-check' : 'fa-circle'}"></i> ${escaparHtml(item.texto)}
    </div>
  `).join('');
}

function aplicarRascunho(rascunho) {
  const el = elementos();
  if (el.titulo) el.titulo.value = rascunho.titulo || '';
  if (el.area) el.area.value = rascunho.area || '';
  if (el.modelo) el.modelo.value = rascunho.modelo === 'flex' ? 'flexivel' : rascunho.modelo || createModelOptions[0].value;
  if (el.descricao) el.descricao.value = rascunho.descricao || '';
  if (el.dataInicio) el.dataInicio.value = rascunho.dataInicio || '';
  if (el.dataFim) el.dataFim.value = rascunho.dataFim || '';
  if (el.videoApresentacaoUrl) el.videoApresentacaoUrl.value = rascunho.videoApresentacaoUrl || '';
  rubricas = Array.isArray(rascunho.rubricas) && rascunho.rubricas.length
    ? rascunho.rubricas.map((item) => ({ categoria: item.categoria || item.nome || '', valor: item.valor || '' }))
    : [{ categoria: '', valor: '' }];
  marcos = Array.isArray(rascunho.marcos) && rascunho.marcos.length
    ? rascunho.marcos.map((marco) => ({ titulo: marco.titulo || '', dataPrevista: marco.dataPrevista || marco.data || '' }))
    : [{ titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }];
  if ('resumo' in rascunho || 'prazo' in rascunho) {
    const passoLegado = Number(rascunho.passoAtual) || 1;
    rascunho.passoAtual = passoLegado <= 2 ? 1 : passoLegado === 3 ? 2 : 4;
  }
}

export function submeterCriarCampanha() {
  limparRascunho();
  mostrarAcao('Projeto submetido. Status: aguardando aprovação da curadoria.');
  nav('dash-pesquisador');
}

function descartarRascunho() {
  limparRascunho();
  passoAtual = 1;
  rubricas = [{ categoria: '', valor: '' }];
  marcos = [{ titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }, { titulo: '', dataPrevista: '' }];
  valorMetaAtual = '';
  window.dispatchEvent(new CustomEvent('criar-campanha:atualizar-meta', { detail: '' }));
  document.getElementById('form-criar-campanha')?.reset();
  atualizarContadorDescricao();
  renderRubricas();
  atualizarLimitesCronograma();
  atualizarSomaRubricas();
  irParaPasso(1);
  mostrarAcao('Rascunho descartado.');
}

export function renderCreateFormContent() {
  const container = document.getElementById('criar-campanha-campo-titulo');
  if (!container) return;
  const rascunho = carregarRascunho();
  valorMetaAtual = normalizarValorMeta(rascunho?.meta);
  renderizarEstruturaFormulario();
  renderizarCamposDados(valorMetaAtual);
  renderRubricas();
  atualizarLimitesCronograma();
  atualizarSomaRubricas();
  renderPassosNav();

  if (rascunho) {
    aplicarRascunho(rascunho);
    atualizarContadorDescricao();
    renderRubricas();
    renderMarcos();
    atualizarSomaRubricas();
    irParaPasso(rascunho.passoAtual || 1);
  } else {
    irParaPasso(1);
  }

  const el = elementos();
  [
    el.titulo,
    el.area,
    el.modelo,
    el.descricao,
    el.dataInicio,
    el.dataFim,
    el.videoApresentacaoUrl,
  ].forEach((campo) => {
    campo?.addEventListener('input', () => {
      if (campo === el.descricao) atualizarContadorDescricao();
      if (campo === el.dataInicio || campo === el.dataFim) atualizarLimitesCronograma();
      salvarRascunho();
    });
    campo?.addEventListener('change', () => {
      if (campo === el.dataInicio && el.dataInicio.value && !el.dataFim.value) {
        const fimSugerido = new Date(`${el.dataInicio.value}T12:00:00`);
        fimSugerido.setDate(fimSugerido.getDate() + 30);
        el.dataFim.value = new Date(fimSugerido.getTime() - fimSugerido.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      }
      if (campo === el.dataInicio || campo === el.dataFim) atualizarLimitesCronograma();
      salvarRascunho();
    });
  });

  document.getElementById('criar-campanha-rubrica-add')?.addEventListener('click', () => {
    rubricas.push({ categoria: '', valor: '' });
    renderRubricas();
    salvarRascunho();
  });

  document.getElementById('criar-campanha-marco-add')?.addEventListener('click', () => {
    marcos.push({ titulo: '', dataPrevista: '' });
    renderMarcos();
    salvarRascunho();
  });

  document.getElementById('criar-campanha-avancar')?.addEventListener('click', () => {
    if (passoAtual === 1 && !validarDadosCampanha()) return;
    if (passoAtual < PASSOS_CRIAR_CAMPANHA.length) irParaPasso(passoAtual + 1);
  });
  document.getElementById('criar-campanha-voltar')?.addEventListener('click', () => {
    if (passoAtual > 1) irParaPasso(passoAtual - 1);
  });
  document.getElementById('criar-campanha-descartar')?.addEventListener('click', descartarRascunho);
}
