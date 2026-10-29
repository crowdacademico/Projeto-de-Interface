import { renderMenuLateralPainel, escaparHtml, TONS_STATUS } from './1-utilitarios.js';
import { htmlEscalaProgresso, htmlGraficoLinha } from './1-utilitarios.js';
import {
    researcherStats,
    researcherProgress,
    researcherProjects,
    researcherSummaryCards,
    researcherSidebarItems,
    researcherArrecadacaoMensal,
} from '../dados-falsos/10-dash-pesquisador.js';
import { renderProjectSupportInfo } from './19-campanha.js';

export function renderResearcherDashboard() {

    renderMenuLateralPainel('researcher-sidebar-nav', researcherSidebarItems);
    renderProjectSupportInfo();
    const stats = document.getElementById('researcher-stats');
    const grafico = document.getElementById('researcher-grafico-arrecadacao');
    const progress = document.getElementById('researcher-progress');
    const projects = document.getElementById('researcher-projects');
    const summaryCards = document.getElementById('researcher-summary-cards');
    if (grafico) {
        grafico.innerHTML = htmlGraficoLinha(researcherArrecadacaoMensal);
    }
    if (stats) {
        stats.innerHTML = researcherStats.map(stat => `
            <div class="rounded-xl border borda-padrao fundo-destaque p-4">
                <div class="text-2xl font-black ${stat.accent}">${escaparHtml(stat.value)}</div>
                <div class="text-xs uppercase tracking-widest texto-fraco mt-1">${escaparHtml(stat.label)}</div>
            </div>
        `).join('');
    }
    if (progress) {
        progress.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div>
                    <div class="rotulo">${escaparHtml(researcherProgress.title)}</div>
                    <div class="text-xl font-black texto-forte mt-1">${escaparHtml(researcherProgress.value)}</div>
                </div>
                <span class="text-sm font-bold text-primary">${escaparHtml(researcherProgress.width)}</span>
            </div>
            ${htmlEscalaProgresso({ percentual: parseInt(researcherProgress.width, 10), valorAtual: researcherProgress.valorAtual, valorMeta: researcherProgress.valorMeta, modelo: researcherProgress.modelo })}
        `;
    }
    if (projects) {
        projects.innerHTML = researcherProjects.map(project => `
            <tr class="hover-fundo-sutil transition-colors">
                <td class="px-6 py-4 font-semibold texto-padrao">${escaparHtml(project.campaign)}</td>
                <td class="px-6 py-4 texto-padrao numero text-right">${escaparHtml(project.gross)}</td>
                <td class="px-6 py-4 texto-padrao numero text-right">${escaparHtml(project.net)}</td>
                <td class="px-6 py-4 texto-padrao numero text-right">${escaparHtml(project.donors)}</td>
                <td class="px-6 py-4 texto-padrao">${escaparHtml(project.deadline)}</td>
                <td class="px-6 py-4 texto-padrao numero text-right">${escaparHtml(project.goal)}</td>
                <td class="px-6 py-4"><span class="status-pill ${TONS_STATUS[project.statusTone]}">${escaparHtml(project.status)}</span></td>
                <td class="px-6 py-4 text-right">
                    <button type="button" onclick="mostrarAcao('Ações da campanha simuladas no protótipo.')" aria-label="Mais ações" class="w-8 h-8 rounded-md hover-fundo-sutil texto-fraco transition-colors"><i class="fa-solid fa-ellipsis"></i></button>
                </td>
            </tr>
        `).join('');
    }
    if (summaryCards) {
        summaryCards.innerHTML = researcherSummaryCards.map(card => `
            <div class="rounded-xl border borda-padrao p-5 ${card.accent}">
                <div class="microrrotulo">${escaparHtml(card.title)}</div>
                <div class="text-3xl font-black mt-2">${escaparHtml(card.value)}</div>
            </div>
        `).join('');
    }
}
