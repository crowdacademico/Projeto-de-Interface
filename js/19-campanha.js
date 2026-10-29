import { projectTabs, projectSupportInfo, CAMPANHA_LINHA_DO_TEMPO } from '../dados-falsos/8-campanha.js';
import { ORCAMENTO_RUBRICAS, ORCAMENTO_TOTAL } from '../dados-falsos/28-orcamento.js';
import { APOIADORES_RECENTES, TOTAL_APOIADORES } from '../dados-falsos/27-apoiadores.js';
import { mostrarAviso } from './25-avisos.js';
import { nav } from './24-roteador.js';
import { escaparHtml, htmlEscalaProgresso, htmlAvatar } from './1-utilitarios.js';

const CORES_ORCAMENTO = ['var(--cor-cianotipo-600)', 'var(--cor-cianotipo-500)', 'var(--cor-cianotipo-400)', 'var(--cor-cianotipo-300)'];

function renderOrcamentoCampanha() {
    const container = document.getElementById('orcamento-conteudo-campanha');
    if (!container) return;
    container.innerHTML = `
        <div class="flex w-full h-3 rounded-full overflow-hidden mb-6" role="img" aria-label="Composição do orçamento por item">
            ${ORCAMENTO_RUBRICAS.map((r, i) => `<div style="width:${(r.valor / ORCAMENTO_TOTAL * 100).toFixed(1)}%; background-color:${CORES_ORCAMENTO[i % CORES_ORCAMENTO.length]}"></div>`).join('')}
        </div>
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b borda-padrao">
                    <th class="text-left pb-3 rotulo">Item</th>
                    <th class="text-right pb-3 rotulo">Valor</th>
                    <th class="text-right pb-3 rotulo">%</th>
                </tr>
            </thead>
            <tbody class="tabela-dividida">
                ${ORCAMENTO_RUBRICAS.map((r, i) => `
                    <tr>
                        <td class="py-3 texto-padrao">
                            <span class="w-2.5 h-2.5 rounded-full inline-block mr-2" style="background-color:${CORES_ORCAMENTO[i % CORES_ORCAMENTO.length]}"></span>${escaparHtml(r.rubrica)}
                        </td>
                        <td class="py-3 texto-forte numero text-right whitespace-nowrap">R$ ${r.valor.toLocaleString('pt-BR')}</td>
                        <td class="py-3 texto-fraco numero text-right">${Math.round(r.valor / ORCAMENTO_TOTAL * 100)}%</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr class="border-t-2 borda-padrao">
                    <td class="pt-3 font-bold texto-forte">Total</td>
                    <td class="pt-3 font-bold texto-forte numero text-right whitespace-nowrap">R$ ${ORCAMENTO_TOTAL.toLocaleString('pt-BR')}</td>
                    <td class="pt-3"></td>
                </tr>
            </tfoot>
        </table>
    `;
}

function renderLinhaDoTempoCampanha() {
    const container = document.getElementById('campanha-linha-do-tempo');
    if (!container) return;
    container.innerHTML = `
        <div class="linha-do-tempo">
            ${CAMPANHA_LINHA_DO_TEMPO.map((item) => `
                <div class="linha-do-tempo__item ${item.tipo === 'marco' ? 'linha-do-tempo__item--marco' : ''}">
                    <div class="linha-do-tempo__marcador"></div>
                    <p class="microrrotulo texto-fraco mb-1">${escaparHtml(item.data)}${item.autor ? ` · ${escaparHtml(item.autor)}` : ''}</p>
                    <p class="font-bold texto-forte">${escaparHtml(item.titulo)}</p>
                    <p class="text-sm texto-padrao leading-relaxed mt-1">${escaparHtml(item.corpo)}</p>
                </div>
            `).join('')}
        </div>
    `;
}

export function renderApoiadoresRecentes() {
    const container = document.getElementById('apoiadores-recentes-campanha');
    if (!container) return;
    container.innerHTML = `
        <div class="space-y-3 mb-3">
            ${APOIADORES_RECENTES.map((a) => `
                <div class="flex items-center gap-3">
                    ${htmlAvatar(a.nome, { tamanho: 'sm' })}
                    <div class="min-w-0 flex-1 text-sm font-semibold texto-forte truncate">${escaparHtml(a.nome)}</div>
                    <div class="text-right shrink-0">
                        <div class="text-sm font-bold texto-forte numero">${escaparHtml(a.valor)}</div>
                        <div class="text-xs texto-fraco">${escaparHtml(a.tempo)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <button type="button" onclick="mostrarAcao('Lista completa de apoiadores simulada no protótipo.')" class="text-xs font-bold texto-marca hover:underline">Ver todos os ${TOTAL_APOIADORES} apoiadores</button>
    `;
}

export function renderProjectTabs() {
    const buttonsContainer = document.getElementById('project-tab-buttons');
    const panelsContainer = document.getElementById('project-tab-panels');
    if (!buttonsContainer && !panelsContainer) return;

    if (buttonsContainer) {

        buttonsContainer.innerHTML = projectTabs.map(tab => `
            <button onclick="setProjectTab('${tab.id}')" id="tab-btn-${tab.id}" class="${tab.id === 'sobre' ? 'texto-forte font-bold border-primary' : 'texto-fraco hover-texto-forte font-medium border-transparent'} border-b-2 px-4 py-3 text-sm whitespace-nowrap transition flex items-center gap-2">
                ${escaparHtml(tab.label)}
                ${tab.badge ? `<span class="${tab.badgeClass ? 'tab-badge ' + tab.badgeClass : 'tab-badge fundo-realce texto-padrao'}">${escaparHtml(tab.badge)}</span>` : ''}
            </button>
        `).join('');
    }

    if (panelsContainer) {
        panelsContainer.innerHTML = projectTabs.map(tab => `
            <div id="tab-${tab.id}" class="tab-content ${tab.id === 'sobre' ? 'active' : ''}">
                ${tab.content}
            </div>
        `).join('');

        renderOrcamentoCampanha();
        renderLinhaDoTempoCampanha();
    }
}

export function renderProjectSupportInfo() {
    const container = document.getElementById('project-support-info');
    if (!container) return;
    container.innerHTML = projectSupportInfo.map(item => {
        if (item.variant === 'list') {
            return `
                <div class="border-t borda-padrao pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
                    <p class="font-semibold texto-forte mb-2">${escaparHtml(item.title)}</p>
                    <ul class="list-disc list-inside space-y-2">
                        ${item.items.map(entry => `<li>${entry}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        if (item.variant === 'warning') {
            return `
                <div class="fundo-aviso borda-aviso border rounded-xl p-4 mt-4 text-xs texto-aviso leading-relaxed flex items-start gap-3">
                    <i class="fa-solid fa-shield-halved mt-0.5 text-lg"></i>
                    <div><strong>${escaparHtml(item.title)}:</strong> ${escaparHtml(item.body)}</div>
                </div>
            `;
        }
        return `
            <div class="border-t borda-padrao pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
                <p class="font-semibold texto-forte mb-2">${escaparHtml(item.title)}</p>
                <p>${escaparHtml(item.body)}</p>
            </div>
        `;
    }).join('');
}

export function definirEstadoCampanha(estado, { avisar = true } = {}) {
  const faixa = document.getElementById('faixa-estado-campanha');
  const valor = document.getElementById('valor-arrecadado-campanha');
  const legenda = document.getElementById('legenda-meta-campanha');
  const areaProgresso = document.getElementById('area-escala-progresso-campanha');
  const statAtingido = document.getElementById('stat-atingido-campanha');
  const blocoDias = document.getElementById('bloco-dias-campanha');
  const statDias = document.getElementById('stat-dias-campanha');
  const rotuloDias = document.getElementById('rotulo-dias-campanha');
  const statApoios = document.getElementById('stat-apoios-campanha');
  const botao = document.getElementById('botao-apoiar-campanha');
  if (!faixa || !valor || !botao) return;

  const TONS_FUNDO = ['fundo-aviso', 'fundo-sucesso', 'fundo-realce', 'fundo-institucional-sutil'];
  const TONS_TEXTO = ['texto-aviso', 'texto-sucesso', 'texto-fraco', 'texto-institucional'];
  blocoDias.classList.remove(...TONS_FUNDO);
  statDias.classList.remove(...TONS_TEXTO);
  rotuloDias.classList.remove(...TONS_TEXTO);

  if (estado === 'financiada') {
    faixa.innerHTML = `
      <div class="fundo-sucesso texto-sucesso rounded-lg p-3 mb-6 text-sm font-bold flex items-center gap-2">
        <i class="fa-solid fa-circle-check"></i> Meta atingida em 12/07/2026 com 132% da meta.
      </div>
    `;
    valor.textContent = 'R$ 46.200';
    legenda.textContent = 'arrecadados da meta de R$ 35.000, repasse em 19/07/2026';
    areaProgresso.innerHTML = htmlEscalaProgresso({ percentual: 132, valorAtual: 'R$ 46.200', valorMeta: 'R$ 35.000', modelo: 'tudo-ou-nada' });
    statAtingido.textContent = '132%';
    blocoDias.classList.add('fundo-sucesso');
    statDias.classList.add('texto-sucesso');
    rotuloDias.classList.add('texto-sucesso');
    statDias.textContent = '✓';
    rotuloDias.textContent = 'Financiado';
    if (statApoios) statApoios.textContent = '187';
    botao.innerHTML = '<i class="fa-solid fa-chart-line"></i> Acompanhar resultados';
    botao.onclick = () => setProjectTab('atualizacoes');
  } else if (estado === 'nao-financiada') {
    faixa.innerHTML = `
      <div class="fundo-destaque texto-padrao rounded-lg p-3 mb-6 text-sm border borda-padrao">
        <p class="font-bold texto-forte mb-1"><i class="fa-solid fa-circle-info"></i> Meta não atingida</p>
        <p>O prazo de captação encerrou sem atingir a meta. As contribuições são devolvidas automaticamente a quem apoiou.</p>
      </div>
    `;
    valor.textContent = 'R$ 12.400';
    legenda.textContent = 'arrecadados de R$ 35.000 por 23 apoiadores';
    areaProgresso.innerHTML = htmlEscalaProgresso({ percentual: 35, valorAtual: 'R$ 12.400', valorMeta: 'R$ 35.000', modelo: 'tudo-ou-nada' });
    statAtingido.textContent = '35%';
    blocoDias.classList.add('fundo-realce');
    statDias.classList.add('texto-fraco');
    rotuloDias.classList.add('texto-fraco');
    statDias.textContent = '0';
    rotuloDias.textContent = 'Dias Restantes';
    if (statApoios) statApoios.textContent = '23';
    botao.innerHTML = '<i class="fa-solid fa-compass"></i> Ver projetos parecidos';
    botao.onclick = () => nav('explorar');
  } else if (estado === 'em-breve') {
    faixa.innerHTML = `
      <div class="fundo-institucional-sutil texto-institucional rounded-lg p-3 mb-6 text-sm font-bold flex items-center gap-2">
        <i class="fa-regular fa-clock"></i> Em breve. Início previsto para 20/09/2026, ainda não aceita contribuições.
      </div>
    `;
    valor.textContent = 'R$ 0';
    legenda.textContent = 'meta de R$ 35.000, a captação começa junto com o início da campanha';
    areaProgresso.innerHTML = htmlEscalaProgresso({ percentual: 0, valorAtual: 'R$ 0', valorMeta: 'R$ 35.000', modelo: 'tudo-ou-nada' });
    statAtingido.textContent = '0%';
    blocoDias.classList.add('fundo-institucional-sutil');
    statDias.classList.add('texto-institucional');
    rotuloDias.classList.add('texto-institucional');
    statDias.textContent = '16';
    rotuloDias.textContent = 'Dias pro Início';
    if (statApoios) statApoios.textContent = '0';
    botao.innerHTML = '<i class="fa-regular fa-clock"></i> Disponível em breve';
    botao.onclick = () => mostrarAviso('Esta campanha ainda não abriu para contribuições. Volte na data de início (20/09/2026).');
  } else {
    faixa.innerHTML = '';
    valor.textContent = 'R$ 22.750';
    legenda.textContent = 'arrecadados da meta de R$ 35.000';
    areaProgresso.innerHTML = htmlEscalaProgresso({ percentual: 65, valorAtual: 'R$ 22.750', valorMeta: 'R$ 35.000', modelo: 'tudo-ou-nada' });
    statAtingido.textContent = '65%';
    blocoDias.classList.add('fundo-aviso');
    statDias.classList.add('texto-aviso');
    rotuloDias.classList.add('texto-aviso');
    statDias.textContent = '18';
    rotuloDias.textContent = 'Dias Restantes';
    if (statApoios) statApoios.textContent = String(TOTAL_APOIADORES);
    botao.innerHTML = 'Apoiar esta Pesquisa <i class="fa-solid fa-arrow-right"></i>';
    botao.onclick = () => nav('checkout');
  }

  if (avisar) {
    const rotulos = { 'em-captacao': 'em captação', financiada: 'financiada', 'nao-financiada': 'não financiada', 'em-breve': 'em breve' };
    mostrarAviso(`Estado da campanha de exemplo: ${rotulos[estado] || estado}.`);
  }
}

export function setProjectTab(tab) {
    projectTabs.map(t => t.id).forEach(current => {
        const content = document.getElementById('tab-' + current);
        const button = document.getElementById('tab-btn-' + current);
        if (content) content.classList.toggle('active', current === tab);
        if (button) {
            button.classList.toggle('border-primary', current === tab);
            button.classList.toggle('border-transparent', current !== tab);
            button.classList.toggle('texto-forte', current === tab);
            button.classList.toggle('font-bold', current === tab);
            button.classList.toggle('texto-fraco', current !== tab);
            button.classList.toggle('font-medium', current !== tab);
        }
    });
}
