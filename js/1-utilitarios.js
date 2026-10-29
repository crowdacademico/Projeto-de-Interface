import { mostrarAviso } from './25-avisos.js';
import { LIMITES_FAIXAS_REPUTACAO } from '../dados-falsos/12-config-prototipo.js';

export function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escaparAtributo(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function htmlMigalhas(itens) {
  return `
    <nav class="migalhas mb-6" aria-label="Trilha de navegação">
      <a href="#" onclick="nav('home'); return false;">Início</a>
      ${itens.map((item, indice) => {
        const ultimo = indice === itens.length - 1;
        return `
          <span class="migalhas__separador">/</span>
          ${ultimo
            ? `<span class="migalhas__atual">${escaparHtml(item.rotulo)}</span>`
            : `<a href="#" onclick="nav('${item.rota}'); return false;">${escaparHtml(item.rotulo)}</a>`}
        `;
      }).join('')}
    </nav>
  `;
}

export function filtrarEOrdenarProjetos(lista, filtros = {}) {
  const { busca = '', status = 'todos', areas = [], modelo = 'todos', ordenacao = 'recentes' } = filtros;
  const areasSet = areas instanceof Set ? areas : new Set(areas);
  const statusSet = status === 'todos' ? null : (status instanceof Set ? status : new Set(Array.isArray(status) ? status : [status]));
  const termo = busca.trim().toLowerCase();

  let filtrados = lista.filter((p) => {
    if (termo) {
      const alvo = `${p.title} ${p.researcher} ${p.institution}`.toLowerCase();
      if (!alvo.includes(termo)) return false;
    }
    if (statusSet && !statusSet.has(p.status)) return false;
    if (areasSet.size > 0 && !areasSet.has(p.area)) return false;
    if (modelo !== 'todos' && p.modelo !== modelo) return false;
    return true;
  });

  if (ordenacao === 'percentual') {
    filtrados = [...filtrados].sort((a, b) => b.valorArrecadado / b.meta - a.valorArrecadado / a.meta);
  } else if (ordenacao === 'prazo') {
    filtrados = [...filtrados].sort((a, b) => {
      if (a.diasRestantes === 0 && b.diasRestantes === 0) return 0;
      if (a.diasRestantes === 0) return 1;
      if (b.diasRestantes === 0) return -1;
      return a.diasRestantes - b.diasRestantes;
    });
  } else {
    filtrados = [...filtrados].sort((a, b) => b.id - a.id);
  }

  return filtrados;
}

export function htmlEstadoVazio({ icone = 'fa-inbox', titulo, mensagem, acaoHtml = '' }) {
  return `
    <div class="estado-vazio">
      <div class="estado-vazio__icone"><i class="fa-solid ${icone}"></i></div>
      <div class="estado-vazio__titulo">${escaparHtml(titulo)}</div>
      ${mensagem ? `<p class="text-sm">${escaparHtml(mensagem)}</p>` : ''}
      ${acaoHtml ? `<div class="estado-vazio__acao">${acaoHtml}</div>` : ''}
    </div>
  `;
}

export function htmlGraficoLinha(pontos) {
  const largura = 400;
  const altura = 140;
  const margem = 12;
  const valores = pontos.map((p) => p.valorMil);
  const max = Math.max(...valores);
  const min = 0;
  const passoX = (largura - margem * 2) / (pontos.length - 1);
  const coordenadas = pontos.map((p, i) => {
    const x = margem + i * passoX;
    const y = altura - margem - ((p.valorMil - min) / (max - min)) * (altura - margem * 2);
    return { x, y, ...p };
  });
  const linha = coordenadas.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${margem},${altura - margem} ${linha} ${coordenadas[coordenadas.length - 1].x.toFixed(1)},${altura - margem}`;

  return `
    <svg viewBox="0 0 ${largura} ${altura}" class="w-full h-auto" role="img" aria-label="Gráfico de linha: captação mensal, de ${pontos[0].mes} (R$ ${pontos[0].valorMil} mil) a ${pontos[pontos.length - 1].mes} (R$ ${pontos[pontos.length - 1].valorMil} mil)">
      <polygon points="${area}" fill="var(--cor-marca-sutil)" />
      <polyline points="${linha}" fill="none" stroke="var(--cor-marca)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
      ${coordenadas.map((c) => `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3" fill="var(--cor-marca)" />`).join('')}
    </svg>
    <div class="flex justify-between mt-2 text-xs texto-fraco">
      ${pontos.map((p) => `<span>${escaparHtml(p.mes)}</span>`).join('')}
    </div>
  `;
}

export const TONS_STATUS = {
  sucesso: 'fundo-sucesso texto-sucesso',
  sucessoForte: 'fundo-sucesso texto-sucesso',
  aviso: 'fundo-aviso texto-aviso',
  avisoForte: 'fundo-aviso texto-aviso',
  info: 'fundo-info texto-info',
  infoForte: 'fundo-info texto-info',
  perigo: 'fundo-erro texto-erro',
  perigoForte: 'fundo-erro texto-erro',
  neutro: 'fundo-realce texto-padrao',
  institucional: 'fundo-institucional-sutil texto-institucional',
  urgencia: 'fundo-urgencia-sutil texto-urgencia',
};

export function classeStatus(item) {
  if (!item) return '';
  return item.classeStatus || TONS_STATUS[item.tomStatus] || '';
}

export function mostrarAcao(mensagem) {
  mostrarAviso(mensagem);
}

export function formatarData(valor) {
  if (!valor) return '-';
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleDateString('pt-BR');
}

export function formatarDataHora(valor) {
  if (!valor) return '-';
  const data = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleString('pt-BR');
}

const PALETA_AVATAR = [
  'var(--cor-avatar-1)',
  'var(--cor-avatar-2)',
  'var(--cor-avatar-3)',
  'var(--cor-avatar-4)',
  'var(--cor-avatar-5)',
  'var(--cor-avatar-6)',
  'var(--cor-avatar-7)',
];

function corPorNome(nome) {
  let soma = 0;
  for (let i = 0; i < nome.length; i += 1) {
    soma += nome.charCodeAt(i);
  }
  return PALETA_AVATAR[soma % PALETA_AVATAR.length];
}

export function htmlAvatar(nome, { tamanho = 'md', forma = 'circulo', foto = null } = {}) {
  const classesTamanho = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-24 h-24 text-4xl',
    xxl: 'w-28 h-28 text-5xl',
  };
  const classeForma = forma === 'quadrado' ? 'rounded-xl' : 'rounded-full';
  const nomeSeguro = (nome || '').trim() || '?';
  const classeTamanho = classesTamanho[tamanho] || classesTamanho.md;

  if (foto) {
    return `<img src="${escaparAtributo(foto)}" alt="${escaparAtributo(nomeSeguro)}" class="${classeTamanho} ${classeForma} object-cover shrink-0" />`;
  }
  return `
        <div class="${classeTamanho} ${classeForma} flex items-center justify-center font-bold text-white shrink-0" style="background-color: ${corPorNome(nomeSeguro)}" aria-hidden="true">
            ${escaparHtml(nomeSeguro[0].toUpperCase())}
        </div>
    `;
}

export function htmlEscalaProgresso({ percentual, valorAtual, valorMeta, modelo = 'tudo-ou-nada', compacta = false }) {
  const percentualExibido = Math.max(0, Math.min(100, Math.round(percentual)));
  const classeModelo = modelo === 'flexivel' ? 'escala-progresso--flexivel' : 'escala-progresso--tudo-ou-nada';
  const classeCompacta = compacta ? 'escala-progresso--compacta' : '';
  return `
        <div class="escala-progresso ${classeModelo} ${classeCompacta}" style="--progresso: ${percentualExibido}%"
             role="progressbar" aria-valuenow="${Math.round(percentual)}" aria-valuemin="0" aria-valuemax="100"
             aria-label="${Math.round(percentual)}% da meta de ${escaparAtributo(valorMeta)} arrecadada">
            <div class="escala-progresso__trilho">
                <div class="escala-progresso__preenchimento"></div>
                <div class="escala-progresso__marca-meta"></div>
                <span class="escala-progresso__rotulo-meta microrrotulo texto-fraco">Meta</span>
            </div>
            <div class="escala-progresso__eixo">
                <span class="microrrotulo texto-fraco">R$ 0</span>
                <span class="microrrotulo numero texto-forte">${escaparHtml(valorAtual)}</span>
                <span class="microrrotulo texto-fraco">${escaparHtml(valorMeta)}</span>
            </div>
        </div>
    `;
}

export function inicializarCarrossel({ wrapper, trilho, anterior, proximo }) {
  if (!wrapper || !trilho) return;

  const atualizar = () => {
    const podeRolar = trilho.scrollWidth > trilho.clientWidth + 1;
    if (anterior) anterior.classList.toggle('hidden', !podeRolar);
    if (proximo) proximo.classList.toggle('hidden', !podeRolar);
    if (!podeRolar) {
      wrapper.classList.remove('carrossel-cartoes--fade-esquerda', 'carrossel-cartoes--fade-direita');
      return;
    }
    const noInicio = trilho.scrollLeft <= 1;
    const noFim = trilho.scrollLeft >= trilho.scrollWidth - trilho.clientWidth - 1;
    wrapper.classList.toggle('carrossel-cartoes--fade-esquerda', !noInicio);
    wrapper.classList.toggle('carrossel-cartoes--fade-direita', !noFim);
    if (anterior) anterior.disabled = noInicio;
    if (proximo) proximo.disabled = noFim;
  };

  if (!wrapper.dataset.carrosselInicializado) {
    wrapper.dataset.carrosselInicializado = 'true';

    anterior?.addEventListener('click', () => trilho.scrollBy({ left: -trilho.clientWidth * 0.9, behavior: 'smooth' }));
    proximo?.addEventListener('click', () => trilho.scrollBy({ left: trilho.clientWidth * 0.9, behavior: 'smooth' }));
    trilho.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
  }
  atualizar();
}

export function faixaReputacao(pontuacao) {
  const { atencao: limiteAtencao, construcao: limiteConstrucao, confiavel: limiteConfiavel } = LIMITES_FAIXAS_REPUTACAO;
  if (pontuacao <= limiteAtencao) return { rotulo: 'Atenção', classe: 'selo-reputacao--atencao' };
  if (pontuacao <= limiteConstrucao) return { rotulo: 'Em Construção', classe: 'selo-reputacao--construcao' };
  if (pontuacao <= limiteConfiavel) return { rotulo: 'Confiável', classe: 'selo-reputacao--confiavel' };
  return { rotulo: 'Referência', classe: 'selo-reputacao--referencia' };
}

export function htmlSeloReputacao(pontuacao) {
  const faixa = faixaReputacao(pontuacao);
  return `
        <span class="selo-reputacao ${faixa.classe}" title="Pontuação de reputação acadêmica: ${pontuacao}/100">
            <span class="selo-reputacao__pontuacao numero">${pontuacao}</span>
            <span class="selo-reputacao__rotulo">${escaparHtml(faixa.rotulo)}</span>
        </span>
    `;
}

export function renderMenuLateralPainel(idContainer, itens) {
  const container = document.getElementById(idContainer);
  if (!container) return;
  container.innerHTML = itens
    .map((item) => {
      const classe = item.ativo
        ? 'painel-conta-item painel-conta-item--ativo'
        : item.desabilitado
          ? 'painel-conta-item painel-conta-item--desabilitado'
          : 'painel-conta-item';
      return `
                <button type="button" class="${classe}" ${item.desabilitado ? 'disabled' : ''} ${item.mensagem ? `onclick="mostrarAcao('${escaparAtributo(item.mensagem)}')"` : ''}>
                    <span class="flex items-center gap-3"><i class="fa-solid ${item.icone} w-4"></i> ${escaparHtml(item.rotulo)}</span>
                </button>
            `;
    })
    .join('');
}
