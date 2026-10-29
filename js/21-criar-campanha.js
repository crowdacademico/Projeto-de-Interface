import { escaparHtml, mostrarAcao } from './1-utilitarios.js';
import { htmlCardProjeto } from './18-home.js';
import { nav } from './24-roteador.js';
import {
  createAreaOptions,
  createModelOptions,
  PASSOS_CRIAR_CAMPANHA,
  CAPAS_CRIAR_CAMPANHA,
} from '../dados-falsos/11-criar-campanha.js';

const CHAVE_RASCUNHO = 'crowdacademico-protótipo.rascunho-campanha';
const LIMITE_RESUMO = 280;

let passoAtual = 1;
let capaSelecionada = CAPAS_CRIAR_CAMPANHA[0].id;

let rubricas = [{ nome: '', valor: '' }];

function elementos() {
  return {
    titulo: document.getElementById('criar-campanha-titulo'),
    area: document.getElementById('create-area-options'),
    resumo: document.getElementById('criar-campanha-resumo'),
    descricao: document.getElementById('criar-campanha-descricao'),
    meta: document.getElementById('criar-campanha-meta'),
    prazo: document.getElementById('criar-campanha-prazo'),
  };
}

function modeloSelecionado() {
  const marcado = document.querySelector('input[name="modelo-financiamento"]:checked');
  return marcado ? marcado.value : createModelOptions[0].value;
}

function salvarRascunho() {
  const el = elementos();
  const rascunho = {
    titulo: el.titulo?.value || '',
    area: el.area?.value || '',
    resumo: el.resumo?.value || '',
    descricao: el.descricao?.value || '',
    capa: capaSelecionada,
    meta: el.meta?.value || '',
    prazo: el.prazo?.value || '',
    modelo: modeloSelecionado(),
    rubricas,
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
  ['identificacao', 'projeto', 'orcamento', 'revisao'].forEach((chave, indice) => {
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

function renderCapas() {
  const container = document.getElementById('criar-campanha-capas');
  if (!container) return;
  container.innerHTML = CAPAS_CRIAR_CAMPANHA.map((capa) => `
    <button type="button" data-capa="${capa.id}" class="relative rounded-lg overflow-hidden border-2 h-20 ${capa.id === capaSelecionada ? 'border-primary' : 'borda-padrao'}">
      <img src="${capa.src}" alt="${escaparHtml(capa.alt)}" class="w-full h-full object-cover">
      ${capa.id === capaSelecionada ? '<span class="absolute inset-0 bg-primary/20 flex items-center justify-center"><i class="fa-solid fa-circle-check text-white text-xl drop-shadow"></i></span>' : ''}
    </button>
  `).join('');
  container.querySelectorAll('[data-capa]').forEach((botao) => {
    botao.addEventListener('click', () => {
      capaSelecionada = botao.dataset.capa;
      renderCapas();
      salvarRascunho();
    });
  });
}

function atualizarContadorResumo() {
  const campo = document.getElementById('criar-campanha-resumo');
  const contador = document.getElementById('criar-campanha-resumo-contador');
  if (!campo || !contador) return;
  contador.textContent = `${campo.value.length}/${LIMITE_RESUMO}`;
}

function renderModelOptions() {
  const container = document.getElementById('create-model-options');
  if (!container) return;
  container.innerHTML = createModelOptions.map((option) => `
    <label class="modelo-financiamento-opcao flex-1 rounded-xl border-2 borda-padrao p-5 cursor-pointer fundo-sutil hover:border-primary transition-all" role="radio">
      <input type="radio" name="modelo-financiamento" value="${escaparHtml(option.value)}" ${option.checked ? 'checked' : ''} class="mr-3 accent-primary">
      <div class="inline-flex items-center gap-2 font-bold texto-forte mb-1"><i class="fa-solid ${option.icone} texto-marca"></i> ${escaparHtml(option.title)}</div>
      <div class="text-sm texto-fraco mb-2">${escaparHtml(option.description)}</div>
      <div class="text-xs texto-marca font-semibold leading-relaxed">${escaparHtml(option.consequencia)}</div>
    </label>
  `).join('');
  container.querySelectorAll('.modelo-financiamento-opcao').forEach((rotulo) => {
    rotulo.addEventListener('click', () => {
      container.querySelectorAll('.modelo-financiamento-opcao').forEach((r) => r.classList.remove('border-primary', 'shadow-marca'));
      rotulo.classList.add('border-primary', 'shadow-marca');
      salvarRascunho();
    });
  });
  const marcada = container.querySelector('input[name="modelo-financiamento"]:checked');
  marcada?.closest('.modelo-financiamento-opcao')?.classList.add('border-primary', 'shadow-marca');
}

function htmlLinhaRubrica(rubrica, indice) {
  return `
    <div class="flex gap-3 items-center" data-rubrica-linha="${indice}">
      <input type="text" data-rubrica-campo="nome" data-indice="${indice}" value="${escaparHtml(rubrica.nome)}" placeholder="Ex: Reagentes de laboratório" class="input-padrao flex-1">
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
      if (rubricas.length === 0) rubricas = [{ nome: '', valor: '' }];
      renderRubricas();
      atualizarSomaRubricas();
      salvarRascunho();
    });
  });
}

function atualizarSomaRubricas() {
  const container = document.getElementById('criar-campanha-rubricas-soma');
  if (!container) return;
  const soma = rubricas.reduce((total, r) => total + (Number(r.valor) || 0), 0);
  const meta = Number(document.getElementById('criar-campanha-meta')?.value) || 0;
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
  const capa = CAPAS_CRIAR_CAMPANHA.find((c) => c.id === capaSelecionada) || CAPAS_CRIAR_CAMPANHA[0];
  const areaRotulo = createAreaOptions.find((a) => a.value === el.area?.value)?.label || 'Área não selecionada';
  const meta = Number(el.meta?.value) || 1;
  const modelo = modeloSelecionado() === 'flex' ? 'flexivel' : 'tudo-ou-nada';

  container.innerHTML = htmlCardProjeto({
    image: capa.src,
    title: el.titulo?.value || 'Título do projeto',
    description: el.resumo?.value || 'O resumo do projeto aparece aqui.',
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
    timeLabel: `${el.prazo?.value || 30} dias rest.`,
  });
}

function renderChecklist() {
  const container = document.getElementById('criar-campanha-checklist');
  if (!container) return;
  const el = elementos();
  const soma = rubricas.reduce((total, r) => total + (Number(r.valor) || 0), 0);
  const meta = Number(el.meta?.value) || 0;

  const itens = [
    { ok: (el.titulo?.value || '').trim().length >= 10, texto: 'Título claro e específico (mín. 10 caracteres)' },
    { ok: (el.resumo?.value || '').trim().length >= 20, texto: 'Resumo curto preenchido' },
    { ok: (el.descricao?.value || '').trim().length >= 40, texto: 'Descrição e metodologia detalhadas' },
    { ok: meta > 0 && soma === meta, texto: 'Itens do orçamento batem com a meta' },
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
  if (el.resumo) el.resumo.value = rascunho.resumo || '';
  if (el.descricao) el.descricao.value = rascunho.descricao || '';
  if (el.meta) el.meta.value = rascunho.meta || '';
  if (el.prazo) el.prazo.value = rascunho.prazo || 30;
  capaSelecionada = rascunho.capa || CAPAS_CRIAR_CAMPANHA[0].id;
  rubricas = Array.isArray(rascunho.rubricas) && rascunho.rubricas.length ? rascunho.rubricas : [{ nome: '', valor: '' }];
  const radioModelo = document.querySelector(`input[name="modelo-financiamento"][value="${rascunho.modelo}"]`);
  if (radioModelo) radioModelo.checked = true;
}

export function submeterCriarCampanha() {
  limparRascunho();
  mostrarAcao('Projeto submetido. Status: aguardando aprovação da curadoria.');
  nav('dash-pesquisador');
}

function descartarRascunho() {
  limparRascunho();
  passoAtual = 1;
  rubricas = [{ nome: '', valor: '' }];
  capaSelecionada = CAPAS_CRIAR_CAMPANHA[0].id;
  document.getElementById('form-criar-campanha')?.reset();
  renderCapas();
  renderModelOptions();
  renderRubricas();
  atualizarContadorResumo();
  atualizarSomaRubricas();
  irParaPasso(1);
  mostrarAcao('Rascunho descartado.');
}

export function renderCreateFormContent() {
  const areaSelect = document.getElementById('create-area-options');
  if (!areaSelect) return;

  areaSelect.innerHTML = createAreaOptions.map(area => `
        <option value="${escaparHtml(area.value)}">${escaparHtml(area.label)}</option>
    `).join('');

  renderModelOptions();
  renderCapas();
  renderRubricas();
  atualizarContadorResumo();
  atualizarSomaRubricas();
  renderPassosNav();

  const rascunho = carregarRascunho();
  if (rascunho) {
    aplicarRascunho(rascunho);
    renderCapas();
    renderModelOptions();
    renderRubricas();
    atualizarContadorResumo();
    atualizarSomaRubricas();
    irParaPasso(rascunho.passoAtual || 1);
  } else {
    irParaPasso(1);
  }

  ['criar-campanha-titulo', 'create-area-options', 'criar-campanha-resumo', 'criar-campanha-descricao', 'criar-campanha-meta', 'criar-campanha-prazo'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', () => {
      if (id === 'criar-campanha-resumo') atualizarContadorResumo();
      if (id === 'criar-campanha-meta') atualizarSomaRubricas();
      salvarRascunho();
    });
  });

  document.getElementById('criar-campanha-rubrica-add')?.addEventListener('click', () => {
    rubricas.push({ nome: '', valor: '' });
    renderRubricas();
    salvarRascunho();
  });

  document.getElementById('criar-campanha-avancar')?.addEventListener('click', () => {
    if (passoAtual < PASSOS_CRIAR_CAMPANHA.length) irParaPasso(passoAtual + 1);
  });
  document.getElementById('criar-campanha-voltar')?.addEventListener('click', () => {
    if (passoAtual > 1) irParaPasso(passoAtual - 1);
  });
  document.getElementById('criar-campanha-descartar')?.addEventListener('click', descartarRascunho);
}
